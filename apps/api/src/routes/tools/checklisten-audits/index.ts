import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { caTemplatesRouter } from './templates.js';
import { caSessionsRouter } from './sessions.js';
import { caReportsRouter } from './reports.js';

export const checklistenAuditsRouter: RouterType = Router();

/**
 * Middleware: Authentifizierung + Zugriff auf mindestens eines der beiden Tools.
 * Akzeptiert sowohl 'standards.checklisten' als auch 'standards.excellence_tracker'.
 */
checklistenAuditsRouter.use(authenticate, async (req, res, next) => {
  // Versuche erst excellence_tracker, dann checklisten
  const tryTool = (toolKey: string) =>
    new Promise<boolean>((resolve) => {
      requireToolAccess(toolKey)(req, res, (err?: unknown) => {
        if (err) { resolve(false); return; }
        // Prüfe ob die Response schon geschrieben wurde (403/404)
        if (res.headersSent) { resolve(false); return; }
        resolve(true);
      });
    });

  const hasExcellence = await tryTool('standards.excellence_tracker');
  if (hasExcellence && !res.headersSent) {
    next();
    return;
  }

  // Reset res wenn Header noch nicht gesendet
  if (!res.headersSent) {
    const hasChecklisten = await tryTool('standards.checklisten');
    if (hasChecklisten && !res.headersSent) {
      next();
      return;
    }
  }

  if (!res.headersSent) {
    res.status(403).json({ error: 'Kein Zugriff auf Checklisten & Audits.' });
  }
});

// GET /stores — Zugängliche Stores
checklistenAuditsRouter.get('/stores', async (req, res) => {
  try {
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const tenantId = (req as any).tenantId as string;

    const where: Record<string, unknown> = { isActive: true };
    if (toolStoreIds !== 'all') {
      where['id'] = { in: toolStoreIds };
    } else if (tenantId) {
      where['tenantId'] = tenantId;
    }

    const stores = await prisma.store.findMany({
      where,
      select: { id: true, name: true, city: true },
      orderBy: { name: 'asc' },
    });

    res.json(stores);
  } catch (err) {
    console.error('CA stores list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// Sub-Router mounten
checklistenAuditsRouter.use('/templates', caTemplatesRouter);
checklistenAuditsRouter.use('/sessions', caSessionsRouter);
checklistenAuditsRouter.use('/reports', caReportsRouter);
