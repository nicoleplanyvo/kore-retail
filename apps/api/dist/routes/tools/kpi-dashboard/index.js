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
        const dateFrom = req.query.dateFrom;
        const dateTo = req.query.dateTo;
        // Build current period date range
        const from = dateFrom ?? `${new Date().getFullYear()}-01-01`;
        const to = dateTo ?? new Date().toISOString().slice(0, 10);
        // Calculate last year period (shift by 1 year)
        const fromDate = new Date(from + 'T00:00:00');
        const toDate = new Date(to + 'T00:00:00');
        const lyFrom = `${fromDate.getFullYear() - 1}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}`;
        const lyTo = `${toDate.getFullYear() - 1}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`;
        const baseWhere = { tenantId };
        if (storeId) {
            baseWhere['storeId'] = storeId;
            if (toolStoreIds !== 'all' && !toolStoreIds.includes(storeId)) {
                return res.status(403).json({ error: 'Kein Zugriff auf diesen Store.' });
            }
        }
        else if (toolStoreIds !== 'all') {
            baseWhere['storeId'] = { in: toolStoreIds };
        }
        const currentWhere = { ...baseWhere, date: { gte: from, lte: to } };
        const lastYearWhere = { ...baseWhere, date: { gte: lyFrom, lte: lyTo } };
        const [currentAgg, prevAgg, currentStoreCount, lyStoreCount] = await Promise.all([
            prisma.kpiEntry.aggregate({
                where: currentWhere,
                _sum: { revenue: true, transactions: true, footfall: true, unitsSold: true },
                _count: true,
            }),
            prisma.kpiEntry.aggregate({
                where: lastYearWhere,
                _sum: { revenue: true, transactions: true, footfall: true, unitsSold: true },
                _count: true,
            }),
            prisma.kpiEntry.groupBy({ by: ['storeId'], where: currentWhere }),
            prisma.kpiEntry.groupBy({ by: ['storeId'], where: lastYearWhere }),
        ]);
        const buildPeriodData = (sum, count, stores) => {
            const totalRevenue = sum.revenue ?? 0;
            const totalTransactions = sum.transactions ?? 0;
            const totalFootfall = sum.footfall ?? 0;
            const totalUnits = sum.unitsSold ?? 0;
            return {
                totalRevenue,
                totalTransactions,
                totalFootfall,
                totalUnits,
                avgRevenue: count > 0 ? Math.round((totalRevenue / count) * 100) / 100 : 0,
                avgFootfall: count > 0 ? Math.round((totalFootfall / count) * 100) / 100 : 0,
                avgBasket: totalTransactions > 0 ? Math.round((totalRevenue / totalTransactions) * 100) / 100 : 0,
                avgConversion: totalFootfall > 0 ? Math.round((totalTransactions / totalFootfall) * 10000) / 100 : 0,
                avgUpt: totalTransactions > 0 ? Math.round((totalUnits / totalTransactions) * 100) / 100 : 0,
                storeCount: stores,
                totalEntries: count,
            };
        };
        const current = buildPeriodData(currentAgg._sum, currentAgg._count, currentStoreCount.length);
        const lastYear = buildPeriodData(prevAgg._sum, prevAgg._count, lyStoreCount.length);
        const pctChange = (cur, prev) => {
            if (prev === 0 && cur === 0)
                return null;
            if (prev === 0)
                return 100;
            return Math.round(((cur - prev) / prev) * 10000) / 100;
        };
        const changes = {
            revenue: pctChange(current.totalRevenue, lastYear.totalRevenue),
            avgRevenue: pctChange(current.avgRevenue, lastYear.avgRevenue),
            footfall: pctChange(current.avgFootfall, lastYear.avgFootfall),
            conversion: pctChange(current.avgConversion, lastYear.avgConversion),
            avgBasket: pctChange(current.avgBasket, lastYear.avgBasket),
            upt: pctChange(current.avgUpt, lastYear.avgUpt),
        };
        res.json({
            period: { from, to },
            lastYearPeriod: { from: lyFrom, to: lyTo },
            current,
            lastYear,
            changes,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /trends — Tagesverlauf (aggregated per date)
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
            take: 500,
        });
        // Aggregate per date (frontend expects avgRevenue, avgFootfall, avgConversion, avgBasket)
        const byDate = new Map();
        for (const e of entries) {
            const existing = byDate.get(e.date);
            if (existing) {
                existing.revenue += e.revenue;
                existing.transactions += e.transactions;
                existing.footfall += (e.footfall ?? 0);
                existing.unitsSold += (e.unitsSold ?? 0);
                existing.count++;
            }
            else {
                byDate.set(e.date, {
                    revenue: e.revenue,
                    transactions: e.transactions,
                    footfall: e.footfall ?? 0,
                    unitsSold: e.unitsSold ?? 0,
                    count: 1,
                });
            }
        }
        const trends = Array.from(byDate.entries()).map(([date, d]) => ({
            date,
            avgRevenue: Math.round((d.revenue / d.count) * 100) / 100,
            avgFootfall: Math.round((d.footfall / d.count) * 100) / 100,
            avgConversion: d.footfall > 0 ? Math.round((d.transactions / d.footfall) * 10000) / 100 : 0,
            avgBasket: d.transactions > 0 ? Math.round((d.revenue / d.transactions) * 100) / 100 : 0,
        }));
        res.json(trends);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map