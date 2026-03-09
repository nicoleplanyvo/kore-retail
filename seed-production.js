/**
 * seed-production.js — CJS Seed-Script für die Produktions-Datenbank
 *
 * Kann direkt mit `node seed-production.js` auf dem Server ausgeführt werden.
 * Verwendet better-sqlite3 direkt (kein Prisma, kein TypeScript nötig).
 */

const path = require('path');
const crypto = require('crypto');

// ── better-sqlite3 laden ──────────────────────────
const Database = require(
  path.join(__dirname, 'apps/api/node_modules/better-sqlite3')
);

// ── bcryptjs laden ────────────────────────────────
const bcrypt = require(
  path.join(__dirname, 'apps/api/node_modules/bcryptjs')
);

// ── Datenbank öffnen ──────────────────────────────
const dbPath = path.join(__dirname, 'data', 'kore.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function uuid() {
  return crypto.randomUUID();
}

console.log('══════════════════════════════════════════════');
console.log('  KORE — Produktions-Datenbank Seed');
console.log('══════════════════════════════════════════════');
console.log(`  DB: ${dbPath}`);
console.log('');

// ── 1. KORE Admin User ───────────────────────────
const adminHash = bcrypt.hashSync('admin1234', 12);
const now = new Date().toISOString();

const existingAdmin = db.prepare('SELECT id FROM "User" WHERE email = ?').get('admin@kore-retail.de');
if (!existingAdmin) {
  db.prepare(`
    INSERT INTO "User" (id, email, name, "passwordHash", role, "isActive", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, 1, ?, ?)
  `).run(uuid(), 'admin@kore-retail.de', 'KORE Admin', adminHash, 'kore_admin', now, now);
  console.log('✓ Admin User erstellt: admin@kore-retail.de (Passwort: admin1234)');
} else {
  console.log('→ Admin User existiert bereits');
}

