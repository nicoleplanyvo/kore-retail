import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';

export const rankingsRouter: RouterType = Router();

// ---------- Types ----------

interface IndicatorScore {
  indicatorId: string;
  name: string;
  unit: string;
  value: number;
  score: number;
  weight: number;
}

interface StoreRanking {
  storeId: string;
  storeName: string;
  totalScore: number;
  rank: number;
  indicators: IndicatorScore[];
}

// ---------- Scoring helpers ----------

function normalizeValue(
  value: number,
  target: number | null,
  higherIsBetter: boolean,
  allValues: number[],
): number {
  if (target !== null && target > 0) {
    return higherIsBetter
      ? Math.min(100, (value / target) * 100)
      : Math.min(100, (target / Math.max(value, 0.001)) * 100);
  }
  // Min-max normalization across all stores
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  if (max === min) return 100;
  const normalized = ((value - min) / (max - min)) * 100;
  return higherIsBetter ? normalized : 100 - normalized;
}

function buildRankings(
  stores: { id: string; name: string }[],
  indicators: { id: string; name: string; unit: string; weight: number; targetValue: number | null; higherIsBetter: boolean }[],
  entries: { storeId: string; indicatorId: string; value: number }[],
): StoreRanking[] {
  // Group entries by indicator to get all values for normalization
  const entriesByIndicator = new Map<string, Map<string, number>>();
  const allValuesByIndicator = new Map<string, number[]>();

  for (const entry of entries) {
    if (!entriesByIndicator.has(entry.indicatorId)) {
      entriesByIndicator.set(entry.indicatorId, new Map());
      allValuesByIndicator.set(entry.indicatorId, []);
    }
    entriesByIndicator.get(entry.indicatorId)!.set(entry.storeId, entry.value);
    allValuesByIndicator.get(entry.indicatorId)!.push(entry.value);
  }

  // Calculate score per store
  const storeRankings: StoreRanking[] = stores.map((store) => {
    const indicatorScores: IndicatorScore[] = indicators.map((ind) => {
      const storeValues = entriesByIndicator.get(ind.id);
      const value = storeValues?.get(store.id) ?? 0;
      const allValues = allValuesByIndicator.get(ind.id) ?? [0];
      const score = storeValues?.has(store.id)
        ? normalizeValue(value, ind.targetValue, ind.higherIsBetter, allValues)
        : 0;

      return {
        indicatorId: ind.id,
        name: ind.name,
        unit: ind.unit,
        value,
        score: Math.round(score * 10) / 10,
        weight: ind.weight,
      };
    });

    const totalScore = indicatorScores.reduce(
      (sum, is) => sum + is.score * is.weight,
      0,
    );

    return {
      storeId: store.id,
      storeName: store.name,
      totalScore: Math.round(totalScore * 10) / 10,
      rank: 0,
      indicators: indicatorScores,
    };
  });

  // Sort by totalScore descending, assign ranks
  storeRankings.sort((a, b) => b.totalScore - a.totalScore);
  return storeRankings.map((sr, idx) => ({ ...sr, rank: idx + 1 }));
}

// ---------- GET / (current period ranking) ----------

rankingsRouter.get('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const period = (req.query['period'] as string) ?? getCurrentPeriod();

    const [stores, indicators, entries] = await Promise.all([
      prisma.store.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.rtbIndicator.findMany({
        where: { tenantId, isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.rtbEntry.findMany({
        where: { tenantId, period },
        select: { storeId: true, indicatorId: true, value: true },
      }),
    ]);

    // Only include stores that have at least one entry
    const storesWithEntries = new Set(entries.map((e) => e.storeId));
    const filteredStores = stores.filter((s) => storesWithEntries.has(s.id));

    const rankings = buildRankings(filteredStores, indicators, entries);

    res.json({ data: rankings, period });
  } catch (err) {
    console.error('RTB rankings error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- GET /trend ----------

rankingsRouter.get('/trend', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const months = Math.min(parseInt(req.query['months'] as string) || 6, 24);
    const periods = getLastNPeriods(months);

    const snapshots = await prisma.rtbSnapshot.findMany({
      where: { tenantId, period: { in: periods } },
      include: { store: { select: { id: true, name: true } } },
      orderBy: [{ period: 'asc' }, { rank: 'asc' }],
    });

    // Group by store
    const byStore = new Map<string, { storeName: string; data: { period: string; totalScore: number; rank: number }[] }>();
    for (const snap of snapshots) {
      if (!byStore.has(snap.storeId)) {
        byStore.set(snap.storeId, { storeName: snap.store.name, data: [] });
      }
      byStore.get(snap.storeId)!.data.push({
        period: snap.period,
        totalScore: snap.totalScore,
        rank: snap.rank,
      });
    }

    res.json({ data: Object.fromEntries(byStore), periods });
  } catch (err) {
    console.error('RTB trend error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- GET /comparison ----------

rankingsRouter.get('/comparison', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const storeIds = ((req.query['storeIds'] as string) ?? '').split(',').filter(Boolean);
    const period = (req.query['period'] as string) ?? getCurrentPeriod();

    if (storeIds.length < 2 || storeIds.length > 4) {
      res.status(400).json({ error: '2 bis 4 Stores für Vergleich auswählen.' });
      return;
    }

    const [stores, indicators, entries] = await Promise.all([
      prisma.store.findMany({
        where: { id: { in: storeIds }, tenantId, isActive: true },
        select: { id: true, name: true },
      }),
      prisma.rtbIndicator.findMany({
        where: { tenantId, isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.rtbEntry.findMany({
        where: { tenantId, storeId: { in: storeIds }, period },
        select: { storeId: true, indicatorId: true, value: true },
      }),
    ]);

    const rankings = buildRankings(stores, indicators, entries);

    res.json({ data: rankings, period });
  } catch (err) {
    console.error('RTB comparison error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- POST /recalculate ----------

rankingsRouter.post('/recalculate', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const period = (req.body?.period as string) ?? getCurrentPeriod();

    const [stores, indicators, entries] = await Promise.all([
      prisma.store.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, name: true },
      }),
      prisma.rtbIndicator.findMany({
        where: { tenantId, isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.rtbEntry.findMany({
        where: { tenantId, period },
        select: { storeId: true, indicatorId: true, value: true },
      }),
    ]);

    const storesWithEntries = new Set(entries.map((e) => e.storeId));
    const filteredStores = stores.filter((s) => storesWithEntries.has(s.id));
    const rankings = buildRankings(filteredStores, indicators, entries);

    // Upsert snapshots
    const upserts = rankings.map((r) =>
      prisma.rtbSnapshot.upsert({
        where: { storeId_period: { storeId: r.storeId, period } },
        create: {
          tenantId,
          storeId: r.storeId,
          period,
          totalScore: r.totalScore,
          rank: r.rank,
        },
        update: {
          totalScore: r.totalScore,
          rank: r.rank,
        },
      }),
    );

    await Promise.all(upserts);

    res.json({ data: rankings, period, snapshotsUpdated: rankings.length });
  } catch (err) {
    console.error('RTB recalculate error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- Helpers ----------

function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getLastNPeriods(n: number): string[] {
  const periods: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    periods.push(`${year}-${month}`);
  }
  return periods;
}
