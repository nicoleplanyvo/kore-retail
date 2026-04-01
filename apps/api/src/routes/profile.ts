import { Router, type Router as RouterType } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import prisma from '../lib/prisma.js';
import { authenticate, requireMinRole } from '../middleware/auth.js';
import type { UserRole } from '../shared/types.js';

export const profileRouter: RouterType = Router();

const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');

// ── Avatar Multer Setup ──────────────────────────
const avatarStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const dir = path.join(UPLOAD_DIR, 'avatars');
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.sub}-${Date.now()}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nur JPEG, PNG und WebP.'));
    }
  },
});

// All routes require authentication
profileRouter.use(authenticate);

// ── GET /api/profile ─────────────────────────────
// Returns current user's profile
profileRouter.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarPath: true,
        position: true,
        managerId: true,
        tenantId: true,
        isActive: true,
        storeAssignments: {
          select: {
            store: {
              select: { id: true, name: true, city: true },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden.' });
      return;
    }

    // Resolve manager name if managerId is set
    let managerName: string | null = null;
    if (user.managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: user.managerId },
        select: { name: true },
      });
      managerName = manager?.name ?? null;
    }

    const stores = user.storeAssignments.map((a) => a.store);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarPath ? `/api/uploads/${user.avatarPath}` : null,
      position: user.position,
      managerId: user.managerId,
      managerName,
      stores,
    });
  } catch (err) {
    console.error('Profile GET error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── PUT /api/profile ─────────────────────────────
// Update own profile (name, position)
profileRouter.put('/', async (req, res) => {
  try {
    const { name, position } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Name ist erforderlich.' });
      return;
    }

    const data: { name: string; position?: string | null } = { name: name.trim() };
    if (position !== undefined) {
      data.position = typeof position === 'string' && position.trim().length > 0
        ? position.trim()
        : null;
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.sub },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarPath: true,
        position: true,
        managerId: true,
        storeAssignments: {
          select: {
            store: {
              select: { id: true, name: true, city: true },
            },
          },
        },
      },
    });

    const stores = updated.storeAssignments.map((a) => a.store);

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatarUrl: updated.avatarPath ? `/api/uploads/${updated.avatarPath}` : null,
      position: updated.position,
      managerId: updated.managerId,
      stores,
    });
  } catch (err) {
    console.error('Profile PUT error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /api/profile/avatar ─────────────────────
// Upload avatar image
profileRouter.post('/avatar', avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Keine Datei hochgeladen.' });
      return;
    }

    const userId = req.user!.sub;

    // Get current user to check for existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPath: true },
    });

    // Delete old avatar file if exists
    if (currentUser?.avatarPath) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, currentUser.avatarPath));
      } catch {
        // Old file may not exist — not a hard error
      }
    }

    // Save relative path: avatars/{userId}-{timestamp}.ext
    const relativePath = `avatars/${req.file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { avatarPath: relativePath },
    });

    res.json({ avatarUrl: `/api/uploads/${relativePath}` });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── DELETE /api/profile/avatar ───────────────────
// Remove avatar
profileRouter.delete('/avatar', async (req, res) => {
  try {
    const userId = req.user!.sub;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPath: true },
    });

    if (currentUser?.avatarPath) {
      // Delete file from disk
      try {
        await fs.unlink(path.join(UPLOAD_DIR, currentUser.avatarPath));
      } catch {
        // File may not exist — not a hard error
      }

      // Clear avatarPath in database
      await prisma.user.update({
        where: { id: userId },
        data: { avatarPath: null },
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Avatar delete error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── PUT /api/profile/manager ─────────────────────
// Set managerId (only tenant_admin or kore_admin)
profileRouter.put('/manager', requireMinRole('tenant_admin' as UserRole), async (req, res) => {
  try {
    const { userId, managerId } = req.body;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'userId ist erforderlich.' });
      return;
    }

    // Verify target user exists and belongs to same tenant
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tenantId: true },
    });

    if (!targetUser) {
      res.status(404).json({ error: 'Benutzer nicht gefunden.' });
      return;
    }

    // Non-kore_admin can only manage users in their own tenant
    if (req.user!.role !== 'kore_admin' && targetUser.tenantId !== req.user!.tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf diesen Benutzer.' });
      return;
    }

    // If managerId is provided, verify the manager exists
    if (managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: { id: true, tenantId: true },
      });

      if (!manager) {
        res.status(404).json({ error: 'Manager nicht gefunden.' });
        return;
      }

      // Manager must be in the same tenant
      if (req.user!.role !== 'kore_admin' && manager.tenantId !== req.user!.tenantId) {
        res.status(400).json({ error: 'Manager muss im selben Mandanten sein.' });
        return;
      }

      // User cannot be their own manager
      if (userId === managerId) {
        res.status(400).json({ error: 'Ein Benutzer kann nicht sein eigener Manager sein.' });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { managerId: managerId || null },
      select: { id: true, name: true, managerId: true },
    });

    res.json(updated);
  } catch (err) {
    console.error('Manager update error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /api/profile/colleagues ──────────────────
// List all active users in the same tenant
profileRouter.get('/colleagues', async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;

    if (!tenantId) {
      // kore_admin without tenant — return all active users
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarPath: true,
          managerId: true,
          isActive: true,
        },
        orderBy: { name: 'asc' },
      });

      res.json(users);
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarPath: true,
        managerId: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(users);
  } catch (err) {
    console.error('Colleagues GET error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
