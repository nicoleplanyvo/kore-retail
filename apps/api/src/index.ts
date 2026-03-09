import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
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
import { storeExcellenceAuditRouter } from './routes/tools/store-excellence-audit/index.js';
import { toolsRouter } from './routes/tools/index.js';

// ── ESM __dirname ─────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const isProduction = NODE_ENV === 'production';

// ── CORS ──────────────────────────────────────────
// Production: Same-Origin (kein CORS nötig, aber als Fallback konfiguriert)
// Development: Vite Dev-Server auf Port 5173 (Web) und 5174 (Dashboard)
const CORS_ORIGIN =
  process.env['CORS_ORIGIN'] ?? 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:5176,https://dashboard.kore-retail.de,https://app.kore-retail.de';
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Erlaube Requests ohne Origin (Health Checks, Same-Origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
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

// Routes — Tools (App: zugewiesene Tools des Users)
app.use('/api/tools', toolsRouter);
// Routes — Tools (SEA)
app.use('/api/tools/sea', storeExcellenceAuditRouter);

// Statische Uploads mit Auth-Schutz
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');
app.use('/api/uploads', authenticate, express.static(UPLOAD_DIR));

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'kore-server', mode: NODE_ENV });
});

// ── Static File Serving (nur in Production) ───────
// In Development werden Web + Dashboard von eigenen Vite Dev-Servern bedient.
// In Production serviert dieser Server alles über einen Node.js-Prozess.
//
// Modus 1 (DASHBOARD_ONLY=true): dashboard.kore-retail.de
//   /              → Dashboard SPA (apps/dashboard/dist)
//   /api/*         → Express API
//
// Modus 2 (Default): kore-retail.de (Unified)
//   /              → Website (apps/web/dist)
//   /dashboard/    → Dashboard SPA (apps/dashboard/dist)
//   /api/*         → Express API
if (isProduction) {
  const dashboardOnly = process.env['DASHBOARD_ONLY'] === 'true';

  const dashboardRoot =
    process.env['DASHBOARD_ROOT'] ??
    path.resolve(__dirname, '../../dashboard/dist');

  if (dashboardOnly) {
    // ── Subdomain-Modus: Dashboard am Root ──
    app.use(express.static(dashboardRoot));

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api/') || req.path === '/health') return next();
      res.sendFile(path.join(dashboardRoot, 'index.html'));
    });

    console.log('  Mode: Dashboard-Only (Subdomain)');
    console.log(`    Dashboard: ${dashboardRoot}`);
  } else {
    // ── Unified-Modus: Website + Dashboard ──
    const webRoot =
      process.env['WEB_ROOT'] ?? path.resolve(__dirname, '../../web/dist');

    app.use('/dashboard', express.static(dashboardRoot));
    app.use(express.static(webRoot));

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api/') || req.path === '/health') return next();
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
  if (!isProduction) {
    console.log(`  CORS: ${CORS_ORIGIN}`);
  }
  console.log(
    `  Resend: ${process.env['RESEND_API_KEY'] ? 'configured' : 'not configured (dev mode)'}`,
  );
});
