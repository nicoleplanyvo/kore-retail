import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';
import { logAudit } from '../../../lib/audit.js';
import { getSubordinateIds } from '../../../lib/hierarchy.js';

export const sopAcknowledgmentsRouter: RouterType = Router();

// POST /documents/:id/acknowledge — User bestätigt SOP-Kenntnisnahme
sopAcknowledgmentsRouter.post('/documents/:id/acknowledge', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const sopId = req.params['id'] as string;

    // Prüfe ob SOP existiert und zugänglich ist
    const sop = await prisma.sop.findUnique({
      where: { id: sopId },
    });

    if (!sop) {
      res.status(404).json({ error: 'SOP nicht gefunden.' });
      return;
    }

    // Zugriffsprüfung: Global oder eigener Tenant
    if (sop.tenantId !== null && sop.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf dieses SOP.' });
      return;
    }

    // Nur veröffentlichte SOPs können bestätigt werden
    if (sop.status !== 'PUBLISHED') {
      res.status(400).json({ error: 'Nur veröffentlichte SOPs können bestätigt werden.' });
      return;
    }

    // Upsert: Falls bereits bestätigt, Zeitstempel aktualisieren
    const acknowledgment = await prisma.sopAcknowledgment.upsert({
      where: {
        sopId_userId: { sopId, userId },
      },
      update: {
        acknowledgedAt: new Date(),
      },
      create: {
        sopId,
        userId,
      },
    });

    await logAudit({
      tenantId,
      userId,
      action: 'ACKNOWLEDGE',
      entity: 'Sop',
      entityId: sopId,
      details: `SOP bestätigt: ${sop.title}`,
      ipAddress: req.ip ?? null,
    });

    res.json(acknowledgment);
  } catch (err) {
    console.error('SOP acknowledge error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /documents/:id/acknowledgments — Hierarchy-filtered: nur Untergebene sichtbar
sopAcknowledgmentsRouter.get('/documents/:id/acknowledgments', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const sopId = req.params['id'] as string;

    // Prüfe ob SOP existiert und zugänglich ist
    const sop = await prisma.sop.findUnique({
      where: { id: sopId },
    });

    if (!sop) {
      res.status(404).json({ error: 'SOP nicht gefunden.' });
      return;
    }

    if (sop.tenantId !== null && sop.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf dieses SOP.' });
      return;
    }

    // Get subordinate IDs for hierarchy filtering
    const subordinateIds = await getSubordinateIds(userId, tenantId);

    // kore_admin and tenant_admin see all in tenant; others see only subordinates + self
    const isAdmin = req.user!.role === 'kore_admin' || req.user!.role === 'tenant_admin';
    const visibleUserIds = isAdmin ? undefined : [...subordinateIds, userId];

    const whereClause: Record<string, unknown> = { sopId };
    if (visibleUserIds) {
      whereClause['userId'] = { in: visibleUserIds };
    }

    const acknowledgments = await prisma.sopAcknowledgment.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { acknowledgedAt: 'desc' },
    });

    const totalReports = isAdmin
      ? await prisma.user.count({ where: { tenantId, isActive: true } })
      : subordinateIds.length;

    res.json({
      totalReports,
      acknowledged: acknowledgments.length,
      users: acknowledgments.map((ack) => ({
        id: ack.user.id,
        name: ack.user.name,
        email: ack.user.email,
        acknowledgedAt: ack.acknowledgedAt,
      })),
    });
  } catch (err) {
    console.error('SOP acknowledgments list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /reports/acknowledgment-status — Zusammenfassung pro SOP (hierarchy-filtered)
sopAcknowledgmentsRouter.get('/reports/acknowledgment-status', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;

    // Alle veröffentlichten SOPs für diesen Tenant (inkl. globale)
    const sops = await prisma.sop.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { tenantId: null },
          { tenantId },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        isMandatory: true,
        deadline: true,
        isOverdue: true,
        category: { select: { id: true, name: true } },
        publishedAt: true,
        _count: { select: { acknowledgments: true } },
      },
      orderBy: { title: 'asc' },
    });

    const isAdmin = req.user!.role === 'kore_admin' || req.user!.role === 'tenant_admin';

    let totalUsers: number;
    let subordinateIds: string[] = [];

    if (isAdmin) {
      totalUsers = await prisma.user.count({
        where: { tenantId, isActive: true },
      });
    } else {
      subordinateIds = await getSubordinateIds(userId, tenantId);
      totalUsers = subordinateIds.length;
    }

    // If not admin, we need per-SOP counts filtered by subordinates
    const report = await Promise.all(
      sops.map(async (sop) => {
        let acknowledgedCount: number;
        if (isAdmin) {
          acknowledgedCount = sop._count.acknowledgments;
        } else {
          acknowledgedCount = await prisma.sopAcknowledgment.count({
            where: {
              sopId: sop.id,
              userId: { in: subordinateIds },
            },
          });
        }

        return {
          sopId: sop.id,
          title: sop.title,
          status: sop.status,
          category: sop.category,
          publishedAt: sop.publishedAt,
          isMandatory: sop.isMandatory,
          deadline: sop.deadline,
          isOverdue: sop.isOverdue,
          acknowledgedCount,
          totalUsers,
          acknowledgedPercent:
            totalUsers > 0
              ? Math.round((acknowledgedCount / totalUsers) * 1000) / 10
              : 0,
        };
      }),
    );

    res.json(report);
  } catch (err) {
    console.error('SOP acknowledgment status report error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /reports/compliance — Pflicht-SOPs Compliance pro User (hierarchy-filtered)
sopAcknowledgmentsRouter.get('/reports/compliance', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const isAdmin = req.user!.role === 'kore_admin' || req.user!.role === 'tenant_admin';

    // Get mandatory published SOPs
    const mandatorySops = await prisma.sop.findMany({
      where: {
        status: 'PUBLISHED',
        isMandatory: true,
        OR: [{ tenantId: null }, { tenantId }],
      },
      select: { id: true, title: true, deadline: true, isOverdue: true },
    });

    const mandatorySopIds = mandatorySops.map((s) => s.id);
    const totalMandatory = mandatorySopIds.length;

    if (totalMandatory === 0) {
      res.json({ totalMandatory: 0, users: [] });
      return;
    }

    // Get visible users
    let visibleUsers: { id: string; name: string; email: string }[];
    if (isAdmin) {
      visibleUsers = await prisma.user.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      });
    } else {
      const subordinateIds = await getSubordinateIds(userId, tenantId);
      visibleUsers = await prisma.user.findMany({
        where: { id: { in: subordinateIds }, isActive: true },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      });
    }

    // Get all acknowledgments for mandatory SOPs by visible users
    const visibleUserIds = visibleUsers.map((u) => u.id);
    const acknowledgments = await prisma.sopAcknowledgment.findMany({
      where: {
        sopId: { in: mandatorySopIds },
        userId: { in: visibleUserIds },
      },
      select: { sopId: true, userId: true },
    });

    // Build a set for quick lookup
    const ackSet = new Set(acknowledgments.map((a) => `${a.userId}:${a.sopId}`));

    const users = visibleUsers.map((user) => {
      const readCount = mandatorySopIds.filter(
        (sopId) => ackSet.has(`${user.id}:${sopId}`),
      ).length;
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        readCount,
        totalMandatory,
        readPercent:
          totalMandatory > 0
            ? Math.round((readCount / totalMandatory) * 1000) / 10
            : 0,
      };
    });

    res.json({ totalMandatory, users });
  } catch (err) {
    console.error('SOP compliance report error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /reports/overdue — Überfällige Pflicht-SOPs
sopAcknowledgmentsRouter.get('/reports/overdue', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;

    const now = new Date();

    const overdueSops = await prisma.sop.findMany({
      where: {
        status: 'PUBLISHED',
        isMandatory: true,
        deadline: { lt: now },
        OR: [{ tenantId: null }, { tenantId }],
      },
      select: {
        id: true,
        title: true,
        deadline: true,
        category: { select: { id: true, name: true } },
        _count: { select: { acknowledgments: true } },
      },
      orderBy: { deadline: 'asc' },
    });

    const totalUsers = await prisma.user.count({
      where: { tenantId, isActive: true },
    });

    const report = overdueSops.map((sop) => ({
      sopId: sop.id,
      title: sop.title,
      deadline: sop.deadline,
      category: sop.category,
      acknowledgedCount: sop._count.acknowledgments,
      totalUsers,
      acknowledgedPercent:
        totalUsers > 0
          ? Math.round((sop._count.acknowledgments / totalUsers) * 1000) / 10
          : 0,
    }));

    res.json(report);
  } catch (err) {
    console.error('SOP overdue report error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