// ── 2. Demo-Tenants ──────────────────────────────
function upsertTenant(slug, data) {
  const existing = db.prepare('SELECT id FROM "Tenant" WHERE slug = ?').get(slug);
  if (existing) {
    console.log(`  → Tenant "${data.name}" existiert bereits`);
    return existing.id;
  }
  const id = uuid();
  db.prepare(`
    INSERT INTO "Tenant" (id, name, slug, status, "contactEmail", "contactName", "contactPhone", "maxUsers", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.name, slug, data.status || 'ACTIVE', data.contactEmail, data.contactName, data.contactPhone, data.maxUsers || 15, now, now);
  return id;
}

const tenant1Id = upsertTenant('modehouse-mueller', {
  name: 'Modehouse Müller',
  contactEmail: 'info@modehouse-mueller.de',
  contactName: 'Thomas Müller',
  contactPhone: '+49 211 1234567',
  maxUsers: 50,
});

const tenant2Id = upsertTenant('boutique-schmidt', {
  name: 'Boutique Schmidt',
  contactEmail: 'kontakt@boutique-schmidt.de',
  contactName: 'Anna Schmidt',
  contactPhone: '+49 221 7654321',
  maxUsers: 15,
});

const tenant3Id = upsertTenant('luxus-retail-gmbh', {
  name: 'Luxus Retail GmbH',
  status: 'TRIALING',
  contactEmail: 'management@luxus-retail.de',
  contactName: 'Dr. Markus Weber',
  contactPhone: '+49 89 9876543',
  maxUsers: 200,
});

console.log('✓ Demo-Tenants erstellt');

// ── 3. Demo-Stores ───────────────────────────────
function upsertStore(tenantId, name, city, address) {
  const existing = db.prepare('SELECT id FROM "Store" WHERE "tenantId" = ? AND name = ?').get(tenantId, name);
  if (existing) return existing.id;
  const id = uuid();
  db.prepare(`
    INSERT INTO "Store" (id, "tenantId", name, city, address, "isActive", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, 1, ?, ?)
  `).run(id, tenantId, name, city, address, now, now);
  return id;
}

const stores = [
  // Modehouse Müller — 3 Filialen
  { tenantId: tenant1Id, name: 'Düsseldorf Kö', city: 'Düsseldorf', address: 'Königsallee 42' },
  { tenantId: tenant1Id, name: 'Köln Schildergasse', city: 'Köln', address: 'Schildergasse 88' },
  { tenantId: tenant1Id, name: 'Essen Limbecker', city: 'Essen', address: 'Limbecker Platz 1' },
  // Boutique Schmidt — 1 Filiale
  { tenantId: tenant2Id, name: 'Flagship Ehrenfeld', city: 'Köln', address: 'Venloer Str. 201' },
  // Luxus Retail GmbH — 5 Filialen
  { tenantId: tenant3Id, name: 'München Maximilianstr.', city: 'München', address: 'Maximilianstr. 10' },
  { tenantId: tenant3Id, name: 'Berlin KaDeWe', city: 'Berlin', address: 'Tauentzienstr. 21' },
  { tenantId: tenant3Id, name: 'Hamburg Neuer Wall', city: 'Hamburg', address: 'Neuer Wall 35' },
  { tenantId: tenant3Id, name: 'Frankfurt Goethestr.', city: 'Frankfurt', address: 'Goethestr. 12' },
  { tenantId: tenant3Id, name: 'Stuttgart Königstr.', city: 'Stuttgart', address: 'Königstr. 28' },
];

const storeIds = stores.map(s => upsertStore(s.tenantId, s.name, s.city, s.address));
const muellerStoreIds = storeIds.slice(0, 3);
const schmidtStoreIds = storeIds.slice(3, 4);
const luxusStoreIds = storeIds.slice(4, 9);

console.log(`✓ ${stores.length} Stores erstellt`);

// ── 4. Tool-Definitionen ─────────────────────────
const tools = [
  // STANDARDS & COMPLIANCE
  { key: 'standards.checklisten', name: 'Checklisten', category: 'STANDARDS_COMPLIANCE', description: 'Standardisierte Checklisten für Store-Visits und Audits', icon: 'ClipboardCheck', priceMonthly: 1500, sortOrder: 1 },
  { key: 'standards.store_standards', name: 'Store Standards', category: 'STANDARDS_COMPLIANCE', description: 'Store-Standards definieren, messen und benchmarken', icon: 'Award', priceMonthly: 1500, sortOrder: 2 },
  { key: 'standards.excellence_tracker', name: 'Excellence Tracker', category: 'STANDARDS_COMPLIANCE', description: 'Fortlaufendes Tracking von Store-Excellence-KPIs', icon: 'TrendingUp', priceMonthly: 1900, sortOrder: 3 },
  { key: 'standards.vm_foto_compliance', name: 'VM Foto-Compliance', category: 'STANDARDS_COMPLIANCE', description: 'Foto-basierte VM-Compliance-Checks', icon: 'Camera', priceMonthly: 1900, sortOrder: 4 },
  { key: 'standards.sop_bibliothek', name: 'SOP Bibliothek', category: 'STANDARDS_COMPLIANCE', description: 'Zentrale Verwaltung aller Standard Operating Procedures', icon: 'BookOpen', priceMonthly: 1500, sortOrder: 5 },
  // PERFORMANCE
  { key: 'performance.kpi_dashboard', name: 'KPI Dashboard', category: 'PERFORMANCE', description: 'Echtzeit-KPI-Dashboard mit relevanten Kennzahlen', icon: 'BarChart3', priceMonthly: 1900, sortOrder: 1 },
  { key: 'performance.budget_tracker', name: 'Budget Tracker', category: 'PERFORMANCE', description: 'Budget-Planung und Kostenverfolgung pro Store', icon: 'Wallet', priceMonthly: 1500, sortOrder: 2 },
  { key: 'performance.forecast', name: 'Forecast', category: 'PERFORMANCE', description: 'Umsatz- und Performance-Prognosen', icon: 'LineChart', priceMonthly: 2500, sortOrder: 3 },
  { key: 'performance.loss_prevention', name: 'Loss Prevention', category: 'PERFORMANCE', description: 'Schwund-Erkennung und Verlustprävention', icon: 'Shield', priceMonthly: 1500, sortOrder: 4 },
  { key: 'performance.inventory', name: 'Inventory', category: 'PERFORMANCE', description: 'Bestandsmanagement und Inventur-Automatisierung', icon: 'Package', priceMonthly: 1900, sortOrder: 5 },
  // FLOOR
  { key: 'floor.live_floor', name: 'Live Floor', category: 'FLOOR', description: 'Echtzeit-Überblick über Verkaufsfläche und Personal', icon: 'Monitor', priceMonthly: 1900, sortOrder: 1 },
  { key: 'floor.fr_tracking', name: 'FR Tracking', category: 'FLOOR', description: 'Footfall & Revenue Tracking in Echtzeit', icon: 'Activity', priceMonthly: 1900, sortOrder: 2 },
  { key: 'floor.vm_guidelines', name: 'VM Guidelines', category: 'FLOOR', description: 'Visual-Merchandising-Richtlinien digital verwalten', icon: 'Palette', priceMonthly: 1500, sortOrder: 3 },
  { key: 'floor.maintenance', name: 'Maintenance', category: 'FLOOR', description: 'Store-Wartung und Reparatur-Management', icon: 'Wrench', priceMonthly: 1000, sortOrder: 4 },
  // TRAINING
  { key: 'training.training_hub_lms', name: 'Training Hub / LMS', category: 'TRAINING', description: 'Learning-Management-System mit Kursen', icon: 'GraduationCap', priceMonthly: 2500, sortOrder: 1 },
  { key: 'training.training_hours', name: 'Training Hours', category: 'TRAINING', description: 'Trainingszeiten erfassen und analysieren', icon: 'Clock', priceMonthly: 1000, sortOrder: 2 },
  { key: 'training.challenges', name: 'Challenges', category: 'TRAINING', description: 'Team-Challenges und Gamification', icon: 'Trophy', priceMonthly: 1900, sortOrder: 3 },
  { key: 'training.onboarding', name: 'Onboarding', category: 'TRAINING', description: 'Strukturiertes Onboarding neuer Mitarbeiter', icon: 'UserPlus', priceMonthly: 1900, sortOrder: 4 },
  // COACHING & PEOPLE
  { key: 'coaching.one_on_one', name: '1:1 Coaching', category: 'COACHING_PEOPLE', description: 'Strukturierte 1:1-Coaching-Sessions', icon: 'MessageSquare', priceMonthly: 1900, sortOrder: 1 },
  { key: 'coaching.pdp_pip', name: 'PDP / PIP', category: 'COACHING_PEOPLE', description: 'Personal Development & Performance Plans', icon: 'Compass', priceMonthly: 1500, sortOrder: 2 },
  { key: 'coaching.appraisals', name: 'Appraisals', category: 'COACHING_PEOPLE', description: 'Mitarbeitergespräche und Leistungsbeurteilungen', icon: 'Star', priceMonthly: 1500, sortOrder: 3 },
  { key: 'coaching.shift_planning', name: 'Shift Planning', category: 'COACHING_PEOPLE', description: 'Intelligente Schichtplanung und Personalabdeckung', icon: 'CalendarDays', priceMonthly: 2500, sortOrder: 4 },
  { key: 'coaching.pulse_survey', name: 'Pulse Survey', category: 'COACHING_PEOPLE', description: 'Regelmäßige Mitarbeiter-Pulsbefragungen', icon: 'Heart', priceMonthly: 1500, sortOrder: 5 },
  { key: 'coaching.wellbeing', name: 'Wellbeing', category: 'COACHING_PEOPLE', description: 'Mitarbeiter-Wellbeing-Tracking und Ressourcen', icon: 'Smile', priceMonthly: 1500, sortOrder: 6 },
  // KOMMUNIKATION
  { key: 'komm.briefings', name: 'Briefings', category: 'KOMMUNIKATION', description: 'Tägliche Store-Briefings digital verteilen', icon: 'FileText', priceMonthly: 1000, sortOrder: 1 },
  { key: 'komm.handover', name: 'Handover', category: 'KOMMUNIKATION', description: 'Schichtübergabe-Protokolle digital', icon: 'ArrowLeftRight', priceMonthly: 1000, sortOrder: 2 },
  { key: 'komm.team_push', name: 'Team Push', category: 'KOMMUNIKATION', description: 'Push-Nachrichten an Store-Teams', icon: 'Bell', priceMonthly: 1000, sortOrder: 3 },
  { key: 'komm.team_newsletter', name: 'Team Newsletter', category: 'KOMMUNIKATION', description: 'Interne Newsletter für Teams', icon: 'Mail', priceMonthly: 1500, sortOrder: 4 },
  // CUSTOMER & STOCK
  { key: 'customer.fr_conversion', name: 'FR Conversion', category: 'CUSTOMER_STOCK', description: 'Footfall-to-Revenue Conversion', icon: 'TrendingUp', priceMonthly: 1900, sortOrder: 1 },
  { key: 'customer.clienteling_crm', name: 'Clienteling / CRM', category: 'CUSTOMER_STOCK', description: 'Kundenbeziehungsmanagement und VIP-Betreuung', icon: 'Users', priceMonthly: 2500, sortOrder: 2 },
  { key: 'customer.stock_callouts', name: 'Stock Callouts', category: 'CUSTOMER_STOCK', description: 'Bestandsmeldungen und Nachbestellungen', icon: 'PackageSearch', priceMonthly: 1500, sortOrder: 3 },
  { key: 'customer.track_trace', name: 'Track & Trace', category: 'CUSTOMER_STOCK', description: 'Warenverfolgung und Lieferstatus', icon: 'Navigation', priceMonthly: 1900, sortOrder: 4 },
  // REGIONAL
  { key: 'regional.multi_store_view', name: 'Multi-Store View', category: 'REGIONAL_INSIGHTS', description: 'Vergleichende Ansicht aller Stores', icon: 'Map', priceMonthly: 3500, sortOrder: 1 },
  { key: 'regional.rm_dashboard', name: 'RM Dashboard', category: 'REGIONAL_INSIGHTS', description: 'Regional-Manager-Dashboard mit KPIs', icon: 'LayoutDashboard', priceMonthly: 2500, sortOrder: 2 },
];

const upsertTool = db.prepare(`
  INSERT INTO "ToolDefinition" (id, key, name, description, category, icon, "priceMonthly", "isActive", "sortOrder", "createdAt", "updatedAt")
  VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
  ON CONFLICT (key) DO UPDATE SET
    name = excluded.name,
    description = excluded.description,
    category = excluded.category,
    icon = excluded.icon,
    "priceMonthly" = excluded."priceMonthly",
    "sortOrder" = excluded."sortOrder",
    "updatedAt" = excluded."updatedAt"
`);

for (const t of tools) {
  upsertTool.run(uuid(), t.key, t.name, t.description, t.category, t.icon, t.priceMonthly, t.sortOrder, now, now);
}
console.log(`✓ ${tools.length} Tool-Definitionen erstellt`);

// ── 5. Tool-Zuweisungen pro Store ────────────────
// Alle Tool-IDs laden
const allTools = db.prepare('SELECT id, key FROM "ToolDefinition"').all();
const toolMap = {};
for (const t of allTools) toolMap[t.key] = t.id;

function assignTools(storeIdList, toolKeys) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO "StoreToolAssignment" (id, "storeId", "toolId", "isActive", "assignedAt")
    VALUES (?, ?, ?, 1, ?)
  `);
  for (const storeId of storeIdList) {
    for (const key of toolKeys) {
      const toolId = toolMap[key];
      if (!toolId) continue;
      insert.run(uuid(), storeId, toolId, now);
    }
  }
}

