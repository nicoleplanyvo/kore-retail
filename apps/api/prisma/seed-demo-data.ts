/**
 * KORE Retail Platform — Comprehensive Demo Data Seed
 *
 * Populates ALL 34 tools with realistic German retail demo data
 * for "Modehouse Mueller" tenant. Run AFTER the base seed.ts.
 *
 * Usage:  npx tsx prisma/seed-demo-data.ts
 */
import prisma from '../src/lib/prisma.js';
import { randomUUID } from 'crypto';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function id(prefix = 'demo'): string {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 3600_000);
}

/** Random integer in [min, max] inclusive */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random float in [min, max] with 2 decimal places */
function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/** Pick random element from array */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Monday of the current week */
function currentMonday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Monday of next week */
function nextMonday(): Date {
  const m = currentMonday();
  m.setDate(m.getDate() + 7);
  return m;
}

/** Month string like "2026-03" */
function monthStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Summary tracker
// ---------------------------------------------------------------------------
const summary: string[] = [];
function log(msg: string) {
  console.log(msg);
  summary.push(msg);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('\n=== KORE Demo-Daten Seed ===\n');

  // ── Fetch existing entities ────────────────────────────────────────────
  const tenant = await prisma.tenant.findUnique({ where: { slug: 'modehouse-mueller' } });
  if (!tenant) {
    throw new Error('Tenant "modehouse-mueller" nicht gefunden. Bitte zuerst seed.ts ausführen.');
  }
  const tenantId = tenant.id;

  const stores = await prisma.store.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  if (stores.length === 0) {
    throw new Error('Keine Stores für Modehouse Mueller gefunden.');
  }

  const users = await prisma.user.findMany({ where: { tenantId }, orderBy: { email: 'asc' } });
  if (users.length === 0) {
    throw new Error('Keine User für Modehouse Mueller gefunden.');
  }

  const userByEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  const ta = userByEmail['ta@modehouse.de'];
  const rm = userByEmail['rm@modehouse.de'];
  const mm = userByEmail['mm@modehouse.de'];
  const sm = userByEmail['sm@modehouse.de'];
  const learner = userByEmail['learner@modehouse.de'];

  if (!ta || !rm || !sm || !learner) {
    throw new Error('Nicht alle Demo-User gefunden (ta/rm/sm/learner).');
  }

  // Store shortcuts
  const store1 = stores[0]; // Düsseldorf Kö
  const store2 = stores[1]; // Essen Limbecker
  const store3 = stores[2]; // Köln Schildergasse
  const allStores = [store1, store2, store3];
  const allUsers = [ta, rm, mm, sm, learner].filter(Boolean);

  console.log(`Tenant: ${tenant.name} (${tenantId})`);
  console.log(`Stores: ${stores.map((s) => s.name).join(', ')}`);
  console.log(`Users:  ${users.map((u) => u.email).join(', ')}\n`);

  // ======================================================================
  // 1. CHECKLISTEN
  // ======================================================================
  try {
    const existingCount = await prisma.checklistSession.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Checklisten: bereits vorhanden — übersprungen');
    } else {
      const template = await prisma.checklistTemplate.findFirst({
        where: { isDefault: true, name: 'Store Visit Checklist' },
        include: { sections: { include: { items: true } } },
      });
      if (!template) throw new Error('Checklist template nicht gefunden');

      const allItems = template.sections.flatMap((s) => s.items);
      const sessionConfigs = [
        { store: store1, user: sm, daysAgo: 3, status: 'COMPLETED' as const },
        { store: store2, user: rm, daysAgo: 7, status: 'COMPLETED' as const },
        { store: store3, user: ta, daysAgo: 1, status: 'COMPLETED' as const },
      ];

      for (const cfg of sessionConfigs) {
        const sessionId = id('chk_sess');
        await prisma.checklistSession.create({
          data: {
            id: sessionId,
            tenantId,
            storeId: cfg.store.id,
            templateId: template.id,
            conductedBy: cfg.user.id,
            status: cfg.status,
            completionRate: 100,
            notes: 'Demo Store-Visit',
            startedAt: daysAgo(cfg.daysAgo),
            completedAt: daysAgo(cfg.daysAgo),
            entries: {
              create: allItems.map((item) => {
                const result = pick(['PASS', 'PASS', 'PASS', 'FAIL', 'NA'] as const);
                return {
                  id: id('chk_ent'),
                  itemId: item.id,
                  valueBool: result === 'NA' ? null : result === 'PASS',
                  comment: result === 'FAIL' ? 'Nachbesserung erforderlich' : null,
                  answeredAt: daysAgo(cfg.daysAgo),
                };
              }),
            },
          },
        });
      }
      log('✓ Checklisten: 3 Sessions mit Einträgen erstellt');
    }
  } catch (e) {
    console.error('✗ Checklisten:', e);
  }

  // ======================================================================
  // 2. STORE EXCELLENCE AUDIT
  // ======================================================================
  try {
    const existingCount = await prisma.auditSession.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Store Excellence Audit: bereits vorhanden — übersprungen');
    } else {
      const template = await prisma.auditTemplate.findFirst({
        where: { isDefault: true, name: 'KORE Store Excellence Standard' },
        include: { categories: { include: { criteria: true } } },
      });
      if (!template) throw new Error('Audit template nicht gefunden');

      const allCriteria = template.categories.flatMap((c) => c.criteria);
      const auditConfigs = [
        { store: store1, user: rm.id, daysAgo: 14, score: 87.5 },
        { store: store2, user: ta.id, daysAgo: 5, score: 72.3 },
      ];

      for (const cfg of auditConfigs) {
        const sessionId = id('aud_sess');
        await prisma.auditSession.create({
          data: {
            id: sessionId,
            tenantId,
            storeId: cfg.store.id,
            templateId: template.id,
            conductedBy: cfg.user,
            status: 'COMPLETED',
            overallScore: cfg.score,
            notes: 'Planmäßiges Quartals-Audit',
            startedAt: daysAgo(cfg.daysAgo),
            completedAt: daysAgo(cfg.daysAgo),
            responses: {
              create: allCriteria.map((cr) => {
                const passed = Math.random() > 0.25;
                return {
                  id: id('aud_resp'),
                  criterionId: cr.id,
                  scorePercent: passed ? randInt(75, 100) : randInt(30, 60),
                  passed,
                  comment: passed ? null : 'Verbesserungsbedarf',
                };
              }),
            },
          },
        });
      }
      log('✓ Store Excellence Audit: 2 abgeschlossene Audits erstellt');
    }
  } catch (e) {
    console.error('✗ Store Excellence Audit:', e);
  }

  // ======================================================================
  // 3. SOP BIBLIOTHEK — Acknowledgments
  // ======================================================================
  try {
    const existingCount = await prisma.sopAcknowledgment.count();
    if (existingCount > 0) {
      log('⏭  SOP Acknowledgments: bereits vorhanden — übersprungen');
    } else {
      const sops = await prisma.sop.findMany({ where: { status: 'PUBLISHED' }, take: 3 });
      if (sops.length === 0) throw new Error('Keine publizierten SOPs gefunden');

      const ackUsers = [sm, learner, rm, ta, mm].filter(Boolean);
      let count = 0;
      for (const sop of sops) {
        // Not all users acknowledge every SOP
        const subset = ackUsers.slice(0, randInt(2, ackUsers.length));
        for (const u of subset) {
          await prisma.sopAcknowledgment.create({
            data: {
              id: id('sop_ack'),
              sopId: sop.id,
              userId: u.id,
              acknowledgedAt: daysAgo(randInt(1, 30)),
            },
          });
          count++;
        }
      }
      log(`✓ SOP Bibliothek: ${count} Acknowledgments erstellt`);
    }
  } catch (e) {
    console.error('✗ SOP Bibliothek:', e);
  }

  // ======================================================================
  // 4. VM FOTO-COMPLIANCE
  // ======================================================================
  try {
    const existingCount = await prisma.vmSubmission.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  VM Foto-Compliance: bereits vorhanden — übersprungen');
    } else {
      // Create VM guidelines first
      const guidelineData = [
        { name: 'Schaufenster Frühling', category: 'Schaufenster', desc: 'Frühlingsdekoration mit hellen Farben' },
        { name: 'Eingangsbereich Standard', category: 'Eingang', desc: 'Willkommensdisplay und aktuelle Kampagne' },
        { name: 'Kassenbereich Ordnung', category: 'Kasse', desc: 'Aufgeräumter Kassenbereich mit Impulskauf-Artikeln' },
        { name: 'Warenträger Damenmode', category: 'Warenträger', desc: 'Farblich sortiert, max. 80% Auslastung' },
      ];

      const guidelines = [];
      for (const g of guidelineData) {
        const gl = await prisma.vmGuideline.create({
          data: {
            id: id('vm_gl'),
            tenantId,
            name: g.name,
            description: g.desc,
            category: g.category,
            referencePhoto: `/uploads/vm/reference/${g.category.toLowerCase()}.jpg`,
            createdBy: ta.id,
          },
        });
        guidelines.push(gl);
      }

      const statuses = ['PENDING', 'APPROVED', 'APPROVED', 'APPROVED', 'REJECTED', 'PENDING', 'APPROVED', 'REJECTED'] as const;
      const submitters = [sm, learner, sm, learner, sm, learner, sm, learner];

      for (let i = 0; i < 8; i++) {
        const status = statuses[i];
        const isReviewed = status !== 'PENDING';
        await prisma.vmSubmission.create({
          data: {
            id: id('vm_sub'),
            tenantId,
            guidelineId: guidelines[i % guidelines.length].id,
            storeId: allStores[i % allStores.length].id,
            submittedBy: submitters[i].id,
            photoPath: `/uploads/vm/submissions/sub_${i + 1}.jpg`,
            status,
            reviewedBy: isReviewed ? rm.id : null,
            reviewNote: status === 'REJECTED' ? 'Nicht gemäß Guideline — bitte erneut einreichen' : (isReviewed ? 'Sehr gut umgesetzt' : null),
            submittedAt: daysAgo(randInt(1, 14)),
            reviewedAt: isReviewed ? daysAgo(randInt(0, 3)) : null,
          },
        });
      }
      log('✓ VM Foto-Compliance: 4 Guidelines + 8 Submissions erstellt');
    }
  } catch (e) {
    console.error('✗ VM Foto-Compliance:', e);
  }

  // ======================================================================
  // 5. STORE STANDARDS (Personalkosten-Planer) — Evaluations
  // ======================================================================
  try {
    const existingCount = await prisma.standardEvaluation.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Store Standards: bereits vorhanden — übersprungen');
    } else {
      const definitions = await prisma.standardDefinition.findMany({ where: { tenantId: null } });
      if (definitions.length === 0) throw new Error('Keine StandardDefinitions gefunden');

      const now = new Date();
      const evalConfigs = [
        { store: store1, period: `${now.getFullYear()}-KW${String(getISOWeek(now) - 2).padStart(2, '0')}`, score: 88.5 },
        { store: store2, period: `${now.getFullYear()}-KW${String(getISOWeek(now) - 1).padStart(2, '0')}`, score: 76.0 },
        { store: store3, period: monthStr(now), score: 92.1 },
      ];

      for (const cfg of evalConfigs) {
        const evalId = id('std_eval');
        await prisma.standardEvaluation.create({
          data: {
            id: evalId,
            tenantId,
            storeId: cfg.store.id,
            evaluatedBy: rm.id,
            period: cfg.period,
            overallScore: cfg.score,
            status: 'COMPLETED',
            completedAt: daysAgo(2),
            scores: {
              create: definitions.map((def) => {
                const actualValue = def.operator === 'LTE'
                  ? randFloat(def.targetValue * 0.8, def.targetValue * 1.3)
                  : randFloat(def.targetValue * 0.7, def.targetValue * 1.1);
                const passed = def.operator === 'GTE'
                  ? actualValue >= def.targetValue
                  : def.operator === 'LTE'
                    ? actualValue <= def.targetValue
                    : actualValue === def.targetValue;
                return {
                  id: id('std_score'),
                  definitionId: def.id,
                  actualValue,
                  passed,
                  score: passed ? randFloat(80, 100) : randFloat(40, 70),
                  comment: passed ? null : 'Unter Zielwert',
                };
              }),
            },
          },
        });
      }
      log('✓ Store Standards: 3 Evaluierungen mit Scores erstellt');
    }
  } catch (e) {
    console.error('✗ Store Standards:', e);
  }

  // ======================================================================
  // 6. KPI DASHBOARD — 90 days of daily KPIs for 3 stores
  // ======================================================================
  try {
    const existingCount = await prisma.kpiEntry.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  KPI Dashboard: bereits vorhanden — übersprungen');
    } else {
      const entries: {
        id: string;
        tenantId: string;
        storeId: string;
        date: string;
        revenue: number;
        transactions: number;
        footfall: number;
        unitsSold: number;
        staffHours: number;
        enteredBy: string;
      }[] = [];

      for (const store of allStores) {
        // Different baseline per store
        const revenueBase = store === store1 ? 18000 : store === store2 ? 12000 : 15000;
        for (let day = 0; day < 90; day++) {
          const date = daysAgo(90 - day);
          const dayOfWeek = date.getDay();
          // Weekend boost
          const weekendMult = dayOfWeek === 0 || dayOfWeek === 6 ? 1.4 : 1.0;
          // Slight upward trend
          const trendMult = 1 + (day / 90) * 0.08;
          const revenue = Math.round(revenueBase * weekendMult * trendMult * randFloat(0.85, 1.15));
          const transactions = Math.round(revenue / randFloat(55, 85));
          const footfall = Math.round(transactions * randFloat(2.5, 4.0));
          const unitsSold = Math.round(transactions * randFloat(1.3, 2.2));
          const staffHours = randFloat(40, 120);

          entries.push({
            id: id('kpi'),
            tenantId,
            storeId: store.id,
            date: isoDate(date),
            revenue,
            transactions,
            footfall,
            unitsSold,
            staffHours,
            enteredBy: sm.id,
          });
        }
      }

      // createMany for performance
      await prisma.kpiEntry.createMany({ data: entries });
      log(`✓ KPI Dashboard: ${entries.length} Einträge erstellt (90 Tage × 3 Stores)`);
    }
  } catch (e) {
    console.error('✗ KPI Dashboard:', e);
  }

  // ======================================================================
  // 7. BUDGET TRACKER
  // ======================================================================
  try {
    const existingCount = await prisma.budgetPeriod.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Budget Tracker: bereits vorhanden — übersprungen');
    } else {
      const now = new Date();

      for (const store of allStores.slice(0, 2)) {
        // 3 monthly budget periods per store (current + 2 previous months)
        for (let m = 0; m < 3; m++) {
          const periodDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
          const period = monthStr(periodDate);
          const budgetId = id('bud_per');

          const revenueTarget = store === store1 ? 450000 : 320000;
          await prisma.budgetPeriod.create({
            data: {
              id: budgetId,
              tenantId,
              storeId: store.id,
              period,
              budgetType: 'MONTHLY',
              revenue: revenueTarget,
              cogs: Math.round(revenueTarget * 0.45),
              labor: Math.round(revenueTarget * 0.18),
              rent: store === store1 ? 12000 : 8500,
              marketing: 3500,
              other: 2000,
              notes: `Monatsbudget ${period}`,
              createdBy: ta.id,
              actuals: {
                create: generateBudgetActuals(budgetId, period, ta.id, revenueTarget),
              },
            },
          });
        }
      }
      log('✓ Budget Tracker: 6 Budgetperioden + Ist-Werte erstellt');
    }
  } catch (e) {
    console.error('✗ Budget Tracker:', e);
  }

  // ======================================================================
  // 8. FORECAST
  // ======================================================================
  try {
    const existingCount = await prisma.forecast.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Forecast: bereits vorhanden — übersprungen');
    } else {
      const forecasts: {
        id: string;
        tenantId: string;
        storeId: string;
        period: string;
        forecastType: string;
        forecastValue: number;
        actualValue: number | null;
        confidence: number;
        method: string;
        createdBy: string;
      }[] = [];

      const now = new Date();
      for (const store of allStores) {
        const baseRevenue = store === store1 ? 18000 : store === store2 ? 12000 : 15000;
        for (let week = 0; week < 10; week++) {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (week * 7));
          const weekNum = getISOWeek(d);
          const period = `${d.getFullYear()}-KW${String(weekNum).padStart(2, '0')}`;
          const forecastValue = Math.round(baseRevenue * 7 * randFloat(0.92, 1.08));
          // Past weeks have actual values
          const hasActual = week > 0;
          forecasts.push({
            id: id('fc'),
            tenantId,
            storeId: store.id,
            period,
            forecastType: 'REVENUE',
            forecastValue,
            actualValue: hasActual ? Math.round(forecastValue * randFloat(0.9, 1.12)) : null,
            confidence: randFloat(65, 95),
            method: pick(['TREND', 'MANUAL', 'AI']),
            createdBy: rm.id,
          });
        }
      }

      await prisma.forecast.createMany({ data: forecasts });
      log(`✓ Forecast: ${forecasts.length} Einträge erstellt`);
    }
  } catch (e) {
    console.error('✗ Forecast:', e);
  }

  // ======================================================================
  // 9. LOSS PREVENTION
  // ======================================================================
  try {
    const existingCount = await prisma.lossIncident.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Loss Prevention: bereits vorhanden — übersprungen');
    } else {
      const categories = ['THEFT', 'DAMAGE', 'ADMIN_ERROR', 'SUPPLIER', 'OTHER'] as const;
      const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
      const statusOptions = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'] as const;

      const incidentDescriptions: Record<string, string[]> = {
        THEFT: [
          'Diebstahl Lederjacke Größe 40 — Videoauswertung läuft',
          'Ladendiebstahl Parfum-Abteilung — Täter identifiziert',
          'Verdacht auf internen Diebstahl Lagerzugang',
          'Organisierter Diebstahl 3 Handtaschen — Polizei informiert',
        ],
        DAMAGE: [
          'Wasserschaden Lager durch defekte Leitung',
          'Beschädigte Ware aus Lieferung — 12 Teile betroffen',
          'Umgekipptes Regal Herrenmode — 5 Hemden beschädigt',
        ],
        ADMIN_ERROR: [
          'Falsche Preisauszeichnung Sale-Artikel — Differenz 340€',
          'Doppelte Gutschrift Kasse 2 — wird korrigiert',
        ],
        SUPPLIER: [
          'Fehllieferung 50 Stk Winterjacken statt Sommerkleider',
          'Beschädigte Verpackung bei Anlieferung — 8 Artikel',
        ],
        OTHER: [
          'Unbekannter Schwund bei Inventur festgestellt',
          'Kassendifferenz Abendschicht +/- 23€',
          'Nicht zuordenbare Ware im Lager gefunden',
        ],
      };

      const incidents: {
        id: string;
        tenantId: string;
        storeId: string;
        incidentDate: string;
        category: string;
        amount: number;
        description: string;
        severity: string;
        status: string;
        resolution: string | null;
        reportedBy: string;
        assignedTo: string | null;
        resolvedAt: Date | null;
      }[] = [];

      for (let i = 0; i < 15; i++) {
        const cat = pick(categories);
        const status = pick(statusOptions);
        const severity = pick(severities);
        const descs = incidentDescriptions[cat];
        const amount = cat === 'THEFT' ? randFloat(50, 800) : cat === 'DAMAGE' ? randFloat(100, 2000) : randFloat(20, 500);

        incidents.push({
          id: id('loss'),
          tenantId,
          storeId: pick(allStores).id,
          incidentDate: isoDate(daysAgo(randInt(0, 60))),
          category: cat,
          amount,
          description: pick(descs),
          severity,
          status,
          resolution: status === 'RESOLVED' || status === 'CLOSED' ? 'Vorfall aufgeklärt und dokumentiert' : null,
          reportedBy: pick([sm, learner]).id,
          assignedTo: status !== 'OPEN' ? pick([rm, ta]).id : null,
          resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? daysAgo(randInt(0, 5)) : null,
        });
      }

      await prisma.lossIncident.createMany({ data: incidents });
      log('✓ Loss Prevention: 15 Vorfälle erstellt');
    }
  } catch (e) {
    console.error('✗ Loss Prevention:', e);
  }

  // ======================================================================
  // 10. INVENTORY
  // ======================================================================
  try {
    const existingCount = await prisma.inventoryCount.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Inventory: bereits vorhanden — übersprungen');
    } else {
      const fashionProducts = [
        { sku: 'DK-BLZ-001', name: 'Blazer Klassisch Schwarz', cat: 'Damen', price: 189.99 },
        { sku: 'DK-KLD-002', name: 'Kleid Midi Blau', cat: 'Damen', price: 129.99 },
        { sku: 'DK-BLS-003', name: 'Bluse Seide Weiß', cat: 'Damen', price: 89.99 },
        { sku: 'DK-JNS-004', name: 'Jeans Slim Fit Dunkelblau', cat: 'Damen', price: 99.99 },
        { sku: 'DK-MNT-005', name: 'Mantel Wolle Camel', cat: 'Damen', price: 299.99 },
        { sku: 'HK-HMD-001', name: 'Hemd Business Weiß', cat: 'Herren', price: 79.99 },
        { sku: 'HK-ANZ-002', name: 'Anzughose Anthrazit', cat: 'Herren', price: 119.99 },
        { sku: 'HK-PLO-003', name: 'Poloshirt Navy', cat: 'Herren', price: 59.99 },
        { sku: 'HK-JCK-004', name: 'Jacke Leder Braun', cat: 'Herren', price: 349.99 },
        { sku: 'HK-PUL-005', name: 'Pullover Cashmere Grau', cat: 'Herren', price: 199.99 },
        { sku: 'AK-SCH-001', name: 'Schal Kaschmir Rot', cat: 'Accessoires', price: 69.99 },
        { sku: 'AK-GRT-002', name: 'Gürtel Leder Schwarz', cat: 'Accessoires', price: 49.99 },
        { sku: 'AK-TAS-003', name: 'Handtasche City Beige', cat: 'Accessoires', price: 159.99 },
        { sku: 'AK-BRL-004', name: 'Brille Sonnen Aviator', cat: 'Accessoires', price: 119.99 },
        { sku: 'DK-RCK-006', name: 'Rock A-Linie Schwarz', cat: 'Damen', price: 79.99 },
        { sku: 'DK-TOP-007', name: 'Top Satin Bordeaux', cat: 'Damen', price: 59.99 },
        { sku: 'HK-CHI-005', name: 'Chino Beige', cat: 'Herren', price: 89.99 },
        { sku: 'HK-SNK-006', name: 'Sneaker Weiß Premium', cat: 'Herren', price: 139.99 },
        { sku: 'AK-UHR-005', name: 'Uhr Analog Silber', cat: 'Accessoires', price: 229.99 },
        { sku: 'AK-PRF-006', name: 'Parfum Eau de Toilette 50ml', cat: 'Accessoires', price: 89.99 },
      ];

      const countConfigs = [
        { store: store1, type: 'FULL', daysAgo: 30, status: 'COMPLETED' },
        { store: store2, type: 'CYCLE', daysAgo: 7, status: 'COMPLETED' },
      ];

      for (const cfg of countConfigs) {
        const countId = id('inv_cnt');
        let totalDiscrepancies = 0;
        let totalValue = 0;
        const items = fashionProducts.map((p) => {
          const expected = randInt(5, 30);
          const actual = expected + randInt(-3, 2);
          const disc = actual - expected;
          if (disc !== 0) totalDiscrepancies++;
          const discValue = disc * p.price;
          totalValue += actual * p.price;
          return {
            id: id('inv_item'),
            sku: p.sku,
            productName: p.name,
            category: p.cat,
            expectedQty: expected,
            actualQty: actual,
            unitPrice: p.price,
            discrepancy: disc,
            discrepancyValue: Math.round(discValue * 100) / 100,
            countedAt: daysAgo(cfg.daysAgo),
          };
        });

        await prisma.inventoryCount.create({
          data: {
            id: countId,
            tenantId,
            storeId: cfg.store.id,
            countDate: isoDate(daysAgo(cfg.daysAgo)),
            countType: cfg.type,
            status: cfg.status,
            totalItems: items.length,
            countedItems: items.length,
            discrepancies: totalDiscrepancies,
            totalValue: Math.round(totalValue * 100) / 100,
            conductedBy: sm.id,
            completedAt: daysAgo(cfg.daysAgo),
            items: { create: items },
          },
        });
      }
      log('✓ Inventory: 2 Inventuren mit je 20 Artikeln erstellt');
    }
  } catch (e) {
    console.error('✗ Inventory:', e);
  }

  // ======================================================================
  // 11. LIVE FLOOR — Staff Positions & Frequency Logs
  // ======================================================================
  try {
    const existingPositions = await prisma.floorStaffPosition.count({ where: { tenantId } });
    if (existingPositions > 0) {
      log('⏭  Live Floor: bereits vorhanden — übersprungen');
    } else {
      // Fetch zones (created by the tool setup or seed)
      const zones = await prisma.floorZone.findMany({ where: { tenantId } });

      if (zones.length === 0) {
        // Create zones if they don't exist
        const zoneNames = ['Eingang', 'Damenmode', 'Herrenmode', 'Accessoires', 'Kasse', 'Umkleiden'];
        for (const store of allStores) {
          for (let i = 0; i < zoneNames.length; i++) {
            await prisma.floorZone.create({
              data: {
                id: id('zone'),
                tenantId,
                storeId: store.id,
                name: zoneNames[i],
                sortOrder: i,
                minStaff: i === 4 ? 2 : 1, // Kasse needs 2
                maxStaff: i === 0 ? 2 : 4,
                customerCount: randInt(0, 15),
              },
            });
          }
        }
      }

      const allZones = await prisma.floorZone.findMany({ where: { tenantId } });
      const store1Zones = allZones.filter((z) => z.storeId === store1.id);

      // 10 staff positions
      const staffStatuses = ['ON_FLOOR', 'ON_FLOOR', 'ON_FLOOR', 'ON_BREAK', 'CASHIER'] as const;
      const positionUsers = [sm, learner, sm, learner, sm, learner, sm, learner, sm, learner];
      for (let i = 0; i < 10; i++) {
        const zone = store1Zones[i % store1Zones.length];
        const user = positionUsers[i % positionUsers.length];
        await prisma.floorStaffPosition.create({
          data: {
            id: id('floor_pos'),
            tenantId,
            storeId: store1.id,
            zoneId: zone?.id ?? null,
            userId: user.id,
            userName: user.name,
            role: pick(['Verkäufer/in', 'Kassierer/in', 'Teamleitung']),
            status: pick(staffStatuses),
            startedAt: hoursAgo(randInt(1, 6)),
            updatedBy: sm.id,
          },
        });
      }

      // 20 frequency logs for today and yesterday
      const freqLogs: {
        id: string;
        tenantId: string;
        storeId: string;
        zoneId: string;
        customerCount: number;
        staffCount: number;
        hour: number;
        date: string;
        recordedBy: string;
      }[] = [];

      for (let i = 0; i < 20; i++) {
        const isToday = i < 10;
        const date = isToday ? new Date() : daysAgo(1);
        const zone = store1Zones[i % store1Zones.length];
        if (!zone) continue;
        freqLogs.push({
          id: id('freq'),
          tenantId,
          storeId: store1.id,
          zoneId: zone.id,
          customerCount: randInt(2, 25),
          staffCount: randInt(1, 4),
          hour: 9 + (i % 10),
          date: isoDate(date),
          recordedBy: sm.id,
        });
      }

      await prisma.floorFrequencyLog.createMany({ data: freqLogs });
      log('✓ Live Floor: 10 Positionen + 20 Frequenz-Logs erstellt');
    }
  } catch (e) {
    console.error('✗ Live Floor:', e);
  }

  // ======================================================================
  // 12. FR TRACKING — Footfall entries (hourly)
  // ======================================================================
  try {
    const existingCount = await prisma.footfallEntry.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  FR Tracking: bereits vorhanden — übersprungen');
    } else {
      const entries: {
        id: string;
        tenantId: string;
        storeId: string;
        date: string;
        hour: number;
        footfall: number;
        revenue: number;
        transactions: number;
        conversionRate: number;
        enteredBy: string;
      }[] = [];

      for (const store of [store1, store2]) {
        for (let day = 0; day < 60; day++) {
          const date = daysAgo(60 - day);
          // Only open hours 9-20
          for (let hour = 9; hour <= 20; hour++) {
            // Peak hours pattern
            const isPeak = (hour >= 11 && hour <= 13) || (hour >= 16 && hour <= 18);
            const baseFootfall = isPeak ? 35 : 15;
            const footfall = randInt(baseFootfall - 8, baseFootfall + 12);
            const conversionRate = randFloat(15, 45);
            const transactions = Math.round(footfall * conversionRate / 100);
            const revenue = Math.round(transactions * randFloat(55, 95));

            entries.push({
              id: id('ff'),
              tenantId,
              storeId: store.id,
              date: isoDate(date),
              hour,
              footfall,
              revenue,
              transactions,
              conversionRate,
              enteredBy: sm.id,
            });
          }
        }
      }

      // Insert in batches of 500 to avoid SQLite limits
      for (let i = 0; i < entries.length; i += 500) {
        await prisma.footfallEntry.createMany({ data: entries.slice(i, i + 500) });
      }
      log(`✓ FR Tracking: ${entries.length} stündliche Footfall-Einträge erstellt (60 Tage × 2 Stores)`);
    }
  } catch (e) {
    console.error('✗ FR Tracking:', e);
  }

  // ======================================================================
  // 13. VM GUIDELINES DOCUMENTS
  // ======================================================================
  try {
    const existingCount = await prisma.vmGuidelineDoc.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  VM Guidelines Docs: bereits vorhanden — übersprungen');
    } else {
      const docs = [
        {
          title: 'Schaufenstergestaltung Frühjahr/Sommer 2026',
          category: 'Schaufenster',
          content: `# Schaufenstergestaltung Frühjahr/Sommer 2026\n\n## Farbpalette\n- Hauptfarben: Pastellrosa, Hellblau, Salbeigrün\n- Akzentfarben: Gold, Weiß\n\n## Aufbau\n1. Zentrale Figurine mit Highlight-Outfit\n2. Farblich abgestimmte Accessoires\n3. Dekoration: Frühlingsblumen, helle Stoffe\n\n## Wechselrhythmus\n- Alle 2 Wochen Outfit-Wechsel\n- Monatlich Dekorations-Update`,
          status: 'PUBLISHED',
          images: [
            { path: '/uploads/vm/guidelines/ss26_reference_1.jpg', caption: 'Referenz Hauptfenster' },
            { path: '/uploads/vm/guidelines/ss26_reference_2.jpg', caption: 'Detail Accessoire-Aufbau' },
          ],
        },
        {
          title: 'Warenträger-Standard Damenmode',
          category: 'Warenträger',
          content: `# Warenträger-Standard Damenmode\n\n## Grundregeln\n- Maximale Bestückung: 80% der Kapazität\n- Farbverlauf: Hell nach Dunkel (links nach rechts)\n- Größensortierung: S → XL\n\n## Abstände\n- Bügel-Abstand: mindestens 3cm\n- Zwischen Warenträgern: 120cm Durchgang\n\n## Beschilderung\n- Jeder Warenträger mit Kategorie-Schild\n- Preisgruppen deutlich markiert`,
          status: 'PUBLISHED',
          images: [
            { path: '/uploads/vm/guidelines/wt_standard_1.jpg', caption: 'Korrekte Bestückung' },
          ],
        },
        {
          title: 'Kassenbereich Layout',
          category: 'Kasse',
          content: `# Kassenbereich Layout\n\n## Impulskauf-Zone\n- Kleine Accessoires unter 30€\n- Saisonal wechselnde Artikel\n- Geschenkverpackungen sichtbar\n\n## Ordnung\n- Freie Sicht auf Kasse\n- Taschen hinter der Kasse\n- Einheitliche Beutelpräsentation`,
          status: 'PUBLISHED',
          images: [
            { path: '/uploads/vm/guidelines/kasse_layout_1.jpg', caption: 'Kassenbereich Referenz' },
            { path: '/uploads/vm/guidelines/kasse_layout_2.jpg', caption: 'Impulskauf-Aufsteller' },
          ],
        },
      ];

      for (const doc of docs) {
        await prisma.vmGuidelineDoc.create({
          data: {
            id: id('vm_doc'),
            tenantId,
            title: doc.title,
            category: doc.category,
            content: doc.content,
            version: 1,
            status: doc.status,
            effectiveFrom: isoDate(daysAgo(30)),
            createdBy: ta.id,
            publishedAt: daysAgo(28),
            images: {
              create: doc.images.map((img, idx) => ({
                id: id('vm_img'),
                imagePath: img.path,
                caption: img.caption,
                sortOrder: idx,
              })),
            },
          },
        });
      }
      log('✓ VM Guidelines: 3 Guideline-Dokumente mit Bildern erstellt');
    }
  } catch (e) {
    console.error('✗ VM Guidelines:', e);
  }

  // ======================================================================
  // 14. MAINTENANCE
  // ======================================================================
  try {
    const existingCount = await prisma.maintenanceRequest.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Maintenance: bereits vorhanden — übersprungen');
    } else {
      const maintenanceData = [
        { title: 'Beleuchtung Schaufenster defekt', desc: 'LED-Spots im Schaufenster links ausgefallen. 3 von 5 Spots betroffen.', cat: 'ELECTRICAL', prio: 'HIGH', status: 'IN_PROGRESS', cost: 350 },
        { title: 'Klimaanlage Obergeschoss', desc: 'Kühlung im OG funktioniert nur eingeschränkt. Temperatur liegt bei 28°C.', cat: 'HVAC', prio: 'URGENT', status: 'IN_PROGRESS', cost: 1200 },
        { title: 'Waschbecken Mitarbeiter-WC tropft', desc: 'Permanentes Tropfen am Wasserhahn. Dichtung vermutlich defekt.', cat: 'PLUMBING', prio: 'LOW', status: 'OPEN', cost: null },
        { title: 'Kassenterminal 3 reagiert verzögert', desc: 'Terminal hat ~5 Sek. Verzögerung bei Kartenzahlungen. Neustart hilft temporär.', cat: 'IT', prio: 'MEDIUM', status: 'OPEN', cost: null },
        { title: 'Umkleidekabine 4 — Schloss defekt', desc: 'Kabinentür lässt sich nicht mehr richtig verschließen.', cat: 'FIXTURE', prio: 'HIGH', status: 'RESOLVED', cost: 85 },
        { title: 'Eingangstür schließt nicht komplett', desc: 'Automatische Schiebetür hat Verzögerung beim Schließen. Sensor prüfen.', cat: 'FIXTURE', prio: 'MEDIUM', status: 'RESOLVED', cost: 220 },
        { title: 'WLAN-Router Lager ausgefallen', desc: 'Mitarbeiter können im Lager keine Artikel scannen.', cat: 'IT', prio: 'HIGH', status: 'RESOLVED', cost: 150 },
        { title: 'Teppich Eingangsbereich abgenutzt', desc: 'Stolpergefahr durch hochstehende Ecken. Austausch empfohlen.', cat: 'FIXTURE', prio: 'MEDIUM', status: 'OPEN', cost: null },
        { title: 'Aufzug-TÜV fällig', desc: 'Nächste TÜV-Prüfung in 4 Wochen. Termin vereinbaren.', cat: 'OTHER', prio: 'MEDIUM', status: 'OPEN', cost: 450 },
        { title: 'Neon-Schild "SALE" defekt', desc: 'Zwei Buchstaben des beleuchteten Schilds funktionieren nicht mehr.', cat: 'ELECTRICAL', prio: 'LOW', status: 'OPEN', cost: null },
        { title: 'Heizung Lager macht Geräusche', desc: 'Klopfgeräusche aus der Heizungsanlage im Lagerbereich.', cat: 'HVAC', prio: 'LOW', status: 'RESOLVED', cost: 180 },
        { title: 'Feuerlöscher-Prüfung überfällig', desc: '3 Feuerlöscher müssen zur Wartung — gesetzliche Pflicht.', cat: 'OTHER', prio: 'HIGH', status: 'IN_PROGRESS', cost: 200 },
      ];

      for (let i = 0; i < maintenanceData.length; i++) {
        const m = maintenanceData[i];
        const isResolved = m.status === 'RESOLVED';
        await prisma.maintenanceRequest.create({
          data: {
            id: id('maint'),
            tenantId,
            storeId: allStores[i % allStores.length].id,
            title: m.title,
            description: m.desc,
            category: m.cat,
            priority: m.prio,
            status: m.status,
            reportedBy: pick([sm, learner]).id,
            assignedTo: m.status !== 'OPEN' ? pick([ta, rm]).id : null,
            estimatedCost: m.cost,
            actualCost: isResolved && m.cost ? m.cost * randFloat(0.9, 1.2) : null,
            resolvedAt: isResolved ? daysAgo(randInt(1, 5)) : null,
          },
        });
      }
      log('✓ Maintenance: 12 Wartungsanfragen erstellt');
    }
  } catch (e) {
    console.error('✗ Maintenance:', e);
  }

  // ======================================================================
  // 15. TRAINING HUB / LMS — Courses, Enrollments, Certificates
  // ======================================================================
  try {
    const existingCourses = await prisma.course.count({ where: { tenantId } });
    if (existingCourses > 0) {
      log('⏭  Training Hub: bereits vorhanden — übersprungen');
    } else {
      const courseData = [
        { title: 'Produktwissen Damenmode SS26', cat: 'Produkt', dur: 60, required: true, status: 'PUBLISHED' },
        { title: 'Verkaufstraining: Cross-Selling', cat: 'Verkauf', dur: 45, required: true, status: 'PUBLISHED' },
        { title: 'Visual Merchandising Grundlagen', cat: 'VM', dur: 90, required: false, status: 'PUBLISHED' },
        { title: 'Compliance & Datenschutz 2026', cat: 'Compliance', dur: 30, required: true, status: 'PUBLISHED' },
      ];

      const courses = [];
      for (const c of courseData) {
        const course = await prisma.course.create({
          data: {
            id: id('course'),
            tenantId,
            title: c.title,
            description: `Pflicht-Training: ${c.title}`,
            category: c.cat,
            durationMinutes: c.dur,
            isRequired: c.required,
            status: c.status,
            createdBy: ta.id,
            modules: {
              create: [
                { id: id('mod'), title: 'Einführung', content: `# ${c.title} — Einführung\n\nWillkommen zum Kurs.`, sortOrder: 0, durationMinutes: Math.round(c.dur * 0.2) },
                { id: id('mod'), title: 'Hauptteil', content: `# ${c.title} — Hauptteil\n\nKerninhalt des Kurses.`, sortOrder: 1, durationMinutes: Math.round(c.dur * 0.6) },
                { id: id('mod'), title: 'Zusammenfassung & Quiz', content: `# ${c.title} — Abschluss\n\nWiederholung und Test.`, sortOrder: 2, durationMinutes: Math.round(c.dur * 0.2) },
              ],
            },
          },
        });
        courses.push(course);
      }

      // 8 enrollments (various users, various statuses)
      const enrollments = [
        { course: 0, user: sm, status: 'COMPLETED', progress: 100 },
        { course: 0, user: learner, status: 'IN_PROGRESS', progress: 65 },
        { course: 1, user: sm, status: 'COMPLETED', progress: 100 },
        { course: 1, user: learner, status: 'COMPLETED', progress: 100 },
        { course: 2, user: learner, status: 'IN_PROGRESS', progress: 30 },
        { course: 2, user: sm, status: 'ENROLLED', progress: 0 },
        { course: 3, user: sm, status: 'COMPLETED', progress: 100 },
        { course: 3, user: learner, status: 'IN_PROGRESS', progress: 50 },
      ];

      for (const e of enrollments) {
        const enrollmentId = id('enroll');
        const isCompleted = e.status === 'COMPLETED';
        await prisma.courseEnrollment.create({
          data: {
            id: enrollmentId,
            courseId: courses[e.course].id,
            userId: e.user.id,
            storeId: store1.id,
            status: e.status,
            progress: e.progress,
            completedAt: isCompleted ? daysAgo(randInt(3, 20)) : null,
          },
        });

        // Certificate for completed enrollments
        if (isCompleted) {
          await prisma.certificate.create({
            data: {
              id: id('cert'),
              enrollmentId,
              userId: e.user.id,
              courseName: courses[e.course].title,
              issuedAt: daysAgo(randInt(2, 19)),
              expiresAt: daysFromNow(365),
            },
          });
        }
      }
      log('✓ Training Hub: 4 Kurse + 8 Enrollments + 4 Zertifikate erstellt');
    }
  } catch (e) {
    console.error('✗ Training Hub:', e);
  }

  // ======================================================================
  // 16. TRAINING HOURS
  // ======================================================================
  try {
    const existingCount = await prisma.trainingLog.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Training Hours: bereits vorhanden — übersprungen');
    } else {
      const categories = ['PRODUCT', 'SALES', 'SERVICE', 'COMPLIANCE'] as const;
      const topics: Record<string, string[]> = {
        PRODUCT: ['Neue Kollektion SS26', 'Materialien & Pflege', 'Markenportfolio', 'Größenberatung'],
        SALES: ['Cross-Selling Techniken', 'Einwandbehandlung', 'Abschlusstechniken', 'VIP-Beratung'],
        SERVICE: ['Reklamationsmanagement', 'Kundenansprache', 'Beschwerdehandling', 'Telefonservice'],
        COMPLIANCE: ['DSGVO-Schulung', 'Brandschutz', 'Erste Hilfe Auffrischung', 'Arbeitssicherheit'],
      };

      const logs: {
        id: string;
        tenantId: string;
        storeId: string;
        userId: string;
        date: string;
        durationMinutes: number;
        category: string;
        topic: string;
        notes: string | null;
        verifiedBy: string | null;
      }[] = [];

      for (let i = 0; i < 40; i++) {
        const cat = pick(categories);
        const user = pick([sm, learner, sm, learner, learner]);
        logs.push({
          id: id('tlog'),
          tenantId,
          storeId: pick(allStores).id,
          userId: user.id,
          date: isoDate(daysAgo(randInt(1, 60))),
          durationMinutes: pick([15, 30, 45, 60, 90, 120]),
          category: cat,
          topic: pick(topics[cat]),
          notes: i % 3 === 0 ? 'Gute Teilnahme und aktive Mitarbeit' : null,
          verifiedBy: i % 2 === 0 ? sm.id : null,
        });
      }

      await prisma.trainingLog.createMany({ data: logs });
      log('✓ Training Hours: 40 Trainingseinträge erstellt');
    }
  } catch (e) {
    console.error('✗ Training Hours:', e);
  }

  // ======================================================================
  // 17. CHALLENGES
  // ======================================================================
  try {
    const existingCount = await prisma.challenge.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Challenges: bereits vorhanden — übersprungen');
    } else {
      const challengeConfigs = [
        {
          title: 'Umsatz-Challenge März',
          desc: 'Wer erreicht den höchsten Tagesumsatz im März?',
          mode: 'KPI',
          type: 'INDIVIDUAL',
          metric: 'revenue',
          target: 25000,
          status: 'ACTIVE',
          start: daysAgo(15),
          end: daysFromNow(15),
          reward: 'Gutschein 100€ + Ehrung im Newsletter',
          rewardType: 'PRIZE',
        },
        {
          title: 'Cross-Selling Wochen-Battle',
          desc: 'Welches Store-Team schafft den höchsten UPT (Units per Transaction)?',
          mode: 'KPI',
          type: 'STORE',
          metric: 'upt',
          target: 2.5,
          status: 'DRAFT',
          start: daysFromNow(7),
          end: daysFromNow(21),
          reward: 'Team-Frühstück',
          rewardType: 'PRIZE',
        },
        {
          title: 'Beste Schaufenster-Deko',
          desc: 'Kreativste Schaufenstergestaltung — Voting durch alle Mitarbeiter',
          mode: 'VOTING',
          type: 'STORE',
          metric: null,
          target: null,
          status: 'COMPLETED',
          start: daysAgo(45),
          end: daysAgo(15),
          reward: 'Store of the Month Badge',
          rewardType: 'BADGE',
        },
      ];

      for (const cfg of challengeConfigs) {
        const challengeId = id('chal');
        await prisma.challenge.create({
          data: {
            id: challengeId,
            tenantId,
            title: cfg.title,
            description: cfg.desc,
            mode: cfg.mode,
            type: cfg.type,
            metric: cfg.metric,
            targetValue: cfg.target,
            startDate: isoDate(cfg.start),
            endDate: isoDate(cfg.end),
            reward: cfg.reward,
            rewardType: cfg.rewardType,
            status: cfg.status,
            createdBy: ta.id,
          },
        });

        // Add participants to active and completed challenges
        if (cfg.status !== 'DRAFT') {
          for (const u of [sm, learner]) {
            const participantId = id('chal_p');
            await prisma.challengeParticipant.create({
              data: {
                id: participantId,
                challengeId,
                userId: u.id,
                storeId: store1.id,
                currentValue: cfg.status === 'COMPLETED' ? randFloat(1000, 25000) : randFloat(0, 15000),
                rank: u === sm ? 1 : 2,
                completedAt: cfg.status === 'COMPLETED' ? daysAgo(15) : null,
              },
            });

            // Add entries
            for (let i = 0; i < 3; i++) {
              await prisma.challengeEntry.create({
                data: {
                  id: id('chal_e'),
                  challengeId,
                  userId: u.id,
                  value: randFloat(500, 8000),
                  note: i === 0 ? 'Starker Samstag!' : null,
                  createdAt: daysAgo(randInt(1, 30)),
                },
              });
            }
          }
        }
      }
      log('✓ Challenges: 3 Challenges mit Teilnehmern und Einträgen erstellt');
    }
  } catch (e) {
    console.error('✗ Challenges:', e);
  }

  // ======================================================================
  // 18. ONBOARDING
  // ======================================================================
  try {
    const existingCount = await prisma.onboardingTemplate.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Onboarding: bereits vorhanden — übersprungen');
    } else {
      const templateId = id('onb_tpl');
      await prisma.onboardingTemplate.create({
        data: {
          id: templateId,
          tenantId,
          name: 'Neuer Mitarbeiter — Verkauf',
          role: 'learner',
          durationDays: 30,
          isDefault: true,
          steps: {
            create: [
              { id: id('onb_s'), title: 'Willkommen & Rundgang', description: 'Store-Tour, Team-Vorstellung, Schlüssel/Badge', category: 'Einarbeitung', dayNumber: 1, sortOrder: 0 },
              { id: id('onb_s'), title: 'Kassensystem-Schulung', description: 'Einführung in POS-System, Kartenzahlung, Retouren', category: 'Systeme', dayNumber: 2, sortOrder: 1 },
              { id: id('onb_s'), title: 'Produktwissen Grundlagen', description: 'Marken, Kollektionen, Materialien', category: 'Produkt', dayNumber: 3, sortOrder: 2 },
              { id: id('onb_s'), title: 'VM-Standards lernen', description: 'Visual Merchandising Richtlinien durchgehen', category: 'VM', dayNumber: 5, sortOrder: 3 },
              { id: id('onb_s'), title: 'Verkaufstraining Tag 1', description: 'Kundenansprache, Bedarfsanalyse, Cross-Selling', category: 'Verkauf', dayNumber: 7, sortOrder: 4 },
              { id: id('onb_s'), title: 'Compliance & DSGVO', description: 'Datenschutz-Schulung und Unterschrift', category: 'Compliance', dayNumber: 10, sortOrder: 5 },
              { id: id('onb_s'), title: 'Probezeitgespräch Woche 2', description: '1:1 mit Store Manager — Zwischenfeedback', category: 'Feedback', dayNumber: 14, sortOrder: 6 },
              { id: id('onb_s'), title: 'Selbstständiges Arbeiten', description: 'Eigenständige Schicht unter Beobachtung', category: 'Praxis', dayNumber: 21, sortOrder: 7 },
              { id: id('onb_s'), title: 'Abschlussgespräch Onboarding', description: 'Bewertung Probezeit — Übernahme-Entscheidung', category: 'Feedback', dayNumber: 30, sortOrder: 8, isRequired: true },
            ],
          },
        },
      });

      const steps = await prisma.onboardingStep.findMany({ where: { templateId }, orderBy: { sortOrder: 'asc' } });

      // Journey 1: Learner — in progress (day 14)
      const journey1Id = id('onb_j');
      await prisma.onboardingJourney.create({
        data: {
          id: journey1Id,
          templateId,
          tenantId,
          storeId: store1.id,
          userId: learner.id,
          mentorId: sm.id,
          startDate: isoDate(daysAgo(14)),
          status: 'IN_PROGRESS',
          progress: {
            create: steps.map((step, idx) => ({
              id: id('onb_p'),
              stepId: step.id,
              status: idx < 6 ? 'COMPLETED' : idx === 6 ? 'IN_PROGRESS' : 'PENDING',
              completedAt: idx < 6 ? daysAgo(14 - step.dayNumber) : null,
              verifiedBy: idx < 6 ? sm.id : null,
            })),
          },
        },
      });

      // Journey 2: Simulate a recently completed onboarding (MM user)
      if (mm) {
        const journey2Id = id('onb_j');
        await prisma.onboardingJourney.create({
          data: {
            id: journey2Id,
            templateId,
            tenantId,
            storeId: store2.id,
            userId: mm.id,
            mentorId: ta.id,
            startDate: isoDate(daysAgo(45)),
            status: 'COMPLETED',
            completedAt: daysAgo(15),
            progress: {
              create: steps.map((step) => ({
                id: id('onb_p'),
                stepId: step.id,
                status: 'COMPLETED',
                completedAt: daysAgo(45 - step.dayNumber),
                verifiedBy: ta.id,
              })),
            },
          },
        });
      }
      log('✓ Onboarding: 1 Template (9 Schritte) + 2 Journeys erstellt');
    }
  } catch (e) {
    console.error('✗ Onboarding:', e);
  }

  // ======================================================================
  // 19. 1:1 COACHING
  // ======================================================================
  try {
    const existingCount = await prisma.coachingSession.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  1:1 Coaching: bereits vorhanden — übersprungen');
    } else {
      const sessions = [
        {
          coachId: sm.id, coacheeId: learner.id, daysAgo: 21, status: 'COMPLETED',
          topic: 'Verkauf', framework: 'GROW',
          goal: 'Cross-Selling Quote von 15% auf 25% steigern',
          reality: 'Aktuelle Quote liegt bei 16%. Unsicherheit bei Zusatzartikeln.',
          options: '1) Standardphrasen trainieren 2) Produktcombos vorbereiten 3) Hospitieren bei erfahrenem Kollegen',
          wayForward: 'Diese Woche 3 Cross-Selling-Situationen bewusst üben. Nächste Woche Feedback.',
          notes: 'Lisa zeigt gutes Grundverständnis. Braucht mehr Selbstvertrauen.',
          mood: 4,
        },
        {
          coachId: sm.id, coacheeId: learner.id, daysAgo: 14, status: 'COMPLETED',
          topic: 'Kundenservice', framework: 'GROW',
          goal: 'Reklamationsgespräche souverän führen',
          reality: 'Erste Reklamation gut gemeistert, aber verunsichert bei aggressiven Kunden.',
          options: 'Rollenspiel, Eskalationsworkshop, Kollegenbegleitung',
          wayForward: 'Rollenspiel nächste Woche. Stressübung einbauen.',
          notes: 'Guter Fortschritt seit letzter Session.',
          mood: 3,
        },
        {
          coachId: rm.id, coacheeId: sm.id, daysAgo: 7, status: 'COMPLETED',
          topic: 'Fuehrung', framework: 'GROW',
          goal: 'Team-Meeting-Moderation verbessern',
          reality: 'Meetings oft zu lang. Nicht alle kommen zu Wort.',
          options: 'Timeboxing, Agenda vorab, Moderationstechniken',
          wayForward: 'Nächstes Meeting mit fester Agenda und Timer. Feedback einholen.',
          notes: 'Sarah entwickelt sich gut zur Führungskraft.',
          mood: 4,
        },
        {
          coachId: sm.id, coacheeId: learner.id, daysAgo: 0, status: 'SCHEDULED',
          topic: 'Verkauf', framework: 'GROW',
          goal: 'Follow-up: Cross-Selling-Fortschritt',
          reality: null, options: null, wayForward: null,
          notes: null, mood: null,
        },
        {
          coachId: rm.id, coacheeId: sm.id, daysAgo: -7, status: 'SCHEDULED',
          topic: 'Fuehrung', framework: 'SMART',
          goal: 'KPI-Kommunikation ans Team',
          reality: null, options: null, wayForward: null,
          notes: null, mood: null,
        },
      ];

      for (const s of sessions) {
        await prisma.coachingSession.create({
          data: {
            id: id('coach'),
            tenantId,
            storeId: store1.id,
            coachId: s.coachId,
            coacheeId: s.coacheeId,
            scheduledAt: s.daysAgo >= 0 ? daysAgo(s.daysAgo) : daysFromNow(Math.abs(s.daysAgo)),
            duration: 30,
            type: 'REGULAR',
            status: s.status,
            framework: s.framework,
            topic: s.topic,
            goalText: s.goal,
            realityText: s.reality,
            optionsText: s.options,
            wayForwardText: s.wayForward,
            notes: s.notes,
            mood: s.mood,
          },
        });
      }
      log('✓ 1:1 Coaching: 5 Sessions erstellt (3 abgeschlossen, 2 geplant)');
    }
  } catch (e) {
    console.error('✗ 1:1 Coaching:', e);
  }

  // ======================================================================
  // 20. PDP / PIP — Development Plans
  // ======================================================================
  try {
    const existingCount = await prisma.developmentPlan.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  PDP/PIP: bereits vorhanden — übersprungen');
    } else {
      const plans = [
        {
          userId: learner.id, managerId: sm.id, type: 'PDP',
          title: 'Entwicklungsplan Lisa Becker — Verkaufsexpertise',
          goals: [
            { title: 'Cross-Selling Quote 25%', measure: 'Wöchentliche Auswertung UPT', status: 'IN_PROGRESS', progress: 60, targetDays: 60 },
            { title: 'Eigenständige Kundenberatung Premium', measure: 'Mindestens 3 eigenständige Premium-Beratungen', status: 'NOT_STARTED', progress: 0, targetDays: 90 },
            { title: 'Produktwissen Kurs abschließen', measure: 'Zertifikat erhalten', status: 'IN_PROGRESS', progress: 65, targetDays: 30 },
          ],
        },
        {
          userId: sm.id, managerId: rm.id, type: 'PDP',
          title: 'Führungskräfteentwicklung Sarah Klein',
          goals: [
            { title: 'Team-Meeting-Moderation', measure: 'Feedback-Score > 4/5 von Team', status: 'IN_PROGRESS', progress: 40, targetDays: 90 },
            { title: 'KPI-Dashboard tägliche Nutzung', measure: '100% der Arbeitstage KPIs geprüft', status: 'COMPLETED', progress: 100, targetDays: 30 },
          ],
        },
        {
          userId: learner.id, managerId: sm.id, type: 'PIP',
          title: 'Leistungsverbesserungsplan — Pünktlichkeit',
          goals: [
            { title: 'Pünktlichkeit verbessern', measure: 'Keine Verspätung > 5 Min in 4 Wochen', status: 'IN_PROGRESS', progress: 75, targetDays: 30 },
            { title: 'Schichtübergabe vollständig', measure: 'Handover-Protokoll bei jeder Übergabe', status: 'IN_PROGRESS', progress: 50, targetDays: 30 },
          ],
        },
      ];

      for (const plan of plans) {
        const planId = id('dev_plan');
        await prisma.developmentPlan.create({
          data: {
            id: planId,
            tenantId,
            storeId: store1.id,
            userId: plan.userId,
            managerId: plan.managerId,
            type: plan.type,
            title: plan.title,
            status: 'ACTIVE',
            startDate: daysAgo(30),
            targetDate: daysFromNow(60),
            goals: {
              create: plan.goals.map((g) => ({
                id: id('dev_goal'),
                title: g.title,
                measureOfSuccess: g.measure,
                status: g.status,
                progress: g.progress,
                targetDate: daysFromNow(g.targetDays),
              })),
            },
            reviews: {
              create: [
                {
                  id: id('dev_rev'),
                  reviewedBy: plan.managerId,
                  reviewDate: daysAgo(14),
                  overallProgress: plan.goals.reduce((sum, g) => sum + g.progress, 0) / plan.goals.length,
                  comments: 'Guter Fortschritt. Weiter so.',
                },
              ],
            },
          },
        });
      }
      log('✓ PDP/PIP: 3 Entwicklungspläne mit Zielen und Reviews erstellt');
    }
  } catch (e) {
    console.error('✗ PDP/PIP:', e);
  }

  // ======================================================================
  // 21. APPRAISALS
  // ======================================================================
  try {
    const existingCycles = await prisma.appraisalCycle.count({ where: { tenantId } });
    if (existingCycles > 0) {
      // Cycle exists, check for appraisals
      const existingAppraisals = await prisma.appraisal.count();
      if (existingAppraisals > 0) {
        log('⏭  Appraisals: bereits vorhanden — übersprungen');
      } else {
        const cycle = await prisma.appraisalCycle.findFirst({ where: { tenantId } });
        if (cycle) {
          const appraisalData = [
            { employee: sm, manager: rm, status: 'COMPLETED', selfRating: 4, managerRating: 4, overall: 4, strengths: 'Hervorragende Kundenführung, Team-Motivation', improvements: 'Delegation von Aufgaben', goals: 'Vorbereitung auf Area-Manager-Rolle' },
            { employee: learner, manager: sm, status: 'MANAGER_REVIEW', selfRating: 3, managerRating: null, overall: null, strengths: 'Lernbereitschaft, Freundlichkeit', improvements: 'Produktwissen vertiefen, Selbstbewusstsein', goals: 'Eigenständige Premium-Beratung' },
            { employee: ta, manager: rm, status: 'COMPLETED', selfRating: 5, managerRating: 5, overall: 5, strengths: 'Strategisches Denken, Analytics', improvements: 'Work-Life-Balance', goals: 'Expansion Bayern vorbereiten' },
            { employee: learner, manager: rm, status: 'PENDING', selfRating: null, managerRating: null, overall: null, strengths: null, improvements: null, goals: null },
          ];

          for (const a of appraisalData) {
            await prisma.appraisal.create({
              data: {
                id: id('appr'),
                cycleId: cycle.id,
                storeId: store1.id,
                employeeId: a.employee.id,
                managerId: a.manager.id,
                status: a.status,
                selfRating: a.selfRating,
                managerRating: a.managerRating,
                overallRating: a.overall,
                strengths: a.strengths,
                improvements: a.improvements,
                goals: a.goals,
                meetingNotes: a.status === 'COMPLETED' ? 'Gutes Gespräch in angenehmer Atmosphäre.' : null,
                completedAt: a.status === 'COMPLETED' ? daysAgo(5) : null,
              },
            });
          }
          log('✓ Appraisals: 4 Mitarbeitergespräche erstellt');
        }
      }
    } else {
      // Create cycle + appraisals
      const now = new Date();
      const cycleId = id('appr_cyc');
      await prisma.appraisalCycle.create({
        data: {
          id: cycleId,
          tenantId,
          name: `Halbjahresgespräch H1 ${now.getFullYear()}`,
          period: `H1 ${now.getFullYear()}`,
          startDate: new Date(now.getFullYear(), 0, 1),
          endDate: new Date(now.getFullYear(), 5, 30),
          status: 'ACTIVE',
        },
      });

      const appraisalData = [
        { employee: sm, manager: rm, status: 'COMPLETED', selfRating: 4, managerRating: 4, overall: 4, strengths: 'Hervorragende Kundenführung, Team-Motivation', improvements: 'Delegation von Aufgaben', goals: 'Vorbereitung auf Area-Manager-Rolle' },
        { employee: learner, manager: sm, status: 'MANAGER_REVIEW', selfRating: 3, managerRating: null, overall: null, strengths: 'Lernbereitschaft, Freundlichkeit', improvements: 'Produktwissen vertiefen', goals: 'Eigenständige Premium-Beratung' },
        { employee: ta, manager: rm, status: 'COMPLETED', selfRating: 5, managerRating: 5, overall: 5, strengths: 'Strategisches Denken, Analytics', improvements: 'Work-Life-Balance', goals: 'Expansion Bayern vorbereiten' },
        { employee: learner, manager: rm, status: 'PENDING', selfRating: null, managerRating: null, overall: null, strengths: null, improvements: null, goals: null },
      ];

      for (const a of appraisalData) {
        await prisma.appraisal.create({
          data: {
            id: id('appr'),
            cycleId,
            storeId: store1.id,
            employeeId: a.employee.id,
            managerId: a.manager.id,
            status: a.status,
            selfRating: a.selfRating,
            managerRating: a.managerRating,
            overallRating: a.overall,
            strengths: a.strengths,
            improvements: a.improvements,
            goals: a.goals,
            meetingNotes: a.status === 'COMPLETED' ? 'Gutes Gespräch in angenehmer Atmosphäre.' : null,
            completedAt: a.status === 'COMPLETED' ? daysAgo(5) : null,
          },
        });
      }
      log('✓ Appraisals: 1 Zyklus + 4 Mitarbeitergespräche erstellt');
    }
  } catch (e) {
    console.error('✗ Appraisals:', e);
  }

  // ======================================================================
  // 22. SHIFT PLANNING
  // ======================================================================
  try {
    const existingCount = await prisma.shiftEntry.count({ where: { storeId: store1.id } });
    if (existingCount > 0) {
      log('⏭  Shift Planning: bereits vorhanden — übersprungen');
    } else {
      const shiftUsers = [ta, rm, sm, learner, mm].filter(Boolean);
      const thisMonday = currentMonday();
      const nextMon = nextMonday();

      const shifts: {
        id: string;
        storeId: string;
        userId: string;
        date: Date;
        startTime: string;
        endTime: string;
        role: string;
        status: string;
      }[] = [];

      // 2 weeks of shifts
      for (const weekStart of [thisMonday, nextMon]) {
        for (let dayOffset = 0; dayOffset < 6; dayOffset++) { // Mon-Sat
          const date = new Date(weekStart);
          date.setDate(date.getDate() + dayOffset);

          const shiftPatterns = [
            { start: '09:00', end: '17:00', role: 'Früh' },
            { start: '12:00', end: '20:00', role: 'Spät' },
            { start: '09:00', end: '14:00', role: 'Teilzeit' },
          ];

          for (let i = 0; i < Math.min(shiftUsers.length, 4); i++) {
            const pattern = shiftPatterns[i % shiftPatterns.length];
            shifts.push({
              id: id('shift'),
              storeId: store1.id,
              userId: shiftUsers[i].id,
              date,
              startTime: pattern.start,
              endTime: pattern.end,
              role: pattern.role,
              status: weekStart === thisMonday ? 'CONFIRMED' : 'PLANNED',
            });
          }
        }
      }

      await prisma.shiftEntry.createMany({ data: shifts });

      // Time entries (clock in/out for past shifts)
      const timeEntries = [
        { storeId: store1.id, userId: sm.id, date: daysAgo(1), clockIn: hoursAgo(33), clockOut: hoursAgo(25), pauseMin: 30, status: 'DONE' as const },
        { storeId: store1.id, userId: learner.id, date: daysAgo(1), clockIn: hoursAgo(30), clockOut: hoursAgo(22), pauseMin: 30, status: 'DONE' as const },
        { storeId: store1.id, userId: sm.id, date: new Date(), clockIn: hoursAgo(3), clockOut: null, pauseMin: 0, status: 'CLOCKED_IN' as const },
      ];

      for (const te of timeEntries) {
        await prisma.shiftTimeEntry.create({
          data: {
            id: id('time'),
            ...te,
          },
        });
      }

      // Availability
      await prisma.shiftAvailability.create({
        data: {
          id: id('avail'),
          storeId: store1.id,
          userId: learner.id,
          date: daysFromNow(10),
          type: 'UNAVAILABLE',
          note: 'Arzttermin nachmittags',
        },
      });

      log(`✓ Shift Planning: ${shifts.length} Schichten + 3 Zeiterfassungen + 1 Verfügbarkeit erstellt`);
    }
  } catch (e) {
    console.error('✗ Shift Planning:', e);
  }

  // ======================================================================
  // 23. PULSE SURVEY
  // ======================================================================
  try {
    const existingSurveys = await prisma.pulseSurvey.count({ where: { tenantId } });
    const existingResponses = await prisma.pulseResponse.count();

    if (existingResponses > 0) {
      log('⏭  Pulse Survey: bereits vorhanden — übersprungen');
    } else {
      let surveyId: string;

      if (existingSurveys > 0) {
        const survey = await prisma.pulseSurvey.findFirst({ where: { tenantId }, include: { questions: true } });
        if (!survey) throw new Error('Survey nicht gefunden');
        surveyId = survey.id;
      } else {
        // Create survey with questions
        surveyId = id('pulse');
        await prisma.pulseSurvey.create({
          data: {
            id: surveyId,
            tenantId,
            title: 'Mitarbeiter-Puls Q1 2026',
            status: 'ACTIVE',
            startDate: daysAgo(14),
            endDate: daysFromNow(14),
            isAnonymous: true,
            createdBy: ta.id,
            questions: {
              create: [
                { id: id('pq'), text: 'Wie zufrieden bist du mit deinem Arbeitsumfeld?', type: 'RATING', sortOrder: 0 },
                { id: id('pq'), text: 'Fühlst du dich von deinem Team unterstützt?', type: 'RATING', sortOrder: 1 },
                { id: id('pq'), text: 'Wie bewertest du die Kommunikation im Store?', type: 'RATING', sortOrder: 2 },
                { id: id('pq'), text: 'Hast du genug Möglichkeiten zur Weiterentwicklung?', type: 'RATING', sortOrder: 3 },
                { id: id('pq'), text: 'Wie fair empfindest du die Schichtplanung?', type: 'RATING', sortOrder: 4 },
                { id: id('pq'), text: 'Würdest du Modehouse Müller als Arbeitgeber empfehlen?', type: 'RATING', sortOrder: 5 },
                { id: id('pq'), text: 'Was gefällt dir am besten an deiner Arbeit?', type: 'TEXT', sortOrder: 6 },
                { id: id('pq'), text: 'Was sollten wir verbessern?', type: 'TEXT', sortOrder: 7 },
              ],
            },
          },
        });
      }

      const questions = await prisma.pulseQuestion.findMany({ where: { surveyId }, orderBy: { sortOrder: 'asc' } });

      const textResponses = {
        best: [
          'Das Team ist super! Wir helfen uns gegenseitig.',
          'Die Kunden und die abwechslungsreiche Arbeit.',
          'Flexible Schichtplanung und faire Bezahlung.',
          'Die Möglichkeit, mich weiterzuentwickeln.',
          'Tolle Kolleg*innen und gute Lage.',
          'Ich mag den Kundenkontakt und die Mode.',
        ],
        improve: [
          'Mehr Weiterbildungsangebote wären toll.',
          'Klimaanlage im Sommer verbessern.',
          'Manchmal zu wenig Personal auf der Fläche.',
          'Bessere Kommunikation zwischen den Schichten.',
          'Mehr Team-Events wären schön.',
          'Digitalisierung der Lager-Prozesse.',
        ],
      };

      // 6 anonymous responses
      for (let r = 0; r < 6; r++) {
        const responseId = id('pr');
        await prisma.pulseResponse.create({
          data: {
            id: responseId,
            surveyId,
            storeId: allStores[r % allStores.length].id,
            respondentId: null, // anonymous
            submittedAt: daysAgo(randInt(0, 12)),
            answers: {
              create: questions.map((q) => {
                if (q.type === 'RATING') {
                  return {
                    id: id('pa'),
                    questionId: q.id,
                    valueRating: randInt(3, 5),
                  };
                } else {
                  const isImproveQ = q.text.includes('verbessern');
                  return {
                    id: id('pa'),
                    questionId: q.id,
                    valueText: isImproveQ ? pick(textResponses.improve) : pick(textResponses.best),
                  };
                }
              }),
            },
          },
        });
      }
      log('✓ Pulse Survey: 1 Umfrage (8 Fragen) + 6 Antworten erstellt');
    }
  } catch (e) {
    console.error('✗ Pulse Survey:', e);
  }

  // ======================================================================
  // 24. WELLBEING
  // ======================================================================
  try {
    const existingCount = await prisma.wellbeingCheckIn.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Wellbeing: bereits vorhanden — übersprungen');
    } else {
      const checkIns: {
        id: string;
        tenantId: string;
        storeId: string;
        userId: string;
        date: Date;
        moodScore: number;
        energyLevel: number;
        stressLevel: number;
        workloadRating: number;
        notes: string | null;
        isAnonymous: boolean;
      }[] = [];

      const wellbeingNotes = [
        'Guter Tag heute, Team-Stimmung war super!',
        'Etwas müde nach langer Woche.',
        'Stressiger Samstag, aber wir haben es geschafft.',
        null,
        'Neue Kollegin eingearbeitet — positiv!',
        null,
        'Sale-Phase ist anstrengend, aber motivierend.',
        null,
        'Freue mich auf den Urlaub nächste Woche.',
        null,
        'Gutes Feedback von Kunden bekommen.',
        null,
        'Heute war ruhig — konnte aufräumen.',
        null,
        'Toller Team-Spirit diese Woche!',
      ];

      for (let i = 0; i < 15; i++) {
        const user = pick([sm, learner, sm, learner, learner]);
        checkIns.push({
          id: id('wb'),
          tenantId,
          storeId: pick(allStores).id,
          userId: user.id,
          date: daysAgo(randInt(0, 30)),
          moodScore: randInt(2, 5),
          energyLevel: randInt(2, 5),
          stressLevel: randInt(1, 4),
          workloadRating: randInt(2, 5),
          notes: wellbeingNotes[i] ?? null,
          isAnonymous: false,
        });
      }

      await prisma.wellbeingCheckIn.createMany({ data: checkIns });
      log('✓ Wellbeing: 15 Check-Ins erstellt');
    }
  } catch (e) {
    console.error('✗ Wellbeing:', e);
  }

  // ======================================================================
  // 25. BRIEFINGS
  // ======================================================================
  try {
    const existingCount = await prisma.briefing.count({ where: { storeId: store1.id } });
    if (existingCount > 0) {
      log('⏭  Briefings: bereits vorhanden — übersprungen');
    } else {
      const briefingData = [
        {
          title: 'Morgen-Briefing Montag',
          content: 'Start in die neue Woche! Fokus auf neue Kollektion und Cross-Selling.',
          date: isoDate(daysAgo(1)),
          type: 'MORNING',
          sections: JSON.stringify([
            { title: 'Tagesablauf', content: 'Lieferung um 10:00, VM-Update 14:00, Team-Meeting 16:00', sortOrder: 0 },
            { title: 'KPI-Update', content: 'Samstag: 19.500€ Umsatz (+12% vs. Vorwoche). Weiter so!', sortOrder: 1 },
            { title: 'Aktionen', content: 'Neue Kampagne "Spring Essentials" — Displays im Eingang aufbauen', sortOrder: 2 },
          ]),
          acknowledged: true,
        },
        {
          title: 'Morgen-Briefing Dienstag',
          content: 'Ruhiger Tag erwartet. Fokus auf Lager-Aufräumen und VM-Standards.',
          date: isoDate(daysAgo(0)),
          type: 'MORNING',
          sections: JSON.stringify([
            { title: 'Tagesablauf', content: 'Lageraufräumen 09:30-11:00, Normalservice ab 11:00', sortOrder: 0 },
            { title: 'Hinweis', content: 'Klimaanlage wird morgen repariert — Fenster bereithalten', sortOrder: 1 },
          ]),
          acknowledged: true,
        },
        {
          title: 'Abend-Briefing Dienstag',
          content: 'Zusammenfassung des Tages und Vorbereitung auf Mittwoch.',
          date: isoDate(daysAgo(0)),
          type: 'EVENING',
          sections: JSON.stringify([
            { title: 'Tagesergebnis', content: 'Umsatz: 14.200€, 165 Transaktionen, Conversion 32%', sortOrder: 0 },
            { title: 'Offene Punkte', content: 'Retoure Kundin Schmidt noch offen — Ware prüfen', sortOrder: 1 },
          ]),
          acknowledged: true,
        },
        {
          title: 'Sonder-Briefing: Sale-Start',
          content: 'Am Donnerstag startet der Summer-Pre-Sale. Alle Vorbereitungen abschließen!',
          date: isoDate(daysFromNow(2)),
          type: 'SPECIAL',
          sections: JSON.stringify([
            { title: 'Vorbereitungen', content: 'Sale-Schilder anbringen, Preisauszeichnung prüfen, Sale-Ecke einrichten', sortOrder: 0 },
            { title: 'Personal', content: 'Zusätzliche Kräfte Do-Sa eingeplant. Schichtplan im System.', sortOrder: 1 },
            { title: 'Ziel', content: 'Tagesumsatz-Ziel: 22.000€', sortOrder: 2 },
          ]),
          acknowledged: false,
        },
        {
          title: 'Morgen-Briefing Mittwoch',
          content: 'Guten Morgen! Heute ist Mittwoch — Liefertag.',
          date: isoDate(daysFromNow(1)),
          type: 'MORNING',
          sections: JSON.stringify([
            { title: 'Lieferung', content: 'Große Lieferung erwartet: 15 Kartons neue Kollektion. Priorität: Auspacken und auf die Fläche bringen.', sortOrder: 0 },
          ]),
          acknowledged: false,
        },
      ];

      for (const b of briefingData) {
        const briefingId = id('brief');
        await prisma.briefing.create({
          data: {
            id: briefingId,
            storeId: store1.id,
            title: b.title,
            content: b.content,
            sections: b.sections,
            date: b.date,
            type: b.type,
            createdBy: sm.id,
            publishedAt: b.acknowledged ? daysAgo(1) : null,
          },
        });

        if (b.acknowledged) {
          for (const u of [sm, learner]) {
            await prisma.briefingAcknowledgment.create({
              data: {
                id: id('brief_ack'),
                briefingId,
                userId: u.id,
                readAt: daysAgo(0),
              },
            });
          }
        }
      }
      log('✓ Briefings: 5 Briefings erstellt (3 bestätigt, 2 offen)');
    }
  } catch (e) {
    console.error('✗ Briefings:', e);
  }

  // ======================================================================
  // 26. HANDOVER
  // ======================================================================
  try {
    const existingCount = await prisma.handover.count({ where: { storeId: store1.id } });
    if (existingCount > 0) {
      log('⏭  Handover: bereits vorhanden — übersprungen');
    } else {
      const handoverData = [
        { from: sm, to: learner, date: isoDate(daysAgo(0)), shift: 'Früh → Spät', status: 'SUBMITTED', sales: '11.200€ bis 14:00 — auf Kurs', tasks: 'Lieferung noch 3 Kartons auspacken', incidents: 'Keine', customer: 'Frau Weber kommt 16:00 zum Abholen', stock: 'Kleid Midi Blau Gr. 38 ausverkauft — nachbestellt' },
        { from: learner, to: sm, date: isoDate(daysAgo(1)), shift: 'Spät → Früh', status: 'ACKNOWLEDGED', sales: 'Tagesumsatz 18.400€', tasks: 'Schaufenster muss bis 10:00 fertig sein', incidents: 'Kassendifferenz -4,50€ dokumentiert', customer: null, stock: 'Neue Lieferung morgen 09:30' },
        { from: sm, to: learner, date: isoDate(daysAgo(2)), shift: 'Früh → Spät', status: 'ACKNOWLEDGED', sales: '9.800€ bis 14:00', tasks: 'Retoure Kundin Meier bearbeiten', incidents: 'Keine', customer: 'VIP Herr Schneider kommt 17:00', stock: null },
        { from: sm, to: null, date: isoDate(daysAgo(3)), shift: 'Spät', status: 'SUBMITTED', sales: '15.600€ Tagesumsatz', tasks: null, incidents: 'Beleuchtung Eingang links ausgefallen — Maintenance gemeldet', customer: null, stock: null },
        { from: learner, to: sm, date: isoDate(daysAgo(4)), shift: 'Spät → Früh', status: 'ACKNOWLEDGED', sales: '12.300€ Tagesumsatz', tasks: 'VM Update Damenmode noch ausstehend', incidents: 'Keine', customer: null, stock: 'Sale-Ware muss umsortiert werden' },
        { from: sm, to: learner, date: isoDate(daysAgo(5)), shift: 'Früh → Spät', status: 'SUBMITTED', sales: '8.900€ bis 14:00', tasks: 'Alle Preisschilder prüfen', incidents: 'Keine', customer: 'Frau Weber holt Änderung ab', stock: null },
        { from: sm, to: null, date: isoDate(daysAgo(6)), shift: 'Früh', status: 'DRAFT', sales: 'Noch keine Zahlen', tasks: 'Inventur-Vorbereitung', incidents: null, customer: null, stock: null },
        { from: learner, to: sm, date: isoDate(daysAgo(7)), shift: 'Spät → Früh', status: 'ACKNOWLEDGED', sales: '16.100€', tasks: null, incidents: 'Versuchter Ladendiebstahl — Polizei informiert', customer: null, stock: 'Wareneingang komplett verarbeitet' },
      ];

      for (const h of handoverData) {
        await prisma.handover.create({
          data: {
            id: id('hand'),
            storeId: store1.id,
            fromUserId: h.from.id,
            toUserId: h.to?.id ?? null,
            shiftDate: h.date,
            shiftType: h.shift,
            status: h.status,
            salesUpdate: h.sales,
            openTasks: h.tasks,
            incidents: h.incidents,
            customerNotes: h.customer,
            stockNotes: h.stock,
          },
        });
      }
      log('✓ Handover: 8 Übergabe-Protokolle erstellt');
    }
  } catch (e) {
    console.error('✗ Handover:', e);
  }

  // ======================================================================
  // 27. TEAM PUSH
  // ======================================================================
  try {
    const existingCount = await prisma.teamMessage.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Team Push: bereits vorhanden — übersprungen');
    } else {
      const messages = [
        { title: 'Neue Kollektion eingetroffen!', body: 'Die Frühjahr/Sommer 2026 Kollektion ist da! Bitte informiert euch über die Highlights im LMS-Kurs "Produktwissen SS26".', prio: 'HIGH', target: 'ALL' },
        { title: 'Sale-Start Donnerstag', body: 'Am Donnerstag startet der Summer-Pre-Sale. Bitte alle Vorbereitungen bis Mittwoch 20:00 abschließen. Details im Briefing.', prio: 'URGENT', target: 'STORE' },
        { title: 'Team-Event: Bowling Freitag 19:00', body: 'Zur Feier unseres Quartals-Erfolgs gehen wir am Freitag bowlen! Anmeldung bitte bis Mittwoch bei Sarah.', prio: 'NORMAL', target: 'ALL' },
        { title: 'Erinnerung: DSGVO-Schulung', body: 'Alle Mitarbeiter, die den Compliance-Kurs noch nicht abgeschlossen haben, bitte bis Ende der Woche nachholen.', prio: 'HIGH', target: 'ROLE' },
      ];

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const msgId = id('tmsg');
        await prisma.teamMessage.create({
          data: {
            id: msgId,
            tenantId,
            title: msg.title,
            body: msg.body,
            priority: msg.prio,
            targetType: msg.target,
            targetStoreIds: msg.target === 'STORE' ? store1.id : null,
            sentBy: pick([ta, rm, sm]).id,
            createdAt: daysAgo(i * 2 + 1),
            reads: {
              create: i < 2
                ? [sm, learner].map((u) => ({
                    id: id('tmsg_r'),
                    userId: u.id,
                    readAt: daysAgo(i * 2),
                  }))
                : [{ id: id('tmsg_r'), userId: sm.id, readAt: daysAgo(i) }],
            },
          },
        });
      }
      log('✓ Team Push: 4 Nachrichten mit Lesebestätigungen erstellt');
    }
  } catch (e) {
    console.error('✗ Team Push:', e);
  }

  // ======================================================================
  // 28. NEWSLETTER
  // ======================================================================
  try {
    const existingCount = await prisma.newsletter.count({ where: { tenantId } });
    if (existingCount > 0) {
      log('⏭  Newsletter: bereits vorhanden — übersprungen');
    } else {
      const newsletters = [
        {
          title: 'Modehouse Müller — Team-Newsletter März 2026',
          status: 'PUBLISHED',
          publishedAt: daysAgo(5),
          sections: [
            { title: 'Highlight des Monats', content: 'Unser Düsseldorf Kö Store hat den höchsten Umsatz aller Zeiten erzielt! 450.000€ im März — eine Steigerung von 15% zum Vorjahresmonat. Herzlichen Glückwunsch an das gesamte Team!', sortOrder: 0 },
            { title: 'Neue Mitarbeiterin', content: 'Wir begrüßen Lisa Becker in unserem Team! Lisa verstärkt seit dem 15. März das Verkaufsteam in Düsseldorf. Willkommen, Lisa!', sortOrder: 1 },
            { title: 'Schulungen im April', content: 'Im April starten folgende Schulungen: Produktwissen SS26 (Pflicht), Cross-Selling-Training (empfohlen), VM-Grundlagen (für neue Mitarbeiter). Bitte meldet euch im LMS an.', sortOrder: 2 },
            { title: 'Challenge-Update', content: 'Die Umsatz-Challenge März läuft noch bis zum 15. April! Aktueller Stand: Düsseldorf führt vor Köln. Gebt Gas!', sortOrder: 3 },
          ],
        },
        {
          title: 'Modehouse Müller — Team-Newsletter Februar 2026',
          status: 'PUBLISHED',
          publishedAt: daysAgo(35),
          sections: [
            { title: 'Rückblick Februar', content: 'Ein erfolgreicher Monat! Alle drei Stores haben ihre Umsatzziele erreicht. Besonders stark: Cross-Selling-Rate gestiegen auf durchschnittlich 22%.', sortOrder: 0 },
            { title: 'Personalplanung', content: 'Ab März suchen wir Verstärkung für den Köln Store. Bitte empfehlt uns weiter — es gibt einen Werbe-Bonus von 500€!', sortOrder: 1 },
            { title: 'IT-Update', content: 'Neue Version der Kassen-Software wird am 1. März installiert. Kurzschulung am 28. Februar um 08:30.', sortOrder: 2 },
          ],
        },
      ];

      for (const nl of newsletters) {
        const nlId = id('nwsl');
        await prisma.newsletter.create({
          data: {
            id: nlId,
            tenantId,
            title: nl.title,
            content: nl.sections.map((s) => `## ${s.title}\n${s.content}`).join('\n\n'),
            status: nl.status,
            publishedAt: nl.publishedAt,
            createdBy: ta.id,
            sections: {
              create: nl.sections.map((s) => ({
                id: id('nwsl_s'),
                title: s.title,
                content: s.content,
                sortOrder: s.sortOrder,
              })),
            },
            views: {
              create: [sm, learner].map((u) => ({
                id: id('nwsl_v'),
                userId: u.id,
                viewedAt: new Date(nl.publishedAt.getTime() + randInt(1, 48) * 3600_000),
              })),
            },
          },
        });
      }
      log('✓ Newsletter: 2 Newsletter mit Sektionen und View-Tracking erstellt');
    }
  } catch (e) {
    console.error('✗ Newsletter:', e);
  }

  // ======================================================================
  // 29. FR CONVERSION — Additional Sessions & Goals
  // ======================================================================
  try {
    const existingGoals = await prisma.conversionGoal.count({ where: { storeId: store1.id } });
    if (existingGoals > 0) {
      log('⏭  FR Conversion Goals: bereits vorhanden — übersprungen');
    } else {
      const now = new Date();
      await prisma.conversionGoal.createMany({
        data: [
          { id: id('conv_g'), storeId: store1.id, period: monthStr(now), targetConversion: 40.0, targetAvgBasket: 85.0 },
          { id: id('conv_g'), storeId: store1.id, period: monthStr(new Date(now.getFullYear(), now.getMonth() - 1, 1)), targetConversion: 38.0, targetAvgBasket: 80.0 },
        ],
      });
      log('✓ FR Conversion: 2 Conversion-Goals erstellt');
    }
  } catch (e) {
    console.error('✗ FR Conversion:', e);
  }

  // ======================================================================
  // 30. CLIENTELING / CRM
  // ======================================================================
  try {
    const existingCount = await prisma.clientProfile.count({ where: { storeId: store1.id } });
    if (existingCount > 0) {
      log('⏭  Clienteling/CRM: bereits vorhanden — übersprungen');
    } else {
      const clientData = [
        { first: 'Claudia', last: 'Weber', email: 'c.weber@example.com', phone: '+49 176 12345678', vip: 'GOLD', prefs: 'Eleganter Stil, bevorzugt Schwarz/Navy', sizes: 'Blazer: 38, Kleid: 36, Schuhe: 39', total: 12, spent: 4850.00, loyalty: 450 },
        { first: 'Markus', last: 'Schneider', email: 'm.schneider@example.com', phone: '+49 172 87654321', vip: 'PLATINUM', prefs: 'Business-Casual, Premium-Marken', sizes: 'Hemd: 41, Hose: 52, Schuhe: 43', total: 28, spent: 12300.00, loyalty: 1200 },
        { first: 'Sandra', last: 'Hoffmann', email: 's.hoffmann@example.com', phone: '+49 151 11223344', vip: 'SILVER', prefs: 'Casual, nachhaltige Materialien', sizes: 'Top: M, Jeans: 29/32, Schuhe: 38', total: 6, spent: 1890.00, loyalty: 180 },
        { first: 'Peter', last: 'Fischer', email: null, phone: '+49 170 99887766', vip: null, prefs: 'Klassisch, Marke unwichtig, Qualität zählt', sizes: 'Anzug: 50, Hemd: 40', total: 3, spent: 950.00, loyalty: 90 },
        { first: 'Anna', last: 'Klein', email: 'anna.klein@example.com', phone: '+49 160 55443322', vip: 'GOLD', prefs: 'Trend-orientiert, farbig, Statement-Pieces', sizes: 'Kleid: 38, Mantel: 38, Schuhe: 37', total: 15, spent: 5200.00, loyalty: 520 },
        { first: 'Thomas', last: 'Wagner', email: 't.wagner@example.com', phone: null, vip: 'SILVER', prefs: 'Sportlich-elegant', sizes: 'Polo: L, Chino: 50, Sneaker: 44', total: 8, spent: 2100.00, loyalty: 200 },
        { first: 'Maria', last: 'Braun', email: 'maria.braun@example.com', phone: '+49 157 66778899', vip: 'PLATINUM', prefs: 'Luxuriös, Designer-Stücke, Accessoires', sizes: 'Kleid: 34, Jacke: 34, Tasche: OS', total: 35, spent: 18500.00, loyalty: 1850 },
        { first: 'Johannes', last: 'Müller', email: 'j.mueller@example.com', phone: '+49 175 44556677', vip: null, prefs: 'Basics, gutes Preis-Leistungs-Verhältnis', sizes: 'T-Shirt: XL, Jeans: 34/32', total: 4, spent: 680.00, loyalty: 60 },
      ];

      for (const c of clientData) {
        const clientId = id('client');
        await prisma.clientProfile.create({
          data: {
            id: clientId,
            storeId: store1.id,
            firstName: c.first,
            lastName: c.last,
            email: c.email,
            phone: c.phone,
            vipLevel: c.vip,
            preferences: c.prefs,
            sizes: c.sizes,
            totalPurchases: c.total,
            totalSpent: c.spent,
            loyaltyPoints: c.loyalty,
            consentGeneral: true,
            consentEmail: c.email !== null,
            consentSms: c.phone !== null,
            lastVisit: daysAgo(randInt(1, 30)),
            birthday: new Date(1975 + randInt(0, 25), randInt(0, 11), randInt(1, 28)),
            createdBy: sm.id,
            interactions: {
              create: [
                {
                  id: id('ci'),
                  userId: sm.id,
                  type: 'PURCHASE',
                  channel: 'STORE',
                  date: daysAgo(randInt(1, 14)),
                  notes: `Kauf: ${pick(['Blazer', 'Kleid', 'Hemd', 'Jeans', 'Accessoire'])} — zufrieden`,
                  purchaseAmount: randFloat(50, 500),
                },
                {
                  id: id('ci'),
                  userId: sm.id,
                  type: 'VISIT',
                  channel: 'STORE',
                  date: daysAgo(randInt(15, 45)),
                  notes: 'Beratungsgespräch',
                },
              ],
            },
            tasks: {
              create: c.vip
                ? [{
                    id: id('ct'),
                    userId: sm.id,
                    title: `Follow-up: ${c.first} ${c.last} — Neue Kollektion vorstellen`,
                    dueDate: daysFromNow(randInt(3, 14)),
                    status: 'OPEN',
                  }]
                : [],
            },
          },
        });

        // Appointments for VIP clients
        if (c.vip === 'PLATINUM' || c.vip === 'GOLD') {
          await prisma.clientAppointment.create({
            data: {
              id: id('ca'),
              storeId: store1.id,
              clientId,
              advisorId: sm.id,
              type: 'BERATUNG',
              title: `Styling-Beratung ${c.first} ${c.last}`,
              notes: c.vip === 'PLATINUM' ? 'VIP — Champagner bereitstellen' : null,
              startsAt: daysFromNow(randInt(2, 10)),
              endsAt: new Date(daysFromNow(randInt(2, 10)).getTime() + 60 * 60 * 1000),
              status: 'GEPLANT',
            },
          });
        }
      }
      log('✓ Clienteling/CRM: 8 Kundenprofile mit Interaktionen, Aufgaben und Terminen erstellt');
    }
  } catch (e) {
    console.error('✗ Clienteling/CRM:', e);
  }

  // ======================================================================
  // 31. STOCK CALLOUTS
  // ======================================================================
  try {
    const existingCount = await prisma.stockCallout.count({ where: { storeId: store1.id } });
    if (existingCount > 0) {
      log('⏭  Stock Callouts: bereits vorhanden — übersprungen');
    } else {
      const callouts = [
        { sku: 'DK-KLD-002', name: 'Kleid Midi Blau Gr. 38', current: 0, reorder: 3, qty: 5, urgency: 'HIGH', status: 'OPEN' },
        { sku: 'DK-BLS-003', name: 'Bluse Seide Weiß Gr. 36', current: 1, reorder: 3, qty: 4, urgency: 'NORMAL', status: 'ORDERED' },
        { sku: 'HK-HMD-001', name: 'Hemd Business Weiß Gr. 41', current: 2, reorder: 5, qty: 8, urgency: 'NORMAL', status: 'ORDERED' },
        { sku: 'AK-TAS-003', name: 'Handtasche City Beige', current: 0, reorder: 2, qty: 3, urgency: 'HIGH', status: 'OPEN' },
        { sku: 'DK-JNS-004', name: 'Jeans Slim Fit Gr. 28', current: 1, reorder: 4, qty: 6, urgency: 'NORMAL', status: 'DELIVERED' },
        { sku: 'HK-PLO-003', name: 'Poloshirt Navy Gr. M', current: 3, reorder: 5, qty: 5, urgency: 'LOW', status: 'OPEN' },
        { sku: 'DK-MNT-005', name: 'Mantel Wolle Camel Gr. 40', current: 0, reorder: 2, qty: 2, urgency: 'HIGH', status: 'ORDERED' },
        { sku: 'AK-SCH-001', name: 'Schal Kaschmir Rot', current: 4, reorder: 3, qty: 0, urgency: 'LOW', status: 'CANCELLED' },
        { sku: 'HK-ANZ-002', name: 'Anzughose Anthrazit Gr. 50', current: 1, reorder: 3, qty: 4, urgency: 'NORMAL', status: 'OPEN' },
        { sku: 'DK-RCK-006', name: 'Rock A-Linie Schwarz Gr. 36', current: 0, reorder: 2, qty: 3, urgency: 'HIGH', status: 'OPEN' },
      ];

      await prisma.stockCallout.createMany({
        data: callouts.map((c) => ({
          id: id('stock'),
          storeId: allStores[Math.floor(Math.random() * allStores.length)].id,
          sku: c.sku,
          productName: c.name,
          currentStock: c.current,
          reorderPoint: c.reorder,
          requestedQty: c.qty,
          urgency: c.urgency,
          status: c.status,
          reportedBy: pick([sm, learner]).id,
        })),
      });
      log('✓ Stock Callouts: 10 Bestandsmeldungen erstellt');
    }
  } catch (e) {
    console.error('✗ Stock Callouts:', e);
  }

  // ======================================================================
  // 32. TRACK & TRACE — Customer Orders
  // ======================================================================
  try {
    const existingCount = await prisma.customerOrder.count({ where: { storeId: store1.id } });
    if (existingCount > 0) {
      log('⏭  Track & Trace: bereits vorhanden — übersprungen');
    } else {
      const orderData = [
        { num: 'MH-2026-001', customer: 'Claudia Weber', email: 'c.weber@example.com', status: 'DELIVERED', carrier: 'DHL', tracking: 'DE1234567890', eta: daysAgo(2) },
        { num: 'MH-2026-002', customer: 'Markus Schneider', email: 'm.schneider@example.com', status: 'SHIPPED', carrier: 'DHL Express', tracking: 'DE0987654321', eta: daysFromNow(1) },
        { num: 'MH-2026-003', customer: 'Sandra Hoffmann', email: 's.hoffmann@example.com', status: 'IN_TRANSIT', carrier: 'Hermes', tracking: 'HE5678901234', eta: daysFromNow(3) },
        { num: 'MH-2026-004', customer: 'Anna Klein', email: 'anna.klein@example.com', status: 'ORDERED', carrier: null, tracking: null, eta: daysFromNow(5) },
        { num: 'MH-2026-005', customer: 'Maria Braun', email: 'maria.braun@example.com', status: 'READY_FOR_PICKUP', carrier: null, tracking: null, eta: null },
        { num: 'MH-2026-006', customer: 'Johannes Müller', email: 'j.mueller@example.com', status: 'ORDERED', carrier: null, tracking: null, eta: daysFromNow(7) },
      ];

      for (const o of orderData) {
        const orderId = id('order');
        const statusHistory = getStatusHistory(o.status, sm.id);
        await prisma.customerOrder.create({
          data: {
            id: orderId,
            storeId: store1.id,
            orderNumber: o.num,
            customerName: o.customer,
            customerEmail: o.email,
            status: o.status,
            trackingNumber: o.tracking,
            carrier: o.carrier,
            estimatedDelivery: o.eta,
            createdBy: sm.id,
            createdAt: daysAgo(randInt(3, 14)),
            statusUpdates: {
              create: statusHistory.map((sh) => ({
                id: id('ord_st'),
                status: sh.status,
                updatedBy: sm.id,
                notes: sh.notes,
                createdAt: sh.date,
              })),
            },
          },
        });
      }
      log('✓ Track & Trace: 6 Kundenbestellungen mit Status-Updates erstellt');
    }
  } catch (e) {
    console.error('✗ Track & Trace:', e);
  }

  // ======================================================================
  // Summary
  // ======================================================================
  console.log('\n=== Zusammenfassung ===\n');
  for (const s of summary) {
    console.log(`  ${s}`);
  }
  console.log('\nDemo-Daten Seed abgeschlossen.\n');
}

