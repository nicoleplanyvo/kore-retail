# KORE — Master Briefing für Claude Code
> Vertraulich · gadplan GmbH · Stand März 2026  
> Dieses Dokument ist die einzige Source of Truth für alle KORE-Entwicklungsarbeiten.

---

## 1. Projektübersicht

**KORE** (Domain: `koreretail.de`) ist eine Premium Retail Consulting Brand mit drei integrierten Produkten:

| Produkt | Typ | Priorität |
|---------|-----|-----------|
| **KORE Website** | Marketing + Lead-Gen | P0 — sofort |
| **KORE Train** | SaaS (Trainingsplattform) | P1 — MVP Q2 2026 |
| **KORE Pulse** | SaaS (KPI-Dashboard) | P2 — Q3 2026 |
| **KORE Shift** | SaaS (Dienstplan-Tool) | P3 — Q4 2026 |

**Inhaberin:** Nici — Store Manager bei Ralph Lauren Roermond Outlet (10+ Jahre Premium Retail Management), gleichzeitig Unternehmerin (gadplan GmbH, Meerbusch). Arbeitet anonym aufgrund ihrer RL-Position.

**Co-Founder:** Mathis — technischer Lead, übernimmt Backend und Infrastruktur.

**Rechtlicher Rahmen:** KORE läuft unter gadplan GmbH. Kein Naming von Ralph Lauren in irgendeinem öffentlich sichtbaren Content.

---

## 2. Brand Identity

### 2.1 Markenpositionierung

**KORE ist:**
- Premium Retail Consulting für den DACH-Markt
- Betrieben von jemandem mit echter Floor-Erfahrung
- Die Kombination aus persönlicher Beratung + skalierbaren digitalen Tools
- Zielgruppe primär: Fashion, Lifestyle, Accessories Retailer

**KORE ist NICHT:**
- Eine Sportbrand oder Sport-spezifisches Consulting
- Generisches Management-Consulting
- Akademisch-distanziert
- Günstig oder austauschbar

**Positioning Statement:**
> "KORE ist die einzige Retail-Consulting-Marke, die mit echter Floor-Erfahrung aus dem Premium-Segment systematisch die operative Performance von Retailern verbessert — durch Consulting, Training und digitale Eigentools."

### 2.2 Design System (KORE CI)

Alle Produkte und die Website verwenden ausschließlich dieses Design System. Niemals abweichen.

#### Farben

```css
:root {
  /* Primäre Palette */
  --kore-bg:       #F7F4EF;   /* Off-White — Seitenhintergrund */
  --kore-surface:  #EDEAE4;   /* Warm Surface — Cards, Sectionen */
  --kore-border:   #D8D4CC;   /* Subtile Trennlinien */
  --kore-ink:      #1C1A17;   /* Charcoal — Primärtext */
  --kore-mid:      #8A847A;   /* Warm Grey — Sekundärtext, Labels */
  --kore-faint:    #B5B0A8;   /* Captions, Disabled States */
  --kore-white:    #FDFCFA;   /* Card-Hintergründe */

  /* Accent */
  --kore-brass:    #9E8460;   /* Aged Brass — Primary Accent, CTAs */
  --kore-brass-lt: #C9B898;   /* Light Brass — Hover, Borders */
  --kore-brass-dk: #7A6347;   /* Dark Brass — Active States */

  /* Semantic */
  --kore-success:  #6B8C6B;
  --kore-warning:  #B8935A;
  --kore-error:    #9E5252;
}
```

#### Typografie

```
Display / Headlines: Cormorant (Google Fonts)
  - Font-Weight: 300 (light), 400 (regular), 600 (semibold)
  - Font-Style: Normal + Italic
  - Einsatz: Alle H1–H3, Pull Quotes, große Zahlen

Body / UI: Jost (Google Fonts)
  - Font-Weight: 300 (light), 400 (regular), 500 (medium)
  - Einsatz: Fließtext, Labels, Navigation, Buttons, Input-Felder

Monospace (Code/Daten): JetBrains Mono
  - Nur für Datendarstellung in KORE Pulse
```

#### Typografie-Skala

