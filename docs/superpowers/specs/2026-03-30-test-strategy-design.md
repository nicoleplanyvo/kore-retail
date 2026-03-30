# Test Strategy — API Integration + Frontend Unit Tests

## Goal
Add comprehensive test coverage to the KORE platform, focusing on the most critical paths: authentication, tenant isolation, role authorization, and core UI components.

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Framework | Vitest | Already in Vite ecosystem, zero config overhead |
| API testing | Supertest | HTTP assertions against Express app |
| Test DB | In-Memory SQLite via Prisma | Fresh DB per suite, fast, fully isolated |
| Frontend DOM | jsdom (via Vitest) | Lightweight browser environment |
| React testing | React Testing Library | Tests user behavior, not implementation |

## API Tests

### Structure
```
apps/api/src/__tests__/
  helpers/setup.ts          — DB setup, fixtures, login helper
  auth.test.ts              — Auth endpoints
  tenant-isolation.test.ts  — Cross-tenant data leak prevention
  roles.test.ts             — Role-based authorization
  tools-smoke.test.ts       — Happy-path CRUD per tool
```

### Test Database Setup
Each test suite:
1. Creates a fresh In-Memory SQLite Prisma client
2. Pushes the schema (`prisma db push --force-reset`)
3. Seeds test data via helper functions
4. Tests run against this isolated DB
5. DB is automatically discarded when suite ends

### Auth Tests (`auth.test.ts`)
- POST /login — valid credentials → 200 + accessToken + user
- POST /login — wrong password → 401
- POST /login — nonexistent email → 401
- POST /login — user with `passwordHash: null` (pending invite) → 401
- POST /login — inactive user → 401
- POST /refresh — valid cookie → new accessToken
- POST /refresh — expired/missing cookie → 401
- POST /forgot-password — always returns 200 (doesn't reveal email existence)
- POST /reset-password — valid token → password changed
- POST /reset-password — expired token → 400
- POST /reset-password — already-used token → 400
- POST /accept-invite — valid token → user activated + auto-login
- POST /accept-invite — expired token → 400
- PUT /change-password — correct current password → success
- PUT /change-password — wrong current password → 401
- POST /impersonate — kore_admin → success
- POST /impersonate — tenant_admin → 403
- POST /stop-impersonation — returns original admin session

### Tenant Isolation Tests (`tenant-isolation.test.ts`)
Setup: 2 tenants (A, B), each with a tenant_admin and a learner.
- Tenant A admin cannot list Tenant B users
- Tenant A user cannot see Tenant B messaging conversations
- Tenant A user cannot create conversation with Tenant B user
- Orgchart endpoint returns only same-tenant users
- Branding: tenant_admin A cannot update Tenant B branding
- Profile colleagues endpoint returns only same-tenant colleagues

### Role Authorization Tests (`roles.test.ts`)
- kore_admin can access all admin endpoints
- tenant_admin can access branding for own tenant
- tenant_admin cannot access kore_admin-only endpoints (tenant CRUD, stats)
- store_manager cannot access admin endpoints
- learner can only access own profile, messaging, orgchart (read-only)

### Tool Smoke Tests (`tools-smoke.test.ts`)
Per tool (Audit, Checklisten, SOP, VM Compliance, Standards, KPI, Budget, Forecast, Loss Prevention, Inventory):
- Create → 201
- Read (list) → 200 + array with created item
- Read (detail) → 200 + correct data
- Only tests happy path, no edge cases

## Frontend Tests

### Structure
```
apps/web/src/__tests__/
  helpers/render.tsx        — Provider wrapper
  helpers/mocks.ts          — Mock user, mock API
  auth-flow.test.tsx        — Store, login, protected route
  sidebar.test.tsx          — Navigation, role-based visibility
  pages.test.tsx            — Smoke render tests
```

### Test Helpers

**`renderWithProviders(component, options?)`**
Wraps component in: BrowserRouter + QueryClientProvider + optionally pre-set AuthStore state.

**`mockAuthUser(overrides?)`**
Returns an AuthUser object with sensible defaults:
```typescript
{
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'store_manager',
  tenantId: 'test-tenant-1',
  ...overrides
}
```

**`mockApi(path, response)`**
Mocks global fetch to return a specific response for a given API path.

### Auth Flow Tests (`auth-flow.test.tsx`)
- authStore.setAuth stores user and token
- authStore.clearAuth resets to null
- ProtectedRoute redirects to /login when not authenticated
- ProtectedRoute with minRole blocks insufficient roles
- ProtectedRoute with minRole allows sufficient roles

### Sidebar Tests (`sidebar.test.tsx`)
- Renders Home link for any authenticated user
- Renders Platform section (Messaging, Orgchart, Profil)
- Renders Branding link only for tenant_admin and kore_admin
- Does NOT render Branding link for store_manager or learner
- Shows tenant logo when tenantBranding.logoUrl is present
- Shows "KORE" text when no logo
- Shows tenant name from branding

### Page Smoke Tests (`pages.test.tsx`)
Each test verifies the page renders without crashing with mock data:
- ProfilePage — renders user name, avatar section
- MessagingPage — renders conversation list area
- OrgchartPage — renders tree structure
- BrandingPage — renders color picker, logo upload button

### Hook Tests
- useUnreadCount — returns number from mocked API

## Not In Scope
- E2E browser tests (Playwright/Cypress) — future project
- Visual regression / screenshot tests
- Performance / load testing
- Testing third-party libraries (Zustand, TanStack Query internals)
- Pixel-perfect styling tests

## Dependencies to Install
- `vitest` — test runner (both apps)
- `@testing-library/react` — React component testing (web app)
- `@testing-library/jest-dom` — DOM matchers (web app)
- `@testing-library/user-event` — user interaction simulation (web app)
- `jsdom` — browser environment for Vitest (web app)
- `supertest` + `@types/supertest` — HTTP testing (API)

## Vitest Configuration
- API: `apps/api/vitest.config.ts` — node environment, path alias for `src/`
- Web: `apps/web/vitest.config.ts` — jsdom environment, extends existing Vite config
- Root: `vitest.workspace.ts` — workspace config pointing to both apps
- Scripts: `"test"` in each app's package.json + root `"test"` via turbo

## Success Criteria
- All tests pass with `pnpm test` from root
- Auth flow is fully covered (login, refresh, invite, reset, impersonation)
- Tenant isolation is proven (no cross-tenant data access)
- Role hierarchy is enforced
- Core UI components render correctly per role
- CI-ready: tests can run in GitHub Actions
