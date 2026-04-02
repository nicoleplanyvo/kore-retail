import { Router, type Router as RouterType } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import prisma from '../../lib/prisma.js';
import { authenticate, requireMinRole } from '../../middleware/auth.js';
import { tenantCreateSchema, tenantUpdateSchema } from '../../shared/validators.js';

export const adminTenantsRouter: RouterType = Router();
adminTenantsRouter.use(authenticate, requireMinRole('kore_admin'));

// Branding router — tenant_admin can manage own branding, kore_admin can manage any
export const tenantBrandingRouter: RouterType = Router();
tenantBrandingRouter.use(authenticate, requireMinRole('tenant_admin'));

// ── Logo Upload Multer Config ──────────────────────────────────────
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? './uploads';
const LOGO_DIR = path.join(UPLOAD_DIR, 'logos');

const logoStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await fs.mkdir(LOGO_DIR, { recursive: true });
      cb(null, LOGO_DIR);
    } catch (error) {
      cb(error as Error, '');
    }
  },
  filename: (req, file, cb) => {
    const tenantId = req.params['id'] as string;
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${tenantId}-${Date.now()}${ext}`);
  },
});

const logoUpload = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nur JPEG, PNG, WebP und SVG Dateien sind erlaubt.'));
    }
  },
});

// ── GET /api/admin/tenants/:id/branding — Branding-Daten eines Tenants ──
tenantBrandingRouter.get('/:id/branding', async (req, res) => {
  try {
    const tenantId = req.params['id'] as string;

    // Tenant-Zugriff prüfen: kore_admin darf alles, andere nur eigenen Tenant
    if (req.user!.role !== 'kore_admin' && req.user!.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf diesen Mandanten.' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, slug: true, logoUrl: true },
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant nicht gefunden.' });
      return;
    }

    res.json(tenant);
  } catch (err) {
    console.error('Branding GET error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── PUT /api/admin/tenants/:id/branding — Branding-Daten aktualisieren ──
tenantBrandingRouter.put('/:id/branding', async (req, res) => {
  try {
    const tenantId = req.params['id'] as string;

    // Tenant-Zugriff prüfen
    if (req.user!.role !== 'kore_admin' && req.user!.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf diesen Mandanten.' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      res.status(404).json({ error: 'Tenant nicht gefunden.' });
      return;
    }

    // Only allow updating name for now (extend later with primaryColor etc.)
    const { name } = req.body;
    const updateData: Record<string, unknown> = {};
    if (name && typeof name === 'string') updateData['name'] = name;

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
      select: { id: true, name: true, slug: true, logoUrl: true },
    });

    res.json(updated);
  } catch (err) {
    console.error('Branding PUT error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /api/admin/tenants/:id/branding/logo — Logo hochladen ──
tenantBrandingRouter.post('/:id/branding/logo', logoUpload.single('logo'), async (req, res) => {
  try {
    const tenantId = req.params['id'] as string;

    // Tenant-Zugriff prüfen
    if (req.user!.role !== 'kore_admin' && req.user!.tenantId !== tenantId) {
      res.status(403).json({ error: 'Kein Zugriff auf diesen Mandanten.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Keine Datei hochgeladen.' });
      return;
    }

    // Altes Logo löschen, falls vorhanden
    const existing = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { logoUrl: true },
    });

    if (existing?.logoUrl) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, existing.logoUrl));
      } catch {
        // Altes Logo existiert evtl. nicht mehr — kein harter Fehler
      }
    }

    // Relativer Pfad für die DB: "logos/tenantId-timestamp.ext"
    const logoUrl = `logos/${req.file.filename}`;

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { logoUrl },
      select: { id: true, name: true, slug: true, logoUrl: true },
    });

    res.json(updated);
  } catch (err) {
    console.error('Logo upload error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /api/admin/tenants/stats — Dashboard-Statistiken
adminTenantsRouter.get('/stats', async (_req, res) => {
  try {
    const [totalTenants, activeTenants, totalStores, activeStores, activeAssignments] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { status: 'ACTIVE' } }),
      prisma.store.count(),
      prisma.store.count({ where: { isActive: true } }),
      prisma.storeToolAssignment.findMany({
        where: { isActive: true },
        include: { tool: { select: { priceMonthly: true } } },
      }),
    ]);

    let mrr = 0;
    for (const a of activeAssignments) {
      mrr += a.tool.priceMonthly;
    }

    res.json({
      totalTenants,
      activeTenants,
      totalStores,
      activeStores,
      totalToolBookings: activeAssignments.length,
      mrr,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /api/admin/tenants — Liste mit Pagination, Suche, Filter
adminTenantsRouter.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query['pageSize'] as string) || 20));
    const search = (req.query['search'] as string) || '';
    const status = req.query['status'] as string | undefined;

    const where: Record<string, unknown> = {};

    if (search) {
      where['OR'] = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { contactEmail: { contains: search } },
        { contactName: { contains: search } },
      ];
    }
    if (status) where['status'] = status;

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        include: {
          _count: { select: { users: true, stores: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tenant.count({ where }),
    ]);

    res.json({ data: tenants, total, page, pageSize });
  } catch (err) {
    console.error('Admin tenants list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /api/admin/tenants/:id — Tenant Detail mit Stores
adminTenantsRouter.get('/:id', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params['id'] },
      include: {
        stores: {
          include: { _count: { select: { tools: true } } },
          orderBy: { name: 'asc' },
        },
        _count: { select: { users: true, stores: true } },
      },
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant nicht gefunden.' });
      return;
    }

    res.json(tenant);
  } catch (err) {
    console.error('Admin tenant detail error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// POST /api/admin/tenants — Neuen Tenant erstellen
adminTenantsRouter.post('/', async (req, res) => {
  try {
    const result = tenantCreateSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Validierungsfehler', details: result.error.flatten().fieldErrors });
      return;
    }

    const data = result.data;

    const existing = await prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (existing) {
      res.status(409).json({ error: 'Ein Tenant mit diesem Slug existiert bereits.' });
      return;
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        contactEmail: data.contactEmail || null,
        contactName: data.contactName || null,
        contactPhone: data.contactPhone || null,
        maxUsers: data.maxUsers ?? 15,
      },
      include: {
        stores: { include: { _count: { select: { tools: true } } } },
        _count: { select: { users: true, stores: true } },
      },
    });

    res.status(201).json(tenant);
  } catch (err) {
    console.error('Admin tenant create error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// PUT /api/admin/tenants/:id — Tenant aktualisieren
adminTenantsRouter.put('/:id', async (req, res) => {
  try {
    const result = tenantUpdateSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Validierungsfehler', details: result.error.flatten().fieldErrors });
      return;
    }

    const data = result.data;

    if (data.slug) {
      const existing = await prisma.tenant.findUnique({ where: { slug: data.slug } });
      if (existing && existing.id !== req.params['id']) {
        res.status(409).json({ error: 'Ein anderer Tenant verwendet bereits diesen Slug.' });
        return;
      }
    }

    const tenant = await prisma.tenant.update({
      where: { id: req.params['id'] },
      data: {
        ...data,
        contactEmail: data.contactEmail || null,
        contactName: data.contactName || null,
        contactPhone: data.contactPhone || null,
      },
      include: {
        stores: { include: { _count: { select: { tools: true } } } },
        _count: { select: { users: true, stores: true } },
      },
    });

    res.json(tenant);
  } catch (err) {
    console.error('Admin tenant update error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// DELETE /api/admin/tenants/:id — Tenant deaktivieren
adminTenantsRouter.delete('/:id', async (req, res) => {
  try {
    const tenant = await prisma.tenant.update({
      where: { id: req.params['id'] },
      data: { status: 'CANCELED' },
    });

    res.json({ success: true, tenant });
  } catch (err) {
    console.error('Admin tenant delete error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
