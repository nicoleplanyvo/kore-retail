# Test Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add API integration tests and frontend unit tests covering auth, tenant isolation, roles, and core UI components.

**Architecture:** Vitest as test runner for both API and web apps. API tests use Supertest against a refactored Express app with a test SQLite database. Frontend tests use React Testing Library with jsdom. Test DB is reset before each suite via helper functions.

**Tech Stack:** Vitest, Supertest, React Testing Library, jsdom, better-sqlite3 (in-memory)

---

### Task 1: Install Dependencies

**Files:**
- Modify: `apps/api/package.json`
- Modify: `apps/web/package.json`
- Modify: `package.json` (root)

- [ ] **Step 1: Install API test dependencies**

```bash
cd apps/api && pnpm add -D vitest supertest @types/supertest
```

- [ ] **Step 2: Install web test dependencies**

```bash
cd apps/web && pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Add test scripts to API package.json**

Add to `apps/api/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Add test scripts to web package.json**

Add to `apps/web/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add root test script**

Add to root `package.json` scripts:
```json
"test": "turbo test",
"test:watch": "turbo test:watch"
```

- [ ] **Step 6: Commit**

```bash
git add apps/api/package.json apps/web/package.json package.json pnpm-lock.yaml
git commit -m "chore: add vitest, supertest, testing-library dependencies"
```

---

### Task 2: Vitest Configuration Files

**Files:**
- Create: `apps/api/vitest.config.ts`
- Create: `apps/web/vitest.config.ts`

- [ ] **Step 1: Create API vitest config**

Create `apps/api/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/helpers/globalSetup.ts'],
    include: ['src/__tests__/**/*.test.ts'],
    testTimeout: 15000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 2: Create web vitest config**

Create `apps/web/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/helpers/setup.ts'],
    include: ['src/__tests__/**/*.test.tsx', 'src/__tests__/**/*.test.ts'],
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Verify both configs parse correctly**

```bash
cd apps/api && npx vitest --version
cd ../web && npx vitest --version
```

Expected: Vitest version printed without errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/vitest.config.ts apps/web/vitest.config.ts
git commit -m "chore: add vitest configuration for API and web"
```

---

### Task 3: Extract Express App for Testability

**Files:**
- Create: `apps/api/src/app.ts`
- Modify: `apps/api/src/index.ts`

The current `index.ts` creates the Express app AND starts listening. Tests need the app without `.listen()`. Extract app creation into `app.ts`.

- [ ] **Step 1: Create `apps/api/src/app.ts`**

Move all Express configuration from `index.ts` into a `createApp()` function. This file does NOT call `app.listen()`:

