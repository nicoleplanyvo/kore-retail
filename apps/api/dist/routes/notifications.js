import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
export const notificationsRouter = Router();
notificationsRouter.use(authenticate);
// GET /api/notifications — paginated list
notificationsRouter.get('/', async (req, res) => {
    try {
        const userId = req.user.sub;
        const page = Math.max(1, parseInt(req.query['page']) || 1);
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query['pageSize']) || 20));
        const unreadOnly = req.query['unreadOnly'] === 'true';
        const where = { userId };
        if (unreadOnly)
            where['isRead'] = false;
        const [data, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true, type: true, title: true, body: true,
                    link: true, isRead: true, createdAt: true,
                },
            }),
            prisma.notification.count({ where }),
        ]);
        res.json({ data, total, page, pageSize });
    }
    catch (err) {
        console.error('Notifications list error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /api/notifications/unread-count
notificationsRouter.get('/unread-count', async (req, res) => {
    try {
        const count = await prisma.notification.count({
            where: { userId: req.user.sub, isRead: false },
        });
        res.json({ count });
    }
    catch (err) {
        console.error('Unread count error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// PUT /api/notifications/read-all — MUST be before /:id/read
notificationsRouter.put('/read-all', async (req, res) => {
    try {
        const result = await prisma.notification.updateMany({
            where: { userId: req.user.sub, isRead: false },
            data: { isRead: true },
        });
        res.json({ success: true, updated: result.count });
    }
    catch (err) {
        console.error('Mark all read error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// PUT /api/notifications/:id/read
notificationsRouter.put('/:id/read', async (req, res) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: req.params['id'] },
        });
        if (!notification || notification.userId !== req.user.sub) {
            res.status(404).json({ error: 'Benachrichtigung nicht gefunden.' });
            return;
        }
        await prisma.notification.update({
            where: { id: notification.id },
            data: { isRead: true },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error('Mark read error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=notifications.js.map