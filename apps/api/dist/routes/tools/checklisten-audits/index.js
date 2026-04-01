import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { caTemplatesRouter } from './templates.js';
import { caSessionsRouter } from './sessions.js';
import { caReportsRouter } from './reports.js';
export const checklistenAuditsRouter = Router();
/**
 * Middleware: Authentifizierung + Zugriff auf 'standards.checklisten'.
 * (Ehemals auch 'standards.excellence_tracker' — jetzt zusammengefuehrt.)
 */
checklistenAuditsRouter.use(authenticate, requireToolAccess('standards.checklisten'));
// GET /stores — Zugängliche Stores
checklistenAuditsRouter.get('/stores', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const tenantId = req.tenantId;
        const where = { isActive: true };
        if (toolStoreIds !== 'all') {
            where['id'] = { in: toolStoreIds };
        }
        else if (tenantId) {
            where['tenantId'] = tenantId;
        }
        const stores = await prisma.store.findMany({
            where,
            select: { id: true, name: true, city: true },
            orderBy: { name: 'asc' },
        });
        res.json(stores);
    }
    catch (err) {
        console.error('CA stores list error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// Sub-Router mounten
checklistenAuditsRouter.use('/templates', caTemplatesRouter);
checklistenAuditsRouter.use('/sessions', caSessionsRouter);
checklistenAuditsRouter.use('/reports', caReportsRouter);
//# sourceMappingURL=index.js.map