```css
/* Display */
.text-display    { font-family: 'Cormorant', serif; font-size: clamp(4rem, 9vw, 8.5rem); font-weight: 300; line-height: 0.92; }
.text-h1         { font-family: 'Cormorant', serif; font-size: clamp(2.4rem, 4vw, 3.8rem); font-weight: 300; line-height: 1.1; }
.text-h2         { font-family: 'Cormorant', serif; font-size: 1.8rem; font-weight: 300; line-height: 1.2; }
.text-h3         { font-family: 'Cormorant', serif; font-size: 1.45rem; font-weight: 600; line-height: 1.3; }

/* Body */
.text-lead       { font-family: 'Cormorant', serif; font-size: 1.25rem; font-style: italic; font-weight: 300; line-height: 1.6; }
.text-body       { font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 300; line-height: 1.8; }
.text-small      { font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 300; }
.text-caption    { font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; }
```

#### Spacing System

```
4px   — xs (micro-spacing, icon gaps)
8px   — sm
12px  — md-sm
16px  — md
20px  — md-lg
24px  — lg
32px  — xl
48px  — 2xl
64px  — 3xl
96px  — section-padding-y
```

#### Komponenten-Tokens

```css
/* Border Radius */
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
/* KORE verwendet bewusst kleine Border-Radii — kein Rounded-Overkill */

/* Shadows — sehr subtil */
--shadow-sm:  0 1px 3px rgba(28,26,23,0.06);
--shadow-md:  0 4px 12px rgba(28,26,23,0.08);
--shadow-lg:  0 12px 32px rgba(28,26,23,0.10);

/* Transitions */
--transition: 0.2s ease;

/* Borders */
--border-default: 1px solid var(--kore-border);
--border-brass:   1px solid var(--kore-brass-lt);
--border-ink:     1px solid var(--kore-ink);
```

#### UI-Komponenten-Patterns

```
Cards:
  - background: var(--kore-white)
  - border: var(--border-default)
  - padding: 32px
  - KEIN border-radius > 4px

Buttons Primary:
  - background: var(--kore-ink)
  - color: var(--kore-white)
  - border: none
  - padding: 12px 28px
  - font: Jost 500, 0.78rem, letter-spacing: 0.1em, uppercase
  - hover: background: var(--kore-brass)

Buttons Secondary:
  - background: transparent
  - border: var(--border-ink)
  - color: var(--kore-ink)
  - hover: border-color: var(--kore-brass); color: var(--kore-brass)

Input Fields:
  - background: var(--kore-white)
  - border: var(--border-default)
  - padding: 12px 16px
  - font: Jost 300, 0.9rem
  - focus: border-color: var(--kore-brass)
  - border-radius: 0 (kein radius)

Tags / Badges:
  - border: var(--border-default)
  - padding: 4px 10px
  - font: Jost 500, 0.65rem, uppercase, letter-spacing: 0.1em
  - color: var(--kore-mid)

Dividers:
  - 1px solid var(--kore-border)
  - Accent-Divider: 2px solid var(--kore-brass)

Accent-Line (links am Card-Edge):
  - border-left: 3px solid var(--kore-brass)

Navigation:
  - height: 56px
  - background: rgba(247,244,239,0.94) + backdrop-filter: blur(10px)
  - border-bottom: var(--border-default)
```

---

## 3. Tech Stack

### Frontend (alle Produkte)

```
Framework:    React 18+ mit TypeScript (strict mode — KEIN any)
Styling:      Tailwind CSS + CSS Custom Properties für KORE Design Tokens
State:        Zustand (global), React Query (server state)
Forms:        React Hook Form + Zod (Validation)
Routing:      React Router v6
Icons:        Lucide React (KEIN Material Icons für App-UIs)
Fonts:        Google Fonts (Cormorant + Jost)
Charts:       Recharts (für KORE Pulse)
Build:        Vite
Testing:      Jest + React Testing Library + Cypress (E2E)
```

### Backend

