import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import prisma from '../../../lib/prisma.js';
import { requireMinRole } from '../../../middleware/auth.js';
import { logAudit } from '../../../lib/audit.js';
import { calculateAuditScore } from '../../../shared/audit-scoring.js';

export const caSessionsRouter: RouterType = Router();

// ── Zod Schemas ──────────────────────────────────────

const sessionCreateSchema = z.object({
  storeId: z.string().min(1, 'Store muss ausgewählt werden'),
  templateId: z.string().min(1, 'Template muss ausgewählt werden'),
  storeLocation: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
});

const responseUpsertSchema = z.object({
  scorePercent: z.number().int().min(0).max(100).optional().nullable(),
  passed: z.boolean().optional().nullable(),
  comment: z.string().max(1000).optional().nullable(),
  valueBool: z.boolean().optional().nullable(),
  valueText: z.string().max(2000).optional().nullable(),
  valueNumber: z.number().optional().nullable(),
});

// ── GET /sessions ────────────────────────────────────

caSessionsRouter.get('/', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query['pageSize'] as string) || 20));

    const where = buildSessionWhere(tenantId, toolStoreIds, req.query as Record<string, string>);

    const [sessions, total] = await Promise.all([
      prisma.auditSession.findMany({
        where,
        include: {
          template: { select: { id: true, name: true, templateType: true } },
          store: { select: { id: true, name: true, city: true } },
          _count: { select: { responses: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditSession.count({ where }),
    ]);

    res.json({ data: sessions, total, page, pageSize });
  } catch (err) {
    console.error('CA sessions list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /sessions ───────────────────────────────────

caSessionsRouter.post(
  '/',
  requireMinRole('store_manager'),
  async (req, res) => {
    try {
      const result = sessionCreateSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: 'Validierungsfehler',
          details: result.error.flatten().fieldErrors,
        });
        return;
      }

      const data = result.data;
      const tenantId = (req as any).tenantId as string;
      const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
      const userId = req.user!.sub;

      if (toolStoreIds !== 'all' && !toolStoreIds.includes(data.storeId)) {
        res.status(403).json({ error: 'Kein Zugriff auf diesen Store.' });
        return;
      }

      const template = await prisma.auditTemplate.findUnique({
        where: { id: data.templateId },
      });

      if (!template || !template.isActive) {
        res.status(404).json({ error: 'Template nicht gefunden.' });
        return;
      }
      if (template.tenantId !== null && template.tenantId !== tenantId) {
        res.status(403).json({ error: 'Kein Zugriff auf dieses Template.' });
        return;
      }

      const session = await prisma.auditSession.create({
        data: {
          tenantId,
          storeId: data.storeId,
          templateId: data.templateId,
          conductedBy: userId,
          storeLocation: data.storeLocation ?? null,
          notes: data.notes ?? null,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          status: 'IN_PROGRESS',
          startedAt: new Date(),
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
          store: { select: { id: true, name: true, city: true } },
        },
      });

      await logAudit({
        tenantId,
        userId,
        action: 'CREATE',
        entity: 'AuditSession',
        entityId: session.id,
        details: `Session gestartet: ${template.name} in Store ${data.storeId}`,
        ipAddress: req.ip ?? null,
      });

      res.status(201).json(session);
    } catch (err) {
      console.error('CA session create error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── GET /sessions/:id ────────────────────────────────

caSessionsRouter.get('/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const sessionId = req.params['id'] as string;

    const session = await prisma.auditSession.findUnique({
      where: { id: sessionId },
      include: {
        template: {
          include: {
            categories: {
              orderBy: { sortOrder: 'asc' },
              include: { criteria: { orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
        store: { select: { id: true, name: true, city: true } },
        responses: { include: { criterion: true } },
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Session nicht gefunden.' });
      return;
    }
    if (session.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf diese Session.' });
      return;
    }
    if (toolStoreIds !== 'all' && !toolStoreIds.includes(session.storeId)) {
      res.status(403).json({ error: 'Kein Zugriff auf diesen Store.' });
      return;
    }

    res.json(session);
  } catch (err) {
    console.error('CA session detail error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /sessions/:id/complete ──────────────────────

caSessionsRouter.post(
  '/:id/complete',
  requireMinRole('store_manager'),
  async (req, res) => {
    try {
      const tenantId = (req as any).tenantId as string;
      const sessionId = req.params['id'] as string;

      const session = await prisma.auditSession.findUnique({
        where: { id: sessionId },
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
      });

      if (!session) {
        res.status(404).json({ error: 'Session nicht gefunden.' });
        return;
      }
      if (session.tenantId !== tenantId) {
        res.status(403).json({ error: 'Kein Zugriff auf diese Session.' });
        return;
      }
      if (session.status === 'COMPLETED') {
        res.status(400).json({ error: 'Session ist bereits abgeschlossen.' });
        return;
      }
      if (session.status === 'CANCELLED') {
        res.status(400).json({ error: 'Abgebrochene Session kann nicht abgeschlossen werden.' });
        return;
      }

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

      const completed = await prisma.auditSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          overallScore: scoreResult.overallScore,
          completionRate: scoreResult.completionRate,
          completedAt: new Date(),
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
          store: { select: { id: true, name: true, city: true } },
          responses: { include: { criterion: true } },
        },
      });

      await logAudit({
        tenantId,
        userId: req.user!.sub,
        action: 'COMPLETE',
        entity: 'AuditSession',
        entityId: session.id,
        details: `Session abgeschlossen, Score: ${scoreResult.overallScore?.toFixed(1)}%`,
        ipAddress: req.ip ?? null,
      });

      res.json({ ...completed, scoreDetails: scoreResult });
    } catch (err) {
      console.error('CA session complete error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── POST /sessions/:id/cancel ────────────────────────

caSessionsRouter.post(
  '/:id/cancel',
  requireMinRole('store_manager'),
  async (req, res) => {
    try {
      const tenantId = (req as any).tenantId as string;
      const sessionId = req.params['id'] as string;

      const existing = await prisma.auditSession.findUnique({
        where: { id: sessionId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Session nicht gefunden.' });
        return;
      }
      if (existing.tenantId !== tenantId) {
        res.status(403).json({ error: 'Kein Zugriff auf diese Session.' });
        return;
      }
      if (existing.status === 'COMPLETED') {
        res.status(400).json({ error: 'Abgeschlossene Sessions können nicht abgebrochen werden.' });
        return;
      }

      await prisma.auditSession.update({
        where: { id: sessionId },
        data: { status: 'CANCELLED' },
      });

      await logAudit({
        tenantId,
        userId: req.user!.sub,
        action: 'CANCEL',
        entity: 'AuditSession',
        entityId: sessionId,
        ipAddress: req.ip ?? null,
      });

      res.json({ success: true });
    } catch (err) {
      console.error('CA session cancel error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── PUT /sessions/:id/responses/:criterionId ─────────

caSessionsRouter.put(
  '/:id/responses/:criterionId',
  requireMinRole('store_manager'),
  async (req, res) => {
    try {
      const result = responseUpsertSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: 'Validierungsfehler',
          details: result.error.flatten().fieldErrors,
        });
        return;
      }

      const data = result.data;
      const tenantId = (req as any).tenantId as string;
      const sessionId = req.params['id'] as string;
      const criterionId = req.params['criterionId'] as string;

      const session = await prisma.auditSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        res.status(404).json({ error: 'Session nicht gefunden.' });
        return;
      }
      if (session.tenantId !== tenantId) {
        res.status(403).json({ error: 'Kein Zugriff auf diese Session.' });
        return;
      }
      if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
        res.status(400).json({ error: 'Session kann nicht mehr bearbeitet werden.' });
        return;
      }

      const criterion = await prisma.auditCriterion.findUnique({
        where: { id: criterionId },
        include: { category: { select: { templateId: true } } },
      });

      if (!criterion || criterion.category.templateId !== session.templateId) {
        res.status(404).json({ error: 'Kriterium nicht gefunden oder gehört nicht zum Template.' });
        return;
      }

      const response = await prisma.auditResponse.upsert({
        where: {
          sessionId_criterionId: { sessionId, criterionId },
        },
        update: {
          scorePercent: data.scorePercent ?? undefined,
          passed: data.passed ?? undefined,
          comment: data.comment ?? undefined,
          valueBool: data.valueBool ?? undefined,
          valueText: data.valueText ?? undefined,
          valueNumber: data.valueNumber ?? undefined,
        },
        create: {
          sessionId,
          criterionId,
          scorePercent: data.scorePercent ?? null,
          passed: data.passed ?? null,
          comment: data.comment ?? null,
          valueBool: data.valueBool ?? null,
          valueText: data.valueText ?? null,
          valueNumber: data.valueNumber ?? null,
        },
        include: { criterion: true },
      });

      res.json(response);
    } catch (err) {
      console.error('CA response upsert error:', err);
      res.status(500).json({ error: 'Interner Serverfehler.' });
    }
  },
);

// ── Helpers ──────────────────────────────────────────

function buildSessionWhere(
  tenantId: string,
  toolStoreIds: string[] | 'all',
  query: Record<string, string>,
): Record<string, unknown> {
  const where: Record<string, unknown> = { tenantId };

  if (toolStoreIds !== 'all') {
    where['storeId'] = { in: toolStoreIds };
  }
  if (query['storeId']) where['storeId'] = query['storeId'];
  if (query['status']) where['status'] = query['status'];

  // Filter by templateType via template relation
  if (query['templateType'] === 'AUDIT' || query['templateType'] === 'CHECKLIST') {
    where['template'] = { templateType: query['templateType'] };
  }

  // Date range filter
  const dateFilter: Record<string, unknown> = {};
  if (query['from']) dateFilter['gte'] = new Date(query['from']);
  if (query['to']) dateFilter['lte'] = new Date(query['to']);
  if (query['from'] || query['to']) {
    where['createdAt'] = dateFilter;
  }

  return where;
}