```typescript
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { contactRouter } from './routes/contact.js';
import { auditRouter } from './routes/audit.js';
import { authRouter } from './routes/auth.js';
import { authenticate } from './middleware/auth.js';
import { authRateLimit, passwordRateLimit } from './middleware/rateLimit.js';
import { adminTenantsRouter, tenantBrandingRouter } from './routes/admin/tenants.js';
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
import { frConversionRouter } from './routes/tools/fr-conversion/index.js';
import { clientelingRouter } from './routes/tools/clienteling/index.js';
import { stockCalloutsRouter } from './routes/tools/stock-callouts/index.js';
import { trackTraceRouter } from './routes/tools/track-trace/index.js';
import { multiStoreRouter } from './routes/tools/multi-store/index.js';
import { rmDashboardRouter } from './routes/tools/rm-dashboard/index.js';
import { toolsRouter } from './routes/tools/index.js';
import { blogRouter } from './routes/blog.js';
import { profileRouter } from './routes/profile.js';
import { orgchartRouter } from './routes/orgchart.js';
import { messagingRouter } from './routes/messaging.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  const CORS_ORIGIN =
    process.env['CORS_ORIGIN'] ??
    'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,https://kore-retail.de,https://www.kore-retail.de,https://dashboard.kore-retail.de,https://app.kore-retail.de';
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

  // Public
  app.use('/api/contact', contactRouter);
  app.use('/api/audit', auditRouter);
  app.use('/api/blog', blogRouter);

  // Auth
  app.post('/api/auth/login', authRateLimit);
  app.post('/api/auth/forgot-password', passwordRateLimit);
  app.post('/api/auth/reset-password', passwordRateLimit);
  app.post('/api/auth/accept-invite', passwordRateLimit);
  app.use('/api/auth', authRouter);

  // Admin
  app.use('/api/admin/tenants', adminTenantsRouter);
  app.use('/api/admin/tenants', tenantBrandingRouter);
  app.use('/api/admin/tools', adminToolsRouter);
  app.use('/api/admin/stores', adminStoresRouter);
  app.use('/api/admin/gdpr', adminGdprRouter);
  app.use('/api/admin/users', adminUsersRouter);
  app.use('/api/admin/reporting', adminReportingRouter);
  app.use('/api/admin/regions', adminRegionsRouter);

  // Tools
  app.use('/api/tools', toolsRouter);
  app.use('/api/tools/sea', storeExcellenceAuditRouter);
  app.use('/api/tools/checklisten', checklistenRouter);
  app.use('/api/tools/sop', sopRouter);
  app.use('/api/tools/vm-compliance', vmComplianceRouter);
  app.use('/api/tools/store-standards', storeStandardsRouter);
  app.use('/api/tools/kpi', kpiDashboardRouter);
  app.use('/api/tools/budget', budgetTrackerRouter);
  app.use('/api/tools/forecast', forecastToolRouter);
  app.use('/api/tools/loss-prevention', lossPreventionRouter);
  app.use('/api/tools/inventory', inventoryRouter);
  app.use('/api/tools/live-floor', liveFloorRouter);
  app.use('/api/tools/fr-tracking', frTrackingRouter);
  app.use('/api/tools/vm-guidelines', vmGuidelinesRouter);
  app.use('/api/tools/maintenance', maintenanceRouter);
  app.use('/api/tools/training-hub', trainingHubRouter);
  app.use('/api/tools/training-hours', trainingHoursRouter);
  app.use('/api/tools/challenges', challengesRouter);
  app.use('/api/tools/onboarding', onboardingRouter);
  app.use('/api/tools/coaching', coachingRouter);
  app.use('/api/tools/pdp-pip', pdpPipRouter);
  app.use('/api/tools/appraisals', appraisalsRouter);
  app.use('/api/tools/shift-planning', shiftPlanningRouter);
  app.use('/api/tools/pulse-survey', pulseSurveyRouter);
  app.use('/api/tools/wellbeing', wellbeingRouter);
  app.use('/api/tools/briefings', briefingsRouter);
  app.use('/api/tools/handover', handoverRouter);
  app.use('/api/tools/team-push', teamPushRouter);
  app.use('/api/tools/newsletter', newsletterRouter);
  app.use('/api/tools/fr-conversion', frConversionRouter);
  app.use('/api/tools/clienteling', clientelingRouter);
  app.use('/api/tools/stock-callouts', stockCalloutsRouter);
  app.use('/api/tools/track-trace', trackTraceRouter);
  app.use('/api/tools/multi-store', multiStoreRouter);
  app.use('/api/tools/rm-dashboard', rmDashboardRouter);

  // Platform
  app.use('/api/profile', profileRouter);
  app.use('/api/orgchart', orgchartRouter);
  app.use('/api/messaging', messagingRouter);

  // Static uploads
  const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? path.join(process.cwd(), 'uploads');
  app.use('/api/uploads', authenticate, express.static(UPLOAD_DIR));

  return app;
}
```

- [ ] **Step 2: Simplify `apps/api/src/index.ts`**