// Modehouse Müller — 12 Tools
assignTools(muellerStoreIds, [
  'standards.checklisten', 'standards.store_standards', 'standards.excellence_tracker',
  'performance.kpi_dashboard', 'performance.budget_tracker',
  'floor.live_floor', 'floor.vm_guidelines',
  'training.training_hub_lms', 'training.training_hours',
  'coaching.shift_planning', 'coaching.appraisals',
  'komm.briefings',
]);

// Boutique Schmidt — 5 Tools
assignTools(schmidtStoreIds, [
  'standards.checklisten',
  'performance.kpi_dashboard',
  'training.training_hub_lms',
  'coaching.shift_planning',
  'komm.briefings',
]);

// Luxus Retail — 24 Tools
assignTools(luxusStoreIds, [
  'standards.checklisten', 'standards.store_standards', 'standards.excellence_tracker', 'standards.vm_foto_compliance', 'standards.sop_bibliothek',
  'performance.kpi_dashboard', 'performance.budget_tracker', 'performance.forecast', 'performance.inventory',
  'floor.live_floor', 'floor.fr_tracking', 'floor.vm_guidelines',
  'training.training_hub_lms', 'training.challenges', 'training.onboarding',
  'coaching.one_on_one', 'coaching.appraisals', 'coaching.shift_planning', 'coaching.pulse_survey',
  'customer.clienteling_crm', 'customer.fr_conversion', 'customer.stock_callouts',
  'regional.multi_store_view', 'regional.rm_dashboard',
]);

