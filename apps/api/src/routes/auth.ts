import { Router, type Router as RouterType } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { loginSchema } from '@kore/validators';

export const authRouter: RouterType = Router();

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validierungsfehler',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
      return;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = signAccessToken({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });

    const refreshToken = signRefreshToken(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
      path: '/api/auth',
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.['refreshToken'];
    if (!token) {
      res.status(401).json({ error: 'Kein Refresh-Token.' });
      return;
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Benutzer nicht gefunden oder deaktiviert.' });
      return;
    }

    const accessToken = signAccessToken({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(401).json({ error: 'Refresh-Token ungültig oder abgelaufen.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (_req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ success: true });
});

// GET /api/auth/me
authRouter.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden.' });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