```
Runtime:      Node.js 20+
Framework:    Express.js mit TypeScript
ORM:          Prisma (PostgreSQL)
Auth:         JWT + Refresh Token Rotation
File Storage: S3-compatible (Cloudflare R2)
Email:        Resend (transaktional)
Payments:     Stripe (Subscriptions)
Validation:   Zod (shared mit Frontend via monorepo)
```

### Infrastruktur

```
Frontend:     Vercel
Backend:      Railway
Database:     Neon (PostgreSQL serverless) oder Railway PostgreSQL
CDN:          Cloudflare
Domain:       koreretail.de (+ kore-train.de, kore-pulse.de optional später)
Monitoring:   Sentry (Errors), Vercel Analytics
```

### Monorepo-Struktur

```
kore/
├── apps/
│   ├── web/          — KORE Marketing Website (React/Vite)
│   ├── train/        — KORE Train SaaS App (React/Vite)
│   ├── pulse/        — KORE Pulse SaaS App (React/Vite)
│   └── api/          — Shared Backend (Express/Node)
├── packages/
│   ├── ui/           — Shared KORE Design System Components
│   ├── types/        — Shared TypeScript Types
│   └── validators/   — Shared Zod Schemas
├── package.json      — Workspace root (pnpm workspaces)
└── turbo.json        — Turborepo config
```

**Package Manager:** pnpm (workspaces)  
**Build System:** Turborepo

---

## 4. KORE Website (P0)

### Zweck
Lead-Generation + Credibility-Aufbau. Potenzielle Kunden sollen eine kostenlose Audit-Anfrage stellen oder direkt Kontakt aufnehmen.

### Seiten / Routing

```
/                 — Homepage (Hero + Services Overview + Social Proof + CTA)
/consulting       — Consulting Services Detail
/training         — Training Academy Detail
/suite            — KORE Suite (SaaS) Overview + Pricing
/about            — Über KORE (anonym — keine Namensnennung, kein RL-Bezug)
/contact          — Kontaktformular + Kalender-Embed (Calendly)
/audit            — Kostenloser Audit-Antrag (Lead-Magnet)
/case-studies     — Anonymisierte Fallstudien
/legal            — Impressum + Datenschutz (DSGVO-konform DE)
```

### Homepage-Struktur

```
1. NAV
   - Logo: KORE (Cormorant, Charcoal)
   - Links: Consulting | Training | Suite | Über KORE | Kontakt
   - CTA Button: "Kostenloses Audit" (Brass)

2. HERO
   - Große Typografie: "KORE / Retail Intelligence"
   - Subline (Cormorant italic, grau): "Premium Retail Consulting für DACH."
   - CTA: "Kostenloses Audit anfragen" + "Services ansehen"
   - Hero-Stat-Leiste: 10+ Jahre Experience | 3 Revenue Streams | DACH-weit

3. SERVICES OVERVIEW (3 Karten)
   - Consulting / Training Academy / KORE Suite

4. WARUM KORE (Editorial Layout)
   - Pull Quote + 2-Column Text
   - "From the Floor. For the Floor." — kein Sport-Bezug

5. CASE STUDIES TEASER (2–3 anonymisiert)
   - "Leading Premium Retailer, DACH — +23% Conversion nach Audit"

6. KORE SUITE TEASER
   - 3 Tools kurz + Pricing CTA

7. KONTAKT / CTA SECTION
   - "Kostenloses Audit" Form (Name, Company, Store-Anzahl, Challenge, E-Mail)

8. FOOTER
   - Logo + Tagline + Links + Impressum + DSGVO
   - © gadplan GmbH
```

### Anforderungen

- **DSGVO-konform:** Cookie Banner, Datenschutzerklärung DE, kein Google Analytics (→ Vercel Analytics oder Plausible)
- **Kontaktformular:** Daten per E-Mail an Nici (über Resend) + automatische Bestätigung
- **Mobile-first:** Vollständig responsiv, alle Breakpoints
- **SEO:** Korrekte Meta-Tags, OpenGraph, Sitemap, Robots.txt
- **Performance:** Lighthouse Score > 90 in allen Kategorien
- **Sprache:** Deutsch (DE) als Default, English optional als Toggle später
- **Keine echten Namen:** "Inhaberin mit 10+ Jahren Premium Retail Erfahrung" — kein Bezug auf RL oder Person

