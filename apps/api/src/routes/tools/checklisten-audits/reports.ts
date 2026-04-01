import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';
import { calculateAuditScore } from '../../../shared/audit-scoring.js';

export const caReportsRouter: RouterType = Router();

// ── GET /reports/dashboard ───────────────────────────

caReportsRouter.get('/dashboard', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const storeId = req.query['storeId'] as string | undefined;

    const baseWhere = buildBaseWhere(tenantId, toolStoreIds, storeId);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // KPIs parallel laden
    const [
      totalAudits,
      completedAudits,
      todaysSessions,
      overdueCount,
      recentCompleted,
    ] = await Promise.all([
      prisma.auditSession.count({ where: baseWhere }),
      prisma.auditSession.findMany({
        where: { ...baseWhere, status: 'COMPLETED', overallScore: { not: null } },
        select: { overallScore: true, completionRate: true },
      }),
      prisma.auditSession.count({
        where: { ...baseWhere, startedAt: { gte: todayStart } },
      }),
      prisma.auditSession.count({
        where: {
          ...baseWhere,
          status: 'IN_PROGRESS',
          dueDate: { lt: todayStart },
        },
      }),
      prisma.auditSession.findMany({
        where: { ...baseWhere, status: 'COMPLETED' },
        select: { completionRate: true },
        orderBy: { completedAt: 'desc' },
        take: 20,
      }),
    ]);

    const scores = completedAudits
      .map((s) => s.overallScore)
      .filter((s): s is number => s !== null);

    const avgScore = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

    const avgCompletionRate = recentCompleted.length > 0
      ? Math.round(
          (recentCompleted.reduce((s, c) => s + c.completionRate, 0) /
            recentCompleted.length) *
            10,
        ) / 10
      : 0;

    // Trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (scores.length >= 4) {
      const half = Math.floor(scores.length / 2);
      const recentAvg = scores.slice(0, half).reduce((a, b) => a + b, 0) / half;
      const olderAvg =
        scores.slice(half).reduce((a, b) => a + b, 0) / (scores.length - half);
      if (recentAvg > olderAvg + 2) trend = 'up';
      else if (recentAvg < olderAvg - 2) trend = 'down';
    }

    res.json({
      totalAudits,
      avgScore,
      avgCompletionRate,
      todaysSessions,
      overdueCount,
      trend,
    });
  } catch (err) {
    console.error('CA reports dashboard error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /reports/trends ──────────────────────────────

caReportsRouter.get('/trends', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 20));

    const storeFilter =
      toolStoreIds !== 'all' ? { storeId: { in: toolStoreIds } } : {};

    const sessions = await prisma.auditSession.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        overallScore: { not: null },
        ...storeFilter,
      },
      select: {
        id: true,
        overallScore: true,
        completionRate: true,
        completedAt: true,
        store: { select: { name: true, city: true } },
        template: { select: { name: true, templateType: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    // Chronologische Reihenfolge
    res.json(sessions.reverse());
  } catch (err) {
    console.error('CA reports trends error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /reports/categories ──────────────────────────

caReportsRouter.get('/categories', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';

    const storeFilter =
      toolStoreIds !== 'all' ? { storeId: { in: toolStoreIds } } : {};

    const sessions = await prisma.auditSession.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        ...storeFilter,
      },
      include: {
        template: {
          include: {
            categories: {
              orderBy: { sortOrder: 'asc' },
              include: { criteria: { orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
        responses: true,
      },
      orderBy: { completedAt: 'desc' },
      take: 50,
    });

    const categoryTotals = new Map<
      string,
      { name: string; scores: number[]; passRates: number[] }
    >();

    for (const session of sessions) {
      const scoreResult = calculateAuditScore(
        session.template.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          weight: cat.weight,
          criteria: cat.criteria.map((crit) => ({
            id: crit.id,
            isRequired: crit.isRequired,
            type: crit.type as 'SCORED' | 'BOOLEAN' | 'TEXT' | 'NUMBER',
          })),
        })),
        session.responses.map((r) => ({
          criterionId: r.criterionId,
          scorePercent: r.scorePercent,
          passed: r.passed,
          valueBool: r.valueBool,
          valueText: r.valueText,
          valueNumber: r.valueNumber,
        })),
      );

      for (const scored of scoreResult.categories) {
        const existing = categoryTotals.get(scored.categoryName);
        if (existing) {
          if (scored.scoredCount > 0) existing.scores.push(scored.averagePercent);
          if (scored.passCount + scored.failCount > 0) existing.passRates.push(scored.passRate);
        } else {
          categoryTotals.set(scored.categoryName, {
            name: scored.categoryName,
            scores: scored.scoredCount > 0 ? [scored.averagePercent] : [],
            passRates: scored.passCount + scored.failCount > 0 ? [scored.passRate] : [],
          });
        }
      }
    }

    const categoryAverages = Array.from(categoryTotals.values()).map((cat) => ({
      categoryName: cat.name,
      averageScore: avgOf(cat.scores),
      passRate: avgOf(cat.passRates),
      sampleCount: cat.scores.length,
    }));

    res.json({ categoryAverages, totalSessions: sessions.length });
  } catch (err) {
    console.error('CA reports categories error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /reports/stores ──────────────────────────────

caReportsRouter.get('/stores', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';

    const storeFilter =
      toolStoreIds !== 'all' ? { storeId: { in: toolStoreIds } } : {};

    const sessions = await prisma.auditSession.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        overallScore: { not: null },
        ...storeFilter,
      },
      select: {
        overallScore: true,
        completionRate: true,
        store: { select: { id: true, name: true, city: true } },
      },
    });

    // Gruppiere nach Store
    const storeMap = new Map<
      string,
      { name: string; city: string | null; scores: number[]; completionRates: number[] }
    >();

    for (const session of sessions) {
      const existing = storeMap.get(session.store.id);
      if (existing) {
        if (session.overallScore !== null) existing.scores.push(session.overallScore);
        existing.completionRates.push(session.completionRate);
      } else {
        storeMap.set(session.store.id, {
          name: session.store.name,
          city: session.store.city,
          scores: session.overallScore !== null ? [session.overallScore] : [],
          completionRates: [session.completionRate],
        });
      }
    }

    const storeRanking = Array.from(storeMap.entries())
      .map(([storeId, data]) => ({
        storeId,
        storeName: data.name,
        city: data.city,
        avgScore: avgOf(data.scores),
        avgCompletionRate: avgOf(data.completionRates),
        sessionCount: data.scores.length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    res.json(storeRanking);
  } catch (err) {
    console.error('CA reports stores error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── Helpers ──────────────────────────────────────────

function buildBaseWhere(
  tenantId: string,
  toolStoreIds: string[] | 'all',
  storeId?: string,
): Record<string, unknown> {
  const where: Record<string, unknown> = { tenantId };
  if (toolStoreIds !== 'all') where['storeId'] = { in: toolStoreIds };
  if (storeId) where['storeId'] = storeId;
  return where;
}

function avgOf(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}
