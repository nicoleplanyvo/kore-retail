import '../__tests__/helpers/setup.js';
import { seedTwoTenants } from './helpers/setup.js';
import { createApp } from '../app.js';
import request from 'supertest';
const app = createApp();
// ─── Role Authorization Tests ───────────────────────────────────────────────
describe('Role Authorization', () => {
    // ── Admin Tenants Endpoint ────────────────────────────────────────────────
    describe('GET /api/admin/tenants', () => {
        it('kore_admin can GET /api/admin/tenants → 200 with data array', async () => {
            const { tokenKoreAdmin } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/admin/tenants')
                .set('Authorization', `Bearer ${tokenKoreAdmin}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
        it('tenant_admin cannot GET /api/admin/tenants → 403', async () => {
            const { tokenAdminA } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/admin/tenants')
                .set('Authorization', `Bearer ${tokenAdminA}`);
            expect(res.status).toBe(403);
        });
        it('learner cannot GET /api/admin/tenants → 403', async () => {
            const { tokenLearnerA } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/admin/tenants')
                .set('Authorization', `Bearer ${tokenLearnerA}`);
            expect(res.status).toBe(403);
        });
    });
    // ── Learner Access to Common Endpoints ────────────────────────────────────
    describe('Learner access to common endpoints', () => {
        it('learner can GET /api/auth/me → 200', async () => {
            const { tokenLearnerA } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${tokenLearnerA}`);
            expect(res.status).toBe(200);
            expect(res.body.user).toBeDefined();
        });
        it('learner can GET /api/orgchart → 200', async () => {
            const { tokenLearnerA } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/orgchart')
                .set('Authorization', `Bearer ${tokenLearnerA}`);
            expect(res.status).toBe(200);
            expect(res.body.users).toBeDefined();
        });
        it('learner can GET /api/messaging/conversations → 200', async () => {
            const { tokenLearnerA } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/messaging/conversations')
                .set('Authorization', `Bearer ${tokenLearnerA}`);
            expect(res.status).toBe(200);
            expect(res.body.conversations).toBeDefined();
        });
    });
    // ── Admin Stats Endpoint ──────────────────────────────────────────────────
    describe('GET /api/admin/tenants/stats', () => {
        it('kore_admin can GET /api/admin/tenants/stats → 200', async () => {
            const { tokenKoreAdmin } = await seedTwoTenants();
            const res = await request(app)
                .get('/api/admin/tenants/stats')
                .set('Authorization', `Bearer ${tokenKoreAdmin}`);
            expect(res.status).toBe(200);
            expect(res.body.totalTenants).toBeDefined();
        });
    });
    // ── Learner Cannot Access Branding ────────────────────────────────────────
    describe('Branding authorization', () => {
        it('learner cannot GET /api/admin/tenants/:tenantA.id/branding → 403', async () => {
            const { tenantA, tokenLearnerA } = await seedTwoTenants();
            const res = await request(app)
                .get(`/api/admin/tenants/${tenantA.id}/branding`)
                .set('Authorization', `Bearer ${tokenLearnerA}`);
            expect(res.status).toBe(403);
        });
    });
});
//# sourceMappingURL=roles.test.js.map