---

## 5. KORE Train (P1 — SaaS)

### Produktbeschreibung
Interaktive Trainingsplattform für Retail-Teams. Store Manager können Trainings erstellen und ihrem Team zuweisen. Team-Mitglieder absolvieren Lernpfade auf dem Smartphone.

### Nutzerrollen

```typescript
type UserRole = 
  | 'kore_admin'      // Nici / KORE-intern: voller Zugriff auf alle Tenants
  | 'tenant_admin'    // Store-Inhaber / HR: erstellt Kurse, verwaltet Team
  | 'store_manager'   // Kann Assignments erstellen, Reports sehen
  | 'learner'         // Floor-Mitarbeiter: konsumiert Trainings
```

### Datenmodell (Prisma Schema — Core)

```prisma
// Tenant (= ein Retailer)
model Tenant {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  plan          Plan      @default(STARTER)
  logoUrl       String?
  brandColor    String?   @default("#9E8460")
  maxUsers      Int       @default(15)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  users         User[]
  courses       Course[]
  subscription  Subscription?
}

// User
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  role          UserRole
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  avatarUrl     String?
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  
  enrollments   Enrollment[]
  certificates  Certificate[]
}

// Course
model Course {
  id            String    @id @default(cuid())
  title         String
  description   String?
  coverImageUrl String?
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  isPublished   Boolean   @default(false)
  estimatedMins Int       @default(30)
  tags          String[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  modules       Module[]
  enrollments   Enrollment[]
}

// Module (Abschnitt eines Kurses)
model Module {
  id            String    @id @default(cuid())
  courseId      String
  course        Course    @relation(fields: [courseId], references: [id])
  title         String
  order         Int
  
  lessons       Lesson[]
}

// Lesson (einzelne Lerneinheit)
model Lesson {
  id            String      @id @default(cuid())
  moduleId      String
  module        Module      @relation(fields: [moduleId], references: [id])
  title         String
  type          LessonType  // VIDEO | TEXT | QUIZ | CHECKLIST
  content       Json        // Flexibler Content je nach Type
  order         Int
  durationMins  Int?
}

enum LessonType {
  VIDEO
  TEXT
  QUIZ
  CHECKLIST
}

// Enrollment (Zuweisung User → Kurs)
model Enrollment {
  id            String              @id @default(cuid())
  userId        String
  user          User                @relation(fields: [userId], references: [id])
  courseId      String
  course        Course              @relation(fields: [courseId], references: [id])
  status        EnrollmentStatus    @default(NOT_STARTED)
  progressPct   Int                 @default(0)
  startedAt     DateTime?
  completedAt   DateTime?
  dueDate       DateTime?
  assignedBy    String?
  
  lessonProgress LessonProgress[]
  
  @@unique([userId, courseId])
}

enum EnrollmentStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  OVERDUE
}

model LessonProgress {
  id            String      @id @default(cuid())
  enrollmentId  String
  enrollment    Enrollment  @relation(fields: [enrollmentId], references: [id])
  lessonId      String
  isCompleted   Boolean     @default(false)
  score         Int?        // für Quiz-Lessons
  completedAt   DateTime?
  
  @@unique([enrollmentId, lessonId])
}

// Certificate
model Certificate {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  courseId      String
  issuedAt      DateTime  @default(now())
  pdfUrl        String?
  
  @@unique([userId, courseId])
}

// Subscription (Stripe)
model Subscription {
  id                String    @id @default(cuid())
  tenantId          String    @unique
  tenant            Tenant    @relation(fields: [tenantId], references: [id])
  stripeCustomerId  String    @unique
  stripeSubId       String    @unique
  plan              Plan
  status            SubStatus
  currentPeriodEnd  DateTime
  cancelAtPeriod    Boolean   @default(false)
}

enum Plan {
  STARTER      // 299€/Mo — bis 15 User, nur Train
  PROFESSIONAL // 599€/Mo — unbegrenzt, Train + Pulse
  ENTERPRISE   // Custom
}

enum SubStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  TRIALING
}
```

