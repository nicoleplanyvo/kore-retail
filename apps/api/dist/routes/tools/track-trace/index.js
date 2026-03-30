import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { customerOrderCreateSchema, customerOrderUpdateSchema, orderStatusUpdateSchema, } from '../../../shared/validators.js';
export const trackTraceRouter = Router();
trackTraceRouter.use(authenticate, requireToolAccess('customer.track_trace'));
// ── STORES ──────────────────────────────────────────
trackTraceRouter.get('/stores', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const where = toolStoreIds === 'all' ? {} : { id: { in: toolStoreIds } };
        const stores = await prisma.store.findMany({ where, select: { id: true, name: true, city: true }, orderBy: { name: 'asc' } });
        res.json(stores);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── ORDERS: LIST ────────────────────────────────────
trackTraceRouter.get('/orders', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
        const where = {};
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        else if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.status)
            where['status'] = req.query.status;
        // Filter by type (TRANSFER / CLICK_COLLECT / standard)
        if (req.query.type) {
            // type is stored as prefix in orderNumber (TRF- / CC- / ORD-)
            where['orderNumber'] = { startsWith: req.query.type };
        }
        if (req.query.search) {
            const search = req.query.search;
            where['OR'] = [
                { orderNumber: { contains: search } },
                { customerName: { contains: search } },
                { trackingNumber: { contains: search } },
            ];
        }
        const [data, total] = await Promise.all([
            prisma.customerOrder.findMany({
                where,
                include: {
                    store: { select: { id: true, name: true, city: true } },
                    creator: { select: { id: true, name: true } },
                    _count: { select: { statusUpdates: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.customerOrder.count({ where }),
        ]);
        res.json({ data, total, page, pageSize });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── ORDERS: CREATE ──────────────────────────────────
trackTraceRouter.post('/orders', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const userId = req.user.sub;
        const parsed = customerOrderCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const storeId = req.body.storeId || (toolStoreIds !== 'all' ? toolStoreIds[0] : undefined);
        if (!storeId)
            return res.status(400).json({ error: 'storeId ist erforderlich.' });
        const order = await prisma.customerOrder.create({
            data: {
                orderNumber: parsed.data.orderNumber,
                customerName: parsed.data.customerName,
                storeId,
                createdBy: userId,
                ...(parsed.data.customerEmail ? { customerEmail: parsed.data.customerEmail } : {}),
                ...(parsed.data.trackingNumber ? { trackingNumber: parsed.data.trackingNumber } : {}),
                ...(parsed.data.carrier ? { carrier: parsed.data.carrier } : {}),
                ...(parsed.data.estimatedDelivery ? { estimatedDelivery: new Date(parsed.data.estimatedDelivery) } : {}),
            },
        });
        res.status(201).json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── ORDERS: DETAIL ──────────────────────────────────
trackTraceRouter.get('/orders/:id', async (req, res) => {
    try {
        const order = await prisma.customerOrder.findUnique({
            where: { id: req.params['id'] },
            include: {
                store: { select: { id: true, name: true, city: true } },
                creator: { select: { id: true, name: true } },
                statusUpdates: {
                    include: { updater: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!order)
            return res.status(404).json({ error: 'Vorgang nicht gefunden.' });
        res.json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── ORDERS: UPDATE ──────────────────────────────────
trackTraceRouter.put('/orders/:id', async (req, res) => {
    try {
        const parsed = customerOrderUpdateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const data = { ...parsed.data };
        if (parsed.data.estimatedDelivery)
            data['estimatedDelivery'] = new Date(parsed.data.estimatedDelivery);
        const order = await prisma.customerOrder.update({
            where: { id: req.params['id'] },
            data,
        });
        res.json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── ORDERS: ADD STATUS UPDATE ───────────────────────
trackTraceRouter.post('/orders/:id/status', async (req, res) => {
    try {
        const userId = req.user.sub;
        const parsed = orderStatusUpdateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const statusUpdate = await prisma.orderStatusUpdate.create({
            data: {
                orderId: req.params['id'],
                updatedBy: userId,
                status: parsed.data.status,
                notes: parsed.data.notes,
            },
        });
        // Also update the order's status
        await prisma.customerOrder.update({
            where: { id: req.params['id'] },
            data: { status: parsed.data.status },
        });
        res.status(201).json(statusUpdate);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── DASHBOARD ───────────────────────────────────────
trackTraceRouter.get('/dashboard', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const where = {};
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        else if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.from)
            where['createdAt'] = { ...(where['createdAt'] || {}), gte: new Date(req.query.from) };
        if (req.query.to)
            where['createdAt'] = { ...(where['createdAt'] || {}), lte: new Date(req.query.to + 'T23:59:59') };
        const orders = await prisma.customerOrder.findMany({
            where,
            include: {
                store: { select: { id: true, name: true } },
                statusUpdates: { orderBy: { createdAt: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = orders.length;
        const transfers = orders.filter(o => o.orderNumber.startsWith('TRF-'));
        const clickCollect = orders.filter(o => o.orderNumber.startsWith('CC-'));
        // Status counts
        const statusCounts = {};
        for (const o of orders) {
            statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        }
        // Transfer KPIs
        const completedTransfers = transfers.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED');
        const transfersWithDiff = transfers.filter(o => o.statusUpdates.some(su => su.status === 'DIFFERENCE_REPORTED'));
        const differenceRate = transfers.length > 0
            ? Math.round((transfersWithDiff.length / transfers.length) * 100)
            : 0;
        // Avg transfer duration (from creation to DELIVERED/COMPLETED)
        let avgTransferDays = 0;
        if (completedTransfers.length > 0) {
            const totalDays = completedTransfers.reduce((sum, o) => {
                const delivered = o.statusUpdates.find(su => su.status === 'DELIVERED' || su.status === 'COMPLETED');
                if (!delivered)
                    return sum;
                const days = (new Date(delivered.createdAt).getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                return sum + days;
            }, 0);
            avgTransferDays = Math.round((totalDays / completedTransfers.length) * 10) / 10;
        }
        // Click & Collect KPIs
        const ccCompleted = clickCollect.filter(o => o.status === 'PICKED_UP');
        const ccPending = clickCollect.filter(o => o.status !== 'PICKED_UP' && o.status !== 'RETURNED');
        // Monthly trend
        const monthMap = new Map();
        orders.forEach(o => {
            const month = new Date(o.createdAt).toISOString().slice(0, 7);
            const existing = monthMap.get(month) || { transfers: 0, cc: 0, total: 0 };
            existing.total++;
            if (o.orderNumber.startsWith('TRF-'))
                existing.transfers++;
            if (o.orderNumber.startsWith('CC-'))
                existing.cc++;
            monthMap.set(month, existing);
        });
        const trends = Array.from(monthMap.entries())
            .map(([month, d]) => ({ month, ...d }))
            .sort((a, b) => a.month.localeCompare(b.month));
        // Per-store stats
        const storeMap = new Map();
        orders.forEach(o => {
            const key = o.storeId;
            const existing = storeMap.get(key) || { id: o.storeId, name: o.store?.name || '—', total: 0, transfers: 0, cc: 0 };
            existing.total++;
            if (o.orderNumber.startsWith('TRF-'))
                existing.transfers++;
            if (o.orderNumber.startsWith('CC-'))
                existing.cc++;
            storeMap.set(key, existing);
        });
        const storeStats = Array.from(storeMap.values()).sort((a, b) => b.total - a.total);
        res.json({
            kpis: {
                total,
                transferCount: transfers.length,
                clickCollectCount: clickCollect.length,
                completedTransfers: completedTransfers.length,
                avgTransferDays,
                differenceRate,
                ccCompleted: ccCompleted.length,
                ccPending: ccPending.length,
            },
            byStatus: statusCounts,
            trends,
            storeStats,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── SUMMARY (legacy compat) ─────────────────────────
trackTraceRouter.get('/summary', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const where = {};
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        else if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        const orders = await prisma.customerOrder.findMany({ where });
        const statusCounts = {};
        for (const o of orders) {
            statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        }
        res.json({
            total: orders.length,
            byStatus: statusCounts,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map