Replace the entire file with:
```typescript
import 'dotenv/config';
import prisma from './lib/prisma.js';
import { createApp } from './app.js';

const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const isProduction = NODE_ENV === 'production';

if (isProduction) {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`✗ Fehlende Umgebungsvariablen: ${missing.join(', ')}`);
    process.exit(1);
  }
  if ((process.env['JWT_SECRET'] ?? '').length < 32) {
    console.error('✗ JWT_SECRET muss mindestens 32 Zeichen lang sein.');
    process.exit(1);
  }
  if ((process.env['JWT_REFRESH_SECRET'] ?? '').length < 32) {
    console.error('✗ JWT_REFRESH_SECRET muss mindestens 32 Zeichen lang sein.');
    process.exit(1);
  }
}

const app = createApp();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

// Health Check
app.get('/health', async (_req, res) => {
  try {
    await prisma.tenant.count();
    res.json({ status: 'ok', service: 'kore-api', mode: NODE_ENV, db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', service: 'kore-api', mode: NODE_ENV, db: 'disconnected' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`✓ KORE API running on port ${PORT} (${NODE_ENV})`);
});

function gracefulShutdown(signal: string) {
  console.log(`\n${signal} empfangen, Server wird beendet...`);
  server.close(async () => {
    try { await prisma.$disconnect(); } catch {}
    console.log('✓ Server beendet.');
    process.exit(0);
  });
  setTimeout(() => { console.error('✗ Timeout beim Shutdown.'); process.exit(1); }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

- [ ] **Step 3: Verify build still passes**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/api --force
```

Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/app.ts apps/api/src/index.ts
git commit -m "refactor: extract Express app into app.ts for testability"
```

---

### Task 4: API Test Helpers

**Files:**
- Create: `apps/api/src/__tests__/helpers/globalSetup.ts`
- Create: `apps/api/src/__tests__/helpers/setup.ts`

- [ ] **Step 1: Create global setup file**

Create `apps/api/src/__tests__/helpers/globalSetup.ts`:
```typescript
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Ensure test database exists with current schema
const TEST_DB_PATH = path.resolve(__dirname, '../../../prisma/test.db');

