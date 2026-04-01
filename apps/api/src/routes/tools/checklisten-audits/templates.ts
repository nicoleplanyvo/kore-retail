import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import prisma from '../../../lib/prisma.js';
import { requireRole } from '../../../middleware/auth.js';

export const caTemplatesRouter: RouterType = Router();

// ── Zod Schemas ──────────────────────────────────────

const criterionSchema = z.object({
  label: z.string().min(1).max(300),
  description: z.string().max(500).optional(),
  weight: z.number().min(0).default(1),
  type: z.enum(['SCORED', 'BOOLEAN', 'TEXT', 'NUMBER']).default('SCORED'),
  isRequired: z.boolean().default(true),
  photoRequired: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  weight: z.number().min(0).default(1),
  sortOrder: z.number().int().min(0).default(0),
  criteria: z.array(criterionSchema).min(1),
});

const templateCreateSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  templateType: z.enum(['AUDIT', 'CHECKLIST']).default('AUDIT'),
  recurrence: z.enum(['daily', 'weekly', 'monthly']).optional(),
  categories: z.array(categorySchema).min(1),
  isDefault: z.boolean().optional(),
});

const templateUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional(),
  recurrence: z.enum(['daily', 'weekly', 'monthly']).nullish(),
  categories: z.array(categorySchema).optional(),
});

// ── GET /templates ───────────────────────────────────

