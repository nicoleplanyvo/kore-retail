import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireToolAccess } from '../../../middleware/requireToolAccess.js';
import { vmSubmissionCreateSchema, vmReviewSchema, vmAreaCreateSchema, vmAreaUpdateSchema, } from '../../../shared/validators.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
/* ------------------------------------------------------------------ */
/*  Upload directories — use same base dir as static /api/uploads      */
/* ------------------------------------------------------------------ */
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');
const photoDir = path.join(UPLOAD_DIR, 'vm-submissions');
if (!fs.existsSync(photoDir))
    fs.mkdirSync(photoDir, { recursive: true });
const pdfDir = path.join(UPLOAD_DIR, 'vm-area-pdfs');
if (!fs.existsSync(pdfDir))
    fs.mkdirSync(pdfDir, { recursive: true });
const photoUpload = multer({
    storage: multer.diskStorage({
        destination: photoDir,
        filename: (_r, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
});
const pdfUpload = multer({
    storage: multer.diskStorage({
        destination: pdfDir,
        filename: (_r, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Nur PDF-Dateien sind erlaubt.'));
        }
    },
});
/* ------------------------------------------------------------------ */
/*  Router setup                                                       */
/* ------------------------------------------------------------------ */
export const vmComplianceRouter = Router();
vmComplianceRouter.use(authenticate, requireToolAccess('standards.vm_foto_compliance'));
/* ================================================================== */
/*  AREAS — Bereiche definieren                                        */
/* ================================================================== */
/** GET /areas — Liste aller aktiven Bereiche */
vmComplianceRouter.get('/areas', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const showAll = req.query.showAll === 'true';
        const where = { tenantId };
        if (!showAll)
            where['isActive'] = true;
        const areas = await prisma.vmArea.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { submissions: true } } },
        });
        res.json(areas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** POST /areas — Neuen Bereich anlegen */
vmComplianceRouter.post('/areas', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const parsed = vmAreaCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        }
        const area = await prisma.vmArea.create({
            data: { tenantId, ...parsed.data },
        });
        res.status(201).json(area);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** PUT /areas/:id — Bereich aktualisieren */
vmComplianceRouter.put('/areas/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const parsed = vmAreaUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        }
        const existing = await prisma.vmArea.findFirst({
            where: { id: req.params['id'], tenantId },
        });
        if (!existing)
            return res.status(404).json({ error: 'Bereich nicht gefunden.' });
        const updated = await prisma.vmArea.update({
            where: { id: req.params['id'] },
            data: parsed.data,
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** DELETE /areas/:id — Bereich soft-löschen (isActive = false) */
vmComplianceRouter.delete('/areas/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const existing = await prisma.vmArea.findFirst({
            where: { id: req.params['id'], tenantId },
        });
        if (!existing)
            return res.status(404).json({ error: 'Bereich nicht gefunden.' });
        const updated = await prisma.vmArea.update({
            where: { id: req.params['id'] },
            data: { isActive: false },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** POST /areas/:id/pdf — PDF-Guideline hochladen */
vmComplianceRouter.post('/areas/:id/pdf', pdfUpload.single('pdf'), async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const areaId = req.params['id'];
        const existing = await prisma.vmArea.findFirst({
            where: { id: areaId, tenantId },
        });
        if (!existing)
            return res.status(404).json({ error: 'Bereich nicht gefunden.' });
        if (!req.file)
            return res.status(400).json({ error: 'PDF-Datei ist erforderlich.' });
        const pdfPath = `/api/uploads/vm-area-pdfs/${req.file.filename}`;
        const updated = await prisma.vmArea.update({
            where: { id: areaId },
            data: { pdfPath },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** GET /areas/:id/pdf — PDF anzeigen/herunterladen */
vmComplianceRouter.get('/areas/:id/pdf', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const area = await prisma.vmArea.findFirst({
            where: { id: req.params['id'], tenantId },
        });
        if (!area || !area.pdfPath) {
            return res.status(404).json({ error: 'PDF nicht gefunden.' });
        }
        // pdfPath is stored as "/api/uploads/vm-area-pdfs/..." — strip "/api/uploads/" to get relative
        const relativePdf = area.pdfPath.replace(/^\/api\/uploads\//, '');
        const filePath = path.join(UPLOAD_DIR, relativePdf);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'PDF-Datei nicht vorhanden.' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
        fs.createReadStream(filePath).pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/* ================================================================== */
/*  STORES                                                             */
/* ================================================================== */
vmComplianceRouter.get('/stores', async (req, res) => {
    try {
        const toolStoreIds = req.toolStoreIds;
        const tenantId = req.tenantId;
        const where = { isActive: true };
        if (toolStoreIds !== 'all')
            where['id'] = { in: toolStoreIds };
        else if (tenantId)
            where['tenantId'] = tenantId;
        const stores = await prisma.store.findMany({
            where,
            select: { id: true, name: true, city: true },
            orderBy: { name: 'asc' },
        });
        res.json(stores);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/* ================================================================== */
/*  USERS                                                              */
/* ================================================================== */
vmComplianceRouter.get('/users', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const users = await prisma.user.findMany({
            where: { tenantId, isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/* ================================================================== */
/*  CHECKS — Compliance-Submissions                                    */
/* ================================================================== */
/* NOTE: /checks/overdue and /checks/escalate are registered BEFORE    */
/* /checks/:id so Express does not treat "overdue"/"escalate" as :id   */
/** GET /checks/overdue — Überfällige Checks auflisten */
vmComplianceRouter.get('/checks/overdue', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const where = {
            tenantId,
            status: 'PENDING',
            deadline: { lt: new Date() },
        };
        if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        const overdue = await prisma.vmSubmission.findMany({
            where,
            include: {
                guideline: { select: { id: true, name: true } },
                store: { select: { id: true, name: true, city: true } },
                submitter: { select: { id: true, name: true, managerId: true } },
                area: { select: { id: true, name: true } },
            },
            orderBy: { deadline: 'asc' },
        });
        res.json(overdue);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** POST /checks/escalate — Eskalation für überfällige Checks auslösen */
vmComplianceRouter.post('/checks/escalate', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const overdueChecks = await prisma.vmSubmission.findMany({
            where: {
                tenantId,
                status: 'PENDING',
                deadline: { lt: new Date() },
                escalatedAt: null,
            },
            include: {
                submitter: { select: { id: true, name: true, managerId: true } },
                guideline: { select: { name: true } },
                store: { select: { name: true } },
                area: { select: { name: true } },
            },
        });
        const escalated = [];
        for (const check of overdueChecks) {
            const managerId = check.submitter?.managerId;
            if (!managerId)
                continue;
            const areaName = check.area?.name ?? check.guideline?.name ?? 'VM Check';
            const storeName = check.store?.name ?? 'Unbekannter Store';
            await prisma.$transaction([
                prisma.vmSubmission.update({
                    where: { id: check.id },
                    data: { escalatedAt: new Date(), escalatedTo: managerId },
                }),
                prisma.notification.create({
                    data: {
                        tenantId,
                        userId: managerId,
                        type: 'VM_ESCALATION',
                        title: `Überfälliger VM-Check: ${areaName}`,
                        body: `Der VM-Compliance-Check für "${areaName}" im Store "${storeName}" ist überfällig und wurde eskaliert.`,
                        link: `/app/tools/vm-compliance/checks/${check.id}`,
                    },
                }),
            ]);
            escalated.push(check.id);
        }
        res.json({ escalatedCount: escalated.length, escalatedIds: escalated });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** GET /checks — Liste aller Checks */
vmComplianceRouter.get('/checks', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));
        const where = { tenantId };
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        else if (toolStoreIds !== 'all')
            where['storeId'] = { in: toolStoreIds };
        if (req.query.status)
            where['status'] = req.query.status;
        if (req.query.areaId)
            where['areaId'] = req.query.areaId;
        if (req.query.from || req.query.to) {
            where['submittedAt'] = {};
            if (req.query.from)
                where['submittedAt']['gte'] = new Date(req.query.from);
            if (req.query.to)
                where['submittedAt']['lte'] = new Date(req.query.to);
        }
        const [data, total] = await Promise.all([
            prisma.vmSubmission.findMany({
                where,
                include: {
                    guideline: { select: { id: true, name: true, category: true, referencePhoto: true } },
                    store: { select: { id: true, name: true, city: true } },
                    submitter: { select: { id: true, name: true } },
                    area: { select: { id: true, name: true } },
                },
                orderBy: { submittedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.vmSubmission.count({ where }),
        ]);
        res.json({ data, total, page, pageSize });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** POST /checks — Neuen Check einreichen (supports area + deadline) */
vmComplianceRouter.post('/checks', photoUpload.single('photo'), async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.user.sub;
        const parsed = vmSubmissionCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        }
        if (!req.file)
            return res.status(400).json({ error: 'Foto ist erforderlich.' });
        const guideline = await prisma.vmGuideline.findFirst({
            where: { id: parsed.data.guidelineId, tenantId, isActive: true },
        });
        if (!guideline)
            return res.status(404).json({ error: 'Guideline nicht gefunden.' });
        if (parsed.data.areaId) {
            const area = await prisma.vmArea.findFirst({
                where: { id: parsed.data.areaId, tenantId, isActive: true },
            });
            if (!area)
                return res.status(404).json({ error: 'Bereich nicht gefunden.' });
        }
        const submission = await prisma.vmSubmission.create({
            data: {
                tenantId,
                guidelineId: parsed.data.guidelineId,
                storeId: parsed.data.storeId,
                areaId: parsed.data.areaId || null,
                submittedBy: userId,
                photoPath: `/api/uploads/vm-submissions/${req.file.filename}`,
                deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
            },
            include: {
                guideline: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
                area: { select: { id: true, name: true } },
            },
        });
        res.status(201).json(submission);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** GET /checks/:id — Check Detail */
vmComplianceRouter.get('/checks/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const submission = await prisma.vmSubmission.findFirst({
            where: { id: req.params['id'], tenantId },
            include: {
                guideline: true,
                store: { select: { id: true, name: true, city: true } },
                submitter: { select: { id: true, name: true } },
                reviewer: { select: { id: true, name: true } },
                area: { select: { id: true, name: true, pdfPath: true } },
            },
        });
        if (!submission)
            return res.status(404).json({ error: 'Check nicht gefunden.' });
        res.json(submission);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/** PUT /checks/:id — Review / Bewertung */
vmComplianceRouter.put('/checks/:id', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.user.sub;
        const parsed = vmReviewSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        }
        const submission = await prisma.vmSubmission.findFirst({
            where: { id: req.params['id'], tenantId },
        });
        if (!submission)
            return res.status(404).json({ error: 'Check nicht gefunden.' });
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
                area: { select: { id: true, name: true } },
            },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/* ================================================================== */
/*  DASHBOARD                                                          */
/* ================================================================== */
vmComplianceRouter.get('/dashboard', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const storeFilter = { tenantId };
        if (toolStoreIds !== 'all')
            storeFilter['storeId'] = { in: toolStoreIds };
        const [totalSubmissions, approved, rejected, pending] = await Promise.all([
            prisma.vmSubmission.count({ where: storeFilter }),
            prisma.vmSubmission.count({ where: { ...storeFilter, status: 'APPROVED' } }),
            prisma.vmSubmission.count({ where: { ...storeFilter, status: 'REJECTED' } }),
            prisma.vmSubmission.count({ where: { ...storeFilter, status: 'PENDING' } }),
        ]);
        const complianceRate = (approved + rejected) > 0
            ? Math.round((approved / (approved + rejected)) * 100)
            : 0;
        // Overdue count
        const overdueCount = await prisma.vmSubmission.count({
            where: {
                ...storeFilter,
                status: 'PENDING',
                deadline: { lt: new Date() },
            },
        });
        // Store ranking
        const storeWhere = { tenantId, isActive: true };
        if (toolStoreIds !== 'all')
            storeWhere['id'] = { in: toolStoreIds };
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
        const byWeek = {};
        for (const sub of recentSubs) {
            const weekKey = sub.submittedAt.toISOString().slice(0, 10);
            if (!byWeek[weekKey])
                byWeek[weekKey] = { approved: 0, rejected: 0, pending: 0 };
            if (sub.status === 'APPROVED')
                byWeek[weekKey].approved++;
            else if (sub.status === 'REJECTED')
                byWeek[weekKey].rejected++;
            else
                byWeek[weekKey].pending++;
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
            overdueCount,
            storeRanking,
            trend,
            worstAreas,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/* ================================================================== */
/*  GUIDELINES                                                         */
/* ================================================================== */
vmComplianceRouter.get('/guidelines', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const guidelines = await prisma.vmGuideline.findMany({
            where: { tenantId, isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { submissions: true } } },
        });
        res.json(guidelines);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
/* ================================================================== */
/*  REPORTS / LEGACY COMPAT                                            */
/* ================================================================== */
vmComplianceRouter.get('/reports/summary', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const storeFilter = { tenantId };
        if (toolStoreIds !== 'all')
            storeFilter['storeId'] = { in: toolStoreIds };
        const [totalSubmissions, approved, rejected, pending] = await Promise.all([
            prisma.vmSubmission.count({ where: storeFilter }),
            prisma.vmSubmission.count({ where: { ...storeFilter, status: 'APPROVED' } }),
            prisma.vmSubmission.count({ where: { ...storeFilter, status: 'REJECTED' } }),
            prisma.vmSubmission.count({ where: { ...storeFilter, status: 'PENDING' } }),
        ]);
        const complianceRate = (approved + rejected) > 0
            ? Math.round((approved / (approved + rejected)) * 100)
            : 0;
        res.json({ totalSubmissions, approved, rejected, pending, complianceRate });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
vmComplianceRouter.get('/submissions', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const toolStoreIds = req.toolStoreIds;
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));
        const where = { tenantId };
        if (req.query.status)
            where['status'] = req.query.status;
        if (req.query.storeId)
            where['storeId'] = req.query.storeId;
        if (req.query.guidelineId)
            where['guidelineId'] = req.query.guidelineId;
        if (toolStoreIds !== 'all' && !req.query.storeId)
            where['storeId'] = { in: toolStoreIds };
        const [data, total] = await Promise.all([
            prisma.vmSubmission.findMany({
                where,
                include: {
                    guideline: { select: { id: true, name: true, category: true, referencePhoto: true } },
                    store: { select: { id: true, name: true, city: true } },
                    submitter: { select: { id: true, name: true } },
                    area: { select: { id: true, name: true } },
                },
                orderBy: { submittedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.vmSubmission.count({ where }),
        ]);
        res.json({ data, total, page, pageSize });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
vmComplianceRouter.post('/submissions', photoUpload.single('photo'), async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.user.sub;
        const parsed = vmSubmissionCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        }
        if (!req.file)
            return res.status(400).json({ error: 'Foto ist erforderlich.' });
        const guideline = await prisma.vmGuideline.findFirst({
            where: { id: parsed.data.guidelineId, tenantId, isActive: true },
        });
        if (!guideline)
            return res.status(404).json({ error: 'Guideline nicht gefunden.' });
        const submission = await prisma.vmSubmission.create({
            data: {
                tenantId,
                guidelineId: parsed.data.guidelineId,
                storeId: parsed.data.storeId,
                areaId: parsed.data.areaId || null,
                submittedBy: userId,
                photoPath: `/api/uploads/vm-submissions/${req.file.filename}`,
                deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
            },
            include: {
                guideline: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
                area: { select: { id: true, name: true } },
            },
        });
        res.status(201).json(submission);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
vmComplianceRouter.put('/reviews/submissions/:id/review', async (req, res) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.user.sub;
        const parsed = vmReviewSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Ungültige Daten.', details: parsed.error.flatten() });
        }
        const submission = await prisma.vmSubmission.findFirst({
            where: { id: req.params['id'], tenantId },
        });
        if (!submission)
            return res.status(404).json({ error: 'Submission nicht gefunden.' });
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=index.js.map