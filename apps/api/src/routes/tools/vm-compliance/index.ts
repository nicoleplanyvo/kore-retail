import { Router, type Router as RouterType } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { vmSubmissionCreateSchema, vmReviewSchema, vmGuidelineCreateSchema, vmGuidelineUpdateSchema } from '../../../shared/validators.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');

const submissionDir = path.join(UPLOAD_DIR, 'vm-submissions');
if (!fs.existsSync(submissionDir)) fs.mkdirSync(submissionDir, { recursive: true });

const guidelinePhotoDir = path.join(UPLOAD_DIR, 'vm-guidelines');
if (!fs.existsSync(guidelinePhotoDir)) fs.mkdirSync(guidelinePhotoDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: submissionDir,
    filename: (_r, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const guidelineUpload = multer({
  storage: multer.diskStorage({
    destination: guidelinePhotoDir,
    filename: (_r, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const guidelinePdfDir = path.join(UPLOAD_DIR, 'vm-guideline-pdfs');
if (!fs.existsSync(guidelinePdfDir)) fs.mkdirSync(guidelinePdfDir, { recursive: true });

const guidelinePdfUpload = multer({
  storage: multer.diskStorage({
    destination: guidelinePdfDir,
    filename: (_r, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const areaPdfDir = path.join(UPLOAD_DIR, 'vm-area-pdfs');
if (!fs.existsSync(areaPdfDir)) fs.mkdirSync(areaPdfDir, { recursive: true });

const areaPdfUpload = multer({
  storage: multer.diskStorage({
    destination: areaPdfDir,
    filename: (_r, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const vmComplianceRouter: RouterType = Router();
vmComplianceRouter.use(authenticate, requireToolAccess('standards.vm_foto_compliance'));

// GET /stores
vmComplianceRouter.get('/stores', async (req, res) => {
  try {
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const tenantId = (req as any).tenantId as string;
    const where: Record<string, unknown> = { isActive: true };
    if (toolStoreIds !== 'all') where['id'] = { in: toolStoreIds };
    else if (tenantId) where['tenantId'] = tenantId;
    const stores = await prisma.store.findMany({ where, select: { id: true, name: true, city: true }, orderBy: { name: 'asc' } });
    res.json(stores);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /users
vmComplianceRouter.get('/users', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const users = await prisma.user.findMany({
      where: { tenantId, isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /checks — Compliance-Checks Liste
vmComplianceRouter.get('/checks', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));

    const where: Record<string, unknown> = { tenantId };
    if (req.query.storeId) where['storeId'] = req.query.storeId;
    else if (toolStoreIds !== 'all') where['storeId'] = { in: toolStoreIds };
    if (req.query.status) where['status'] = req.query.status;
    if (req.query.from || req.query.to) {
      where['submittedAt'] = {};
      if (req.query.from) (where['submittedAt'] as Record<string, unknown>)['gte'] = new Date(req.query.from as string);
      if (req.query.to) (where['submittedAt'] as Record<string, unknown>)['lte'] = new Date(req.query.to as string);
    }

    const [data, total] = await Promise.all([
      prisma.vmSubmission.findMany({
        where,
        include: {
          guideline: { select: { id: true, name: true, category: true, referencePhoto: true } },
          store: { select: { id: true, name: true, city: true } },
          submitter: { select: { id: true, name: true } },
        },
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.vmSubmission.count({ where }),
    ]);
    res.json({ data, total, page, pageSize });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /checks — Neuen Check einreichen
vmComplianceRouter.post('/checks', upload.single('photo'), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const parsed = vmSubmissionCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
    if (!req.file) return res.status(400).json({ error: 'Foto ist erforderlich.' });

    const guideline = await prisma.vmGuideline.findFirst({
      where: { id: parsed.data.guidelineId, tenantId, isActive: true },
    });
    if (!guideline) return res.status(404).json({ error: 'Guideline nicht gefunden.' });

    const submission = await prisma.vmSubmission.create({
      data: {
        tenantId,
        guidelineId: parsed.data.guidelineId,
        storeId: parsed.data.storeId,
        submittedBy: userId,
        photoPath: `/api/uploads/vm-submissions/${req.file.filename}`,
      },
      include: {
        guideline: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(submission);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /checks/:id — Check Detail
vmComplianceRouter.get('/checks/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const submission = await prisma.vmSubmission.findFirst({
      where: { id: req.params['id'], tenantId },
      include: {
        guideline: true,
        store: { select: { id: true, name: true, city: true } },
        submitter: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } },
      },
    });
    if (!submission) return res.status(404).json({ error: 'Check nicht gefunden.' });
    res.json(submission);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// PUT /checks/:id — Review / Bewertung
vmComplianceRouter.put('/checks/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const parsed = vmReviewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });

    const submission = await prisma.vmSubmission.findFirst({
      where: { id: req.params['id'], tenantId },
    });
    if (!submission) return res.status(404).json({ error: 'Check nicht gefunden.' });

    const updated = await prisma.vmSubmission.update({
      where: { id: req.params['id'] },
      data: {
        status: parsed.data.status,
        reviewNote: parsed.data.reviewNote || null,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
      include: {
        guideline: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
      },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /dashboard — Dashboard-Daten
vmComplianceRouter.get('/dashboard', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';

    const storeFilter: Record<string, unknown> = { tenantId };
    if (toolStoreIds !== 'all') storeFilter['storeId'] = { in: toolStoreIds };

    const [totalSubmissions, approved, rejected, pending] = await Promise.all([
      prisma.vmSubmission.count({ where: storeFilter }),
      prisma.vmSubmission.count({ where: { ...storeFilter, status: 'APPROVED' } }),
      prisma.vmSubmission.count({ where: { ...storeFilter, status: 'REJECTED' } }),
      prisma.vmSubmission.count({ where: { ...storeFilter, status: 'PENDING' } }),
    ]);

    const complianceRate = (approved + rejected) > 0
      ? Math.round((approved / (approved + rejected)) * 100)
      : 0;

    // Store ranking
    const storeWhere: Record<string, unknown> = { tenantId, isActive: true };
    if (toolStoreIds !== 'all') storeWhere['id'] = { in: toolStoreIds };

    const stores = await prisma.store.findMany({
      where: storeWhere,
      select: {
        id: true, name: true, city: true,
        vmSubmissions: { select: { status: true } },
      },
      orderBy: { name: 'asc' },
    });

    const storeRanking = stores.map((store) => {
      const storeApproved = store.vmSubmissions.filter((s) => s.status === 'APPROVED').length;
      const storeRejected = store.vmSubmissions.filter((s) => s.status === 'REJECTED').length;
      const reviewed = storeApproved + storeRejected;
      return {
        storeId: store.id,
        storeName: store.name,
        city: store.city,
        total: store.vmSubmissions.length,
        approved: storeApproved,
        rejected: storeRejected,
        complianceRate: reviewed > 0 ? Math.round((storeApproved / reviewed) * 100) : 0,
      };
    }).sort((a, b) => b.complianceRate - a.complianceRate);

    // Recent submissions for trend
    const recentSubs = await prisma.vmSubmission.findMany({
      where: { ...storeFilter, submittedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { submittedAt: true, status: true },
      orderBy: { submittedAt: 'asc' },
    });

    const byWeek: Record<string, { approved: number; rejected: number; pending: number }> = {};
    for (const sub of recentSubs) {
      const weekKey = sub.submittedAt.toISOString().slice(0, 10);
      if (!byWeek[weekKey]) byWeek[weekKey] = { approved: 0, rejected: 0, pending: 0 };
      if (sub.status === 'APPROVED') byWeek[weekKey]!.approved++;
      else if (sub.status === 'REJECTED') byWeek[weekKey]!.rejected++;
      else byWeek[weekKey]!.pending++;
    }

    const trend = Object.entries(byWeek).map(([date, counts]) => ({ date, ...counts }));

    // Worst areas (by guideline category)
    const guidelines = await prisma.vmGuideline.findMany({
      where: { tenantId, isActive: true },
      select: {
        id: true, name: true, category: true,
        submissions: { select: { status: true } },
      },
    });

    const worstAreas = guidelines.map((g) => {
      const gApproved = g.submissions.filter((s) => s.status === 'APPROVED').length;
      const gRejected = g.submissions.filter((s) => s.status === 'REJECTED').length;
      const reviewed = gApproved + gRejected;
      return {
        guidelineId: g.id,
        guidelineName: g.name,
        category: g.category,
        total: g.submissions.length,
        complianceRate: reviewed > 0 ? Math.round((gApproved / reviewed) * 100) : 0,
      };
    }).sort((a, b) => a.complianceRate - b.complianceRate).slice(0, 10);

    res.json({
      totalSubmissions,
      approved,
      rejected,
      pending,
      complianceRate,
      storeRanking,
      trend,
      worstAreas,
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /areas — VM Areas (mit PDF-Pfad)
vmComplianceRouter.get('/areas', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const areas = await prisma.vmArea.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(areas);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /areas — Neuen Bereich erstellen
vmComplianceRouter.post('/areas', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const { name, description } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name ist erforderlich (mind. 2 Zeichen).' });
    }
    const maxSort = await prisma.vmArea.aggregate({ where: { tenantId }, _max: { sortOrder: true } });
    const area = await prisma.vmArea.create({
      data: { tenantId, name: name.trim(), description: description?.trim() || null, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
    });
    res.status(201).json(area);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// PUT /areas/:id — Bereich aktualisieren
vmComplianceRouter.put('/areas/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const areaId = req.params['id'] as string;
    const existing = await prisma.vmArea.findFirst({ where: { id: areaId, tenantId } });
    if (!existing) return res.status(404).json({ error: 'Bereich nicht gefunden.' });
    const { name, description, isActive, sortOrder } = req.body;
    const updated = await prisma.vmArea.update({
      where: { id: areaId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// DELETE /areas/:id — Bereich loeschen (soft-delete)
vmComplianceRouter.delete('/areas/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const areaId = req.params['id'] as string;
    const existing = await prisma.vmArea.findFirst({ where: { id: areaId, tenantId } });
    if (!existing) return res.status(404).json({ error: 'Bereich nicht gefunden.' });
    await prisma.vmArea.update({ where: { id: areaId }, data: { isActive: false } });
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /areas/:id/pdf — PDF Guideline fuer Bereich hochladen
vmComplianceRouter.post('/areas/:id/pdf', areaPdfUpload.single('pdf'), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const areaId = req.params['id'] as string;
    if (!req.file) return res.status(400).json({ error: 'PDF ist erforderlich.' });
    const existing = await prisma.vmArea.findFirst({ where: { id: areaId, tenantId } });
    if (!existing) return res.status(404).json({ error: 'Bereich nicht gefunden.' });
    // Alte PDF loeschen
    if (existing.pdfPath) {
      const oldPath = path.join(UPLOAD_DIR, existing.pdfPath.replace(/^\/(api\/)?uploads\//, ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const updated = await prisma.vmArea.update({
      where: { id: areaId },
      data: { pdfPath: `/api/uploads/vm-area-pdfs/${req.file.filename}` },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /guidelines — VM Guidelines (for the submit form)
vmComplianceRouter.get('/guidelines', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const guidelines = await prisma.vmGuideline.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { submissions: true } } },
    });
    res.json(guidelines);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /guidelines — Neue Guideline erstellen
vmComplianceRouter.post('/guidelines', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const parsed = vmGuidelineCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });

    // sortOrder: nächste Position
    const maxSort = await prisma.vmGuideline.aggregate({
      where: { tenantId },
      _max: { sortOrder: true },
    });
    const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

    const guideline = await prisma.vmGuideline.create({
      data: {
        tenantId,
        name: parsed.data.name,
        description: parsed.data.description || null,
        category: parsed.data.category || null,
        createdBy: userId,
        sortOrder: nextSort,
      },
    });
    res.status(201).json(guideline);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// PUT /guidelines/:id — Guideline aktualisieren
vmComplianceRouter.put('/guidelines/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const guidelineId = req.params['id'] as string;
    const parsed = vmGuidelineUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });

    const existing = await prisma.vmGuideline.findFirst({
      where: { id: guidelineId, tenantId },
    });
    if (!existing) return res.status(404).json({ error: 'Guideline nicht gefunden.' });

    const updated = await prisma.vmGuideline.update({
      where: { id: guidelineId },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description || null }),
        ...(parsed.data.category !== undefined && { category: parsed.data.category || null }),
        ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
        ...(parsed.data.sortOrder !== undefined && { sortOrder: parsed.data.sortOrder }),
      },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// DELETE /guidelines/:id — Guideline löschen (soft-delete)
vmComplianceRouter.delete('/guidelines/:id', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const guidelineId = req.params['id'] as string;
    const existing = await prisma.vmGuideline.findFirst({
      where: { id: guidelineId, tenantId },
    });
    if (!existing) return res.status(404).json({ error: 'Guideline nicht gefunden.' });

    await prisma.vmGuideline.update({
      where: { id: guidelineId },
      data: { isActive: false },
    });
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /guidelines/:id/photo — Referenzbild hochladen
vmComplianceRouter.post('/guidelines/:id/photo', guidelineUpload.single('photo'), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const guidelineId = req.params['id'] as string;
    if (!req.file) return res.status(400).json({ error: 'Foto ist erforderlich.' });

    const existing = await prisma.vmGuideline.findFirst({
      where: { id: guidelineId, tenantId },
    });
    if (!existing) return res.status(404).json({ error: 'Guideline nicht gefunden.' });

    // Altes Referenzbild löschen falls vorhanden
    if (existing.referencePhoto) {
      const oldPath = path.join(UPLOAD_DIR, existing.referencePhoto.replace(/^\/(api\/)?uploads\//, ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const updated = await prisma.vmGuideline.update({
      where: { id: guidelineId },
      data: { referencePhoto: `/api/uploads/vm-guidelines/${req.file.filename}` },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /guidelines/:id/pdf — PDF-Guideline hochladen
vmComplianceRouter.post('/guidelines/:id/pdf', guidelinePdfUpload.single('pdf'), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const guidelineId = req.params['id'] as string;
    if (!req.file) return res.status(400).json({ error: 'PDF ist erforderlich.' });

    const existing = await prisma.vmGuideline.findFirst({
      where: { id: guidelineId, tenantId },
    });
    if (!existing) return res.status(404).json({ error: 'Guideline nicht gefunden.' });

    // Alte PDF loeschen falls vorhanden
    if (existing.pdfPath) {
      const oldPath = path.join(UPLOAD_DIR, existing.pdfPath.replace(/^\/(api\/)?uploads\//, ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updated = await prisma.vmGuideline.update({
      where: { id: guidelineId },
      data: { pdfPath: `/api/uploads/vm-guideline-pdfs/${req.file.filename}` },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /reports/summary — Compliance-Rate Overview (legacy compat)
vmComplianceRouter.get('/reports/summary', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const storeFilter: Record<string, unknown> = { tenantId };
    if (toolStoreIds !== 'all') storeFilter['storeId'] = { in: toolStoreIds };

    const [totalSubmissions, approved, rejected, pending] = await Promise.all([
      prisma.vmSubmission.count({ where: storeFilter }),
      prisma.vmSubmission.count({ where: { ...storeFilter, status: 'APPROVED' } }),
      prisma.vmSubmission.count({ where: { ...storeFilter, status: 'REJECTED' } }),
      prisma.vmSubmission.count({ where: { ...storeFilter, status: 'PENDING' } }),
    ]);
    const complianceRate = (approved + rejected) > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0;
    res.json({ totalSubmissions, approved, rejected, pending, complianceRate });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// GET /submissions — legacy compat
vmComplianceRouter.get('/submissions', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const toolStoreIds = (req as any).toolStoreIds as string[] | 'all';
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));

    const where: Record<string, unknown> = { tenantId };
    if (req.query.status) where['status'] = req.query.status;
    if (req.query.storeId) where['storeId'] = req.query.storeId;
    if (req.query.guidelineId) where['guidelineId'] = req.query.guidelineId;
    if (toolStoreIds !== 'all' && !req.query.storeId) where['storeId'] = { in: toolStoreIds };

    const [data, total] = await Promise.all([
      prisma.vmSubmission.findMany({
        where,
        include: {
          guideline: { select: { id: true, name: true, category: true, referencePhoto: true } },
          store: { select: { id: true, name: true, city: true } },
          submitter: { select: { id: true, name: true } },
        },
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.vmSubmission.count({ where }),
    ]);
    res.json({ data, total, page, pageSize });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// POST /submissions — legacy compat
vmComplianceRouter.post('/submissions', upload.single('photo'), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const parsed = vmSubmissionCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });
    if (!req.file) return res.status(400).json({ error: 'Foto ist erforderlich.' });

    const guideline = await prisma.vmGuideline.findFirst({
      where: { id: parsed.data.guidelineId, tenantId, isActive: true },
    });
    if (!guideline) return res.status(404).json({ error: 'Guideline nicht gefunden.' });

    const submission = await prisma.vmSubmission.create({
      data: {
        tenantId,
        guidelineId: parsed.data.guidelineId,
        storeId: parsed.data.storeId,
        submittedBy: userId,
        photoPath: `/api/uploads/vm-submissions/${req.file.filename}`,
      },
      include: {
        guideline: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(submission);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});

// PUT /reviews/submissions/:id/review — legacy compat
vmComplianceRouter.put('/reviews/submissions/:id/review', async (req, res) => {
  try {
    const tenantId = (req as any).tenantId as string;
    const userId = req.user!.sub;
    const parsed = vmReviewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Ungueltige Daten.', details: parsed.error.flatten() });

    const submission = await prisma.vmSubmission.findFirst({
      where: { id: req.params['id'], tenantId },
    });
    if (!submission) return res.status(404).json({ error: 'Submission nicht gefunden.' });

    const updated = await prisma.vmSubmission.update({
      where: { id: req.params['id'] },
      data: {
        status: parsed.data.status,
        reviewNote: parsed.data.reviewNote || null,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
      include: {
        guideline: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
      },
    });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); }
});