export function setup() {
  // Remove old test DB
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }

  // Push schema to fresh test DB
  execSync('npx prisma db push --force-reset --skip-generate', {
    cwd: path.resolve(__dirname, '../../../'),
    env: {
      ...process.env,
      DATABASE_URL: `file:./test.db`,
    },
    stdio: 'pipe',
  });
}
```

- [ ] **Step 2: Create test helper with fixtures**

Create `apps/api/src/__tests__/helpers/setup.ts`:
```typescript
import { beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma.js';
import { signAccessToken } from '../../lib/jwt.js';

// Set test env vars before anything
process.env['DATABASE_URL'] = 'file:./test.db';
process.env['JWT_SECRET'] = 'test-jwt-secret-that-is-long-enough-for-validation';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-that-is-long-enough-for-validation';
process.env['NODE_ENV'] = 'test';

/** Truncate all tables before each test */
beforeEach(async () => {
  const tables = [
    'DirectMessage', 'ConversationParticipant', 'Conversation',
    'InvitationToken', 'PasswordResetToken',
    'UserStoreAssignment', 'UserRegionAssignment',
    'StoreToolAssignment',
    'User', 'Store', 'Region', 'ToolDefinition', 'Tenant',
  ];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
});

/** Create a test tenant */
export async function createTenant(name: string, slug?: string) {
  return prisma.tenant.create({
    data: {
      name,
      slug: slug ?? name.toLowerCase().replace(/\s/g, '-'),
    },
  });
}

/** Create a test user with hashed password */
export async function createUser(opts: {
  email: string;
  name: string;
  role: string;
  tenantId?: string | null;
  password?: string;
  isActive?: boolean;
}) {
  const passwordHash = opts.password
    ? await bcrypt.hash(opts.password, 4) // Low rounds for speed in tests
    : null;

  return prisma.user.create({
    data: {
      email: opts.email,
      name: opts.name,
      role: opts.role,
      tenantId: opts.tenantId ?? null,
      passwordHash,
      isActive: opts.isActive ?? true,
    },
  });
}

/** Get an access token for a user */
export function tokenFor(user: { id: string; tenantId: string | null; role: string }, impersonatedBy?: string) {
  return signAccessToken({
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
    ...(impersonatedBy ? { impersonatedBy } : {}),
  });
}

/** Create standard two-tenant test scenario */
export async function seedTwoTenants() {
  const tenantA = await createTenant('Tenant A');
  const tenantB = await createTenant('Tenant B');

  const adminA = await createUser({
    email: 'admin-a@test.com', name: 'Admin A', role: 'tenant_admin',
    tenantId: tenantA.id, password: 'password123',
  });
  const learnerA = await createUser({
    email: 'learner-a@test.com', name: 'Learner A', role: 'learner',
    tenantId: tenantA.id, password: 'password123',
  });
  const adminB = await createUser({
    email: 'admin-b@test.com', name: 'Admin B', role: 'tenant_admin',
    tenantId: tenantB.id, password: 'password123',
  });
  const learnerB = await createUser({
    email: 'learner-b@test.com', name: 'Learner B', role: 'learner',
    tenantId: tenantB.id, password: 'password123',
  });

  const koreAdmin = await createUser({
    email: 'kore@test.com', name: 'KORE Admin', role: 'kore_admin',
    tenantId: null, password: 'password123',
  });

  return { tenantA, tenantB, adminA, learnerA, adminB, learnerB, koreAdmin };
}

export { prisma };
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/__tests__/
git commit -m "test: add API test helpers, globalSetup, and fixture functions"
```

---

### Task 5: Auth API Tests

**Files:**
- Create: `apps/api/src/__tests__/auth.test.ts`

- [ ] **Step 1: Write auth tests**

Create `apps/api/src/__tests__/auth.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { createApp } from '../app.js';
import { createTenant, createUser, tokenFor, prisma } from './helpers/setup.js';

const app = createApp();

describe('POST /api/auth/login', () => {
  it('returns 200 with valid credentials', async () => {
    const tenant = await createTenant('Test Corp');
    await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe('user@test.com');
    expect(res.body.user.tenantBranding).toBeDefined();
  });

  it('returns 401 with wrong password', async () => {
    const tenant = await createTenant('Test Corp');
    await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for nonexistent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for user with null passwordHash (pending invite)', async () => {
    const tenant = await createTenant('Test Corp');
    await createUser({ email: 'invited@test.com', name: 'Invited', role: 'learner', tenantId: tenant.id });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invited@test.com', password: 'anything' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for inactive user', async () => {
    const tenant = await createTenant('Test Corp');
    await createUser({ email: 'inactive@test.com', name: 'Inactive', role: 'learner', tenantId: tenant.id, password: 'password123', isActive: false });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inactive@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns user with valid token', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'password123' });
    const token = tokenFor(user);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(user.id);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('always returns 200 regardless of email existence', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nonexistent@test.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/auth/reset-password', () => {
  it('resets password with valid token', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'oldpassword' });
    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 3600000) },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'newpassword123' });

    expect(res.status).toBe(200);

    // Verify can login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'newpassword123' });
    expect(loginRes.status).toBe(200);
  });

  it('returns 400 for expired token', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'password' });
    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() - 1000) },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'newpassword123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for already-used token', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'password' });
    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 3600000), usedAt: new Date() },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'newpassword123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/accept-invite', () => {
  it('activates user and auto-logs in', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'invited@test.com', name: 'Invited', role: 'learner', tenantId: tenant.id, isActive: false });
    const token = crypto.randomUUID();
    await prisma.invitationToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 7 * 86400000) },
    });

    const res = await request(app)
      .post('/api/auth/accept-invite')
      .send({ token, password: 'mypassword123' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe('invited@test.com');

    // Verify user is now active and can login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invited@test.com', password: 'mypassword123' });
    expect(loginRes.status).toBe(200);
  });

  it('returns 400 for expired invite', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'invited@test.com', name: 'Invited', role: 'learner', tenantId: tenant.id, isActive: false });
    const token = crypto.randomUUID();
    await prisma.invitationToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() - 1000) },
    });

    const res = await request(app)
      .post('/api/auth/accept-invite')
      .send({ token, password: 'mypassword123' });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/auth/change-password', () => {
  it('changes password with correct current password', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'oldpassword1' });
    const token = tokenFor(user);

    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'oldpassword1', newPassword: 'newpassword1' });

    expect(res.status).toBe(200);
  });

  it('returns 401 with wrong current password', async () => {
    const tenant = await createTenant('Test Corp');
    const user = await createUser({ email: 'user@test.com', name: 'Test', role: 'learner', tenantId: tenant.id, password: 'oldpassword1' });
    const token = tokenFor(user);

    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'wrongpassword', newPassword: 'newpassword1' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/impersonate', () => {
  it('kore_admin can impersonate', async () => {
    const tenant = await createTenant('Test Corp');
    const koreAdmin = await createUser({ email: 'kore@test.com', name: 'KORE', role: 'kore_admin', password: 'password123' });
    const target = await createUser({ email: 'target@test.com', name: 'Target', role: 'learner', tenantId: tenant.id, password: 'password123' });
    const token = tokenFor(koreAdmin);

    const res = await request(app)
      .post('/api/auth/impersonate')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: target.id });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(target.id);
    expect(res.body.user.impersonatedBy).toBe(koreAdmin.id);
  });

  it('tenant_admin cannot impersonate', async () => {
    const tenant = await createTenant('Test Corp');
    const admin = await createUser({ email: 'admin@test.com', name: 'Admin', role: 'tenant_admin', tenantId: tenant.id, password: 'password123' });
    const target = await createUser({ email: 'target@test.com', name: 'Target', role: 'learner', tenantId: tenant.id, password: 'password123' });
    const token = tokenFor(admin);

    const res = await request(app)
      .post('/api/auth/impersonate')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: target.id });

    expect(res.status).toBe(403);
  });
});
```

- [ ] **Step 2: Run auth tests**

```bash
cd apps/api && npx vitest run src/__tests__/auth.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/__tests__/auth.test.ts
git commit -m "test: add auth API integration tests"
```

---

### Task 6: Tenant Isolation Tests

**Files:**
- Create: `apps/api/src/__tests__/tenant-isolation.test.ts`

- [ ] **Step 1: Write tenant isolation tests**

Create `apps/api/src/__tests__/tenant-isolation.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { seedTwoTenants, tokenFor, prisma } from './helpers/setup.js';

