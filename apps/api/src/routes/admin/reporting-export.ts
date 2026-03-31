import { Router, type Router as RouterType } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, requireMinRole } from '../../middleware/auth.js';
import {
  createPdfDocument,
  addHeader,
  addSectionTitle,
  addKeyValue,
  addTable,
  addFooter,
  fmtDe,
  fmtEur,
} from '../../lib/pdf.js';

export const reportingExportRouter: RouterType = Router();
reportingExportRouter.use(authenticate);
reportingExportRouter.use(requireMinRole('store_manager'));

// ── GET /kpi — KPI-Report als PDF ────────────────────────────────
reportingExportRouter.get('/kpi', async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(400).json({ error: 'Tenant erforderlich.' });
      return;
    }

    const dateFrom = req.query['dateFrom'] as string | undefined;
    const dateTo = req.query['dateTo'] as string | undefined;
    const storeId = req.query['storeId'] as string | undefined;

    // Tenant-Name laden
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    const tenantName = tenant?.name ?? 'Unbekannt';

    // KPI-Daten laden
    const where: Record<string, unknown> = { tenantId };
    if (storeId) where['storeId'] = storeId;
    if (dateFrom || dateTo) {
      where['date'] = {};
      if (dateFrom) (where['date'] as Record<string, string>)['gte'] = dateFrom;
      if (dateTo) (where['date'] as Record<string, string>)['lte'] = dateTo;
    }

    const entries = await prisma.kpiEntry.findMany({
      where,
      include: { store: { select: { name: true } } },
      orderBy: { date: 'desc' },
      take: 500,
    });

    // Aggregation
    const totalRevenue = entries.reduce((s, e) => s + (e.revenue ?? 0), 0);
    const totalTransactions = entries.reduce((s, e) => s + (e.transactions ?? 0), 0);
    const totalFootfall = entries.reduce((s, e) => s + (e.footfall ?? 0), 0);
    const totalUnits = entries.reduce((s, e) => s + (e.unitsSold ?? 0), 0);
    const totalHours = entries.reduce((s, e) => s + (e.staffHours ?? 0), 0);
    const avgConversion =
      totalFootfall > 0 ? Math.round((totalTransactions / totalFootfall) * 10000) / 100 : 0;

    // PDF erzeugen
    const doc = createPdfDocument(`KPI Report - ${tenantName}`);

    res.setHeader('Content-Type', 'application/pdf');
    const periodLabel = dateFrom && dateTo ? `${dateFrom} bis ${dateTo}` : 'Gesamtzeitraum';
    const safePeriod = (dateFrom ?? 'alle').replace(/\//g, '-');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="kpi-report-${safePeriod}.pdf"`,
    );

    doc.pipe(res);

    addHeader(doc, `KPI Report — ${tenantName}`, `Zeitraum: ${periodLabel} | Erstellt: ${new Date().toLocaleDateString('de-DE')}`);

    // Zusammenfassung
    addSectionTitle(doc, 'Zusammenfassung');
    addKeyValue(doc, 'Gesamtumsatz', fmtEur(totalRevenue));
    addKeyValue(doc, 'Transaktionen', fmtDe(totalTransactions));
    addKeyValue(doc, 'Kundenfrequenz', fmtDe(totalFootfall));
    addKeyValue(doc, 'Conversion-Rate', `${avgConversion}%`);
    addKeyValue(doc, 'Einheiten verkauft', fmtDe(totalUnits));
    addKeyValue(doc, 'Personalstunden', fmtDe(totalHours, 1));
    addKeyValue(doc, 'Einträge', String(entries.length));

    doc.moveDown(1);

    // Tabelle
    addSectionTitle(doc, 'Detaildaten');
    const headers = ['Datum', 'Store', 'Umsatz', 'Transakt.', 'Footfall', 'Einheiten', 'Stunden'];
    const colWidths = [70, 100, 75, 60, 60, 60, 70];
    const rows = entries.map((e) => [
      e.date,
      e.store?.name ?? '-',
      fmtEur(e.revenue ?? 0, 0),
      fmtDe(e.transactions ?? 0),
      fmtDe(e.footfall ?? 0),
      fmtDe(e.unitsSold ?? 0),
      fmtDe(e.staffHours ?? 0, 1),
    ]);

    addTable(doc, headers, rows, colWidths);

    addFooter(doc);
    doc.end();
  } catch (err) {
    console.error('KPI PDF export error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF-Export fehlgeschlagen.' });
    }
  }
});

