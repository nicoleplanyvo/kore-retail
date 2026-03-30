// Set env vars BEFORE any imports that read them at module load time
process.env['DATABASE_URL'] = 'file:./test.db';
process.env['JWT_SECRET'] = 'test-jwt-secret-that-is-long-enough-for-validation';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-that-is-long-enough-for-validation';
process.env['NODE_ENV'] = 'test';

import { beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma.js';
import { signAccessToken } from '../../lib/jwt.js';

export { prisma };

// ── Table truncation order (children before parents) ─────────────────────────
// We disable FK checks so we can truncate in any order without errors.
async function truncateAll(): Promise<void> {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF');
  try {
    // Messaging
    await prisma.$executeRawUnsafe('DELETE FROM "DirectMessage"');
    await prisma.$executeRawUnsafe('DELETE FROM "ConversationParticipant"');
    await prisma.$executeRawUnsafe('DELETE FROM "Conversation"');

    // Auth tokens
    await prisma.$executeRawUnsafe('DELETE FROM "InvitationToken"');
    await prisma.$executeRawUnsafe('DELETE FROM "PasswordResetToken"');

    // Assignments
    await prisma.$executeRawUnsafe('DELETE FROM "UserStoreAssignment"');
    await prisma.$executeRawUnsafe('DELETE FROM "UserRegionAssignment"');
    await prisma.$executeRawUnsafe('DELETE FROM "StoreToolAssignment"');

    // Store Excellence Audit
    await prisma.$executeRawUnsafe('DELETE FROM "AuditResponse"');
    await prisma.$executeRawUnsafe('DELETE FROM "AuditSession"');
    await prisma.$executeRawUnsafe('DELETE FROM "AuditCriterion"');
    await prisma.$executeRawUnsafe('DELETE FROM "AuditCategory"');
    await prisma.$executeRawUnsafe('DELETE FROM "AuditTemplate"');

    // Checklisten
    await prisma.$executeRawUnsafe('DELETE FROM "ChecklistEntry"');
    await prisma.$executeRawUnsafe('DELETE FROM "ChecklistSession"');
    await prisma.$executeRawUnsafe('DELETE FROM "ChecklistItem"');
    await prisma.$executeRawUnsafe('DELETE FROM "ChecklistSection"');
    await prisma.$executeRawUnsafe('DELETE FROM "ChecklistTemplate"');

    // SOP
    await prisma.$executeRawUnsafe('DELETE FROM "SopAcknowledgment"');
    await prisma.$executeRawUnsafe('DELETE FROM "Sop"');
    await prisma.$executeRawUnsafe('DELETE FROM "SopCategory"');

    // VM Compliance
    await prisma.$executeRawUnsafe('DELETE FROM "VmSubmission"');
    await prisma.$executeRawUnsafe('DELETE FROM "VmGuidelineImage"');
    await prisma.$executeRawUnsafe('DELETE FROM "VmGuidelineDoc"');
    await prisma.$executeRawUnsafe('DELETE FROM "VmGuideline"');

    // Store Standards
    await prisma.$executeRawUnsafe('DELETE FROM "StandardScore"');
    await prisma.$executeRawUnsafe('DELETE FROM "StandardEvaluation"');
    await prisma.$executeRawUnsafe('DELETE FROM "StandardDefinition"');
    await prisma.$executeRawUnsafe('DELETE FROM "StandardCategory"');

    // KPI Dashboard
    await prisma.$executeRawUnsafe('DELETE FROM "KpiEntry"');

    // Budget Tracker
    await prisma.$executeRawUnsafe('DELETE FROM "BudgetActual"');
    await prisma.$executeRawUnsafe('DELETE FROM "BudgetPeriod"');
    await prisma.$executeRawUnsafe('DELETE FROM "BudgetScenario"');

    // Forecast
    await prisma.$executeRawUnsafe('DELETE FROM "Forecast"');

    // Loss Prevention
    await prisma.$executeRawUnsafe('DELETE FROM "LossIncident"');

    // Inventory
    await prisma.$executeRawUnsafe('DELETE FROM "InventoryItem"');
    await prisma.$executeRawUnsafe('DELETE FROM "InventoryCount"');

    // Live Floor
    await prisma.$executeRawUnsafe('DELETE FROM "FloorStaffPosition"');
    await prisma.$executeRawUnsafe('DELETE FROM "FloorFrequencyLog"');
    await prisma.$executeRawUnsafe('DELETE FROM "FootfallEntry"');
    await prisma.$executeRawUnsafe('DELETE FROM "FloorZone"');

    // FR Tracking / Conversion
    await prisma.$executeRawUnsafe('DELETE FROM "FRSession"');
    await prisma.$executeRawUnsafe('DELETE FROM "FRRoom"');
    await prisma.$executeRawUnsafe('DELETE FROM "FRSettings"');
    await prisma.$executeRawUnsafe('DELETE FROM "ConversionGoal"');

    // Maintenance
    await prisma.$executeRawUnsafe('DELETE FROM "MaintenanceRequest"');

    // Training Hub
    await prisma.$executeRawUnsafe('DELETE FROM "TrainingLog"');
    await prisma.$executeRawUnsafe('DELETE FROM "Certificate"');
    await prisma.$executeRawUnsafe('DELETE FROM "CourseEnrollment"');
    await prisma.$executeRawUnsafe('DELETE FROM "CourseModule"');
    await prisma.$executeRawUnsafe('DELETE FROM "Course"');

    // Challenges
    await prisma.$executeRawUnsafe('DELETE FROM "ChallengeVote"');
    await prisma.$executeRawUnsafe('DELETE FROM "ChallengeEntry"');
    await prisma.$executeRawUnsafe('DELETE FROM "ChallengeParticipant"');
    await prisma.$executeRawUnsafe('DELETE FROM "Challenge"');

    // Onboarding
    await prisma.$executeRawUnsafe('DELETE FROM "OnboardingProgress"');
    await prisma.$executeRawUnsafe('DELETE FROM "OnboardingJourney"');
    await prisma.$executeRawUnsafe('DELETE FROM "OnboardingStep"');
    await prisma.$executeRawUnsafe('DELETE FROM "OnboardingTemplate"');

    // Coaching
    await prisma.$executeRawUnsafe('DELETE FROM "CoachingSession"');
    await prisma.$executeRawUnsafe('DELETE FROM "CoachingTemplate"');

    // PDP / PIP
    await prisma.$executeRawUnsafe('DELETE FROM "DevelopmentReview"');
    await prisma.$executeRawUnsafe('DELETE FROM "DevelopmentGoal"');
    await prisma.$executeRawUnsafe('DELETE FROM "DevelopmentPlan"');

    // Appraisals
    await prisma.$executeRawUnsafe('DELETE FROM "Appraisal"');
    await prisma.$executeRawUnsafe('DELETE FROM "AppraisalCycle"');

    // Shift Planning
    await prisma.$executeRawUnsafe('DELETE FROM "ShiftSwapRequest"');
    await prisma.$executeRawUnsafe('DELETE FROM "ShiftTimeEntry"');
    await prisma.$executeRawUnsafe('DELETE FROM "ShiftAvailability"');
    await prisma.$executeRawUnsafe('DELETE FROM "ShiftEntry"');
    await prisma.$executeRawUnsafe('DELETE FROM "ShiftWeekStatus"');
    await prisma.$executeRawUnsafe('DELETE FROM "ShiftTemplate"');

    // Pulse Survey
    await prisma.$executeRawUnsafe('DELETE FROM "PulseAnswer"');
    await prisma.$executeRawUnsafe('DELETE FROM "PulseResponse"');
    await prisma.$executeRawUnsafe('DELETE FROM "PulseQuestion"');
    await prisma.$executeRawUnsafe('DELETE FROM "PulseSurvey"');

    // Wellbeing
    await prisma.$executeRawUnsafe('DELETE FROM "WellbeingCheckIn"');
    await prisma.$executeRawUnsafe('DELETE FROM "WellbeingResource"');

    // Briefings
    await prisma.$executeRawUnsafe('DELETE FROM "BriefingAcknowledgment"');
    await prisma.$executeRawUnsafe('DELETE FROM "Briefing"');

    // Handover
    await prisma.$executeRawUnsafe('DELETE FROM "Handover"');

    // Team Push
    await prisma.$executeRawUnsafe('DELETE FROM "TeamMessageRead"');
    await prisma.$executeRawUnsafe('DELETE FROM "TeamMessage"');

    // Newsletter
    await prisma.$executeRawUnsafe('DELETE FROM "NewsletterView"');
    await prisma.$executeRawUnsafe('DELETE FROM "NewsletterSection"');
    await prisma.$executeRawUnsafe('DELETE FROM "Newsletter"');

    // Clienteling
    await prisma.$executeRawUnsafe('DELETE FROM "ClientTask"');
    await prisma.$executeRawUnsafe('DELETE FROM "ClientInteraction"');
    await prisma.$executeRawUnsafe('DELETE FROM "ClientAppointment"');
    await prisma.$executeRawUnsafe('DELETE FROM "ClientProfile"');

    // Stock Callouts / Orders
    await prisma.$executeRawUnsafe('DELETE FROM "OrderStatusUpdate"');
    await prisma.$executeRawUnsafe('DELETE FROM "CustomerOrder"');
    await prisma.$executeRawUnsafe('DELETE FROM "StockCallout"');

    // Blog
    await prisma.$executeRawUnsafe('DELETE FROM "BlogPost"');

    // GDPR
    await prisma.$executeRawUnsafe('DELETE FROM "DataProcessingConsent"');
    await prisma.$executeRawUnsafe('DELETE FROM "AuditLog"');

    // Subscription
    await prisma.$executeRawUnsafe('DELETE FROM "Subscription"');

    // Core entities (order matters: users before tenants, stores, regions)
    await prisma.$executeRawUnsafe('DELETE FROM "User"');
    await prisma.$executeRawUnsafe('DELETE FROM "Store"');
    await prisma.$executeRawUnsafe('DELETE FROM "Region"');
    await prisma.$executeRawUnsafe('DELETE FROM "ToolDefinition"');
    await prisma.$executeRawUnsafe('DELETE FROM "Tenant"');
  } finally {
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
  }
}

beforeEach(async () => {
  await truncateAll();
});

// ── Helper: createTenant ──────────────────────────────────────────────────────

export async function createTenant(name: string, slug?: string) {
  const derivedSlug = slug ?? name.toLowerCase().replace(/\s+/g, '-');
  return prisma.tenant.create({
    data: { name, slug: derivedSlug },
  });
}

// ── Helper: createUser ────────────────────────────────────────────────────────

export interface CreateUserOptions {
  email: string;
  name: string;
  role: string;
  tenantId?: string;
  password?: string;
  isActive?: boolean;
}

export async function createUser(opts: CreateUserOptions) {
  const passwordHash = await bcrypt.hash(opts.password ?? 'password123', 4);
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

// ── Helper: tokenFor ──────────────────────────────────────────────────────────

export function tokenFor(
  user: { id: string; tenantId: string | null; role: string },
  impersonatedBy?: string,
): string {
  return signAccessToken({
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
    ...(impersonatedBy ? { impersonatedBy } : {}),
  });
}

// ── Helper: seedTwoTenants ────────────────────────────────────────────────────

export async function seedTwoTenants() {
  const [tenantA, tenantB] = await Promise.all([
    createTenant('Tenant Alpha', 'tenant-alpha'),
    createTenant('Tenant Beta', 'tenant-beta'),
  ]);

  const [adminA, learnerA, adminB, learnerB, koreAdmin] = await Promise.all([
    createUser({
      email: 'admin-a@example.com',
      name: 'Admin A',
      role: 'tenant_admin',
      tenantId: tenantA.id,
    }),
    createUser({
      email: 'learner-a@example.com',
      name: 'Learner A',
      role: 'learner',
      tenantId: tenantA.id,
    }),
    createUser({
      email: 'admin-b@example.com',
      name: 'Admin B',
      role: 'tenant_admin',
      tenantId: tenantB.id,
    }),
    createUser({
      email: 'learner-b@example.com',
      name: 'Learner B',
      role: 'learner',
      tenantId: tenantB.id,
    }),
    createUser({
      email: 'kore-admin@example.com',
      name: 'KORE Admin',
      role: 'kore_admin',
      tenantId: null,
    }),
  ]);

  return {
    tenantA,
    tenantB,
    adminA,
    learnerA,
    adminB,
    learnerB,
    koreAdmin,
    tokenAdminA: tokenFor(adminA),
    tokenLearnerA: tokenFor(learnerA),
    tokenAdminB: tokenFor(adminB),
    tokenLearnerB: tokenFor(learnerB),
    tokenKoreAdmin: tokenFor(koreAdmin),
  };
}
