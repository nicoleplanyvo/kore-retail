import 'dotenv/config';
import { PrismaClient } from './generated/client/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { hashSync } from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env['DATABASE_URL'] || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Kore Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kore-retail.de' },
    update: {},
    create: {
      email: 'admin@kore-retail.de',
      name: 'KORE Admin',
      passwordHash: hashSync('admin1234', 12),
      role: 'kore_admin',
    },
  });
  console.log(`✓ Admin User erstellt: ${admin.email}`);

  // Demo-Tenants (ohne Plan)
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'modehouse-mueller' },
    update: {},
    create: {
      name: 'Modehouse Müller',
      slug: 'modehouse-mueller',
      status: 'ACTIVE',
      contactEmail: 'info@modehouse-mueller.de',
      contactName: 'Thomas Müller',
      contactPhone: '+49 211 1234567',
      maxUsers: 50,
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'boutique-schmidt' },
    update: {},
    create: {
      name: 'Boutique Schmidt',
      slug: 'boutique-schmidt',
      status: 'ACTIVE',
      contactEmail: 'kontakt@boutique-schmidt.de',
      contactName: 'Anna Schmidt',
      contactPhone: '+49 221 7654321',
      maxUsers: 15,
    },
  });

  const tenant3 = await prisma.tenant.upsert({
    where: { slug: 'luxus-retail-gmbh' },
    update: {},
    create: {
      name: 'Luxus Retail GmbH',
      slug: 'luxus-retail-gmbh',
      status: 'TRIALING',
      contactEmail: 'management@luxus-retail.de',
      contactName: 'Dr. Markus Weber',
      contactPhone: '+49 89 9876543',
      maxUsers: 200,
    },
  });

  console.log(`✓ Demo-Tenants erstellt: ${tenant1.name}, ${tenant2.name}, ${tenant3.name}`);

  // === Demo-Stores ===
  const stores: { tenantId: string; name: string; city: string; address: string }[] = [
    // Modehouse Müller — 3 Filialen
    { tenantId: tenant1.id, name: 'Düsseldorf Kö', city: 'Düsseldorf', address: 'Königsallee 42' },
    { tenantId: tenant1.id, name: 'Köln Schildergasse', city: 'Köln', address: 'Schildergasse 88' },
    { tenantId: tenant1.id, name: 'Essen Limbecker', city: 'Essen', address: 'Limbecker Platz 1' },
    // Boutique Schmidt — 1 Filiale
    { tenantId: tenant2.id, name: 'Flagship Ehrenfeld', city: 'Köln', address: 'Venloer Str. 201' },
    // Luxus Retail GmbH — 5 Filialen
    { tenantId: tenant3.id, name: 'München Maximilianstr.', city: 'München', address: 'Maximilianstr. 10' },
    { tenantId: tenant3.id, name: 'Berlin KaDeWe', city: 'Berlin', address: 'Tauentzienstr. 21' },
    { tenantId: tenant3.id, name: 'Hamburg Neuer Wall', city: 'Hamburg', address: 'Neuer Wall 35' },
    { tenantId: tenant3.id, name: 'Frankfurt Goethestr.', city: 'Frankfurt', address: 'Goethestr. 12' },
    { tenantId: tenant3.id, name: 'Stuttgart Königstr.', city: 'Stuttgart', address: 'Königstr. 28' },
  ];

  const storeRecords = [];
  for (const s of stores) {
    const existing = await prisma.store.findFirst({
      where: { tenantId: s.tenantId, name: s.name },
    });
    if (existing) {
      storeRecords.push(existing);
    } else {
      const created = await prisma.store.create({ data: s });
      storeRecords.push(created);
    }
  }
  console.log(`✓ ${storeRecords.length} Stores erstellt`);

  // === 34 Tool-Definitionen mit Preisen aus dem Akquisepapier ===
  // priceMonthly in Cent (z.B. 1500 = 15€)
  const tools = [
    // STANDARDS & COMPLIANCE
    { key: 'standards.checklisten', name: 'Checklisten', category: 'STANDARDS_COMPLIANCE', description: 'Standardisierte Checklisten für Store-Visits und Audits', icon: 'ClipboardCheck', priceMonthly: 1500, sortOrder: 1 },
    { key: 'standards.store_standards', name: 'Store Standards', category: 'STANDARDS_COMPLIANCE', description: 'Store-Standards definieren, messen und benchmarken', icon: 'Award', priceMonthly: 1500, sortOrder: 2 },
    { key: 'standards.excellence_tracker', name: 'Excellence Tracker', category: 'STANDARDS_COMPLIANCE', description: 'Fortlaufendes Tracking von Store-Excellence-KPIs', icon: 'TrendingUp', priceMonthly: 1900, sortOrder: 3 },
    { key: 'standards.vm_foto_compliance', name: 'VM Foto-Compliance', category: 'STANDARDS_COMPLIANCE', description: 'Foto-basierte VM-Compliance-Checks mit KI-Unterstützung', icon: 'Camera', priceMonthly: 1900, sortOrder: 4 },
    { key: 'standards.sop_bibliothek', name: 'SOP Bibliothek', category: 'STANDARDS_COMPLIANCE', description: 'Zentrale Verwaltung aller Standard Operating Procedures', icon: 'BookOpen', priceMonthly: 1500, sortOrder: 5 },

    // PERFORMANCE & SICHTBARKEIT
    { key: 'performance.kpi_dashboard', name: 'KPI Dashboard', category: 'PERFORMANCE', description: 'Echtzeit-KPI-Dashboard mit allen relevanten Kennzahlen', icon: 'BarChart3', priceMonthly: 1900, sortOrder: 1 },
    { key: 'performance.budget_tracker', name: 'Budget Tracker', category: 'PERFORMANCE', description: 'Budget-Planung und Kostenverfolgung pro Store', icon: 'Wallet', priceMonthly: 1500, sortOrder: 2 },
    { key: 'performance.forecast', name: 'Forecast', category: 'PERFORMANCE', description: 'Umsatz- und Performance-Prognosen mit KI', icon: 'LineChart', priceMonthly: 2500, sortOrder: 3 },
    { key: 'performance.loss_prevention', name: 'Loss Prevention', category: 'PERFORMANCE', description: 'Schwund-Erkennung und Verlustprävention', icon: 'Shield', priceMonthly: 1500, sortOrder: 4 },
    { key: 'performance.inventory', name: 'Inventory', category: 'PERFORMANCE', description: 'Bestandsmanagement und Inventur-Automatisierung', icon: 'Package', priceMonthly: 1900, sortOrder: 5 },

    // FLOOR IN ECHTZEIT
    { key: 'floor.live_floor', name: 'Live Floor', category: 'FLOOR', description: 'Echtzeit-Überblick über Verkaufsfläche und Personal', icon: 'Monitor', priceMonthly: 1900, sortOrder: 1 },
    { key: 'floor.fr_tracking', name: 'FR Tracking', category: 'FLOOR', description: 'Footfall & Revenue Tracking in Echtzeit', icon: 'Activity', priceMonthly: 1900, sortOrder: 2 },
    { key: 'floor.vm_guidelines', name: 'VM Guidelines', category: 'FLOOR', description: 'Visual-Merchandising-Richtlinien digital verwalten', icon: 'Palette', priceMonthly: 1500, sortOrder: 3 },
    { key: 'floor.maintenance', name: 'Maintenance', category: 'FLOOR', description: 'Store-Wartung und Reparatur-Management', icon: 'Wrench', priceMonthly: 1000, sortOrder: 4 },

    // TRAINING & ENTWICKLUNG
    { key: 'training.training_hub_lms', name: 'Training Hub / LMS', category: 'TRAINING', description: 'Learning-Management-System mit Kursen und Zertifikaten', icon: 'GraduationCap', priceMonthly: 2500, sortOrder: 1 },
    { key: 'training.training_hours', name: 'Training Hours', category: 'TRAINING', description: 'Trainingszeiten erfassen und analysieren', icon: 'Clock', priceMonthly: 1000, sortOrder: 2 },
    { key: 'training.challenges', name: 'Challenges', category: 'TRAINING', description: 'Team-Challenges und Gamification für Mitarbeiter', icon: 'Trophy', priceMonthly: 1900, sortOrder: 3 },
    { key: 'training.onboarding', name: 'Onboarding', category: 'TRAINING', description: 'Strukturiertes Onboarding neuer Mitarbeiter', icon: 'UserPlus', priceMonthly: 1900, sortOrder: 4 },

    // COACHING & PEOPLE
    { key: 'coaching.one_on_one', name: '1:1 Coaching', category: 'COACHING_PEOPLE', description: 'Strukturierte 1:1-Coaching-Sessions dokumentieren', icon: 'MessageSquare', priceMonthly: 1900, sortOrder: 1 },
    { key: 'coaching.pdp_pip', name: 'PDP / PIP', category: 'COACHING_PEOPLE', description: 'Personal Development & Performance Improvement Plans', icon: 'Compass', priceMonthly: 1500, sortOrder: 2 },
    { key: 'coaching.appraisals', name: 'Appraisals', category: 'COACHING_PEOPLE', description: 'Mitarbeitergespräche und Leistungsbeurteilungen', icon: 'Star', priceMonthly: 1500, sortOrder: 3 },
    { key: 'coaching.shift_planning', name: 'Shift Planning', category: 'COACHING_PEOPLE', description: 'Intelligente Schichtplanung und Personalabdeckung', icon: 'CalendarDays', priceMonthly: 2500, sortOrder: 4 },
    { key: 'coaching.pulse_survey', name: 'Pulse Survey', category: 'COACHING_PEOPLE', description: 'Regelmäßige Mitarbeiter-Pulsbefragungen', icon: 'Heart', priceMonthly: 1500, sortOrder: 5 },
    { key: 'coaching.wellbeing', name: 'Wellbeing', category: 'COACHING_PEOPLE', description: 'Mitarbeiter-Wellbeing-Tracking und Ressourcen', icon: 'Smile', priceMonthly: 1500, sortOrder: 6 },

    // KOMMUNIKATION & SIGNAL
    { key: 'komm.briefings', name: 'Briefings', category: 'KOMMUNIKATION', description: 'Tägliche Store-Briefings digital verteilen', icon: 'FileText', priceMonthly: 1000, sortOrder: 1 },
    { key: 'komm.handover', name: 'Handover', category: 'KOMMUNIKATION', description: 'Schichtübergabe-Protokolle digital abbilden', icon: 'ArrowLeftRight', priceMonthly: 1000, sortOrder: 2 },
    { key: 'komm.team_push', name: 'Team Push', category: 'KOMMUNIKATION', description: 'Push-Nachrichten an Store-Teams senden', icon: 'Bell', priceMonthly: 1000, sortOrder: 3 },
    { key: 'komm.team_newsletter', name: 'Team Newsletter', category: 'KOMMUNIKATION', description: 'Interne Newsletter für Teams erstellen', icon: 'Mail', priceMonthly: 1500, sortOrder: 4 },

    // CUSTOMER, CLIENTELING & STOCK
    { key: 'customer.fr_conversion', name: 'FR Conversion', category: 'CUSTOMER_STOCK', description: 'Footfall-to-Revenue Conversion optimieren', icon: 'TrendingUp', priceMonthly: 1900, sortOrder: 1 },
    { key: 'customer.clienteling_crm', name: 'Clienteling / CRM', category: 'CUSTOMER_STOCK', description: 'Kundenbeziehungsmanagement und VIP-Betreuung', icon: 'Users', priceMonthly: 2500, sortOrder: 2 },
    { key: 'customer.stock_callouts', name: 'Stock Callouts', category: 'CUSTOMER_STOCK', description: 'Bestandsmeldungen und Nachbestellungen', icon: 'PackageSearch', priceMonthly: 1500, sortOrder: 3 },
    { key: 'customer.track_trace', name: 'Track & Trace', category: 'CUSTOMER_STOCK', description: 'Warenverfolgung und Lieferstatus für Kunden', icon: 'Navigation', priceMonthly: 1900, sortOrder: 4 },

    // REGIONAL INSIGHTS
    { key: 'regional.multi_store_view', name: 'Multi-Store View', category: 'REGIONAL_INSIGHTS', description: 'Vergleichende Ansicht aller Stores einer Region', icon: 'Map', priceMonthly: 3500, sortOrder: 1 },
    { key: 'regional.rm_dashboard', name: 'RM Dashboard', category: 'REGIONAL_INSIGHTS', description: 'Regional-Manager-Dashboard mit aggregierten KPIs', icon: 'LayoutDashboard', priceMonthly: 2500, sortOrder: 2 },
  ];

  for (const t of tools) {
    await prisma.toolDefinition.upsert({
      where: { key: t.key },
      update: { name: t.name, description: t.description, category: t.category, icon: t.icon, priceMonthly: t.priceMonthly, sortOrder: t.sortOrder },
      create: t,
    });
  }
  console.log(`✓ ${tools.length} Tool-Definitionen erstellt`);

  // === Demo-Tool-Zuweisungen pro Store ===
  const allTools = await prisma.toolDefinition.findMany();
  const toolMap = Object.fromEntries(allTools.map((t) => [t.key, t.id]));

  // Modehouse Müller Stores — mittleres Paket (12 Tools pro Store)
  const muellerToolKeys = [
    'standards.checklisten', 'standards.store_standards', 'standards.excellence_tracker',
    'performance.kpi_dashboard', 'performance.budget_tracker',
    'floor.live_floor', 'floor.vm_guidelines',
    'training.training_hub_lms', 'training.training_hours',
    'coaching.shift_planning', 'coaching.appraisals',
    'komm.briefings',
  ];

  // Boutique Schmidt — kleines Paket (5 Tools)
  const schmidtToolKeys = [
    'standards.checklisten',
    'performance.kpi_dashboard',
    'training.training_hub_lms',
    'coaching.shift_planning',
    'komm.briefings',
  ];

  // Luxus Retail — großes Paket (20+ Tools pro Store)
  const luxusToolKeys = [
    'standards.checklisten', 'standards.store_standards', 'standards.excellence_tracker', 'standards.vm_foto_compliance', 'standards.sop_bibliothek',
    'performance.kpi_dashboard', 'performance.budget_tracker', 'performance.forecast', 'performance.inventory',
    'floor.live_floor', 'floor.fr_tracking', 'floor.vm_guidelines',
    'training.training_hub_lms', 'training.challenges', 'training.onboarding',
    'coaching.one_on_one', 'coaching.appraisals', 'coaching.shift_planning', 'coaching.pulse_survey',
    'customer.clienteling_crm', 'customer.fr_conversion', 'customer.stock_callouts',
    'regional.multi_store_view', 'regional.rm_dashboard',
  ];

  async function assignTools(storeIds: string[], toolKeys: string[]) {
    for (const storeId of storeIds) {
      for (const key of toolKeys) {
        const toolId = toolMap[key];
        if (!toolId) continue;
        const existing = await prisma.storeToolAssignment.findUnique({
          where: { storeId_toolId: { storeId, toolId } },
        });
        if (!existing) {
          await prisma.storeToolAssignment.create({
            data: { storeId, toolId },
          });
        }
      }
    }
  }

  const muellerStoreIds = storeRecords.filter((s) => s.tenantId === tenant1.id).map((s) => s.id);
  const schmidtStoreIds = storeRecords.filter((s) => s.tenantId === tenant2.id).map((s) => s.id);
  const luxusStoreIds = storeRecords.filter((s) => s.tenantId === tenant3.id).map((s) => s.id);

  await assignTools(muellerStoreIds, muellerToolKeys);
  await assignTools(schmidtStoreIds, schmidtToolKeys);
  await assignTools(luxusStoreIds, luxusToolKeys);

  console.log('✓ Store-Tool-Zuweisungen erstellt');

  // === Demo-User für alle Rollen (Modehouse Müller) ===
  const demoPassword = hashSync('demo1234', 12);

  const demoUsers = [
    {
      email: 'ta@modehouse.de',
      name: 'Thomas Müller (Admin)',
      role: 'tenant_admin',
      tenantId: tenant1.id,
      storeIds: muellerStoreIds, // alle 3 Stores
    },
    {
      email: 'rm@modehouse.de',
      name: 'Regina Meyer (Regional)',
      role: 'regional_manager',
      tenantId: tenant1.id,
      storeIds: muellerStoreIds, // alle 3 Stores
    },
    {
      email: 'mm@modehouse.de',
      name: 'Marco Müller (Multisite)',
      role: 'multisite_manager',
      tenantId: tenant1.id,
      storeIds: muellerStoreIds.slice(0, 2), // 2 Stores
    },
    {
      email: 'sm@modehouse.de',
      name: 'Sarah Klein (Store)',
      role: 'store_manager',
      tenantId: tenant1.id,
      storeIds: muellerStoreIds.slice(0, 1), // 1 Store
    },
    {
      email: 'learner@modehouse.de',
      name: 'Lisa Becker (Mitarbeiter)',
      role: 'learner',
      tenantId: tenant1.id,
      storeIds: muellerStoreIds.slice(0, 1), // 1 Store
    },
  ];

  for (const du of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: du.email },
      update: {},
      create: {
        email: du.email,
        name: du.name,
        passwordHash: demoPassword,
        role: du.role,
        tenantId: du.tenantId,
      },
    });

    // Store-Zuweisungen
    for (const storeId of du.storeIds) {
      const existing = await prisma.userStoreAssignment.findUnique({
        where: { userId_storeId: { userId: user.id, storeId } },
      });
      if (!existing) {
        await prisma.userStoreAssignment.create({
          data: { userId: user.id, storeId },
        });
      }
    }
  }

  console.log(`✓ ${demoUsers.length} Demo-User erstellt (ta/rm/mm/sm/learner @modehouse.de, Passwort: demo1234)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