### API Endpoints (REST)

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Users:
GET    /api/users                    — Liste (admin/manager)
POST   /api/users/invite             — Einladen per E-Mail
PUT    /api/users/:id                — Update
DELETE /api/users/:id                — Deaktivieren

Courses:
GET    /api/courses                  — Liste für Tenant
POST   /api/courses                  — Erstellen
GET    /api/courses/:id              — Detail
PUT    /api/courses/:id              — Update
DELETE /api/courses/:id              — Löschen
POST   /api/courses/:id/publish      — Veröffentlichen

Modules & Lessons:
POST   /api/courses/:id/modules
PUT    /api/modules/:id
DELETE /api/modules/:id
POST   /api/modules/:id/lessons
PUT    /api/lessons/:id
DELETE /api/lessons/:id

Enrollments:
GET    /api/enrollments              — Meine Enrollments (learner)
GET    /api/enrollments/team         — Team-Übersicht (manager)
POST   /api/enrollments              — Kurs zuweisen
PUT    /api/enrollments/:id/progress — Progress updaten

Certificates:
GET    /api/certificates             — Meine Zertifikate
GET    /api/certificates/:id/pdf     — PDF Download

Admin (KORE internal):
GET    /api/admin/tenants
GET    /api/admin/tenants/:id
PUT    /api/admin/tenants/:id/plan
```

### Frontend-Screens (KORE Train App)

```
Learner Views:
  /                 — Dashboard: Meine Kurse, Fortschritt, To-dos
  /courses          — Kurs-Bibliothek
  /courses/:id      — Kursdetail + Module-Übersicht
  /learn/:lessonId  — Lernview (Video/Text/Quiz)
  /certificates     — Meine Abschlüsse

Manager Views:
  /manage           — Team-Übersicht + Completion Rates
  /manage/assign    — Kurs einem User/Team zuweisen
  /manage/reports   — Detailreports + Export CSV

Admin Views:
  /admin/courses    — Kurse erstellen + editieren
  /admin/users      — User-Verwaltung
  /admin/settings   — Branding (Logo, Farbe), Tenant-Settings
  /admin/billing    — Subscription verwalten (Stripe Portal)
```

### Mobile-First Anforderungen

- Learner-Views müssen auf dem Smartphone primär funktionieren (Floor-Teams)
- Manager/Admin-Views Desktop-optimiert
- PWA-fähig (Service Worker, Offline-Cache für gestartete Lernpfade)
- Touch-optimierte Navigation (Bottom Nav für Mobile)

---

## 6. KORE Pulse (P2 — SaaS)

### Produktbeschreibung
KPI-Dashboard für Store Manager. Echtzeit-Sichtbarkeit auf Conversion, ATV (Average Transaction Value), Team-Performance, Budget vs. Actual.

### Datenmodell (Ergänzung zu Train)

```prisma
// Store (physischer Standort)
model Store {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  name          String
  location      String?
  timezone      String    @default("Europe/Berlin")
  currency      String    @default("EUR")
  
  kpis          KPIEntry[]
  targets       KPITarget[]
}

// KPI-Eintrag (täglich)
model KPIEntry {
  id            String    @id @default(cuid())
  storeId       String
  store         Store     @relation(fields: [storeId], references: [id])
  date          DateTime  @db.Date
  
  // Umsatz
  revenue       Decimal   @db.Decimal(10,2)
  transactions  Int
  
  // Berechnete Werte
  atv           Decimal   @db.Decimal(10,2)  // revenue / transactions
  
  // Conversion (wenn Frequenz-Daten vorhanden)
  footfall      Int?
  conversionPct Decimal?  @db.Decimal(5,2)
  
  // Units
  unitsSold     Int?
  upt           Decimal?  @db.Decimal(5,2)   // units per transaction
  
  // Personal
  staffHours    Decimal?  @db.Decimal(8,2)
  revenuePerHr  Decimal?  @db.Decimal(10,2)
  
  @@unique([storeId, date])
}

