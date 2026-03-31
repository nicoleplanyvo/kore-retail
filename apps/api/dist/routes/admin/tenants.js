import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import prisma from '../../lib/prisma.js';
import { authenticate, requireMinRole } from '../../middleware/auth.js';
import { tenantCreateSchema, tenantUpdateSchema } from '../../shared/validators.js';
export const adminTenantsRouter = Router();
adminTenantsRouter.use(authenticate, requireMinRole('kore_admin'));
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
    }
    catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// GET /api/admin/tenants — Liste mit Pagination, Suche, Filter
adminTenantsRouter.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query['page']) || 1);
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query['pageSize']) || 20));
        const search = req.query['search'] || '';
        const status = req.query['status'];
        const where = {};
        if (search) {
            where['OR'] = [
                { name: { contains: search } },
                { slug: { contains: search } },
                { contactEmail: { contains: search } },
                { contactName: { contains: search } },
            ];
        }
        if (status)
            where['status'] = status;
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
    }
    catch (err) {
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
    }
    catch (err) {
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
    }
    catch (err) {
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
    }
    catch (err) {
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
    }
    catch (err) {
        console.error('Admin tenant delete error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// ============================================================
// Tenant Branding — kore_admin OR tenant_admin (own tenant only)
// ============================================================
/**
 * Separate router for branding endpoints.
 * Mounted at /api/admin/tenants in index.ts (same path), but uses
 * authenticate + requireMinRole('tenant_admin') instead of kore_admin.
 * We export it separately and mount it alongside adminTenantsRouter.
 */
export const tenantBrandingRouter = Router();
tenantBrandingRouter.use(authenticate, requireMinRole('tenant_admin'));
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? './uploads';
const LOGO_ALLOWED_MIMETYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
];
const LOGO_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const logoStorage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        const dir = path.join(UPLOAD_DIR, 'logos');
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const tenantId = req.params['id'];
        const ext = path.extname(file.originalname) || '.png';
        cb(null, `${tenantId}-${Date.now()}${ext}`);
    },
});
const logoUpload = multer({
    storage: logoStorage,
    limits: { fileSize: LOGO_MAX_SIZE },
    fileFilter: (_req, file, cb) => {
        if (LOGO_ALLOWED_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Nur JPEG, PNG, WebP und SVG Dateien sind erlaubt.'));
        }
    },
});
/** Helper: Check branding permission — kore_admin can update any, tenant_admin only their own */
function checkBrandingPermission(userRole, userTenantId, targetTenantId) {
    if (userRole === 'kore_admin')
        return true;
    if (userRole === 'tenant_admin' && userTenantId === targetTenantId)
        return true;
    return false;
}
// GET /api/admin/tenants/:id/branding — Load tenant branding (tenant_admin + kore_admin)
tenantBrandingRouter.get('/:id/branding', async (req, res) => {
    try {
        const tenantId = req.params['id'];
        if (!checkBrandingPermission(req.user.role, req.user.tenantId, tenantId)) {
            res.status(403).json({ error: 'Keine Berechtigung für diesen Mandanten.' });
            return;
        }
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { id: true, name: true, logoUrl: true, primaryColor: true, accentColor: true },
        });
        if (!tenant) {
            res.status(404).json({ error: 'Tenant nicht gefunden.' });
            return;
        }
        res.json(tenant);
    }
    catch (err) {
        console.error('Tenant branding load error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// PUT /api/admin/tenants/:id/branding — Update tenant colors
tenantBrandingRouter.put('/:id/branding', async (req, res) => {
    try {
        const tenantId = req.params['id'];
        if (!checkBrandingPermission(req.user.role, req.user.tenantId, tenantId)) {
            res.status(403).json({ error: 'Keine Berechtigung für diesen Mandanten.' });
            return;
        }
        const { primaryColor, accentColor } = req.body;
        // Validate hex colors if provided (allow null/empty to reset)
        if (primaryColor && !HEX_COLOR_REGEX.test(primaryColor)) {
            res.status(400).json({ error: 'primaryColor muss ein gültiger Hex-Farbwert sein (#000000).' });
            return;
        }
        if (accentColor && !HEX_COLOR_REGEX.test(accentColor)) {
            res.status(400).json({ error: 'accentColor muss ein gültiger Hex-Farbwert sein (#000000).' });
            return;
        }
        const updateData = {};
        if (primaryColor !== undefined)
            updateData['primaryColor'] = primaryColor || null;
        if (accentColor !== undefined)
            updateData['accentColor'] = accentColor || null;
        const tenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: updateData,
            select: {
                id: true,
                name: true,
                logoUrl: true,
                primaryColor: true,
                accentColor: true,
            },
        });
        res.json({
            id: tenant.id,
            name: tenant.name,
            logoUrl: tenant.logoUrl,
            primaryColor: tenant.primaryColor,
            accentColor: tenant.accentColor,
        });
    }
    catch (err) {
        console.error('Tenant branding update error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
// POST /api/admin/tenants/:id/logo — Upload tenant logo
tenantBrandingRouter.post('/:id/logo', (req, res, next) => {
    const tenantId = req.params['id'];
    if (!checkBrandingPermission(req.user.role, req.user.tenantId, tenantId)) {
        res.status(403).json({ error: 'Keine Berechtigung für diesen Mandanten.' });
        return;
    }
    next();
}, logoUpload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'Keine Datei hochgeladen.' });
            return;
        }
        const tenantId = req.params['id'];
        const relativePath = path.join('logos', req.file.filename);
        // Delete old logo file if it exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { logoUrl: true },
        });
        if (existingTenant?.logoUrl) {
            try {
                await fs.unlink(path.join(UPLOAD_DIR, existingTenant.logoUrl));
            }
            catch {
                // Old file may not exist — not a hard error
            }
        }
        const tenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: { logoUrl: relativePath },
            select: {
                id: true,
                name: true,
                logoUrl: true,
                primaryColor: true,
                accentColor: true,
            },
        });
        res.json({
            id: tenant.id,
            name: tenant.name,
            logoUrl: tenant.logoUrl,
            primaryColor: tenant.primaryColor,
            accentColor: tenant.accentColor,
        });
    }
    catch (err) {
        console.error('Tenant logo upload error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=tenants.js.map