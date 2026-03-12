/**
 * seed.js — Production Seed Script (CJS, kein TypeScript noetig)
 *
 * Verwendung auf dem Server:
 *   node seed.js
 *
 * Erstellt: Admin-User, Demo-Tenants, Stores, Tools, Demo-User,
 *           KORE Store Excellence Audit Default-Template
 */

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');

// ── Database ──────────────────────────────────────────
const fs = require('fs');
const DB_PATH = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace('file:', '')
  : path.join(__dirname, 'data', 'kore.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

console.log(`[SEED] Datenbank: ${DB_PATH}`);
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Helpers ───────────────────────────────────────────
function cuid() {
  const ts = Date.now().toString(36);
  const rnd = crypto.randomBytes(8).toString('hex');
  return `c${ts}${rnd}`;
}

function now() {
  return new Date().toISOString();
}

function upsertUser(email, name, passwordHash, role, tenantId) {
  const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(email);
  if (existing) return existing.id;
  const id = cuid();
  db.prepare(
    'INSERT INTO User (id, email, name, passwordHash, role, tenantId, isActive, createdAt, updatedAt) VALUES (?,?,?,?,?,?,1,?,?)'
  ).run(id, email, name, passwordHash, role, tenantId, now(), now());
  return id;
}

function upsertTenant(slug, name, status, contactEmail, contactName, contactPhone, maxUsers) {
  const existing = db.prepare('SELECT id FROM Tenant WHERE slug = ?').get(slug);
  if (existing) return existing.id;
  const id = cuid();
  db.prepare(
    'INSERT INTO Tenant (id, name, slug, status, contactEmail, contactName, contactPhone, maxUsers, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).run(id, name, slug, status, contactEmail, contactName, contactPhone, maxUsers, now(), now());
  return id;
}

function upsertStore(tenantId, name, city, address) {
  const existing = db.prepare('SELECT id FROM Store WHERE tenantId = ? AND name = ?').get(tenantId, name);
  if (existing) return existing.id;
  const id = cuid();
  db.prepare(
    'INSERT INTO Store (id, tenantId, name, city, address, isActive, createdAt, updatedAt) VALUES (?,?,?,?,?,1,?,?)'
  ).run(id, tenantId, name, city, address, now(), now());
  return id;
}

function upsertTool(key, name, category, description, icon, priceMonthly, sortOrder) {
  const existing = db.prepare('SELECT id FROM ToolDefinition WHERE key = ?').get(key);
  if (existing) return existing.id;
  const id = cuid();
  db.prepare(
    'INSERT INTO ToolDefinition (id, key, name, category, description, icon, priceMonthly, isActive, sortOrder, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,1,?,?,?)'
  ).run(id, key, name, category, description, icon, priceMonthly, sortOrder, now(), now());
  return id;
}

function assignToolToStore(storeId, toolId) {
  const existing = db.prepare('SELECT id FROM StoreToolAssignment WHERE storeId = ? AND toolId = ?').get(storeId, toolId);
  if (existing) return;
  db.prepare(
    'INSERT INTO StoreToolAssignment (id, storeId, toolId, isActive, assignedAt) VALUES (?,?,?,1,?)'
  ).run(cuid(), storeId, toolId, now());
}

function assignUserToStore(userId, storeId) {
  const existing = db.prepare('SELECT id FROM UserStoreAssignment WHERE userId = ? AND storeId = ?').get(userId, storeId);
  if (existing) return;
  db.prepare(
    'INSERT INTO UserStoreAssignment (id, userId, storeId, assignedAt) VALUES (?,?,?,?)'
  ).run(cuid(), userId, storeId, now());
}

// ── Seed ──────────────────────────────────────────────
console.log('[SEED] Starte Seeding...');

// 1. Admin-User
const adminHash = bcrypt.hashSync('admin1234', 12);
const adminId = upsertUser('nicole@kore-retail.de', 'Nicole Muñoz Bonilla', adminHash, 'kore_admin', null);
console.log('  ✓ Admin-User: nicole@kore-retail.de (Passwort: admin1234)');

// 2. Demo-Tenants
const t1 = upsertTenant('modehouse-mueller', 'Modehouse Mueller', 'ACTIVE', 'info@modehouse-mueller.de', 'Thomas Mueller', '+49 211 1234567', 50);
const t2 = upsertTenant('boutique-schmidt', 'Boutique Schmidt', 'ACTIVE', 'kontakt@boutique-schmidt.de', 'Anna Schmidt', '+49 221 7654321', 15);
const t3 = upsertTenant('luxus-retail-gmbh', 'Luxus Retail GmbH', 'TRIALING', 'management@luxus-retail.de', 'Dr. Markus Weber', '+49 89 9876543', 200);
console.log('  ✓ 3 Tenants: Modehouse Mueller, Boutique Schmidt, Luxus Retail GmbH');

// 3. Stores
const muellerStores = [
  upsertStore(t1, 'Duesseldorf Koe', 'Duesseldorf', 'Koenigsallee 42'),
  upsertStore(t1, 'Koeln Schildergasse', 'Koeln', 'Schildergasse 88'),
  upsertStore(t1, 'Essen Limbecker', 'Essen', 'Limbecker Platz 1'),
];
const schmidtStores = [
  upsertStore(t2, 'Flagship Ehrenfeld', 'Koeln', 'Venloer Str. 201'),
];
const luxusStores = [
  upsertStore(t3, 'Muenchen Maximilianstr.', 'Muenchen', 'Maximilianstr. 10'),
  upsertStore(t3, 'Berlin KaDeWe', 'Berlin', 'Tauentzienstr. 21'),
  upsertStore(t3, 'Hamburg Neuer Wall', 'Hamburg', 'Neuer Wall 35'),
  upsertStore(t3, 'Frankfurt Goethestr.', 'Frankfurt', 'Goethestr. 12'),
  upsertStore(t3, 'Stuttgart Koenigstr.', 'Stuttgart', 'Koenigstr. 28'),
];
console.log(`  ✓ ${muellerStores.length + schmidtStores.length + luxusStores.length} Stores erstellt`);

// 4. Tool-Definitionen (34 Tools)
const tools = [
  // STANDARDS & COMPLIANCE
  ['standards.checklisten', 'Checklisten', 'STANDARDS_COMPLIANCE', 'Standardisierte Checklisten fuer Store-Visits und Audits', 'ClipboardCheck', 1500, 1],
  ['standards.store_standards', 'Store Standards', 'STANDARDS_COMPLIANCE', 'Store-Standards definieren, messen und benchmarken', 'Award', 1500, 2],
  ['standards.excellence_tracker', 'Excellence Tracker', 'STANDARDS_COMPLIANCE', 'Store Excellence Audit mit Foto-Proof und Scoring', 'TrendingUp', 1900, 3],
  ['standards.vm_foto_compliance', 'VM Foto-Compliance', 'STANDARDS_COMPLIANCE', 'Foto-basierte VM-Compliance-Checks mit KI-Unterstuetzung', 'Camera', 1900, 4],
  ['standards.sop_bibliothek', 'SOP Bibliothek', 'STANDARDS_COMPLIANCE', 'Zentrale Verwaltung aller Standard Operating Procedures', 'BookOpen', 1500, 5],
  // PERFORMANCE & SICHTBARKEIT
  ['performance.kpi_dashboard', 'KPI Dashboard', 'PERFORMANCE', 'Echtzeit-KPI-Dashboard mit allen relevanten Kennzahlen', 'BarChart3', 1900, 1],
  ['performance.budget_tracker', 'Budget Tracker', 'PERFORMANCE', 'Budget-Planung und Kostenverfolgung pro Store', 'Wallet', 1500, 2],
  ['performance.forecast', 'Forecast', 'PERFORMANCE', 'Umsatz- und Performance-Prognosen mit KI', 'LineChart', 2500, 3],
  ['performance.loss_prevention', 'Loss Prevention', 'PERFORMANCE', 'Schwund-Erkennung und Verlustpraevention', 'Shield', 1500, 4],
  ['performance.inventory', 'Inventory', 'PERFORMANCE', 'Bestandsmanagement und Inventur-Automatisierung', 'Package', 1900, 5],
  // FLOOR IN ECHTZEIT
  ['floor.live_floor', 'Live Floor', 'FLOOR', 'Echtzeit-Ueberblick ueber Verkaufsflaeche und Personal', 'Monitor', 1900, 1],
  ['floor.fr_tracking', 'FR Tracking', 'FLOOR', 'Footfall & Revenue Tracking in Echtzeit', 'Activity', 1900, 2],
  ['floor.vm_guidelines', 'VM Guidelines', 'FLOOR', 'Visual-Merchandising-Richtlinien digital verwalten', 'Palette', 1500, 3],
  ['floor.maintenance', 'Maintenance', 'FLOOR', 'Store-Wartung und Reparatur-Management', 'Wrench', 1000, 4],
  // TRAINING & ENTWICKLUNG
  ['training.training_hub_lms', 'Training Hub / LMS', 'TRAINING', 'Learning-Management-System mit Kursen und Zertifikaten', 'GraduationCap', 2500, 1],
  ['training.training_hours', 'Training Hours', 'TRAINING', 'Trainingszeiten erfassen und analysieren', 'Clock', 1000, 2],
  ['training.challenges', 'Challenges', 'TRAINING', 'Team-Challenges und Gamification fuer Mitarbeiter', 'Trophy', 1900, 3],
  ['training.onboarding', 'Onboarding', 'TRAINING', 'Strukturiertes Onboarding neuer Mitarbeiter', 'UserPlus', 1900, 4],
  // COACHING & PEOPLE
  ['coaching.one_on_one', '1:1 Coaching', 'COACHING_PEOPLE', 'Strukturierte 1:1-Coaching-Sessions dokumentieren', 'MessageSquare', 1900, 1],
  ['coaching.pdp_pip', 'PDP / PIP', 'COACHING_PEOPLE', 'Personal Development & Performance Improvement Plans', 'Compass', 1500, 2],
  ['coaching.appraisals', 'Appraisals', 'COACHING_PEOPLE', 'Mitarbeitergespraeche und Leistungsbeurteilungen', 'Star', 1500, 3],
  ['coaching.shift_planning', 'Shift Planning', 'COACHING_PEOPLE', 'Intelligente Schichtplanung und Personalabdeckung', 'CalendarDays', 2500, 4],
  ['coaching.pulse_survey', 'Pulse Survey', 'COACHING_PEOPLE', 'Regelmaessige Mitarbeiter-Pulsbefragungen', 'Heart', 1500, 5],
  ['coaching.wellbeing', 'Wellbeing', 'COACHING_PEOPLE', 'Mitarbeiter-Wellbeing-Tracking und Ressourcen', 'Smile', 1500, 6],
  // KOMMUNIKATION & SIGNAL
  ['komm.briefings', 'Briefings', 'KOMMUNIKATION', 'Taegliche Store-Briefings digital verteilen', 'FileText', 1000, 1],
  ['komm.handover', 'Handover', 'KOMMUNIKATION', 'Schichtuebergabe-Protokolle digital abbilden', 'ArrowLeftRight', 1000, 2],
  ['komm.team_push', 'Team Push', 'KOMMUNIKATION', 'Push-Nachrichten an Store-Teams senden', 'Bell', 1000, 3],
  ['komm.team_newsletter', 'Team Newsletter', 'KOMMUNIKATION', 'Interne Newsletter fuer Teams erstellen', 'Mail', 1500, 4],
  // CUSTOMER, CLIENTELING & STOCK
  ['customer.fr_conversion', 'FR Conversion', 'CUSTOMER_STOCK', 'Footfall-to-Revenue Conversion optimieren', 'TrendingUp', 1900, 1],
  ['customer.clienteling_crm', 'Clienteling / CRM', 'CUSTOMER_STOCK', 'Kundenbeziehungsmanagement und VIP-Betreuung', 'Users', 2500, 2],
  ['customer.stock_callouts', 'Stock Callouts', 'CUSTOMER_STOCK', 'Bestandsmeldungen und Nachbestellungen', 'PackageSearch', 1500, 3],
  ['customer.track_trace', 'Track & Trace', 'CUSTOMER_STOCK', 'Warenverfolgung und Lieferstatus fuer Kunden', 'Navigation', 1900, 4],
  // REGIONAL INSIGHTS
  ['regional.multi_store_view', 'Multi-Store View', 'REGIONAL_INSIGHTS', 'Vergleichende Ansicht aller Stores einer Region', 'Map', 3500, 1],
  ['regional.rm_dashboard', 'RM Dashboard', 'REGIONAL_INSIGHTS', 'Regional-Manager-Dashboard mit aggregierten KPIs', 'LayoutDashboard', 2500, 2],
];

const toolIds = {};
for (const [key, name, category, description, icon, price, order] of tools) {
  toolIds[key] = upsertTool(key, name, category, description, icon, price, order);
}
console.log(`  ✓ ${tools.length} Tool-Definitionen erstellt`);

// 5. Store-Tool-Zuweisungen
const muellerToolKeys = [
  'standards.checklisten', 'standards.store_standards', 'standards.excellence_tracker',
  'performance.kpi_dashboard', 'performance.budget_tracker',
  'floor.live_floor', 'floor.vm_guidelines',
  'training.training_hub_lms', 'training.training_hours',
  'coaching.shift_planning', 'coaching.appraisals',
  'komm.briefings',
];
const schmidtToolKeys = [
  'standards.checklisten', 'performance.kpi_dashboard',
  'training.training_hub_lms', 'coaching.shift_planning', 'komm.briefings',
];
const luxusToolKeys = [
  'standards.checklisten', 'standards.store_standards', 'standards.excellence_tracker', 'standards.vm_foto_compliance', 'standards.sop_bibliothek',
  'performance.kpi_dashboard', 'performance.budget_tracker', 'performance.forecast', 'performance.inventory',
  'floor.live_floor', 'floor.fr_tracking', 'floor.vm_guidelines',
  'training.training_hub_lms', 'training.challenges', 'training.onboarding',
  'coaching.one_on_one', 'coaching.appraisals', 'coaching.shift_planning', 'coaching.pulse_survey',
  'customer.clienteling_crm', 'customer.fr_conversion', 'customer.stock_callouts',
  'regional.multi_store_view', 'regional.rm_dashboard',
];

function assignToolsToStores(storeIds, toolKeys) {
  for (const sid of storeIds) {
    for (const key of toolKeys) {
      if (toolIds[key]) assignToolToStore(sid, toolIds[key]);
    }
  }
}
assignToolsToStores(muellerStores, muellerToolKeys);
assignToolsToStores(schmidtStores, schmidtToolKeys);
assignToolsToStores(luxusStores, luxusToolKeys);
console.log('  ✓ Store-Tool-Zuweisungen erstellt');

// 6. Demo-User mit Store-Zuweisungen
const demoHash = bcrypt.hashSync('demo1234', 12);
const demoUsers = [
  { email: 'ta@modehouse.de', name: 'Thomas Mueller (Admin)', role: 'tenant_admin', tenantId: t1, storeIds: muellerStores },
  { email: 'rm@modehouse.de', name: 'Regina Meyer (Regional)', role: 'regional_manager', tenantId: t1, storeIds: muellerStores },
  { email: 'mm@modehouse.de', name: 'Marco Mueller (Multisite)', role: 'multisite_manager', tenantId: t1, storeIds: muellerStores.slice(0, 2) },
  { email: 'sm@modehouse.de', name: 'Sarah Klein (Store)', role: 'store_manager', tenantId: t1, storeIds: muellerStores.slice(0, 1) },
  { email: 'learner@modehouse.de', name: 'Lisa Becker (Mitarbeiter)', role: 'learner', tenantId: t1, storeIds: muellerStores.slice(0, 1) },
];

for (const du of demoUsers) {
  const uid = upsertUser(du.email, du.name, demoHash, du.role, du.tenantId);
  for (const sid of du.storeIds) {
    assignUserToStore(uid, sid);
  }
}
console.log(`  ✓ ${demoUsers.length} Demo-User erstellt (Passwort: demo1234)`);
console.log('    ta@modehouse.de  → Tenant Admin');
console.log('    rm@modehouse.de  → Regional Manager');
console.log('    mm@modehouse.de  → Multisite Manager');
console.log('    sm@modehouse.de  → Store Manager');
console.log('    learner@modehouse.de → Mitarbeiter');

// 7. KORE Store Excellence Audit — Default-Template
const existingTemplate = db.prepare(
  "SELECT id FROM AuditTemplate WHERE isDefault = 1 AND name = 'KORE Store Excellence Standard'"
).get();

if (!existingTemplate) {
  const templateId = cuid();
  db.prepare(
    'INSERT INTO AuditTemplate (id, tenantId, name, description, version, isDefault, isActive, createdBy, createdAt, updatedAt) VALUES (?,?,?,?,1,1,1,?,?,?)'
  ).run(templateId, null, 'KORE Store Excellence Standard',
    'KORE Standard-Template fuer Store Excellence Audits. Deckt alle wesentlichen Bereiche eines Premium-Retail-Stores ab.',
    adminId, now(), now());

  const categories = [
    {
      name: 'Kundenansprache & Service',
      description: 'Begruessung, Beratungsqualitaet, Verabschiedung',
      sortOrder: 0, weight: 1.5,
      criteria: [
        ['Aktive Begruessung innerhalb 30 Sekunden', 0, 1, 0],
        ['Bedarfsanalyse durchgefuehrt', 1, 1, 0],
        ['Produktwissen demonstriert', 2, 1, 0],
        ['Cross-Selling / Up-Selling angeboten', 3, 0, 0],
        ['Freundliche Verabschiedung', 4, 1, 0],
      ],
    },
    {
      name: 'Visual Merchandising',
      description: 'Schaufenster, Warenpraesentation, Beschilderung',
      sortOrder: 1, weight: 1.2,
      criteria: [
        ['Schaufenster aktuell und ansprechend', 0, 1, 1],
        ['Eingangsbereich einladend', 1, 1, 1],
        ['Warenpraesentation nach VM-Guideline', 2, 1, 1],
        ['Preisauszeichnung vollstaendig', 3, 1, 0],
        ['Kampagnen-Material korrekt platziert', 4, 0, 1],
      ],
    },
    {
      name: 'Sauberkeit & Ordnung',
      description: 'Verkaufsflaeche, Umkleide, Kassenbereich',
      sortOrder: 2, weight: 1.0,
      criteria: [
        ['Verkaufsflaeche sauber und aufgeraeumt', 0, 1, 0],
        ['Umkleidekabinen ordentlich', 1, 1, 1],
        ['Kassenbereich aufgeraeumt', 2, 1, 0],
        ['Lagerbereich organisiert', 3, 0, 0],
      ],
    },
    {
      name: 'Team & Erscheinungsbild',
      description: 'Dresscode, Namensschilder, Teamverhalten',
      sortOrder: 3, weight: 0.8,
      criteria: [
        ['Dresscode eingehalten', 0, 1, 0],
        ['Namensschilder getragen', 1, 1, 0],
        ['Professionelles Auftreten', 2, 1, 0],
        ['Ausreichend Personal auf der Flaeche', 3, 1, 0],
      ],
    },
    {
      name: 'Operative Prozesse',
      description: 'Kasse, Retouren, Warenwirtschaft',
      sortOrder: 4, weight: 1.0,
      criteria: [
        ['Kassenprozess effizient', 0, 1, 0],
        ['Retouren-Prozess korrekt', 1, 1, 0],
        ['Wareneingang zeitnah verarbeitet', 2, 0, 0],
        ['Inventur-Differenzen im Rahmen', 3, 0, 0],
        ['Briefing / Handover dokumentiert', 4, 1, 0],
      ],
    },
    {
      name: 'KPI-Awareness',
      description: 'Kenntnis und Kommunikation der Store-KPIs',
      sortOrder: 5, weight: 0.5,
      criteria: [
        ['Tagesumsatz-Ziel bekannt', 0, 1, 0],
        ['Conversion-Rate bewusst', 1, 0, 0],
        ['UPT-Ziel kommuniziert', 2, 0, 0],
        ['Team-Challenges aktiv', 3, 0, 0],
      ],
    },
  ];

  const insertCategory = db.prepare(
    'INSERT INTO AuditCategory (id, templateId, name, description, sortOrder, weight) VALUES (?,?,?,?,?,?)'
  );
  const insertCriterion = db.prepare(
    'INSERT INTO AuditCriterion (id, categoryId, name, sortOrder, isRequired, photoRequired) VALUES (?,?,?,?,?,?)'
  );

  let criterionCount = 0;
  for (const cat of categories) {
    const catId = cuid();
    insertCategory.run(catId, templateId, cat.name, cat.description, cat.sortOrder, cat.weight);
    for (const [name, sortOrder, isRequired, photoRequired] of cat.criteria) {
      insertCriterion.run(cuid(), catId, name, sortOrder, isRequired, photoRequired);
      criterionCount++;
    }
  }
  console.log(`  ✓ KORE Store Excellence Default-Template erstellt (${categories.length} Kategorien, ${criterionCount} Kriterien)`);
} else {
  console.log('  ✓ KORE Store Excellence Default-Template bereits vorhanden');
}

// ── Checklisten Default-Template ──────────────────────
const existingChecklist = db.prepare('SELECT id FROM ChecklistTemplate WHERE isDefault = 1 AND name = ?').get('Store Visit Checklist');
if (!existingChecklist) {
  const clTemplateId = cuid();
  db.prepare(
    'INSERT INTO ChecklistTemplate (id, tenantId, name, description, version, isDefault, isActive, createdBy, createdAt, updatedAt) VALUES (?,?,?,?,1,1,1,?,?,?)'
  ).run(clTemplateId, null, 'Store Visit Checklist', 'KORE Standard-Checkliste für regelmäßige Store-Visits. Deckt Sauberkeit, VM und Personal ab.', adminId, now(), now());

  const sections = [
    {
      name: 'Sauberkeit & Ordnung', sortOrder: 0,
      items: [
        ['Eingangsbereiche sauber', 'BOOLEAN', 1, 0],
        ['Regale aufgeräumt', 'BOOLEAN', 1, 1],
        ['Umkleidekabinen geprüft', 'BOOLEAN', 1, 2],
        ['Toiletten sauber', 'BOOLEAN', 0, 3],
        ['Lagerraum ordentlich', 'BOOLEAN', 0, 4],
      ],
    },
    {
      name: 'Visual Merchandising', sortOrder: 1,
      items: [
        ['Schaufenster aktuell', 'BOOLEAN', 1, 0],
        ['Produktpräsentation korrekt', 'BOOLEAN', 1, 1],
        ['Preisauszeichnung vollständig', 'BOOLEAN', 1, 2],
        ['Beleuchtung funktioniert', 'BOOLEAN', 0, 3],
      ],
    },
    {
      name: 'Personal & Service', sortOrder: 2,
      items: [
        ['Alle Mitarbeiter in Uniform', 'BOOLEAN', 1, 0],
        ['Personalstärke planmäßig', 'BOOLEAN', 1, 1],
        ['Begrüßung an der Tür', 'BOOLEAN', 0, 2],
      ],
    },
  ];

  const insertSection = db.prepare(
    'INSERT INTO ChecklistSection (id, templateId, name, sortOrder) VALUES (?,?,?,?)'
  );
  const insertItem = db.prepare(
    'INSERT INTO ChecklistItem (id, sectionId, text, type, isRequired, sortOrder) VALUES (?,?,?,?,?,?)'
  );

  let itemCount = 0;
  for (const sec of sections) {
    const secId = cuid();
    insertSection.run(secId, clTemplateId, sec.name, sec.sortOrder);
    for (const [text, type, isRequired, sortOrder] of sec.items) {
      insertItem.run(cuid(), secId, text, type, isRequired, sortOrder);
      itemCount++;
    }
  }
  console.log(`  ✓ Checklisten Default-Template erstellt (${sections.length} Sektionen, ${itemCount} Items)`);
} else {
  console.log('  ✓ Checklisten Default-Template bereits vorhanden');
}

// ── SOP Bibliothek Default-Daten ──────────────────────
const existingSopCat = db.prepare('SELECT id FROM SopCategory WHERE tenantId IS NULL AND name = ?').get('Abläufe');
if (!existingSopCat) {
  const catAblaeufeId = cuid();
  const catKundenserviceId = cuid();
  const catSicherheitId = cuid();

  const insertSopCat = db.prepare(
    'INSERT INTO SopCategory (id, tenantId, name, sortOrder, isActive) VALUES (?,?,?,?,1)'
  );
  insertSopCat.run(catAblaeufeId, null, 'Abläufe', 0);
  insertSopCat.run(catKundenserviceId, null, 'Kundenservice', 1);
  insertSopCat.run(catSicherheitId, null, 'Sicherheit', 2);

  const insertSop = db.prepare(
    'INSERT INTO Sop (id, tenantId, categoryId, title, content, version, status, createdBy, publishedAt, createdAt, updatedAt) VALUES (?,?,?,?,?,1,?,?,?,?,?)'
  );

  insertSop.run(cuid(), null, catAblaeufeId, 'Kassenabschluss',
    '# Kassenabschluss\n\n## Ziel\nSicherstellen, dass der tägliche Kassenabschluss korrekt durchgeführt wird.\n\n## Ablauf\n1. Letzte Transaktion abwarten\n2. Bargeld zählen und abgleichen\n3. EC-/Kreditkarten-Summen prüfen\n4. Kassenabschlussbericht drucken\n5. Bargeld im Tresor einschließen',
    'PUBLISHED', adminId, now(), now(), now());

  insertSop.run(cuid(), null, catKundenserviceId, 'Reklamationsbearbeitung',
    '# Reklamationsbearbeitung\n\n## Ziel\nKundenreklamationen professionell bearbeiten.\n\n## Ablauf\n1. Kunden begrüßen und Kaufbeleg prüfen\n2. Reklamationsgrund dokumentieren\n3. Entscheidung: Umtausch, Gutschein oder Rückerstattung\n4. Im System erfassen',
    'PUBLISHED', adminId, now(), now(), now());

  insertSop.run(cuid(), null, catSicherheitId, 'Notfallplan',
    '# Notfallplan\n\n## Ziel\nSicherstellen, dass alle Mitarbeiter im Notfall richtig reagieren.\n\n## Notfälle\n- Brand: Feueralarm auslösen, Kunden evakuieren, 112 rufen\n- Medizinischer Notfall: 112 rufen, Erste Hilfe leisten\n- Diebstahl: Eigene Sicherheit, 110 rufen\n- Evakuierung: Ruhig zum Ausgang leiten, Sammelplatz aufsuchen',
    'PUBLISHED', adminId, now(), now(), now());

  console.log('  ✓ SOP Bibliothek: 3 Kategorien + 3 Default-SOPs erstellt');
} else {
  console.log('  ✓ SOP Bibliothek Default-Daten bereits vorhanden');
}

// ── Store Standards Default-Daten ──────────────────────
const existingStdCat = db.prepare('SELECT id FROM StandardCategory WHERE tenantId IS NULL AND name = ?').get('Basis Standards');
if (!existingStdCat) {
  const basisCatId = cuid();
  db.prepare(
    'INSERT INTO StandardCategory (id, tenantId, name, description, sortOrder, isActive) VALUES (?,?,?,?,?,1)'
  ).run(basisCatId, null, 'Basis Standards', 'Grundlegende Store-Standards, die für alle Filialen gelten.', 0);

  const insertDef = db.prepare(
    'INSERT INTO StandardDefinition (id, categoryId, tenantId, name, description, unit, targetValue, operator, weight, isActive, sortOrder) VALUES (?,?,?,?,?,?,?,?,?,1,?)'
  );

  insertDef.run(cuid(), basisCatId, null, 'Sauberkeits-Score', 'Mindest-Score bei Sauberkeits-Checks', '%', 85, 'GTE', 1.5, 0);
  insertDef.run(cuid(), basisCatId, null, 'VM-Compliance', 'Visual-Merchandising-Compliance-Rate', '%', 90, 'GTE', 1.0, 1);
  insertDef.run(cuid(), basisCatId, null, 'Wartezeit Kasse', 'Maximale durchschnittliche Wartezeit an der Kasse', 'min', 3, 'LTE', 1.0, 2);
  insertDef.run(cuid(), basisCatId, null, 'Personaldeckung', 'Mindest-Personaldeckung gemäß Schichtplan', '%', 95, 'GTE', 1.2, 3);
  insertDef.run(cuid(), basisCatId, null, 'Mystery-Shopper-Score', 'Mindest-Score bei Mystery-Shopping-Bewertungen', '%', 80, 'GTE', 1.5, 4);

  console.log('  ✓ Store Standards: Kategorie "Basis Standards" + 5 Definitionen erstellt');
} else {
  console.log('  ✓ Store Standards Default-Daten bereits vorhanden');
}

db.close();
console.log('\n[SEED] ✓ Seeding abgeschlossen!');