// ---------------------------------------------------------------------------
// Helper: ISO week number
// ---------------------------------------------------------------------------
function getISOWeek(d: Date): number {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// ---------------------------------------------------------------------------
// Helper: Generate budget actuals for a period
// ---------------------------------------------------------------------------
function generateBudgetActuals(
  _budgetPeriodId: string,
  period: string,
  userId: string,
  revenueTarget: number,
): { id: string; category: string; actualAmount: number; date: string; description: string | null; enteredBy: string }[] {
  const [yearStr, monthStr] = period.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const now = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const maxDay = year === now.getFullYear() && month === now.getMonth()
    ? now.getDate()
    : daysInMonth;

  const actuals: { id: string; category: string; actualAmount: number; date: string; description: string | null; enteredBy: string }[] = [];

  // 5 daily revenue actuals spread across the month
  for (let i = 0; i < 5; i++) {
    const day = Math.min(1 + Math.floor((i / 5) * maxDay), maxDay);
    const date = new Date(year, month, day);
    actuals.push({
      id: id('bud_act'),
      category: 'REVENUE',
      actualAmount: Math.round(revenueTarget / daysInMonth * randFloat(0.85, 1.15)),
      date: isoDate(date),
      description: null,
      enteredBy: userId,
    });
  }

  // Monthly labor, rent, marketing entries
  const laborActual = Math.round(revenueTarget * 0.18 * randFloat(0.95, 1.05));
  const rentActual = revenueTarget > 400000 ? 12000 : 8500;

  actuals.push({
    id: id('bud_act'),
    category: 'LABOR',
    actualAmount: laborActual,
    date: isoDate(new Date(year, month, 1)),
    description: 'Personalkosten gesamt',
    enteredBy: userId,
  });

  actuals.push({
    id: id('bud_act'),
    category: 'RENT',
    actualAmount: rentActual,
    date: isoDate(new Date(year, month, 1)),
    description: 'Monatsmiete',
    enteredBy: userId,
  });

  actuals.push({
    id: id('bud_act'),
    category: 'MARKETING',
    actualAmount: Math.round(3500 * randFloat(0.8, 1.2)),
    date: isoDate(new Date(year, month, 15)),
    description: 'Marketing-Ausgaben',
    enteredBy: userId,
  });

  return actuals;
}

// ---------------------------------------------------------------------------
// Helper: Generate order status history
// ---------------------------------------------------------------------------
function getStatusHistory(
  currentStatus: string,
  userId: string,
): { status: string; notes: string | null; date: Date }[] {
  const flowMap: Record<string, { status: string; notes: string; daysBack: number }[]> = {
    ORDERED: [
      { status: 'ORDERED', notes: 'Bestellung aufgenommen', daysBack: 7 },
    ],
    SHIPPED: [
      { status: 'ORDERED', notes: 'Bestellung aufgenommen', daysBack: 10 },
      { status: 'SHIPPED', notes: 'Paket an DHL übergeben', daysBack: 2 },
    ],
    IN_TRANSIT: [
      { status: 'ORDERED', notes: 'Bestellung aufgenommen', daysBack: 12 },
      { status: 'SHIPPED', notes: 'Versand bestätigt', daysBack: 5 },
      { status: 'IN_TRANSIT', notes: 'Paket unterwegs — voraussichtlich in 3 Tagen', daysBack: 1 },
    ],
    DELIVERED: [
      { status: 'ORDERED', notes: 'Bestellung aufgenommen', daysBack: 14 },
      { status: 'SHIPPED', notes: 'Versand', daysBack: 7 },
      { status: 'IN_TRANSIT', notes: 'Unterwegs', daysBack: 4 },
      { status: 'DELIVERED', notes: 'Zugestellt — Kunde informiert', daysBack: 2 },
    ],
    READY_FOR_PICKUP: [
      { status: 'ORDERED', notes: 'Bestellung für Filialabholung', daysBack: 5 },
      { status: 'READY_FOR_PICKUP', notes: 'Ware liegt bereit — Kunde benachrichtigt', daysBack: 1 },
    ],
  };

  const flow = flowMap[currentStatus] ?? flowMap['ORDERED'];
  return flow.map((f) => ({
    status: f.status,
    notes: f.notes,
    date: daysAgo(f.daysBack),
  }));
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Fatal error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
