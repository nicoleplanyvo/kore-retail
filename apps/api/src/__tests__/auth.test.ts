import '../__tests__/helpers/setup.js';
import { createTenant, createUser, tokenFor, seedTwoTenants, prisma } from './helpers/setup.js';
import { createApp } from '../app.js';
import request from 'supertest';
import crypto from 'crypto';

const app = createApp();

// Rate-limiting is per-IP and shared across tests (in-memory Map).
// Use unique X-Forwarded-For per describe-block to avoid cross-test 429s.
// The app has `trust proxy` enabled, so Express reads X-Forwarded-For as req.ip.

// ─── POST /api/auth/login ───────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  const ip = '10.0.1.1';

  it('returns 200 + accessToken + user with tenantBranding on valid credentials', async () => {
    const tenant = await createTenant('Acme Corp', 'acme');
    await createUser({
      email: 'alice@acme.com',
      name: 'Alice',
      role: 'store_manager',
      tenantId: tenant.id,
      password: 'securePass1',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: 'alice@acme.com', password: 'securePass1' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('alice@acme.com');
    expect(res.body.user.tenantBranding).toBeDefined();
    expect(res.body.user.tenantBranding.tenantName).toBe('Acme Corp');
  });

  it('returns 401 for wrong password', async () => {
    const tenant = await createTenant('Acme');
    await createUser({
      email: 'bob@acme.com',
      name: 'Bob',
      role: 'learner',
      tenantId: tenant.id,
      password: 'correctPassword',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: 'bob@acme.com', password: 'wrongPassword' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for nonexistent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: 'nobody@nowhere.com', password: 'whatever123' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for user with null passwordHash (pending invite)', async () => {
    const tenant = await createTenant('Acme');
    // Create user directly via prisma to have no passwordHash
    await prisma.user.create({
      data: {
        email: 'invited@acme.com',
        name: 'Invited User',
        role: 'learner',
        tenantId: tenant.id,
        passwordHash: null,
        isActive: true,
      },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: 'invited@acme.com', password: 'anyPassword1' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for inactive user', async () => {
    const tenant = await createTenant('Acme');
    await createUser({
      email: 'inactive@acme.com',
      name: 'Inactive User',
      role: 'learner',
      tenantId: tenant.id,
      password: 'securePass1',
      isActive: false,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: 'inactive@acme.com', password: 'securePass1' });

    expect(res.status).toBe(401);
  });
});

// ─── GET /api/auth/me ───────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  it('returns 200 + user data with a valid token', async () => {
    const tenant = await createTenant('Acme');
    const user = await createUser({
      email: 'me@acme.com',
      name: 'Me User',
      role: 'store_manager',
      tenantId: tenant.id,
    });

    const token = tokenFor(user);
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBe(user.id);
    expect(res.body.user.email).toBe('me@acme.com');
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});

// ─── POST /api/auth/forgot-password ─────────────────────────────────────────

describe('POST /api/auth/forgot-password', () => {
  const ip = '10.0.2.1';

  it('always returns 200 regardless of whether email exists', async () => {
    // Email that does not exist
    const res1 = await request(app)
      .post('/api/auth/forgot-password')
      .set('X-Forwarded-For', ip)
      .send({ email: 'ghost@nowhere.com' });

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);

    // Email that does exist
    const tenant = await createTenant('Acme');
    await createUser({
      email: 'real@acme.com',
      name: 'Real User',
      role: 'learner',
      tenantId: tenant.id,
    });

    const res2 = await request(app)
      .post('/api/auth/forgot-password')
      .set('X-Forwarded-For', ip)
      .send({ email: 'real@acme.com' });

    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
  });
});

// ─── POST /api/auth/reset-password ──────────────────────────────────────────

describe('POST /api/auth/reset-password', () => {
  const ip = '10.0.3.1';

  it('resets password with a valid token, then login works', async () => {
    const tenant = await createTenant('Acme');
    const user = await createUser({
      email: 'reset@acme.com',
      name: 'Reset User',
      role: 'learner',
      tenantId: tenant.id,
      password: 'oldPassword1',
    });

    const resetToken = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .set('X-Forwarded-For', ip)
      .send({ token: resetToken, password: 'newSecure1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify new password works for login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.3.10')
      .send({ email: 'reset@acme.com', password: 'newSecure1' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeDefined();

    // Verify old password no longer works
    const oldLoginRes = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.3.11')
      .send({ email: 'reset@acme.com', password: 'oldPassword1' });

    expect(oldLoginRes.status).toBe(401);
  });

  it('returns 400 for expired token', async () => {
    const tenant = await createTenant('Acme');
    const user = await createUser({
      email: 'expired@acme.com',
      name: 'Expired User',
      role: 'learner',
      tenantId: tenant.id,
    });

    const resetToken = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .set('X-Forwarded-For', ip)
      .send({ token: resetToken, password: 'newSecure1' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for already-used token', async () => {
    const tenant = await createTenant('Acme');
    const user = await createUser({
      email: 'used@acme.com',
      name: 'Used Token User',
      role: 'learner',
      tenantId: tenant.id,
    });

    const resetToken = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        usedAt: new Date(), // already used
      },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .set('X-Forwarded-For', ip)
      .send({ token: resetToken, password: 'newSecure1' });

    expect(res.status).toBe(400);
  });
});

// ─── POST /api/auth/accept-invite ───────────────────────────────────────────

describe('POST /api/auth/accept-invite', () => {
  const ip = '10.0.4.1';

  it('activates user and returns accessToken on valid invite token', async () => {
    const tenant = await createTenant('Acme');
    // Create user with no password and inactive
    const user = await prisma.user.create({
      data: {
        email: 'newbie@acme.com',
        name: 'Newbie',
        role: 'learner',
        tenantId: tenant.id,
        passwordHash: null,
        isActive: false,
      },
    });

    const inviteToken = crypto.randomUUID();
    await prisma.invitationToken.create({
      data: {
        token: inviteToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    const res = await request(app)
      .post('/api/auth/accept-invite')
      .set('X-Forwarded-For', ip)
      .send({ token: inviteToken, password: 'myNewPass1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('newbie@acme.com');

    // Verify user can now log in
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.4.10')
      .send({ email: 'newbie@acme.com', password: 'myNewPass1' });

    expect(loginRes.status).toBe(200);
  });

  it('returns 400 for expired invite token', async () => {
    const tenant = await createTenant('Acme');
    const user = await prisma.user.create({
      data: {
        email: 'expired-invite@acme.com',
        name: 'Expired Invite',
        role: 'learner',
        tenantId: tenant.id,
        passwordHash: null,
        isActive: false,
      },
    });

    const inviteToken = crypto.randomUUID();
    await prisma.invitationToken.create({
      data: {
        token: inviteToken,
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000), // expired
      },
    });

    const res = await request(app)
      .post('/api/auth/accept-invite')
      .set('X-Forwarded-For', ip)
      .send({ token: inviteToken, password: 'myNewPass1' });

    expect(res.status).toBe(400);
  });
});

// ─── PUT /api/auth/change-password ──────────────────────────────────────────

describe('PUT /api/auth/change-password', () => {
  it('changes password with correct current password', async () => {
    const tenant = await createTenant('Acme');
    const user = await createUser({
      email: 'changepw@acme.com',
      name: 'ChangePW User',
      role: 'learner',
      tenantId: tenant.id,
      password: 'currentPw1',
    });

    const token = tokenFor(user);
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'currentPw1', newPassword: 'brandNew12' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify new password works
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.5.1')
      .send({ email: 'changepw@acme.com', password: 'brandNew12' });

    expect(loginRes.status).toBe(200);
  });

  it('returns 401 for wrong current password', async () => {
    const tenant = await createTenant('Acme');
    const user = await createUser({
      email: 'wrongcur@acme.com',
      name: 'WrongCur User',
      role: 'learner',
      tenantId: tenant.id,
      password: 'realCurrent1',
    });

    const token = tokenFor(user);
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'wrongGuess1', newPassword: 'brandNew12' });

    expect(res.status).toBe(401);
  });
});

// ─── POST /api/auth/impersonate ─────────────────────────────────────────────

describe('POST /api/auth/impersonate', () => {
  it('kore_admin can impersonate another user', async () => {
    const { koreAdmin, learnerA, tokenKoreAdmin } = await seedTwoTenants();

    const res = await request(app)
      .post('/api/auth/impersonate')
      .set('Authorization', `Bearer ${tokenKoreAdmin}`)
      .send({ userId: learnerA.id });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBe(learnerA.id);
    expect(res.body.user.impersonatedBy).toBe(koreAdmin.id);
  });

  it('tenant_admin gets 403 when trying to impersonate', async () => {
    const { learnerA, tokenAdminA } = await seedTwoTenants();

    const res = await request(app)
      .post('/api/auth/impersonate')
      .set('Authorization', `Bearer ${tokenAdminA}`)
      .send({ userId: learnerA.id });

    expect(res.status).toBe(403);
  });
});
