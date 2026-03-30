import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireMinRole } from '../middleware/auth.js';
export const orgchartRouter = Router();
// All routes require authentication
orgchartRouter.use(authenticate);
// ── GET / — Flat list of active users with managerId relationships ──
orgchartRouter.get('/', async (req, res) => {
    try {
        const userRole = req.user.role;
        let tenantId = req.user.tenantId;
        // kore_admin can optionally view any tenant's org chart
        if (userRole === 'kore_admin' && req.query['tenantId']) {
            tenantId = req.query['tenantId'];
        }
        if (!tenantId) {
            res.status(400).json({ error: 'Kein Mandant zugeordnet.' });
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
                storeAssignments: {
                    select: {
                        store: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
        const result = users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            avatarUrl: u.avatarPath ?? null,
            managerId: u.managerId ?? null,
            storeNames: u.storeAssignments.map((a) => a.store.name),
        }));
        res.json({ users: result });
    }
    catch (err) {
        console.error('Orgchart GET error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PUT /manager — Update a user's managerId ──
orgchartRouter.put('/manager', requireMinRole('tenant_admin'), async (req, res) => {
    try {
        const { userId, managerId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'userId ist erforderlich.' });
            return;
        }
        // Prevent self-assignment
        if (managerId && managerId === userId) {
            res
                .status(400)
                .json({ error: 'Ein Benutzer kann nicht sein eigener Vorgesetzter sein.' });
            return;
        }
        // Load the target user
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, tenantId: true },
        });
        if (!targetUser) {
            res.status(404).json({ error: 'Benutzer nicht gefunden.' });
            return;
        }
        // Non-kore_admin: verify tenant match
        const userRole = req.user.role;
        if (userRole !== 'kore_admin' && targetUser.tenantId !== req.user.tenantId) {
            res.status(403).json({ error: 'Kein Zugriff auf diesen Mandanten.' });
            return;
        }
        // If setting a manager (not clearing), validate the manager
        if (managerId) {
            const managerUser = await prisma.user.findUnique({
                where: { id: managerId },
                select: { id: true, tenantId: true },
            });
            if (!managerUser) {
                res.status(404).json({ error: 'Vorgesetzter nicht gefunden.' });
                return;
            }
            // Both users must belong to the same tenant
            if (targetUser.tenantId !== managerUser.tenantId) {
                res.status(400).json({
                    error: 'Benutzer und Vorgesetzter muessen demselben Mandanten angehoeren.',
                });
                return;
            }
            // Circular reference check: traverse up the manager chain from the
            // proposed managerId to ensure it never reaches the userId being updated.
            // Max 10 levels to prevent infinite loops.
            let currentId = managerId;
            let depth = 0;
            while (currentId && depth < 10) {
                const current = await prisma.user.findUnique({
                    where: { id: currentId },
                    select: { managerId: true },
                });
                if (!current)
                    break;
                if (current.managerId === userId) {
                    res.status(400).json({
                        error: 'Zirkulaere Referenz: Der Vorgesetzte befindet sich bereits in der Berichtskette dieses Benutzers.',
                    });
                    return;
                }
                currentId = current.managerId;
                depth++;
            }
        }
        // Perform the update
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { managerId: managerId ?? null },
            select: {
                id: true,
                name: true,
                managerId: true,
            },
        });
        res.json({
            success: true,
            user: {
                id: updated.id,
                name: updated.name,
                managerId: updated.managerId,
            },
        });
    }
    catch (err) {
        console.error('Orgchart PUT /manager error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=orgchart.js.map