// KPI-Zielwerte (Monat)
model KPITarget {
  id            String    @id @default(cuid())
  storeId       String
  store         Store     @relation(fields: [storeId], references: [id])
  month         DateTime  @db.Date  // Erster des Monats
  
  revenueTarget Decimal   @db.Decimal(10,2)
  atvTarget     Decimal?  @db.Decimal(10,2)
  convTarget    Decimal?  @db.Decimal(5,2)
  
  @@unique([storeId, month])
}
```

### Dashboard-Views

```
/pulse                      — Hauptdashboard (Store-Auswahl, Quick-KPIs)
/pulse/stores/:id           — Store-Detail (Tages/Wochen/Monats-View)
/pulse/stores/:id/input     — Tägliche KPI-Eingabe (simples Formular)
/pulse/compare              — Store-Vergleich (Multi-Store Tenants)
/pulse/reports              — Report-Generator + PDF/CSV Export
/pulse/targets              — Zielwerte setzen
```

### KPI-Berechnungslogik

```typescript
// Alle Berechnungen serverseitig in /packages/validators/src/kpi.ts
export const calculateKPIs = (entries: KPIEntry[]) => ({
  totalRevenue:     sum(entries.map(e => e.revenue)),
  avgATV:           avg(entries.map(e => e.atv)),
  avgConversion:    avg(entries.filter(e => e.conversionPct).map(e => e.conversionPct!)),
  revenueVsTarget:  /* Achtung: Target muss gefetcht werden */,
  trendRevenue:     calculateTrend(entries.map(e => e.revenue)),
  // etc.
})
```

---

## 7. KORE Shift (P3 — SaaS)

### Produktbeschreibung
Budget-intelligenter Dienstplan. Revenue-Forecast → optimale Stunden-Struktur → Dienstplan-Export.

Basiert auf der bestehenden S+B Budget Simulator Logik (bereits entwickelt für RL-intern).

### Core-Logik

```
Revenue Forecast (Woche/Monat)
  ↓
Strukturberechnung (% Revenue → Personalkosten → Stunden)
  ↓
Schicht-Planung (wer, wann, wie lang)
  ↓
Export: iCal / PDF / Excel
```

Detailliertes Spec wird separat geliefert, sobald P2 (Pulse) live ist.

---

## 8. Authentifizierung & Multi-Tenancy

### Konzept

Alle drei SaaS-Apps teilen eine gemeinsame Authentifizierung und Datenbank, aber strikt getrennte Datenzugriffe per `tenantId`.

```typescript
// Middleware: Jeder API-Request muss tenantId enthalten und verifiziert sein
export const requireTenant = async (req, res, next) => {
  const user = req.user; // aus JWT
  if (!user.tenantId) return res.status(403).json({ error: 'No tenant' });
  req.tenantId = user.tenantId;
  next();
};

// Alle DB-Queries müssen tenantId filtern — NIEMALS vergessen
const courses = await prisma.course.findMany({
  where: { tenantId: req.tenantId }  // ← immer!
});
```

### JWT-Payload

```typescript
interface JWTPayload {
  sub: string;       // userId
  tenantId: string;
  role: UserRole;
  plan: Plan;
  iat: number;
  exp: number;       // 15 Minuten
}
// Refresh Token: 30 Tage, httpOnly Cookie
```

---

## 9. Stripe Integration

### Preisstruktur (Produkt-IDs im Stripe Dashboard anlegen)

```
kore_train_starter_monthly:       299€/Monat
kore_train_professional_monthly:  599€/Monat
kore_train_starter_yearly:        2.990€/Jahr (2 Monate gratis)
kore_train_professional_yearly:   5.990€/Jahr
```

### Webhook Events (verarbeiten)

```
checkout.session.completed       → Subscription in DB anlegen
customer.subscription.updated    → Plan-Änderung synken
customer.subscription.deleted    → Tenant auf FREE downgraden
invoice.payment_failed           → E-Mail an Tenant-Admin
```

---

## 10. E-Mail System (Resend)

### Templates (alle auf Deutsch)

```
welcome_tenant_admin    — Nach erfolgreicher Registrierung
invite_user             — Team-Mitglied einladen
course_assigned         — "Du wurdest zu Kurs X zugewiesen"
course_completed        — "Glückwunsch! Du hast X abgeschlossen"
certificate_ready       — Zertifikat-PDF als Anhang
payment_failed          — Zahlung fehlgeschlagen
audit_request_received  — Website Audit-Anfrage (an Nici intern)
audit_request_confirm   — Bestätigung an den Anfragenden
```

### Absender

```
from: "KORE <hello@koreretail.de>"
reply-to: "nici@koreretail.de" (intern)
```

---

## 11. Code-Standards (non-negotiable)

```typescript
// ✅ Immer explizite TypeScript Types — KEIN any
interface CourseCreateInput {
  title: string;
  description?: string;
  tenantId: string;
}

