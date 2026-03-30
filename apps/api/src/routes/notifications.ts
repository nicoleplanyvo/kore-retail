import { Router, type Router as RouterType } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export const notificationsRouter: RouterType = Router();
notificationsRouter.use(authenticate);

// ── GET / ────────────────────────────────────────
// Paginated list of user's own notifications
notificationsRouter.get('/', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const tenantId = req.user!.tenantId ?? undefined;
    const page = Math.max(1, Number(req.query['page']) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query['pageSize']) || 20));
    const unreadOnly = req.query['unreadOnly'] === 'true';

    const where: Record<string, unknown> = { userId, tenantId };
    if (unreadOnly) {
      where['isRead'] = false;
    }

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({ data, total, page, pageSize });
  } catch (err) {
    console.error('Notifications list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /unread-count ────────────────────────────
// Returns count of unread notifications
notificationsRouter.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const tenantId = req.user!.tenantId ?? undefined;

    const count = await prisma.notification.count({
      where: { userId, tenantId, isRead: false },
    });

    res.json({ count });
  } catch (err) {
    console.error('Notification unread-count error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── PUT /read-all ────────────────────────────────
// Mark all user's unread notifications as read
// IMPORTANT: This route must be registered BEFORE /:id/read
notificationsRouter.put('/read-all', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const tenantId = req.user!.tenantId ?? undefined;

    const result = await prisma.notification.updateMany({
      where: { userId, tenantId, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true, updated: result.count });
  } catch (err) {
    console.error('Notification read-all error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── PUT /:id/read ────────────────────────────────
// Mark single notification as read
notificationsRouter.put('/:id/read', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const notificationId = req.params['id']!;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      res.status(404).json({ error: 'Benachrichtigung nicht gefunden.' });
      return;
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Notification mark-read error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
