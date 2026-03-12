import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { vmGuidelinesRouter } from './guidelines.js';
import { vmSubmissionsRouter } from './submissions.js';
import { vmReviewsRouter } from './reviews.js';
import { vmReportsRouter } from './reports.js';
export const vmComplianceRouter = Router();
vmComplianceRouter.use(authenticate, requireToolAccess('standards.vm_foto_compliance'));
vmComplianceRouter.get('/stores', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const tenantId = req.tenantId;
        const where = { isActive: true };
        if (toolStoreIds !== 'all')
            where['id'] = { in: toolStoreIds };
        else if (tenantId)
            where['tenantId'] = tenantId;
        const stores = await prisma.store.findMany({ where, select: { id: true, name: true, city: true }, orderBy: { name: 'asc' } });
        res.json(stores);
    }
    catch (err) {
        console.error('VM stores error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
vmComplianceRouter.use('/guidelines', vmGuidelinesRouter);
vmComplianceRouter.use('/submissions', vmSubmissionsRouter);
vmComplianceRouter.use('/reviews', vmReviewsRouter);
vmComplianceRouter.use('/reports', vmReportsRouter);
//# sourceMappingURL=index.js.map