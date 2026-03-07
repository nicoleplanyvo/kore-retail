/**
 * app.js — CJS entry point for Phusion Passenger (Plesk)
 *
 * Passenger can't load ESM modules directly, so this CommonJS wrapper
 * uses dynamic import() to bootstrap the actual ESM application.
 * It also ensures the SQLite data directory and database schema exist.
 */

const fs = require('fs');
const path = require('path');

// ── 1. Ensure data directory exists for SQLite ──────────────────────
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('[KORE] Created data directory:', dataDir);
}

// ── 2. Auto-initialize database if empty ────────────────────────────
const dbPath = path.join(dataDir, 'kore.db');
if (!fs.existsSync(dbPath)) {
  console.log('[KORE] Database not found, creating schema...');
  try {
    // Use better-sqlite3 directly to create the database
    const Database = require(
      path.join(__dirname, 'apps/api/node_modules/better-sqlite3')
    );
    const db = new Database(dbPath);

    // Enable WAL mode for better concurrent performance
    db.pragma('journal_mode = WAL');

    // Create all tables and indexes
    db.exec(`
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'learner',
    "tenantId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "contactEmail" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "maxUsers" INTEGER NOT NULL DEFAULT 15,
    "logoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Store_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ToolDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "priceMonthly" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "StoreToolAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "config" TEXT,
    CONSTRAINT "StoreToolAssignment_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StoreToolAssignment_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ToolDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "UserStoreAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserStoreAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserStoreAssignment_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "cancelAtPeriod" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DataProcessingConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT NOT NULL,
    "revokedAt" DATETIME,
    "revokedBy" TEXT,
    "version" TEXT NOT NULL,
    "document" TEXT,
    CONSTRAINT "DataProcessingConsent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Prisma migrations table
CREATE TABLE "_prisma_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checksum" TEXT NOT NULL,
    "finished_at" DATETIME,
    "migration_name" TEXT NOT NULL,
    "logs" TEXT,
    "rolled_back_at" DATETIME,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
CREATE INDEX "Store_tenantId_idx" ON "Store"("tenantId");
CREATE UNIQUE INDEX "ToolDefinition_key_key" ON "ToolDefinition"("key");
CREATE INDEX "ToolDefinition_category_idx" ON "ToolDefinition"("category");
CREATE INDEX "StoreToolAssignment_storeId_idx" ON "StoreToolAssignment"("storeId");
CREATE INDEX "StoreToolAssignment_toolId_idx" ON "StoreToolAssignment"("toolId");
CREATE UNIQUE INDEX "StoreToolAssignment_storeId_toolId_key" ON "StoreToolAssignment"("storeId", "toolId");
CREATE INDEX "UserStoreAssignment_userId_idx" ON "UserStoreAssignment"("userId");
CREATE INDEX "UserStoreAssignment_storeId_idx" ON "UserStoreAssignment"("storeId");
CREATE UNIQUE INDEX "UserStoreAssignment_userId_storeId_key" ON "UserStoreAssignment"("userId", "storeId");
CREATE UNIQUE INDEX "Subscription_tenantId_key" ON "Subscription"("tenantId");
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
CREATE INDEX "DataProcessingConsent_tenantId_idx" ON "DataProcessingConsent"("tenantId");
CREATE UNIQUE INDEX "DataProcessingConsent_tenantId_consentType_key" ON "DataProcessingConsent"("tenantId", "consentType");
    `);

    db.close();
    console.log('[KORE] Database schema created successfully!');
  } catch (err) {
    console.error('[KORE] Failed to initialize database:', err.message);
  }
}

// ── 3. Bootstrap ESM application ────────────────────────────────────
(async () => {
  try {
    await import('./apps/api/dist/index.js');
  } catch (err) {
    console.error('[KORE] Failed to start server:', err);
    process.exit(1);
  }
})();