const app = createApp();

describe('Tenant Isolation', () => {
  it('tenant_admin A cannot update Tenant B branding', async () => {
    const { adminA, tenantB } = await seedTwoTenants();
    const token = tokenFor(adminA);

    const res = await request(app)
      .put(`/api/admin/tenants/${tenantB.id}/branding`)
      .set('Authorization', `Bearer ${token}`)
      .send({ primaryColor: '#FF0000' });

    expect(res.status).toBe(403);
  });

  it('tenant_admin A can update own tenant branding', async () => {
    const { adminA, tenantA } = await seedTwoTenants();
    const token = tokenFor(adminA);

    const res = await request(app)
      .get(`/api/admin/tenants/${tenantA.id}/branding`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(tenantA.id);
  });

  it('kore_admin can access any tenant branding', async () => {
    const { koreAdmin, tenantA, tenantB } = await seedTwoTenants();
    const token = tokenFor(koreAdmin);

    const resA = await request(app)
      .get(`/api/admin/tenants/${tenantA.id}/branding`)
      .set('Authorization', `Bearer ${token}`);
    expect(resA.status).toBe(200);

    const resB = await request(app)
      .get(`/api/admin/tenants/${tenantB.id}/branding`)
      .set('Authorization', `Bearer ${token}`);
    expect(resB.status).toBe(200);
  });

  it('orgchart returns only same-tenant users', async () => {
    const { adminA, learnerB } = await seedTwoTenants();
    const token = tokenFor(adminA);

    const res = await request(app)
      .get('/api/orgchart')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const userIds = res.body.map((u: { id: string }) => u.id);
    expect(userIds).not.toContain(learnerB.id);
  });

  it('messaging: cannot create conversation with user from other tenant', async () => {
    const { adminA, learnerB } = await seedTwoTenants();
    const token = tokenFor(adminA);

    const res = await request(app)
      .post('/api/messaging/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ participantIds: [learnerB.id] });

    expect(res.status).toBe(400);
  });

  it('profile colleagues returns only same-tenant users', async () => {
    const { adminA, learnerA, learnerB } = await seedTwoTenants();
    const token = tokenFor(adminA);

    const res = await request(app)
      .get('/api/profile/colleagues')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const ids = res.body.map((u: { id: string }) => u.id);
    expect(ids).toContain(learnerA.id);
    expect(ids).not.toContain(learnerB.id);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd apps/api && npx vitest run src/__tests__/tenant-isolation.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/__tests__/tenant-isolation.test.ts
git commit -m "test: add tenant isolation tests"
```

---

### Task 7: Role Authorization Tests

**Files:**
- Create: `apps/api/src/__tests__/roles.test.ts`

- [ ] **Step 1: Write role tests**

Create `apps/api/src/__tests__/roles.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { seedTwoTenants, tokenFor } from './helpers/setup.js';

const app = createApp();

describe('Role Authorization', () => {
  it('kore_admin can list all tenants', async () => {
    const { koreAdmin } = await seedTwoTenants();
    const token = tokenFor(koreAdmin);

    const res = await request(app)
      .get('/api/admin/tenants')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('tenant_admin cannot list all tenants', async () => {
    const { adminA } = await seedTwoTenants();
    const token = tokenFor(adminA);

    const res = await request(app)
      .get('/api/admin/tenants')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('learner cannot access admin endpoints', async () => {
    const { learnerA } = await seedTwoTenants();
    const token = tokenFor(learnerA);

    const res = await request(app)
      .get('/api/admin/tenants')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('learner can access own profile', async () => {
    const { learnerA } = await seedTwoTenants();
    const token = tokenFor(learnerA);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(learnerA.id);
  });

  it('learner can access orgchart', async () => {
    const { learnerA } = await seedTwoTenants();
    const token = tokenFor(learnerA);

    const res = await request(app)
      .get('/api/orgchart')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('learner can access messaging', async () => {
    const { learnerA } = await seedTwoTenants();
    const token = tokenFor(learnerA);

    const res = await request(app)
      .get('/api/messaging/conversations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('kore_admin can access admin stats', async () => {
    const { koreAdmin } = await seedTwoTenants();
    const token = tokenFor(koreAdmin);

    const res = await request(app)
      .get('/api/admin/tenants/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalTenants).toBe(2);
  });

  it('learner cannot access branding', async () => {
    const { learnerA, tenantA } = await seedTwoTenants();
    const token = tokenFor(learnerA);

    const res = await request(app)
      .get(`/api/admin/tenants/${tenantA.id}/branding`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd apps/api && npx vitest run src/__tests__/roles.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/__tests__/roles.test.ts
git commit -m "test: add role authorization tests"
```

---

### Task 8: Frontend Test Setup

**Files:**
- Create: `apps/web/src/__tests__/helpers/setup.ts`
- Create: `apps/web/src/__tests__/helpers/render.tsx`
- Create: `apps/web/src/__tests__/helpers/mocks.ts`

- [ ] **Step 1: Create jsdom setup file**

Create `apps/web/src/__tests__/helpers/setup.ts`:
```typescript
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Create mock helpers**

Create `apps/web/src/__tests__/helpers/mocks.ts`:
```typescript
import type { AuthUser } from '@kore/types';

export function mockAuthUser(overrides?: Partial<AuthUser>): AuthUser {
  return {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'store_manager',
    tenantId: 'test-tenant-1',
    avatarUrl: null,
    managerId: null,
    storeAssignments: ['store-1'],
    regionAssignments: [],
    tenantBranding: {
      tenantName: 'Test Tenant',
      logoUrl: null,
      primaryColor: null,
      accentColor: null,
    },
    ...overrides,
  };
}
```

- [ ] **Step 3: Create render helper with providers**

Create `apps/web/src/__tests__/helpers/render.tsx`:
```typescript
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactElement } from 'react';
import type { AuthUser } from '@kore/types';
import { useAuthStore } from '../../stores/authStore';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: AuthUser | null;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const { user = null, route = '/', ...renderOptions } = options;

  // Set auth state if user provided
  if (user) {
    useAuthStore.setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  } else {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  // Set route
  window.history.pushState({}, '', route);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/__tests__/
git commit -m "test: add frontend test helpers, mock user, and render wrapper"
```

---

### Task 9: Frontend Auth Flow Tests

**Files:**
- Create: `apps/web/src/__tests__/auth-flow.test.tsx`

- [ ] **Step 1: Write auth flow tests**

Create `apps/web/src/__tests__/auth-flow.test.tsx`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { useAuthStore } from '../../stores/authStore';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { renderWithProviders } from './helpers/render';
import { mockAuthUser } from './helpers/mocks';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  });

  it('setAuth stores user and sets authenticated', () => {
    const user = mockAuthUser();
    useAuthStore.getState().setAuth(user, 'test-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('clearAuth resets to initial state', () => {
    const user = mockAuthUser();
    useAuthStore.getState().setAuth(user, 'test-token');
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithProviders(<ProtectedRoute />, { route: '/app' });

    // Should redirect — we check by NOT finding the outlet content
    // BrowserRouter navigates to /login
    expect(window.location.pathname).toBe('/login');
  });

  it('renders outlet when authenticated', () => {
    const user = mockAuthUser();
    renderWithProviders(<ProtectedRoute />, { user, route: '/app' });

    // No redirect — stays on /app
    expect(window.location.pathname).toBe('/app');
  });

  it('blocks insufficient role with minRole', () => {
    const learner = mockAuthUser({ role: 'learner' });
    renderWithProviders(<ProtectedRoute minRole="tenant_admin" />, { user: learner, route: '/app/branding' });

    expect(screen.getByText(/Zugriff verweigert|Keine Berechtigung|Access Denied/i)).toBeTruthy();
  });

  it('allows sufficient role with minRole', () => {
    const admin = mockAuthUser({ role: 'kore_admin' });
    renderWithProviders(<ProtectedRoute minRole="tenant_admin" />, { user: admin, route: '/app/branding' });

    expect(window.location.pathname).toBe('/app/branding');
  });
});
```

- [ ] **Step 2: Run frontend tests**

```bash
cd apps/web && npx vitest run src/__tests__/auth-flow.test.tsx
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/__tests__/auth-flow.test.tsx
git commit -m "test: add frontend auth flow and ProtectedRoute tests"
```

---

### Task 10: Frontend Sidebar Tests

**Files:**
- Create: `apps/web/src/__tests__/sidebar.test.tsx`

- [ ] **Step 1: Write sidebar tests**

Create `apps/web/src/__tests__/sidebar.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { AppSidebar } from '../../components/AppSidebar';
import { renderWithProviders } from './helpers/render';
import { mockAuthUser } from './helpers/mocks';

// Mock useMyTools — returns empty tools list
vi.mock('../../hooks/useMyTools', () => ({
  useMyTools: () => ({ data: [] }),
}));

// Mock useUnreadCount
vi.mock('../../hooks/useMessaging', () => ({
  useUnreadCount: () => ({ data: 0 }),
}));

describe('AppSidebar', () => {
  it('renders Home link for any user', () => {
    const user = mockAuthUser({ role: 'learner' });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user });

    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('renders Platform section links', () => {
    const user = mockAuthUser({ role: 'store_manager' });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user });

    expect(screen.getByText('Nachrichten')).toBeTruthy();
    expect(screen.getByText('Organigramm')).toBeTruthy();
    expect(screen.getByText('Mein Profil')).toBeTruthy();
  });

  it('shows Branding link for tenant_admin', () => {
    const admin = mockAuthUser({ role: 'tenant_admin' });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user: admin });

    expect(screen.getByText('Branding')).toBeTruthy();
  });

  it('shows Branding link for kore_admin', () => {
    const admin = mockAuthUser({ role: 'kore_admin' });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user: admin });

    expect(screen.getByText('Branding')).toBeTruthy();
  });

  it('does NOT show Branding link for learner', () => {
    const learner = mockAuthUser({ role: 'learner' });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user: learner });

    expect(screen.queryByText('Branding')).toBeNull();
  });

  it('shows KORE text when no tenant logo', () => {
    const user = mockAuthUser({ tenantBranding: { tenantName: 'Test', logoUrl: null, primaryColor: null, accentColor: null } });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user });

    expect(screen.getByText('KORE')).toBeTruthy();
  });

  it('shows tenant name from branding', () => {
    const user = mockAuthUser({ tenantBranding: { tenantName: 'Luxus GmbH', logoUrl: null, primaryColor: null, accentColor: null } });
    renderWithProviders(<AppSidebar open={true} onClose={() => {}} />, { user });

    expect(screen.getByText('Luxus GmbH')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd apps/web && npx vitest run src/__tests__/sidebar.test.tsx
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/__tests__/sidebar.test.tsx
git commit -m "test: add AppSidebar role-based visibility tests"
```

---

### Task 11: Frontend Page Smoke Tests

**Files:**
- Create: `apps/web/src/__tests__/pages.test.tsx`

- [ ] **Step 1: Write page smoke tests**

Create `apps/web/src/__tests__/pages.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './helpers/render';
import { mockAuthUser } from './helpers/mocks';

// Mock all API hooks to return empty data
vi.mock('../../hooks/useProfile', () => ({
  useProfile: () => ({ data: null, isLoading: false }),
  useColleagues: () => ({ data: [] }),
  useUpdateProfile: () => ({ mutateAsync: vi.fn() }),
  useUploadAvatar: () => ({ mutateAsync: vi.fn() }),
  useDeleteAvatar: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('../../hooks/useOrgchart', () => ({
  useOrgchart: () => ({ data: [], isLoading: false }),
  useSetManager: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('../../hooks/useMessaging', () => ({
  useConversations: () => ({ data: [] }),
  useMessages: () => ({ data: { pages: [] } }),
  useSendMessage: () => ({ mutateAsync: vi.fn() }),
  useCreateConversation: () => ({ mutateAsync: vi.fn() }),
  useUnreadCount: () => ({ data: 0 }),
  useColleagues: () => ({ data: [] }),
}));

describe('Page Smoke Tests', () => {
  it('ProfilePage renders without crashing', async () => {
    const { ProfilePage } = await import('../../pages/ProfilePage');
    const user = mockAuthUser();
    renderWithProviders(<ProfilePage />, { user });

    expect(screen.getByText('Mein Profil')).toBeTruthy();
  });

  it('OrgchartPage renders without crashing', async () => {
    const { OrgchartPage } = await import('../../pages/OrgchartPage');
    const user = mockAuthUser();
    renderWithProviders(<OrgchartPage />, { user });

    expect(screen.getByText('Organigramm')).toBeTruthy();
  });

  it('BrandingPage renders for admin', async () => {
    const { BrandingPage } = await import('../../pages/BrandingPage');
    const admin = mockAuthUser({ role: 'tenant_admin' });
    renderWithProviders(<BrandingPage />, { user: admin });

    expect(screen.getByText('Branding')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd apps/web && npx vitest run src/__tests__/pages.test.tsx
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/__tests__/pages.test.tsx
git commit -m "test: add frontend page smoke tests"
```

---

### Task 12: Run Full Test Suite & Verify

- [ ] **Step 1: Run all API tests**

```bash
cd apps/api && npx vitest run
```

Expected: All test suites pass.

- [ ] **Step 2: Run all frontend tests**

```bash
cd apps/web && npx vitest run
```

Expected: All test suites pass.

- [ ] **Step 3: Run from root via turbo**

```bash
pnpm test
```

Expected: Both packages pass. Output shows test counts.

- [ ] **Step 4: Verify build still works**

```bash
npx turbo build --filter=@kore/api --filter=@kore/web --force
```

Expected: Build succeeds — tests don't break production code.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "test: complete test suite — auth, tenant isolation, roles, frontend components"
```
