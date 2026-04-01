import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { indicatorsRouter } from './indicators.js';
import { entriesRouter } from './entries.js';
import { rankingsRouter } from './rankings.js';
export const raiseTheBarRouter = Router();
raiseTheBarRouter.use(authenticate, requireToolAccess('standards.store_standards'));
// ---------- Mount sub-routers ----------
raiseTheBarRouter.use('/indicators', indicatorsRouter);
raiseTheBarRouter.use('/entries', entriesRouter);
raiseTheBarRouter.use('/rankings', rankingsRouter);
// ---------- GET /stores ----------
raiseTheBarRouter.get('/stores', async (req, res) => {
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
        res.json({ data: stores });
    }
    catch (err) {
        console.error('RTB stores error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map