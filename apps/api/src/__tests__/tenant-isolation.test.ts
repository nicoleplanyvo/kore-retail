import '../__tests__/helpers/setup.js';
import { seedTwoTenants } from './helpers/setup.js';
import { createApp } from '../app.js';
import request from 'supertest';

const app = createApp();

// ─── Tenant Isolation Tests ─────────────────────────────────────────────────

describe('Tenant Isolation', () => {
  // ── Branding Isolation ────────────────────────────────────────────────────

  describe('Branding isolation', () => {
    it('tenant_admin A cannot PUT branding for tenant B → 403', async () => {
      const { tenantB, tokenAdminA } = await seedTwoTenants();

      const res = await request(app)
        .put(`/api/admin/tenants/${tenantB.id}/branding`)
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({ primaryColor: '#ff0000' });

      expect(res.status).toBe(403);
    });

    it('tenant_admin A can GET own tenant branding → 200', async () => {
      const { tenantA, tokenAdminA } = await seedTwoTenants();

      const res = await request(app)
        .get(`/api/admin/tenants/${tenantA.id}/branding`)
        .set('Authorization', `Bearer ${tokenAdminA}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(tenantA.id);
    });

    it('kore_admin can GET both tenants branding → 200', async () => {
      const { tenantA, tenantB, tokenKoreAdmin } = await seedTwoTenants();

      const [resA, resB] = await Promise.all([
        request(app)
          .get(`/api/admin/tenants/${tenantA.id}/branding`)
          .set('Authorization', `Bearer ${tokenKoreAdmin}`),
        request(app)
          .get(`/api/admin/tenants/${tenantB.id}/branding`)
          .set('Authorization', `Bearer ${tokenKoreAdmin}`),
      ]);

      expect(resA.status).toBe(200);
      expect(resA.body.id).toBe(tenantA.id);
      expect(resB.status).toBe(200);
      expect(resB.body.id).toBe(tenantB.id);
    });
  });

  // ── Orgchart Isolation ────────────────────────────────────────────────────

  describe('Orgchart isolation', () => {
    it('adminA GET /api/orgchart should NOT contain learnerB', async () => {
      const { learnerA, learnerB, tokenAdminA } = await seedTwoTenants();

      const res = await request(app)
        .get('/api/orgchart')
        .set('Authorization', `Bearer ${tokenAdminA}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toBeDefined();

      const userIds = res.body.users.map((u: { id: string }) => u.id);
      expect(userIds).toContain(learnerA.id);
      expect(userIds).not.toContain(learnerB.id);
    });
  });

  // ── Messaging Isolation ───────────────────────────────────────────────────

  describe('Messaging isolation', () => {
    it('adminA POST /api/messaging/conversations with learnerB id → 400', async () => {
      const { learnerB, tokenAdminA } = await seedTwoTenants();

      const res = await request(app)
        .post('/api/messaging/conversations')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({ participantIds: [learnerB.id] });

      expect(res.status).toBe(400);
    });
  });

  // ── Colleagues Isolation ──────────────────────────────────────────────────

  describe('Colleagues isolation', () => {
    it('adminA GET /api/profile/colleagues should contain learnerA, NOT learnerB', async () => {
      const { learnerA, learnerB, tokenAdminA } = await seedTwoTenants();

      const res = await request(app)
        .get('/api/profile/colleagues')
        .set('Authorization', `Bearer ${tokenAdminA}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const colleagueIds = res.body.map((u: { id: string }) => u.id);
      expect(colleagueIds).toContain(learnerA.id);
      expect(colleagueIds).not.toContain(learnerB.id);
    });
  });
});
