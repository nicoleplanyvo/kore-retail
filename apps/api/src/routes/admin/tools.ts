import { Router, type Router as RouterType } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { toolAssignSchema } from '@kore/validators';

export const adminToolsRouter: RouterType = Router();

// Alle Admin-Tool-Routes erfordern kore_admin
adminToolsRouter.use(authenticate, requireRole('kore_admin'));

// GET /api/admin/tools/overview — Tool-Übersicht: pro Tool die zugewiesenen Tenants
adminToolsRouter.get('/overview', async (_req, res) => {
  try {
    const assignments = await prisma.toolAssignment.findMany({
      where: { isActive: true },
      include: {
        tenant: {
          select: { id: true, name: true, slug: true, plan: true, status: true },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    // Gruppiere nach Tool
    const overview: Record<string, { count: number; tenants: typeof assignments }> = {
      TRAIN: { count: 0, tenants: [] },
      PULSE: { count: 0, tenants: [] },
      SHIFT: { count: 0, tenants: [] },
    };

    for (const assignment of assignments) {
      const group = overview[assignment.tool];
      if (group) {
        group.count++;
        group.tenants.push(assignment);
      }
    }

    res.json(overview);
  } catch (err) {
    console.error('Admin tools overview error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// POST /api/admin/tools/assign — Tool an Tenant zuweisen
adminToolsRouter.post('/assign', async (req, res) => {
  try {
    const result = toolAssignSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validierungsfehler',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { tenantId, tool } = result.data;

    // Prüfe ob Tenant existiert
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      res.status(404).json({ error: 'Tenant nicht gefunden.' });
      return;
    }

    // Upsert: Falls bereits zugewiesen aber deaktiviert, reaktivieren
    const assignment = await prisma.toolAssignment.upsert({
      where: { tenantId_tool: { tenantId, tool } },
      update: { isActive: true },
      create: { tenantId, tool },
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error('Admin tool assign error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// DELETE /api/admin/tools/assign/:id — Tool-Zuweisung entfernen (soft delete)
adminToolsRouter.delete('/assign/:id', async (req, res) => {
  try {
    const assignment = await prisma.toolAssignment.update({
      where: { id: req.params['id'] },
      data: { isActive: false },
    });

    res.json({ success: true, assignment });
  } catch (err) {
    console.error('Admin tool unassign error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
