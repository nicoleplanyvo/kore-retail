import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { clientProfileCreateSchema, clientProfileUpdateSchema, clientInteractionSchema, clientAppointmentCreateSchema, clientAppointmentUpdateSchema, } from '../../../shared/validators.js';
export const clientelingRouter = Router();
clientelingRouter.use(authenticate, requireToolAccess('customer.clienteling_crm'));
// ── Helper ───────────────────────────────────────
function storeWhere(req, filter) {
    const toolStoreIds = req.toolStoreIds;
    const w = {};
    if (filter)
        w['storeId'] = filter;
    else if (toolStoreIds !== 'all')
        w['storeId'] = { in: toolStoreIds };
    return w;
}
// ── GET /stores ──────────────────────────────────
clientelingRouter.get('/stores', async (req, res) => {
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
// ── GET /users ───────────────────────────────────
clientelingRouter.get('/users', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const where = { isActive: true };
        if (tenantId)
            where['tenantId'] = tenantId;
        const users = await prisma.user.findMany({ where, select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GET /customers ───────────────────────────────
clientelingRouter.get('/customers', async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
        const where = storeWhere(req, req.query.storeId);
        if (req.query.search) {
            const s = req.query.search;
            where['OR'] = [
                { firstName: { contains: s } },
                { lastName: { contains: s } },
                { email: { contains: s } },
                { phone: { contains: s } },
            ];
        }
        if (req.query.vip === 'true')
            where['vipLevel'] = { not: null };
        if (req.query.vipLevel)
            where['vipLevel'] = req.query.vipLevel;
        const [data, total] = await Promise.all([
            prisma.clientProfile.findMany({
                where,
                include: {
                    store: { select: { id: true, name: true } },
                    creator: { select: { id: true, name: true } },
                    _count: { select: { interactions: true, tasks: true, appointments: true } },
                },
                orderBy: { updatedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.clientProfile.count({ where }),
        ]);
        res.json({ data, total, page, pageSize });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── POST /customers ──────────────────────────────
clientelingRouter.post('/customers', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const userId = req.user.sub;
        const parsed = clientProfileCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        const storeId = req.body.storeId || (toolStoreIds !== 'all' ? toolStoreIds[0] : undefined);
        if (!storeId)
            return res.status(400).json({ error: 'storeId ist erforderlich.' });
        const data = { ...parsed.data, storeId, createdBy: userId };
        if (parsed.data.birthday)
            data['birthday'] = new Date(parsed.data.birthday);
        if (parsed.data.email === '')
            delete data['email'];
        const client = await prisma.clientProfile.create({
            data: data,
            include: { store: { select: { id: true, name: true } } },
        });
        res.status(201).json(client);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GET /customers/:id ───────────────────────────
clientelingRouter.get('/customers/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const client = await prisma.clientProfile.findFirst({
            where: { id: req.params['id'], store: { tenantId } },
            include: {
                store: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
                interactions: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { date: 'desc' },
                },
                tasks: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' },
                },
                appointments: {
                    include: { advisor: { select: { id: true, name: true } }, store: { select: { id: true, name: true } } },
                    orderBy: { startsAt: 'desc' },
                },
            },
        });
        if (!client)
            return res.status(404).json({ error: 'Kunde nicht gefunden.' });
        res.json(client);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PUT /customers/:id ───────────────────────────
clientelingRouter.put('/customers/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const existing = await prisma.clientProfile.findFirst({ where: { id: req.params['id'], store: { tenantId } } });
        if (!existing)
            return res.status(404).json({ error: 'Kunde nicht gefunden.' });
        const parsed = clientProfileUpdateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        const data = { ...parsed.data };
        if (parsed.data.lastVisit)
            data['lastVisit'] = new Date(parsed.data.lastVisit);
        if (parsed.data.birthday)
            data['birthday'] = new Date(parsed.data.birthday);
        if (parsed.data.email === '')
            data['email'] = null;
        const client = await prisma.clientProfile.update({
            where: { id: req.params['id'] },
            data,
        });
        res.json(client);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── DELETE /customers/:id — DSGVO Loeschung ──────
clientelingRouter.delete('/customers/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const existing = await prisma.clientProfile.findFirst({ where: { id: req.params['id'], store: { tenantId } } });
        if (!existing)
            return res.status(404).json({ error: 'Kunde nicht gefunden.' });
        // Cascade: interactions, tasks are cascade-deleted by schema
        // Appointments: clientId set to null
        await prisma.clientProfile.delete({ where: { id: req.params['id'] } });
        res.json({ success: true, message: 'Kundendaten wurden DSGVO-konform gelöscht.' });
    }
    catch (err) {
        if (err.code === 'P2025')
            return res.status(404).json({ error: 'Kunde nicht gefunden.' });
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── POST /customers/:id/interactions ─────────────
clientelingRouter.post('/customers/:id/interactions', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const clientCheck = await prisma.clientProfile.findFirst({ where: { id: req.params['id'], store: { tenantId } } });
        if (!clientCheck)
            return res.status(404).json({ error: 'Kunde nicht gefunden.' });
        const userId = req.user.sub;
        const parsed = clientInteractionSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        const data = {
            clientId: req.params['id'],
            userId,
            ...parsed.data,
        };
        if (parsed.data.date)
            data['date'] = new Date(parsed.data.date);
        const interaction = await prisma.clientInteraction.create({ data: data });
        // Update lastVisit + totalPurchases
        const updateData = { lastVisit: new Date() };
        if (parsed.data.purchaseAmount && parsed.data.purchaseAmount > 0) {
            updateData['totalPurchases'] = { increment: 1 };
            updateData['totalSpent'] = { increment: parsed.data.purchaseAmount };
        }
        await prisma.clientProfile.update({ where: { id: req.params['id'] }, data: updateData });
        res.status(201).json(interaction);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GET /appointments ────────────────────────────
clientelingRouter.get('/appointments', async (req, res) => {
    try {
        const where = storeWhere(req, req.query.storeId);
        if (req.query.from || req.query.to) {
            const range = {};
            if (req.query.from)
                range['gte'] = new Date(req.query.from);
            if (req.query.to)
                range['lte'] = new Date(req.query.to);
            where['startsAt'] = range;
        }
        if (req.query.status)
            where['status'] = req.query.status;
        if (req.query.advisorId)
            where['advisorId'] = req.query.advisorId;
        const appointments = await prisma.clientAppointment.findMany({
            where,
            include: {
                store: { select: { id: true, name: true } },
                client: { select: { id: true, firstName: true, lastName: true, vipLevel: true } },
                advisor: { select: { id: true, name: true } },
            },
            orderBy: { startsAt: 'asc' },
        });
        res.json(appointments);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── POST /appointments ───────────────────────────
clientelingRouter.post('/appointments', async (req, res) => {
    try {
        const userId = req.user.sub;
        const parsed = clientAppointmentCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        const appointment = await prisma.clientAppointment.create({
            data: {
                ...parsed.data,
                advisorId: req.body.advisorId || userId,
                startsAt: new Date(parsed.data.startsAt),
                endsAt: new Date(parsed.data.endsAt),
                clientId: parsed.data.clientId || null,
            },
            include: {
                store: { select: { id: true, name: true } },
                client: { select: { id: true, firstName: true, lastName: true } },
                advisor: { select: { id: true, name: true } },
            },
        });
        res.status(201).json(appointment);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PUT /appointments/:id ────────────────────────
clientelingRouter.put('/appointments/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const existing = await prisma.clientAppointment.findFirst({ where: { id: req.params['id'], store: { tenantId } } });
        if (!existing)
            return res.status(404).json({ error: 'Termin nicht gefunden.' });
        const parsed = clientAppointmentUpdateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        const data = { ...parsed.data };
        if (parsed.data.startsAt)
            data['startsAt'] = new Date(parsed.data.startsAt);
        if (parsed.data.endsAt)
            data['endsAt'] = new Date(parsed.data.endsAt);
        const appointment = await prisma.clientAppointment.update({
            where: { id: req.params['id'] },
            data,
        });
        res.json(appointment);
    }
    catch (err) {
        if (err.code === 'P2025')
            return res.status(404).json({ error: 'Termin nicht gefunden.' });
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── DELETE /appointments/:id ─────────────────────
clientelingRouter.delete('/appointments/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const existing = await prisma.clientAppointment.findFirst({ where: { id: req.params['id'], store: { tenantId } } });
        if (!existing)
            return res.status(404).json({ error: 'Termin nicht gefunden.' });
        await prisma.clientAppointment.delete({ where: { id: req.params['id'] } });
        res.json({ success: true });
    }
    catch (err) {
        if (err.code === 'P2025')
            return res.status(404).json({ error: 'Termin nicht gefunden.' });
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GET /dashboard ───────────────────────────────
clientelingRouter.get('/dashboard', async (req, res) => {
    try {
        const where = storeWhere(req, req.query.storeId);
        const [clients, recentInteractions, upcomingAppointments] = await Promise.all([
            prisma.clientProfile.findMany({
                where,
                include: { _count: { select: { interactions: true, appointments: true } } },
            }),
            prisma.clientInteraction.findMany({
                where: {
                    client: where,
                    date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                },
                include: { client: { select: { firstName: true, lastName: true } }, user: { select: { name: true } } },
                orderBy: { date: 'desc' },
                take: 20,
            }),
            prisma.clientAppointment.findMany({
                where: {
                    ...storeWhere(req, req.query.storeId),
                    startsAt: { gte: new Date() },
                    status: { not: 'ABGESAGT' },
                },
                include: { client: { select: { firstName: true, lastName: true } }, advisor: { select: { name: true } } },
                orderBy: { startsAt: 'asc' },
                take: 10,
            }),
        ]);
        const totalCustomers = clients.length;
        const vipCount = clients.filter(c => c.vipLevel).length;
        const totalLoyaltyPoints = clients.reduce((s, c) => s + c.loyaltyPoints, 0);
        const totalSpent = clients.reduce((s, c) => s + c.totalSpent, 0);
        const avgSpent = totalCustomers > 0 ? Math.round(totalSpent / totalCustomers * 100) / 100 : 0;
        // New customers last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const newCustomers = clients.filter(c => new Date(c.createdAt) >= thirtyDaysAgo).length;
        // Top customers by totalSpent
        const topCustomers = [...clients]
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10)
            .map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}`, vipLevel: c.vipLevel, totalSpent: c.totalSpent, totalPurchases: c.totalPurchases, loyaltyPoints: c.loyaltyPoints, interactions: c._count.interactions }));
        res.json({
            totalCustomers,
            vipCount,
            newCustomers,
            totalLoyaltyPoints,
            totalSpent,
            avgSpent,
            upcomingAppointments: upcomingAppointments.length,
            recentInteractions,
            upcomingAppointmentsList: upcomingAppointments,
            topCustomers,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map