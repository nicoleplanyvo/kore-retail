import 'dotenv/config';
import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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
import { liveFloorRouter } from './routes/tools/live-floor/index.js';
import { frTrackingRouter } from './routes/tools/fr-tracking/index.js';
import { vmGuidelinesRouter } from './routes/tools/vm-guidelines/index.js';
import { maintenanceRouter } from './routes/tools/maintenance/index.js';
import { trainingHubRouter } from './routes/tools/training-hub/index.js';
import { trainingHoursRouter } from './routes/tools/training-hours/index.js';
import { challengesRouter } from './routes/tools/challenges/index.js';
import { onboardingRouter } from './routes/tools/onboarding/index.js';
import { coachingRouter } from './routes/tools/coaching/index.js';
import { pdpPipRouter } from './routes/tools/pdp-pip/index.js';
import { appraisalsRouter } from './routes/tools/appraisals/index.js';
import { shiftPlanningRouter } from './routes/tools/shift-planning/index.js';
import { pulseSurveyRouter } from './routes/tools/pulse-survey/index.js';
import { wellbeingRouter } from './routes/tools/wellbeing/index.js';
import { briefingsRouter } from './routes/tools/briefings/index.js';
import { handoverRouter } from './routes/tools/handover/index.js';
import { teamPushRouter } from './routes/tools/team-push/index.js';
import { newsletterRouter } from './routes/tools/newsletter/index.js';
import { toolsRouter } from './routes/tools/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const isProduction = NODE_ENV === 'production';

// ── CORS ──────────────────────────────────────────
// Alle Frontends muessen sich mit der API verbinden koennen
const CORS_ORIGIN =
  process.env['CORS_ORIGIN'] ??
  'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,https://kore-retail.de,https://dashboard.kore-retail.de,https://app.kore-retail.de';
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
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
// Tools — Live Floor
app.use('/api/tools/live-floor', liveFloorRouter);
// Tools — FR Tracking
app.use('/api/tools/fr-tracking', frTrackingRouter);
// Tools — VM Guidelines
app.use('/api/tools/vm-guidelines', vmGuidelinesRouter);
// Tools — Maintenance
app.use('/api/tools/maintenance', maintenanceRouter);
// Tools — Training Hub / LMS
app.use('/api/tools/training-hub', trainingHubRouter);
// Tools — Training Hours
app.use('/api/tools/training-hours', trainingHoursRouter);
// Tools — Challenges
app.use('/api/tools/challenges', challengesRouter);
// Tools — Onboarding
app.use('/api/tools/onboarding', onboardingRouter);
// Tools — 1:1 Coaching
app.use('/api/tools/coaching', coachingRouter);
// Tools — PDP / PIP
app.use('/api/tools/pdp-pip', pdpPipRouter);
// Tools — Appraisals
app.use('/api/tools/appraisals', appraisalsRouter);
// Tools — Shift Planning
app.use('/api/tools/shift-planning', shiftPlanningRouter);
// Tools — Pulse Survey
app.use('/api/tools/pulse-survey', pulseSurveyRouter);
// Tools — Wellbeing
app.use('/api/tools/wellbeing', wellbeingRouter);
// Tools — Briefings
app.use('/api/tools/briefings', briefingsRouter);
// Tools — Handover
app.use('/api/tools/handover', handoverRouter);
// Tools — Team Push
app.use('/api/tools/team-push', teamPushRouter);
// Tools — Newsletter
app.use('/api/tools/newsletter', newsletterRouter);

// Statische Uploads mit Auth-Schutz
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');
app.use('/api/uploads', authenticate, express.static(UPLOAD_DIR));

// ── Production Static File Serving ────────────────
if (isProduction) {
  const dashboardDist = path.resolve(__dirname, '../../dashboard/dist');
  app.use('/dashboard', express.static(dashboardDist));
  app.get('/dashboard/*', (_req, res) => {
    res.sendFile(path.join(dashboardDist, 'index.html'));
  });
  app.use(express.static(dashboardDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path === '/health') return next();
    res.sendFile(path.join(dashboardDist, 'index.html'));
  });
}

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'kore-server', mode: NODE_ENV });
});

// ── Start ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ KORE API running on port ${PORT} (${NODE_ENV})`);
  console.log(`  CORS: ${allowedOrigins.join(', ')}`);
  console.log(
    `  Resend: ${process.env['RESEND_API_KEY'] ? 'configured' : 'not configured (dev mode)'}`,
  );
});
