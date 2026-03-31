import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { developmentPlanCreateSchema, developmentGoalCreateSchema, developmentGoalUpdateSchema, developmentReviewCreateSchema, } from '../../../shared/validators.js';
export const pdpPipRouter = Router();
pdpPipRouter.use(authenticate, requireToolAccess('coaching.pdp_pip'));
// ── STORES ──────────────────────────────────────────
pdpPipRouter.get('/stores', async (req, res) => {
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
// ── USERS ───────────────────────────────────────────
pdpPipRouter.get('/users', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const users = await prisma.user.findMany({
            where: { tenantId, isActive: true },
            select: { id: true, name: true, role: true },
            orderBy: { name: 'asc' },
        });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PLANS — LIST ────────────────────────────────────
pdpPipRouter.get('/plans', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
        const where = { tenantId };
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        else if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.type)
            where['type'] = req.query.type;
        if (req.query.status)
            where['status'] = req.query.status;
        if (req.query.userId)
            where['userId'] = req.query.userId;
        if (req.query.managerId)
            where['managerId'] = req.query.managerId;
        const [data, total] = await Promise.all([
            prisma.developmentPlan.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true } },
                    manager: { select: { id: true, name: true } },
                    store: { select: { id: true, name: true } },
                    goals: { orderBy: { createdAt: 'asc' } },
                    _count: { select: { goals: true, reviews: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.developmentPlan.count({ where }),
        ]);
        // Compute goal completion stats for each plan
        const enriched = data.map((plan) => {
            const totalGoals = plan.goals.length;
            const completedGoals = plan.goals.filter((g) => g.status === 'COMPLETED').length;
            const inProgressGoals = plan.goals.filter((g) => g.status === 'IN_PROGRESS').length;
            const avgProgress = totalGoals > 0
                ? Math.round(plan.goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
                : 0;
            const { goals: _goals, ...rest } = plan;
            return { ...rest, totalGoals, completedGoals, inProgressGoals, avgProgress };
        });
        res.json({ data: enriched, total, page, pageSize });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PLANS — CREATE ──────────────────────────────────
pdpPipRouter.post('/plans', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const managerId = req.user.sub;
        const parsed = developmentPlanCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const plan = await prisma.developmentPlan.create({
            data: {
                ...parsed.data,
                tenantId,
                managerId,
                targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : undefined,
            },
            include: {
                user: { select: { id: true, name: true } },
                manager: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
            },
        });
        res.status(201).json(plan);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PLANS — DETAIL ──────────────────────────────────
pdpPipRouter.get('/plans/:id', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const plan = await prisma.developmentPlan.findFirst({
            where: { id: req.params.id, tenantId },
            include: {
                user: { select: { id: true, name: true } },
                manager: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
                goals: { orderBy: { createdAt: 'asc' } },
                reviews: {
                    include: { reviewer: { select: { id: true, name: true } } },
                    orderBy: { reviewDate: 'desc' },
                },
            },
        });
        if (!plan)
            return res.status(404).json({ error: 'Plan nicht gefunden.' });
        res.json(plan);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── PLANS — UPDATE STATUS ───────────────────────────
pdpPipRouter.put('/plans/:id', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        // Verify plan belongs to tenant
        const existing = await prisma.developmentPlan.findFirst({ where: { id: req.params.id, tenantId } });
        if (!existing)
            return res.status(404).json({ error: 'Plan nicht gefunden.' });
        const { status, title, targetDate } = req.body;
        const data = {};
        if (status)
            data['status'] = status;
        if (title)
            data['title'] = title;
        if (targetDate)
            data['targetDate'] = new Date(targetDate);
        const plan = await prisma.developmentPlan.update({
            where: { id: req.params.id },
            data,
            include: {
                user: { select: { id: true, name: true } },
                manager: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
            },
        });
        res.json(plan);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GOALS — CREATE ──────────────────────────────────
pdpPipRouter.post('/plans/:id/goals', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        // Verify plan belongs to tenant
        const plan = await prisma.developmentPlan.findFirst({ where: { id: req.params.id, tenantId } });
        if (!plan)
            return res.status(404).json({ error: 'Plan nicht gefunden.' });
        const parsed = developmentGoalCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const goal = await prisma.developmentGoal.create({
            data: {
                planId: req.params.id,
                title: parsed.data.title,
                measureOfSuccess: parsed.data.measureOfSuccess || null,
                targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
            },
        });
        res.status(201).json(goal);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GOALS — UPDATE ──────────────────────────────────
pdpPipRouter.put('/plans/:pid/goals/:gid', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        // Verify goal belongs to tenant via plan relation
        const existingGoal = await prisma.developmentGoal.findFirst({
            where: { id: req.params.gid, plan: { id: req.params.pid, tenantId } },
        });
        if (!existingGoal)
            return res.status(404).json({ error: 'Ziel nicht gefunden.' });
        const parsed = developmentGoalUpdateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const updateData = {};
        if (parsed.data.title !== undefined)
            updateData['title'] = parsed.data.title;
        if (parsed.data.measureOfSuccess !== undefined)
            updateData['measureOfSuccess'] = parsed.data.measureOfSuccess;
        if (parsed.data.targetDate !== undefined)
            updateData['targetDate'] = parsed.data.targetDate ? new Date(parsed.data.targetDate) : null;
        if (parsed.data.status !== undefined)
            updateData['status'] = parsed.data.status;
        if (parsed.data.progress !== undefined)
            updateData['progress'] = parsed.data.progress;
        const goal = await prisma.developmentGoal.update({
            where: { id: req.params.gid },
            data: updateData,
        });
        res.json(goal);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── GOALS — DELETE ──────────────────────────────────
pdpPipRouter.delete('/plans/:pid/goals/:gid', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        // Verify goal belongs to tenant via plan relation
        const existingGoal = await prisma.developmentGoal.findFirst({
            where: { id: req.params.gid, plan: { id: req.params.pid, tenantId } },
        });
        if (!existingGoal)
            return res.status(404).json({ error: 'Ziel nicht gefunden.' });
        await prisma.developmentGoal.delete({ where: { id: req.params.gid } });
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── REVIEWS — CREATE ────────────────────────────────
pdpPipRouter.post('/plans/:id/reviews', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        // Verify plan belongs to tenant
        const plan = await prisma.developmentPlan.findFirst({ where: { id: req.params.id, tenantId } });
        if (!plan)
            return res.status(404).json({ error: 'Plan nicht gefunden.' });
        const reviewedBy = req.user.sub;
        const parsed = developmentReviewCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
        const review = await prisma.developmentReview.create({
            data: {
                planId: req.params.id,
                reviewedBy,
                overallProgress: parsed.data.overallProgress,
                comments: parsed.data.comments || null,
            },
            include: {
                reviewer: { select: { id: true, name: true } },
            },
        });
        res.status(201).json(review);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ── DASHBOARD ───────────────────────────────────────
pdpPipRouter.get('/dashboard', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const where = { tenantId };
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        else if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.type)
            where['type'] = req.query.type;
        const plans = await prisma.developmentPlan.findMany({
            where,
            include: {
                user: { select: { id: true, name: true } },
                manager: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
                goals: true,
                reviews: { orderBy: { reviewDate: 'desc' }, take: 1 },
            },
        });
        // KPIs
        const totalPlans = plans.length;
        const activePlans = plans.filter((p) => p.status === 'ACTIVE').length;
        const completedPlans = plans.filter((p) => p.status === 'COMPLETED').length;
        const cancelledPlans = plans.filter((p) => p.status === 'CANCELLED').length;
        const pdpCount = plans.filter((p) => p.type === 'PDP').length;
        const pipCount = plans.filter((p) => p.type === 'PIP').length;
        const allGoals = plans.flatMap((p) => p.goals);
        const totalGoals = allGoals.length;
        const completedGoals = allGoals.filter((g) => g.status === 'COMPLETED').length;
        const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
        const avgProgress = totalGoals > 0 ? Math.round(allGoals.reduce((s, g) => s + g.progress, 0) / totalGoals) : 0;
        // Overdue plans (targetDate < now and still ACTIVE)
        const now = new Date();
        const overduePlans = plans.filter((p) => p.status === 'ACTIVE' && p.targetDate && new Date(p.targetDate) < now).length;
        // Upcoming deadlines (next 14 days)
        const twoWeeksOut = new Date();
        twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
        const upcomingDeadlines = plans
            .filter((p) => p.status === 'ACTIVE' && p.targetDate && new Date(p.targetDate) >= now && new Date(p.targetDate) <= twoWeeksOut)
            .map((p) => ({
            id: p.id,
            title: p.title,
            type: p.type,
            userName: p.user?.name ?? '---',
            targetDate: p.targetDate,
        }))
            .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
        // Plans by store
        const storeMap = new Map();
        plans.forEach((p) => {
            const sid = p.storeId || 'none';
            const sname = p.store?.name || 'Ohne Store';
            const entry = storeMap.get(sid) || { storeId: sid, storeName: sname, total: 0, active: 0, completed: 0, pdp: 0, pip: 0 };
            entry.total++;
            if (p.status === 'ACTIVE')
                entry.active++;
            if (p.status === 'COMPLETED')
                entry.completed++;
            if (p.type === 'PDP')
                entry.pdp++;
            if (p.type === 'PIP')
                entry.pip++;
            storeMap.set(sid, entry);
        });
        // Plans needing review (no review in last 14 days)
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const needsReview = plans
            .filter((p) => {
            if (p.status !== 'ACTIVE')
                return false;
            const lastReview = p.reviews[0];
            return !lastReview || new Date(lastReview.reviewDate) < twoWeeksAgo;
        })
            .map((p) => ({
            id: p.id,
            title: p.title,
            type: p.type,
            userName: p.user?.name ?? '---',
            lastReview: p.reviews[0]?.reviewDate ?? null,
        }));
        res.json({
            kpis: {
                totalPlans,
                activePlans,
                completedPlans,
                cancelledPlans,
                pdpCount,
                pipCount,
                totalGoals,
                completedGoals,
                goalCompletionRate,
                avgProgress,
                overduePlans,
            },
            upcomingDeadlines,
            needsReview,
            byStore: Array.from(storeMap.values()),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map