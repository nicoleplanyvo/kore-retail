import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { sopCategoriesRouter } from './categories.js';
import { sopDocumentsRouter } from './documents.js';
import { sopAcknowledgmentsRouter } from './acknowledgments.js';
export const sopRouter = Router();
// Alle SOP-Routes erfordern Auth + Tool-Zugriff
sopRouter.use(authenticate, requireToolAccess('standards.sop_bibliothek'));
// GET /api/tools/sop/stores — Zugängliche Stores für dieses Tool
sopRouter.get('/stores', async (req, res) => {
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
        // kore_admin ohne tenantId: alle aktiven Stores (kein tenantId-Filter)
        const stores = await prisma.store.findMany({
            where,
            select: { id: true, name: true, city: true },
            orderBy: { name: 'asc' },
        });
        res.json(stores);
    }
    catch (err) {
        console.error('SOP stores list error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// Sub-Router mounten
sopRouter.use('/categories', sopCategoriesRouter);
sopRouter.use('/documents', sopDocumentsRouter);
sopRouter.use('/', sopAcknowledgmentsRouter);
//# sourceMappingURL=index.js.map