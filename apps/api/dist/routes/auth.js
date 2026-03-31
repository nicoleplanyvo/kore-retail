import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { loginSchema } from '../shared/validators.js';
import { sendEmail, passwordResetEmail } from '../lib/email.js';
import { createNotification } from '../lib/notifications.js';
export const authRouter = Router();
/** Helper: Lade User-Daten inkl. Store- und Region-Zuweisungen für Auth-Response */
async function buildAuthResponse(userId, impersonatedBy) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            tenantId: true,
            storeAssignments: { select: { storeId: true } },
            regionAssignments: { select: { regionId: true } },
        },
    });
    if (!user)
        return null;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        impersonatedBy: impersonatedBy || undefined,
        storeAssignments: user.storeAssignments.map((a) => a.storeId),
        regionAssignments: user.regionAssignments.map((a) => a.regionId),
    };
}
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
        if (!user.passwordHash) {
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
        const authUser = await buildAuthResponse(user.id);
        res.json({ accessToken, user: authUser });
    }
    catch (err) {
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
        const authUser = await buildAuthResponse(user.id);
        res.json({ accessToken, user: authUser });
    }
    catch {
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
        const authUser = await buildAuthResponse(req.user.sub, req.user.impersonatedBy);
        if (!authUser) {
            res.status(404).json({ error: 'Benutzer nicht gefunden.' });
            return;
        }
        res.json({ user: authUser });
    }
    catch (err) {
        console.error('Auth me error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// POST /api/auth/impersonate — nur kore_admin
authRouter.post('/impersonate', authenticate, requireRole('kore_admin'), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'userId ist erforderlich.' });
            return;
        }
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, tenantId: true, role: true, isActive: true },
        });
        if (!targetUser || !targetUser.isActive) {
            res.status(404).json({ error: 'Ziel-Benutzer nicht gefunden oder deaktiviert.' });
            return;
        }
        // Erstelle Token mit impersonatedBy
        const accessToken = signAccessToken({
            sub: targetUser.id,
            tenantId: targetUser.tenantId,
            role: targetUser.role,
            impersonatedBy: req.user.sub,
        });
        const authUser = await buildAuthResponse(targetUser.id, req.user.sub);
        res.json({ accessToken, user: authUser });
    }
    catch (err) {
        console.error('Impersonate error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// POST /api/auth/stop-impersonation
authRouter.post('/stop-impersonation', authenticate, async (req, res) => {
    try {
        const impersonatedBy = req.user.impersonatedBy;
        if (!impersonatedBy) {
            res.status(400).json({ error: 'Keine aktive Impersonation.' });
            return;
        }
        // Lade Original-Admin
        const adminUser = await prisma.user.findUnique({
            where: { id: impersonatedBy },
            select: { id: true, tenantId: true, role: true, isActive: true },
        });
        if (!adminUser || !adminUser.isActive) {
            res.status(404).json({ error: 'Original-Admin nicht gefunden.' });
            return;
        }
        // Erstelle neuen Token für den Admin (ohne impersonatedBy)
        const accessToken = signAccessToken({
            sub: adminUser.id,
            tenantId: adminUser.tenantId,
            role: adminUser.role,
        });
        const authUser = await buildAuthResponse(adminUser.id);
        res.json({ accessToken, user: authUser });
    }
    catch (err) {
        console.error('Stop impersonation error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ──────────────────────────────────────────────
// Passwort vergessen / zurücksetzen / Einladung
// ──────────────────────────────────────────────
const APP_URL = process.env['APP_URL'] || 'https://app.kore-retail.de';
// POST /api/auth/forgot-password — Public
authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: 'E-Mail-Adresse ist erforderlich.' });
            return;
        }
        // Always return 200 to not reveal whether email exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && user.isActive) {
            const token = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt,
                },
            });
            const resetUrl = `${APP_URL}/reset-password/${token}`;
            await sendEmail(passwordResetEmail({
                name: user.name,
                email: user.email,
                resetUrl,
            }));
        }
        res.json({ success: true, message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine E-Mail gesendet.' });
    }
    catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// POST /api/auth/reset-password — Public
authRouter.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || typeof token !== 'string') {
            res.status(400).json({ error: 'Token ist erforderlich.' });
            return;
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
            res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben.' });
            return;
        }
        const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
        if (!resetToken) {
            res.status(400).json({ error: 'Ungültiger oder abgelaufener Link.' });
            return;
        }
        if (resetToken.usedAt) {
            res.status(400).json({ error: 'Dieser Link wurde bereits verwendet.' });
            return;
        }
        if (resetToken.expiresAt < new Date()) {
            res.status(400).json({ error: 'Dieser Link ist abgelaufen.' });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { passwordHash },
        });
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() },
        });
        res.json({ success: true, message: 'Passwort erfolgreich zurückgesetzt.' });
    }
    catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// POST /api/auth/accept-invite — Public
authRouter.post('/accept-invite', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || typeof token !== 'string') {
            res.status(400).json({ error: 'Token ist erforderlich.' });
            return;
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
            res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben.' });
            return;
        }
        const inviteToken = await prisma.invitationToken.findUnique({ where: { token } });
        if (!inviteToken) {
            res.status(400).json({ error: 'Ungültiger oder abgelaufener Einladungslink.' });
            return;
        }
        if (inviteToken.usedAt) {
            res.status(400).json({ error: 'Diese Einladung wurde bereits angenommen.' });
            return;
        }
        if (inviteToken.expiresAt < new Date()) {
            res.status(400).json({ error: 'Diese Einladung ist abgelaufen.' });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.update({
            where: { id: inviteToken.userId },
            data: {
                passwordHash,
                isActive: true,
            },
        });
        await prisma.invitationToken.update({
            where: { id: inviteToken.id },
            data: { usedAt: new Date() },
        });
        // Auto-login: generate tokens
        const accessToken = signAccessToken({
            sub: user.id,
            tenantId: user.tenantId,
            role: user.role,
        });
        const refreshToken = signRefreshToken(user.id);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
            path: '/api/auth',
        });
        const authUser = await buildAuthResponse(user.id);
        res.json({ success: true, accessToken, user: authUser });
        // ── Notification trigger: notify admins about accepted invite ──
        try {
            if (user.tenantId) {
                const admins = await prisma.user.findMany({
                    where: {
                        tenantId: user.tenantId,
                        role: { in: ['tenant_admin', 'kore_admin'] },
                        isActive: true,
                        id: { not: user.id },
                    },
                    select: { id: true },
                });
                for (const admin of admins) {
                    await createNotification({
                        tenantId: user.tenantId,
                        userId: admin.id,
                        type: 'invite_accepted',
                        title: `${user.name} hat die Einladung angenommen`,
                        link: '/app/orgchart',
                    });
                }
            }
        }
        catch (notifErr) {
            console.error('Notification error (invite_accepted):', notifErr);
        }
    }
    catch (err) {
        console.error('Accept invite error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// PUT /api/auth/change-password — Requires auth
authRouter.put('/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || typeof currentPassword !== 'string') {
            res.status(400).json({ error: 'Aktuelles Passwort ist erforderlich.' });
            return;
        }
        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
            res.status(400).json({ error: 'Neues Passwort muss mindestens 8 Zeichen haben.' });
            return;
        }
        const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
        if (!user || !user.passwordHash) {
            res.status(400).json({ error: 'Passwortänderung nicht möglich.' });
            return;
        }
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Aktuelles Passwort ist falsch.' });
            return;
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });
        res.json({ success: true, message: 'Passwort erfolgreich geändert.' });
    }
    catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=auth.js.map