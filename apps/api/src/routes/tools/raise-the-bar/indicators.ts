import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';
import { z } from 'zod';

export const indicatorsRouter: RouterType = Router();

const MAX_INDICATORS = 10;

// ---------- Validation ----------

const createSchema = z.object({
  name: z.string().min(1).max(120),
  unit: z.string().min(1).max(20).default('%'),
  weight: z.number().min(0).max(1),
  targetValue: z.number().nullable().optional(),
  higherIsBetter: z.boolean().default(true),
});

const updateSchema = createSchema.partial();

const reorderSchema = z.object({
  indicators: z.array(
    z.object({
      id: z.string(),
      weight: z.number().min(0).max(1),
      sortOrder: z.number().int().min(0),
    }),
  ),
});

// ---------- GET / ----------

indicatorsRouter.get('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const indicators = await prisma.rtbIndicator.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ data: indicators });
  } catch (err) {
    console.error('RTB indicators list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- POST / ----------

indicatorsRouter.post('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Ungültige Eingabe.', details: parsed.error.flatten() });
      return;
    }

    const activeCount = await prisma.rtbIndicator.count({
      where: { tenantId, isActive: true },
    });
    if (activeCount >= MAX_INDICATORS) {
      res.status(400).json({ error: `Maximal ${MAX_INDICATORS} Indikatoren erlaubt.` });
      return;
    }

    const indicator = await prisma.rtbIndicator.create({
      data: {
        tenantId,
        name: parsed.data.name,
        unit: parsed.data.unit,
        weight: parsed.data.weight,
        targetValue: parsed.data.targetValue ?? null,
        higherIsBetter: parsed.data.higherIsBetter,
        sortOrder: activeCount,
      },
    });

    res.status(201).json(indicator);
  } catch (err) {
    console.error('RTB indicator create error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- PUT /:id ----------

indicatorsRouter.put('/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Ungültige Eingabe.', details: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.rtbIndicator.findFirst({
      where: { id, tenantId },
    });
    if (!existing) {
      res.status(404).json({ error: 'Indikator nicht gefunden.' });
      return;
    }

    const updated = await prisma.rtbIndicator.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.unit !== undefined && { unit: parsed.data.unit }),
        ...(parsed.data.weight !== undefined && { weight: parsed.data.weight }),
        ...(parsed.data.targetValue !== undefined && { targetValue: parsed.data.targetValue }),
        ...(parsed.data.higherIsBetter !== undefined && { higherIsBetter: parsed.data.higherIsBetter }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('RTB indicator update error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- PUT /reorder ----------

indicatorsRouter.put('/reorder', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Ungültige Eingabe.', details: parsed.error.flatten() });
      return;
    }

    const weightSum = parsed.data.indicators.reduce((s, i) => s + i.weight, 0);
    if (Math.abs(weightSum - 1.0) > 0.01) {
      res.status(400).json({ error: `Gewichtungen müssen 100% ergeben (aktuell: ${Math.round(weightSum * 100)}%).` });
      return;
    }

    const updates = parsed.data.indicators.map((ind) =>
      prisma.rtbIndicator.updateMany({
        where: { id: ind.id, tenantId },
        data: { weight: ind.weight, sortOrder: ind.sortOrder },
      }),
    );
    await Promise.all(updates);

    const indicators = await prisma.rtbIndicator.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({ data: indicators });
  } catch (err) {
    console.error('RTB indicator reorder error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- DELETE /:id ----------

indicatorsRouter.delete('/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { id } = req.params;

    const existing = await prisma.rtbIndicator.findFirst({
      where: { id, tenantId },
    });
    if (!existing) {
      res.status(404).json({ error: 'Indikator nicht gefunden.' });
      return;
    }

    await prisma.rtbIndicator.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('RTB indicator delete error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
