import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
// ── ESM __dirname ─────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { contactRouter } from './routes/contact.js';
import { auditRouter } from './routes/audit.js';
import { authRouter } from './routes/auth.js';
import { authenticate } from './middleware/auth.js';
import { adminTenantsRouter } from './routes/admin/tenants.js';
import { adminToolsRouter } from './routes/admin/tools.js';
import { adminStoresRouter } from './routes/admin/stores.js';
import { adminGdprRouter } from './routes/admin/gdpr.js';
import { adminUsersRouter } from './routes/admin/users.js';
import { adminReportingRouter } from './routes/admin/reporting.js';
import { adminRegionsRouter } from './routes/admin/regions.js';
import { storeExcellenceAuditRouter } from './routes/tools/store-excellence-audit/index.js';
import { checklistenRouter } from './routes/tools/checklisten/index.js';
import { sopRouter } from './routes/tools/sop/index.js';
import { vmComplianceRouter } from './routes/tools/vm-compliance/index.js';
import { storeStandardsRouter } from './routes/tools/store-standards/index.js';
import { kpiDashboardRouter } from './routes/tools/kpi-dashboard/index.js';
import { budgetTrackerRouter } from './routes/tools/budget-tracker/index.js';
import { forecastRouter as forecastToolRouter } from './routes/tools/forecast/index.js';
import { lossPreventionRouter } from './routes/tools/loss-prevention/index.js';
import { inventoryRouter } from './routes/tools/inventory/index.js';
import { toolsRouter } from './routes/tools/index.js';
const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const isProduction = NODE_ENV === 'production';
// ── CORS ──────────────────────────────────────────
// Alle Frontends muessen sich mit der API verbinden koennen
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ??
    'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,https://kore-retail.de,https://dashboard.kore-retail.de,https://app.kore-retail.de';
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// ── API Routes ────────────────────────────────────
// Website-Formulare
app.use('/api/contact', contactRouter);
app.use('/api/audit', auditRouter);
// Auth
app.use('/api/auth', authRouter);
// Admin Dashboard
app.use('/api/admin/tenants', adminTenantsRouter);
app.use('/api/admin/tools', adminToolsRouter);
app.use('/api/admin/stores', adminStoresRouter);
app.use('/api/admin/gdpr', adminGdprRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/reporting', adminReportingRouter);
app.use('/api/admin/regions', adminRegionsRouter);
// Tools (App: zugewiesene Tools des Users)
app.use('/api/tools', toolsRouter);
// Tools — Store Excellence Audit
app.use('/api/tools/sea', storeExcellenceAuditRouter);
// Tools — Checklisten
app.use('/api/tools/checklisten', checklistenRouter);
// Tools — SOP Bibliothek
app.use('/api/tools/sop', sopRouter);
// Tools — VM Foto-Compliance
app.use('/api/tools/vm-compliance', vmComplianceRouter);
// Tools — Store Standards
app.use('/api/tools/store-standards', storeStandardsRouter);
// Tools — KPI Dashboard
app.use('/api/tools/kpi', kpiDashboardRouter);
// Tools — Budget Tracker
app.use('/api/tools/budget', budgetTrackerRouter);
// Tools — Forecast
app.use('/api/tools/forecast', forecastToolRouter);
// Tools — Loss Prevention
app.use('/api/tools/loss-prevention', lossPreventionRouter);
// Tools — Inventory
app.use('/api/tools/inventory', inventoryRouter);
// Statische Uploads mit Auth-Schutz
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');
app.use('/api/uploads', authenticate, express.static(UPLOAD_DIR));
// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'kore-server', mode: NODE_ENV });
});
// ── Static File Serving (nur in Production) ───────
if (isProduction) {
    const dashboardOnly = process.env['DASHBOARD_ONLY'] === 'true';
    const dashboardRoot = process.env['DASHBOARD_ROOT'] ??
        path.resolve(__dirname, '../../dashboard/dist');
    if (dashboardOnly) {
        app.use(express.static(dashboardRoot));
        app.use((req, res, next) => {
            if (req.method !== 'GET')
                return next();
            if (req.path.startsWith('/api/') || req.path === '/health')
                return next();
            res.sendFile(path.join(dashboardRoot, 'index.html'));
        });
        console.log('  Mode: Dashboard-Only (Subdomain)');
        console.log(`    Dashboard: ${dashboardRoot}`);
    }
    else {
        const webRoot = process.env['WEB_ROOT'] ?? path.resolve(__dirname, '../../web/dist');
        app.use('/dashboard', express.static(dashboardRoot));
        app.use(express.static(webRoot));
        app.use((req, res, next) => {
            if (req.method !== 'GET')
                return next();
            if (req.path.startsWith('/api/') || req.path === '/health')
                return next();
            if (req.path.startsWith('/dashboard')) {
                res.sendFile(path.join(dashboardRoot, 'index.html'));
                return;
            }
            res.sendFile(path.join(webRoot, 'index.html'));
        });
        console.log('  Mode: Unified (Website + Dashboard)');
        console.log(`    Website:   ${webRoot}`);
        console.log(`    Dashboard: ${dashboardRoot}`);
    }
}
// ── Start ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\u2713 KORE Server running on port ${PORT} (${NODE_ENV})`);
    console.log(`  CORS: ${allowedOrigins.join(', ')}`);
    console.log(`  Resend: ${process.env['RESEND_API_KEY'] ? 'configured' : 'not configured (dev mode)'}`);
});
//# sourceMappingURL=index.js.map