// ── GET /audit — Audit-Report als PDF ────────────────────────────
reportingExportRouter.get('/audit', async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(400).json({ error: 'Tenant erforderlich.' });
      return;
    }

    const dateFrom = req.query['dateFrom'] as string | undefined;
    const dateTo = req.query['dateTo'] as string | undefined;
    const storeId = req.query['storeId'] as string | undefined;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    const tenantName = tenant?.name ?? 'Unbekannt';

    // Audit-Sessions laden
    const where: Record<string, unknown> = { tenantId, status: 'COMPLETED' };
    if (storeId) where['storeId'] = storeId;
    if (dateFrom || dateTo) {
      where['completedAt'] = {};
      if (dateFrom) (where['completedAt'] as Record<string, Date>)['gte'] = new Date(dateFrom);
      if (dateTo) (where['completedAt'] as Record<string, Date>)['lte'] = new Date(dateTo);
    }

    const sessions = await prisma.auditSession.findMany({
      where,
      include: {
        store: { select: { name: true } },
        template: { select: { name: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: 500,
    });

    // Aggregation
    const totalAudits = sessions.length;
    const scores = sessions
      .map((s) => s.overallScore)
      .filter((s): s is number => s !== null);
    const avgScore =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : 0;
    const passCount = scores.filter((s) => s >= 80).length;
    const passRate = scores.length > 0 ? Math.round((passCount / scores.length) * 1000) / 10 : 0;

    // PDF erzeugen
    const doc = createPdfDocument(`Audit Report - ${tenantName}`);

    res.setHeader('Content-Type', 'application/pdf');
    const periodLabel = dateFrom && dateTo ? `${dateFrom} bis ${dateTo}` : 'Gesamtzeitraum';
    const safePeriod = (dateFrom ?? 'alle').replace(/\//g, '-');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit-report-${safePeriod}.pdf"`,
    );

    doc.pipe(res);

    addHeader(doc, `Audit Report — ${tenantName}`, `Zeitraum: ${periodLabel} | Erstellt: ${new Date().toLocaleDateString('de-DE')}`);

    // Zusammenfassung
    addSectionTitle(doc, 'Zusammenfassung');
    addKeyValue(doc, 'Audits gesamt', String(totalAudits));
    addKeyValue(doc, 'Durchschnittl. Score', `${avgScore}%`);
    addKeyValue(doc, 'Bestehensquote (>=80%)', `${passRate}%`);

    doc.moveDown(1);

    // Tabelle
    addSectionTitle(doc, 'Einzelne Audits');
    const headers = ['Datum', 'Store', 'Template', 'Score', 'Status'];
    const colWidths = [80, 120, 120, 80, 95];
    const rows = sessions.map((s) => [
      s.completedAt ? new Date(s.completedAt).toLocaleDateString('de-DE') : '-',
      s.store?.name ?? s.storeLocation ?? '-',
      s.template?.name ?? '-',
      s.overallScore !== null ? `${Math.round(s.overallScore)}%` : '-',
      s.overallScore !== null && s.overallScore >= 80 ? 'Bestanden' : 'Nicht bestanden',
    ]);

    addTable(doc, headers, rows, colWidths);

    addFooter(doc);
    doc.end();
  } catch (err) {
    console.error('Audit PDF export error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF-Export fehlgeschlagen.' });
    }
  }
});