// ✅ Zod für alle Inputs
const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

// ✅ Error Handling überall
try {
  const course = await prisma.course.create({ data: validatedData });
  return res.status(201).json({ course });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(409).json({ error: 'Conflict' });
  }
  return res.status(500).json({ error: 'Internal server error' });
}

// ✅ JSDoc für alle Public Functions
/**
 * Berechnet den prozentualen Fortschritt eines Enrollments.
 * @param completedLessons - Anzahl abgeschlossener Lerneinheiten
 * @param totalLessons - Gesamtanzahl der Lerneinheiten im Kurs
 * @returns Fortschritt als Integer zwischen 0 und 100
 */
export const calculateProgress = (completedLessons: number, totalLessons: number): number => {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
};

// ✅ Responsive Design — mobile-first
// ✅ ARIA-Attribute für Accessibility
// ✅ Keine hardcodierten Strings — alle Texte in /locales/de.json
```

---

## 12. Prioritätenreihenfolge & Start

### Sofort (diese Woche)

1. **Monorepo aufsetzen** — pnpm workspaces + Turborepo + shared packages
2. **Design System Package** — alle KORE CI Tokens als React-Komponenten in `/packages/ui`
3. **KORE Website** — statische Marketing-Site mit Kontaktformular

### Q2 2026

4. **KORE Train Backend** — Prisma Schema + API + Auth
5. **KORE Train Frontend** — Learner-Views (Mobile-first)
6. **KORE Train Admin** — Kurs-Editor
7. **Stripe Integration** — Checkout + Subscription Management

### Q3 2026

8. **KORE Pulse** — KPI-Dashboard + Dateneingabe
9. **Kombination Train + Pulse** — Professional Plan

---

## 13. Ansprechpartner & Kontext

| Person | Rolle | Hinweis |
|--------|-------|---------|
| **Nici** | Inhaberin / Product Owner | Kommuniziert auf Deutsch. Technisch versiert, braucht keine Erklärungen für Basisdinge. Arbeitet anonym — RL niemals erwähnen. |
| **Mathis** | Co-Founder / Tech Lead | Übernimmt Backend-Setup und Infrastruktur, wo Nici nicht verfügbar |

### Kommunikationsregeln für Claude Code

- Ausgaben auf **Deutsch**, technische Begriffe auf **Englisch** (z.B. "Das Prisma Schema ist fertig, der Migration-Run war erfolgreich.")
- **Keine Platzhalter** in Code — immer vollständig und production-ready
- Bei Unklarheiten: **nachfragen**, nicht raten
- Outputs: Immer echte Dateien, nie nur Code-Blöcke im Chat
- Design: **Immer** das KORE CI aus Section 2.2 verwenden — keine Improvisation

---

## 14. Wichtige Rahmenbedingungen

- Alle Content-Texte auf der Website und in Apps auf **Deutsch (DE)**
- **DSGVO:** Cookie-Consent, Datenschutzerklärung, Recht auf Löschung implementieren
- **Impressum:** gadplan GmbH, Meerbusch — echter Inhalt wird von Nici geliefert
- **Keine Erwähnung von:** Ralph Lauren, Roermond, Nicis Nachnamen, anderen Arbeitgebern
- **Keine Stock-Fotos** ohne Lizenz — Illustrations oder reine Typografie-Layouts bevorzugen
- **SSL:** Immer HTTPS, Vercel handled das automatisch
- **Barrierefreiheit:** WCAG 2.1 AA als Ziel

---

*Dokument endet hier. Bei Fragen: Nici direkt fragen.*
