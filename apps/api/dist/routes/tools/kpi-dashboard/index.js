import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { kpiEntryUpsertSchema } from '../../../shared/validators.js';
export const kpiDashboardRouter = Router();
kpiDashboardRouter.use(authenticate, requireToolAccess('performance.kpi_dashboard'));
// GET /stores
kpiDashboardRouter.get('/stores', async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /entries — Paginiert mit Filter (storeId, dateFrom, dateTo)
kpiDashboardRouter.get('/entries', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 30));
        const where = { tenantId };
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        if (toolStoreIds !== 'all')
            where['storeId'] = req.query.storeId || { in: toolStoreIds };
        if (req.query.dateFrom || req.query.dateTo) {
            where['date'] = {};
            if (req.query.dateFrom)
                where['date']['gte'] = req.query.dateFrom;
            if (req.query.dateTo)
                where['date']['lte'] = req.query.dateTo;
        }
        const [data, total] = await Promise.all([
            prisma.kpiEntry.findMany({
                where,
                include: { store: { select: { id: true, name: true, city: true } } },
                orderBy: { date: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.kpiEntry.count({ where }),
        ]);
        res.json({ data, total, page, pageSize });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// PUT /entries — Upsert (storeId + date unique)
kpiDashboardRouter.put('/entries', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.userId;
        const parsed = kpiEntryUpsertSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        const entry = await prisma.kpiEntry.upsert({
            where: { storeId_date: { storeId: parsed.data.storeId, date: parsed.data.date } },
            create: { ...parsed.data, tenantId, enteredBy: userId },
            update: {
                revenue: parsed.data.revenue,
                transactions: parsed.data.transactions,
                footfall: parsed.data.footfall ?? null,
                unitsSold: parsed.data.unitsSold ?? null,
                staffHours: parsed.data.staffHours ?? null,
            },
            include: { store: { select: { id: true, name: true } } },
        });
        res.json(entry);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /summary — Aggregierte KPIs
kpiDashboardRouter.get('/summary', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const where = { tenantId };
        if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.dateFrom || req.query.dateTo) {
            where['date'] = {};
            if (req.query.dateFrom)
                where['date']['gte'] = req.query.dateFrom;
            if (req.query.dateTo)
                where['date']['lte'] = req.query.dateTo;
        }
        const agg = await prisma.kpiEntry.aggregate({
            where,
            _sum: { revenue: true, transactions: true, footfall: true, unitsSold: true },
            _count: true,
        });
        const storeCount = await prisma.kpiEntry.groupBy({
            by: ['storeId'],
            where,
        });
        const totalRevenue = agg._sum.revenue ?? 0;
        const totalTransactions = agg._sum.transactions ?? 0;
        const totalFootfall = agg._sum.footfall ?? 0;
        const totalUnits = agg._sum.unitsSold ?? 0;
        res.json({
            totalRevenue,
            totalTransactions,
            totalFootfall,
            avgConversion: totalFootfall > 0 ? Math.round((totalTransactions / totalFootfall) * 10000) / 100 : 0,
            avgUPT: totalTransactions > 0 ? Math.round((totalUnits / totalTransactions) * 100) / 100 : 0,
            storeCount: storeCount.length,
            entryCount: agg._count,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /summary/yoy — Year-over-Year Vergleich
kpiDashboardRouter.get('/summary/yoy', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const storeId = req.query.storeId;
        if (!storeId) {
            return res.status(400).json({ error: 'storeId ist erforderlich.' });
        }
        const year = Number(req.query.year) || new Date().getFullYear();
        const prevYear = year - 1;
        const baseWhere = { tenantId, storeId };
        if (toolStoreIds !== 'all' && !toolStoreIds.includes(storeId)) {
            return res.status(403).json({ error: 'Kein Zugriff auf diesen Store.' });
        }
        const currentYearWhere = {
            ...baseWhere,
            date: { gte: `${year}-01-01`, lte: `${year}-12-31` },
        };
        const prevYearWhere = {
            ...baseWhere,
            date: { gte: `${prevYear}-01-01`, lte: `${prevYear}-12-31` },
        };
        const [currentAgg, prevAgg] = await Promise.all([
            prisma.kpiEntry.aggregate({
                where: currentYearWhere,
                _sum: { revenue: true, transactions: true, footfall: true, unitsSold: true },
                _count: true,
            }),
            prisma.kpiEntry.aggregate({
                where: prevYearWhere,
                _sum: { revenue: true, transactions: true, footfall: true, unitsSold: true },
                _count: true,
            }),
        ]);
        const calc = (sum, count) => {
            const revenue = sum.revenue ?? 0;
            const transactions = sum.transactions ?? 0;
            const footfall = sum.footfall ?? 0;
            const unitsSold = sum.unitsSold ?? 0;
            return {
                revenue,
                transactions,
                conversionRate: footfall > 0 ? Math.round((transactions / footfall) * 10000) / 100 : 0,
                avgBasket: transactions > 0 ? Math.round((revenue / transactions) * 100) / 100 : 0,
                unitsPerTransaction: transactions > 0 ? Math.round((unitsSold / transactions) * 100) / 100 : 0,
                entryCount: count,
            };
        };
        const currentYear = calc(currentAgg._sum, currentAgg._count);
        const previousYear = calc(prevAgg._sum, prevAgg._count);
        const pctChange = (current, previous) => {
            if (previous === 0) {
                return { value: current > 0 ? 100 : 0, improved: current > 0 };
            }
            const change = Math.round(((current - previous) / previous) * 10000) / 100;
            return { value: change, improved: change >= 0 };
        };
        const changes = {
            revenue: pctChange(currentYear.revenue, previousYear.revenue),
            transactions: pctChange(currentYear.transactions, previousYear.transactions),
            conversionRate: pctChange(currentYear.conversionRate, previousYear.conversionRate),
            avgBasket: pctChange(currentYear.avgBasket, previousYear.avgBasket),
            unitsPerTransaction: pctChange(currentYear.unitsPerTransaction, previousYear.unitsPerTransaction),
        };
        res.json({ year, prevYear, currentYear, previousYear, changes });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /trends — Tagesverlauf
kpiDashboardRouter.get('/trends', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const where = { tenantId };
        if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        if (req.query.dateFrom || req.query.dateTo) {
            where['date'] = {};
            if (req.query.dateFrom)
                where['date']['gte'] = req.query.dateFrom;
            if (req.query.dateTo)
                where['date']['lte'] = req.query.dateTo;
        }
        const entries = await prisma.kpiEntry.findMany({
            where,
            select: { date: true, revenue: true, transactions: true, footfall: true, unitsSold: true, storeId: true },
            orderBy: { date: 'asc' },
            take: 90,
        });
        res.json(entries);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map