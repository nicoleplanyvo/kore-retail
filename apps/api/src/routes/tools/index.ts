import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { getAccessibleStoreIds } from '../../middleware/auth.js';
import prisma from '../../lib/prisma.js';

export const toolsRouter = Router();

/**
 * GET /api/tools
 * Gibt alle Tools zurück, die den Stores des aktuellen Users zugewiesen sind.
 * Dedupliziert nach toolId (ein User kann mehrere Stores mit demselben Tool haben).
 */
toolsRouter.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user!;
    const storeIds = await getAccessibleStoreIds(user.sub, user.tenantId ?? null, user.role);

    const whereClause =
      storeIds === 'all'
        ? { isActive: true }
        : { storeId: { in: storeIds }, isActive: true };

    const assignments = await prisma.storeToolAssignment.findMany({
      where: whereClause,
      include: {
        tool: true,
      },
      orderBy: [{ tool: { category: 'asc' } }, { tool: { sortOrder: 'asc' } }],
    });

    res.json(assignments);
  } catch (error) {
    console.error('Fehler beim Laden der Tools:', error);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