console.log('✓ Store-Tool-Zuweisungen erstellt');

// ── 6. Demo-User ─────────────────────────────────
const demoHash = bcrypt.hashSync('demo1234', 12);

function upsertUser(email, name, role, tenantId, assignedStoreIds) {
  let userId;
  const existing = db.prepare('SELECT id FROM "User" WHERE email = ?').get(email);
  if (existing) {
    userId = existing.id;
  } else {
    userId = uuid();
    db.prepare(`
      INSERT INTO "User" (id, email, name, "passwordHash", role, "tenantId", "isActive", "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(userId, email, name, demoHash, role, tenantId, now, now);
  }

  // Store-Zuweisungen
  const insertAssign = db.prepare(`
    INSERT OR IGNORE INTO "UserStoreAssignment" (id, "userId", "storeId", "assignedAt")
    VALUES (?, ?, ?, ?)
  `);
  for (const storeId of assignedStoreIds) {
    insertAssign.run(uuid(), userId, storeId, now);
  }
  return userId;
}

upsertUser('ta@modehouse.de', 'Thomas Müller (Admin)', 'tenant_admin', tenant1Id, muellerStoreIds);
upsertUser('rm@modehouse.de', 'Regina Meyer (Regional)', 'regional_manager', tenant1Id, muellerStoreIds);
upsertUser('mm@modehouse.de', 'Marco Müller (Multisite)', 'multisite_manager', tenant1Id, muellerStoreIds.slice(0, 2));
upsertUser('sm@modehouse.de', 'Sarah Klein (Store)', 'store_manager', tenant1Id, muellerStoreIds.slice(0, 1));
upsertUser('learner@modehouse.de', 'Lisa Becker (Mitarbeiter)', 'learner', tenant1Id, muellerStoreIds.slice(0, 1));

console.log('✓ 5 Demo-User erstellt (Passwort: demo1234)');
console.log('  • ta@modehouse.de (Tenant Admin)');
console.log('  • rm@modehouse.de (Regional Manager)');
console.log('  • mm@modehouse.de (Multisite Manager)');
console.log('  • sm@modehouse.de (Store Manager)');
console.log('  • learner@modehouse.de (Learner)');

// ── Fertig ───────────────────────────────────────
db.close();
console.log('');
console.log('══════════════════════════════════════════════');
console.log('  ✓ Seed abgeschlossen!');
console.log('══════════════════════════════════════════════');
