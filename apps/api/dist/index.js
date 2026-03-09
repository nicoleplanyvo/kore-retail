import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { contactRouter } from './routes/contact.js';
import { auditRouter } from './routes/audit.js';
import { authRouter } from './routes/auth.js';
import { adminTenantsRouter } from './routes/admin/tenants.js';
import { adminToolsRouter } from './routes/admin/tools.js';
import { adminStoresRouter } from './routes/admin/stores.js';
import { adminGdprRouter } from './routes/admin/gdpr.js';
import { adminUsersRouter } from './routes/admin/users.js';
import { adminReportingRouter } from './routes/admin/reporting.js';
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
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173,http://localhost:5174';
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(cors({
    origin: (origin, callback) => {
        // Erlaube Requests ohne Origin (Health Checks, Same-Origin)
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
// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'kore-server', mode: NODE_ENV });
});
// ── Static File Serving (nur in Production) ───────
// In Development werden Web + Dashboard von eigenen Vite Dev-Servern bedient.
// In Production serviert dieser Server alles:
//   /              → Website (apps/web/dist)
//   /dashboard/    → Dashboard SPA (apps/dashboard/dist)
//   /api/*         → Express API (oben definiert)
if (isProduction) {
    // Pfade relativ zu dist/index.js:
    //   dist/index.js → ../../web/dist     (= apps/web/dist)
    //   dist/index.js → ../../dashboard/dist (= apps/dashboard/dist)
    const webRoot = process.env['WEB_ROOT'] ?? path.resolve(__dirname, '../../web/dist');
    const dashboardRoot = process.env['DASHBOARD_ROOT'] ??
        path.resolve(__dirname, '../../dashboard/dist');
    // Dashboard: Statische Dateien unter /dashboard/
    app.use('/dashboard', express.static(dashboardRoot));
    // Website: Statische Dateien im Root /
    app.use(express.static(webRoot));
    // SPA Fallback — fängt alle GET-Requests auf, die keine Datei gefunden haben
    // MUSS nach allen API-Routes und express.static() kommen
    app.use((req, res, next) => {
        // Nur GET-Requests bekommen SPA-Fallback
        if (req.method !== 'GET')
            return next();
        // API-Routes und Health-Check NICHT auffangen — sollen normal 404 geben
        if (req.path.startsWith('/api/') || req.path === '/health')
            return next();
        // Dashboard SPA-Routing: /dashboard/login, /dashboard/stores/123, etc.
        if (req.path.startsWith('/dashboard')) {
            res.sendFile(path.join(dashboardRoot, 'index.html'));
            return;
        }
        // Website SPA-Routing: /consulting, /about, etc.
        res.sendFile(path.join(webRoot, 'index.html'));
    });
    console.log('  Static files:');
    console.log(`    Website:   ${webRoot}`);
    console.log(`    Dashboard: ${dashboardRoot}`);
}
// ── Start ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\u2713 KORE Server running on port ${PORT} (${NODE_ENV})`);
    if (!isProduction) {
        console.log(`  CORS: ${CORS_ORIGIN}`);
    }
    console.log(`  Resend: ${process.env['RESEND_API_KEY'] ? 'configured' : 'not configured (dev mode)'}`);
});
//# sourceMappingURL=index.js.map