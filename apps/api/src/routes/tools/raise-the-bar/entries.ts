import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';
import multer from 'multer';
import { z } from 'zod';
import * as XLSX from 'xlsx';

export const entriesRouter: RouterType = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ---------- Validation ----------

const bulkUpsertSchema = z.object({
  storeId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Periode muss YYYY-MM Format haben'),
  values: z.record(z.string(), z.number()),
});

// ---------- GET / ----------

entriesRouter.get('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const period = req.query['period'] as string | undefined;
    const storeId = req.query['storeId'] as string | undefined;

    if (!period) {
      res.status(400).json({ error: 'Parameter "period" ist erforderlich.' });
      return;
    }

    const where: Record<string, unknown> = { tenantId, period };
    if (storeId) where['storeId'] = storeId;

    const entries = await prisma.rtbEntry.findMany({
      where,
      include: { indicator: true, store: { select: { id: true, name: true } } },
      orderBy: [{ storeId: 'asc' }, { indicator: { sortOrder: 'asc' } }],
    });

    res.json({ data: entries });
  } catch (err) {
    console.error('RTB entries list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- PUT / (bulk upsert) ----------

entriesRouter.put('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = (req as any).user?.sub as string;
    const parsed = bulkUpsertSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Ungültige Eingabe.', details: parsed.error.flatten() });
      return;
    }

    const { storeId, period, values } = parsed.data;

    // Verify store belongs to tenant
    const store = await prisma.store.findFirst({
      where: { id: storeId, tenantId, isActive: true },
    });
    if (!store) {
      res.status(404).json({ error: 'Store nicht gefunden.' });
      return;
    }

    // Verify all indicator IDs belong to tenant
    const indicatorIds = Object.keys(values);
    const indicators = await prisma.rtbIndicator.findMany({
      where: { id: { in: indicatorIds }, tenantId, isActive: true },
    });
    if (indicators.length !== indicatorIds.length) {
      res.status(400).json({ error: 'Einige Indikatoren wurden nicht gefunden.' });
      return;
    }

    // Upsert each entry
    const upserts = indicatorIds.map((indicatorId) =>
      prisma.rtbEntry.upsert({
        where: {
          storeId_indicatorId_period: { storeId, indicatorId, period },
        },
        create: {
          tenantId,
          storeId,
          indicatorId,
          period,
          value: values[indicatorId]!,
          createdBy: userId,
        },
        update: {
          value: values[indicatorId]!,
        },
      }),
    );

    const results = await Promise.all(upserts);
    res.json({ data: results, count: results.length });
  } catch (err) {
    console.error('RTB entries bulk upsert error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ---------- POST /import ----------

entriesRouter.post('/import', upload.single('file'), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = (req as any).user?.sub as string;
    const period = req.body?.period as string | undefined;

    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
      res.status(400).json({ error: 'Periode (YYYY-MM) ist erforderlich.' });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Keine Datei hochgeladen.' });
      return;
    }

    // Parse Excel/CSV
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      res.status(400).json({ error: 'Leere Datei.' });
      return;
    }
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName]!);

    if (rows.length === 0) {
      res.status(400).json({ error: 'Keine Datenzeilen gefunden.' });
      return;
    }

    // Load stores and indicators for matching
    const [stores, indicators] = await Promise.all([
      prisma.store.findMany({ where: { tenantId, isActive: true }, select: { id: true, name: true } }),
      prisma.rtbIndicator.findMany({ where: { tenantId, isActive: true }, select: { id: true, name: true } }),
    ]);

    const storeByName = new Map(stores.map((s) => [s.name.toLowerCase(), s]));
    const indicatorByName = new Map(indicators.map((i) => [i.name.toLowerCase(), i]));

    const errors: string[] = [];
    let imported = 0;

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx]!;
      const rowNum = rowIdx + 2; // +1 for 0-index, +1 for header row

      // First column is store name
      const storeName = String(Object.values(row)[0] ?? '').trim();
      const store = storeByName.get(storeName.toLowerCase());
      if (!store) {
        errors.push(`Zeile ${rowNum}: Store "${storeName}" nicht gefunden.`);
        continue;
      }

      // Remaining columns are indicator values
      const entries = Object.entries(row).slice(1);
      for (const [colName, rawValue] of entries) {
        const indicator = indicatorByName.get(colName.toLowerCase());
        if (!indicator) {
          errors.push(`Zeile ${rowNum}: Indikator "${colName}" nicht gefunden.`);
          continue;
        }

        const value = Number(rawValue);
        if (isNaN(value)) {
          errors.push(`Zeile ${rowNum}: Ungültiger Wert "${rawValue}" für "${colName}".`);
          continue;
        }

        await prisma.rtbEntry.upsert({
          where: {
            storeId_indicatorId_period: {
              storeId: store.id,
              indicatorId: indicator.id,
              period,
            },
          },
          create: {
            tenantId,
            storeId: store.id,
            indicatorId: indicator.id,
            period,
            value,
            createdBy: userId,
          },
          update: { value },
        });
        imported++;
      }
    }

    res.json({ imported, errors });
  } catch (err) {
    console.error('RTB import error:', err);
    res.status(500).json({ error: 'Import fehlgeschlagen.' });
  }
});