// ── GET /store-overview — Store-Übersicht als PDF ───────────────
reportingExportRouter.get('/store-overview', async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    if (!tenantId) {
      res.status(400).json({ error: 'Tenant erforderlich.' });
      return;
    }

    const storeId = req.query['storeId'] as string | undefined;
    if (!storeId) {
      res.status(400).json({ error: 'storeId ist erforderlich.' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    const tenantName = tenant?.name ?? 'Unbekannt';

    // Store laden
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        region: { select: { name: true } },
        userAssignments: {
          include: {
            user: { select: { name: true, email: true, role: true } },
          },
          orderBy: { assignedAt: 'desc' },
        },
      },
    });

    if (!store || store.tenantId !== tenantId) {
      res.status(404).json({ error: 'Store nicht gefunden.' });
      return;
    }

    // Letzte KPI-Einträge
    const recentKpis = await prisma.kpiEntry.findMany({
      where: { storeId, tenantId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    // Letzte Audits
    const recentAudits = await prisma.auditSession.findMany({
      where: { storeId, tenantId, status: 'COMPLETED' },
      include: { template: { select: { name: true } } },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    // KPI-Aggregation
    const totalRevenue = recentKpis.reduce((s, e) => s + (e.revenue ?? 0), 0);
    const totalTransactions = recentKpis.reduce((s, e) => s + (e.transactions ?? 0), 0);
    const totalFootfall = recentKpis.reduce((s, e) => s + (e.footfall ?? 0), 0);

    // PDF erzeugen
    const doc = createPdfDocument(`Store-Übersicht - ${store.name}`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="store-übersicht-${store.name.replace(/\s/g, '-').toLowerCase()}.pdf"`,
    );

    doc.pipe(res);

    addHeader(doc, `Store-Übersicht — ${store.name}`, `${tenantName} | Erstellt: ${new Date().toLocaleDateString('de-DE')}`);

    // Store-Details
    addSectionTitle(doc, 'Store-Details');
    addKeyValue(doc, 'Name', store.name);
    addKeyValue(doc, 'Stadt', store.city ?? '-');
    addKeyValue(doc, 'Region', store.region?.name ?? 'Nicht zugeordnet');
    addKeyValue(doc, 'Status', store.isActive ? 'Aktiv' : 'Inaktiv');

    doc.moveDown(1);

    // Team
    addSectionTitle(doc, 'Team');
    if (store.userAssignments.length > 0) {
      const teamHeaders = ['Name', 'E-Mail', 'Rolle'];
      const teamWidths = [160, 200, 135];
      const roleLabels: Record<string, string> = {
        tenant_admin: 'Admin',
        regional_manager: 'Regional Manager',
        multisite_manager: 'Multisite Manager',
        store_manager: 'Store Manager',
        learner: 'Mitarbeiter',
      };
      const teamRows = store.userAssignments.map((a) => [
        a.user.name,
        a.user.email,
        roleLabels[a.user.role] ?? a.user.role,
      ]);
      addTable(doc, teamHeaders, teamRows, teamWidths);
    } else {
      doc.fontSize(10).fillColor('#6b7280').text('Keine Teammitglieder zugewiesen.');
      doc.moveDown(1);
    }

    doc.moveDown(1);

    // KPI-Zusammenfassung (letzte 30 Tage)
    addSectionTitle(doc, `KPI-Zusammenfassung (letzte ${recentKpis.length} Einträge)`);
    addKeyValue(doc, 'Gesamtumsatz', fmtEur(totalRevenue));
    addKeyValue(doc, 'Transaktionen', fmtDe(totalTransactions));
    addKeyValue(doc, 'Kundenfrequenz', fmtDe(totalFootfall));
    addKeyValue(
      doc,
      'Conversion-Rate',
      totalFootfall > 0
        ? `${(Math.round((totalTransactions / totalFootfall) * 10000) / 100).toFixed(1)}%`
        : '-',
    );

    doc.moveDown(1);

    // Letzte Audits
    addSectionTitle(doc, 'Letzte Audits');
    if (recentAudits.length > 0) {
      const auditHeaders = ['Datum', 'Template', 'Score'];
      const auditWidths = [100, 250, 145];
      const auditRows = recentAudits.map((a) => [
        a.completedAt ? new Date(a.completedAt).toLocaleDateString('de-DE') : '-',
        a.template?.name ?? '-',
        a.overallScore !== null ? `${Math.round(a.overallScore)}%` : '-',
      ]);
      addTable(doc, auditHeaders, auditRows, auditWidths);
    } else {
      doc.fontSize(10).fillColor('#6b7280').text('Keine abgeschlossenen Audits vorhanden.');
      doc.moveDown(1);
    }

    addFooter(doc);
    doc.end();
  } catch (err) {
    console.error('Store overview PDF export error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF-Export fehlgeschlagen.' });
    }
  }
});