caTemplatesRouter.get('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const typeFilter = req.query['type'] as string | undefined;

    const where: Record<string, unknown> = {
      isActive: true,
      OR: [
        { tenantId: null, isDefault: true },
        { tenantId },
      ],
    };
    if (typeFilter === 'AUDIT' || typeFilter === 'CHECKLIST') {
      where['templateType'] = typeFilter;
    }

    const templates = await prisma.auditTemplate.findMany({
      where,
      include: {
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            criteria: { orderBy: { sortOrder: 'asc' } },
            _count: { select: { criteria: true } },
          },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });

    res.json(templates);
  } catch (err) {
    console.error('CA templates list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /templates/:id ───────────────────────────────

caTemplatesRouter.get('/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;

    const template = await prisma.auditTemplate.findUnique({
      where: { id: req.params['id'] },
      include: {
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: { criteria: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    });

    if (!template) {
      res.status(404).json({ error: 'Template nicht gefunden.' });
      return;
    }

    if (template.tenantId !== null && template.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf dieses Template.' });
      return;
    }

    res.json(template);
  } catch (err) {
    console.error('CA template detail error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /templates ──────────────────────────────────

caTemplatesRouter.post(
  '/',
  requireRole('tenant_admin', 'kore_admin'),
  async (req, res) => {
    try {
      const result = templateCreateSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: 'Validierungsfehler',
          details: result.error.flatten().fieldErrors,
        });
        return;
      }

      const data = result.data;
      const tenantId = (req as any).tenantId as string;
      const userId = req.user!.sub;
      const isKoreDefault = req.user!.role === 'kore_admin' && data.isDefault === true;

      // AUDIT: Gewichte müssen in Summe 100 ergeben
      if (data.templateType === 'AUDIT') {
        const weightSum = data.categories.reduce((s, c) => s + c.weight, 0);
        if (Math.abs(weightSum - 100) > 0.5) {
          res.status(400).json({
            error: `Kategorie-Gewichte müssen in Summe 100 ergeben (aktuell: ${weightSum}).`,
          });
          return;
        }
      }

      // CHECKLIST: Gewichte gleichmäßig verteilen
      const categories = data.templateType === 'CHECKLIST'
        ? normalizeCategoryWeights(data.categories)
        : data.categories;

      const template = await prisma.auditTemplate.create({
        data: {
          name: data.name,
          description: data.description ?? null,
          templateType: data.templateType,
          recurrence: data.recurrence ?? null,
          tenantId: isKoreDefault ? null : tenantId,
          isDefault: isKoreDefault,
          createdBy: userId,
          categories: {
            create: categories.map((cat, ci) => ({
              name: cat.name,
              description: cat.description ?? null,
              weight: cat.weight,
              sortOrder: cat.sortOrder ?? ci,
              criteria: {
                create: cat.criteria.map((crit, cri) => ({
                  name: crit.label,
                  description: crit.description ?? null,
                  type: crit.type ?? 'SCORED',
                  isRequired: crit.isRequired ?? true,
                  photoRequired: crit.photoRequired ?? false,
                  sortOrder: crit.sortOrder ?? cri,
                })),
              },
            })),
          },
        },
        include: {
          categories: {
            orderBy: { sortOrder: 'asc' },
            include: { criteria: { orderBy: { sortOrder: 'asc' } } },
          },
        },
      });

      res.status(201).json(template);
    } catch (err) {
      console.error('CA template create error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── PUT /templates/:id ───────────────────────────────

caTemplatesRouter.put(
  '/:id',
  requireRole('tenant_admin', 'kore_admin'),
  async (req, res) => {
    try {
      const result = templateUpdateSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: 'Validierungsfehler',
          details: result.error.flatten().fieldErrors,
        });
        return;
      }

      const data = result.data;
      const tenantId = (req as any).tenantId as string;
      const templateId = req.params['id'] as string;

      const existing = await prisma.auditTemplate.findUnique({
        where: { id: templateId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Template nicht gefunden.' });
        return;
      }
      if (existing.tenantId !== null && existing.tenantId !== tenantId) {
        res.status(403).json({ error: 'Kein Zugriff auf dieses Template.' });
        return;
      }
      if (existing.isDefault && req.user!.role !== 'kore_admin') {
        res.status(403).json({ error: 'KORE-Standard-Templates können nur von Admins bearbeitet werden.' });
        return;
      }

      // Delete-and-recreate Kategorien wenn mitgeliefert
      if (data.categories) {
        await prisma.auditCategory.deleteMany({ where: { templateId } });
      }

      const template = await prisma.auditTemplate.update({
        where: { id: templateId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.recurrence !== undefined && { recurrence: data.recurrence }),
          version: { increment: 1 },
          ...(data.categories && {
            categories: {
              create: data.categories.map((cat, ci) => ({
                name: cat.name,
                description: cat.description ?? null,
                weight: cat.weight,
                sortOrder: cat.sortOrder ?? ci,
                criteria: {
                  create: cat.criteria.map((crit, cri) => ({
                    name: crit.label,
                    description: crit.description ?? null,
                    type: crit.type ?? 'SCORED',
                    isRequired: crit.isRequired ?? true,
                    photoRequired: crit.photoRequired ?? false,
                    sortOrder: crit.sortOrder ?? cri,
                  })),
                },
              })),
            },
          }),
        },
        include: {
          categories: {
            orderBy: { sortOrder: 'asc' },
            include: { criteria: { orderBy: { sortOrder: 'asc' } } },
          },
        },
      });

      res.json(template);
    } catch (err) {
      console.error('CA template update error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── DELETE /templates/:id ────────────────────────────

caTemplatesRouter.delete(
  '/:id',
  requireRole('tenant_admin', 'kore_admin'),
  async (req, res) => {
    try {
      const tenantId = (req as any).tenantId as string;
      const templateId = req.params['id'] as string;

      const existing = await prisma.auditTemplate.findUnique({
        where: { id: templateId },
        include: { _count: { select: { sessions: true } } },
      });

      if (!existing) {
        res.status(404).json({ error: 'Template nicht gefunden.' });
        return;
      }
      if (existing.tenantId !== null && existing.tenantId !== tenantId) {
        res.status(403).json({ error: 'Kein Zugriff auf dieses Template.' });
        return;
      }
      if (existing.isDefault && req.user!.role !== 'kore_admin') {
        res.status(403).json({ error: 'KORE-Standard-Templates können nur von Admins gelöscht werden.' });
        return;
      }

      // Hard delete wenn keine Sessions, sonst Soft delete
      if (existing._count.sessions === 0) {
        await prisma.auditTemplate.delete({ where: { id: templateId } });
      } else {
        await prisma.auditTemplate.update({
          where: { id: templateId },
          data: { isActive: false },
        });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('CA template delete error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── POST /templates/:id/clone ────────────────────────

caTemplatesRouter.post(
  '/:id/clone',
  requireRole('tenant_admin', 'kore_admin'),
  async (req, res) => {
    try {
      const tenantId = (req as any).tenantId as string;
      const userId = req.user!.sub;
      const sourceId = req.params['id'] as string;

      const source = await prisma.auditTemplate.findUnique({
        where: { id: sourceId },
        include: {
          categories: {
            orderBy: { sortOrder: 'asc' },
            include: { criteria: { orderBy: { sortOrder: 'asc' } } },
          },
        },
      });

      if (!source) {
        res.status(404).json({ error: 'Template nicht gefunden.' });
        return;
      }

      const clone = await prisma.auditTemplate.create({
        data: {
          name: `${source.name} (Kopie)`,
          description: source.description,
          templateType: source.templateType,
          recurrence: source.recurrence,
          tenantId,
          isDefault: false,
          createdBy: userId,
          categories: {
            create: source.categories.map((cat) => ({
              name: cat.name,
              description: cat.description,
              sortOrder: cat.sortOrder,
              weight: cat.weight,
              criteria: {
                create: cat.criteria.map((crit) => ({
                  name: crit.name,
                  description: crit.description,
                  sortOrder: crit.sortOrder,
                  type: crit.type,
                  isRequired: crit.isRequired,
                  photoRequired: crit.photoRequired,
                })),
              },
            })),
          },
        },
        include: {
          categories: {
            orderBy: { sortOrder: 'asc' },
            include: { criteria: { orderBy: { sortOrder: 'asc' } } },
          },
        },
      });

      res.status(201).json(clone);
    } catch (err) {
      console.error('CA template clone error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── Helpers ──────────────────────────────────────────

type CategoryInput = z.infer<typeof categorySchema>;

/** Verteilt Gewichte gleichmäßig über Kategorien (für Checklisten). */
function normalizeCategoryWeights(categories: CategoryInput[]): CategoryInput[] {
  const equalWeight = categories.length > 0
    ? Math.round((100 / categories.length) * 10) / 10
    : 0;

  return categories.map((cat) => ({
    ...cat,
    weight: equalWeight,
  }));
}
