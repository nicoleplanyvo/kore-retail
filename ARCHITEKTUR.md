# KORE — Architektur & Deployment Guide

## Inhaltsverzeichnis

1. [Das große Bild](#1-das-große-bild)
2. [Was ist was?](#2-was-ist-was)
3. [Wie hängt alles zusammen?](#3-wie-hängt-alles-zusammen)
4. [Lokale Entwicklung](#4-lokale-entwicklung)
5. [Server & Hosting (Plesk)](#5-server--hosting-plesk)
6. [Deployment Schritt für Schritt](#6-deployment-schritt-für-schritt)
7. [Domains & DNS](#7-domains--dns)
8. [Datenbank](#8-datenbank)
9. [Benutzer & Rollen](#9-benutzer--rollen)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Das große Bild

KORE besteht aus **4 Teilen**, die zusammenarbeiten:

```
┌─────────────────────────────────────────────────────────┐
│                    BENUTZER                              │
│                                                         │
│   🌐 Website          📊 Dashboard        📱 App        │
│   kore-retail.de      /dashboard/         app.kore-...  │
│   (Marketing)         (Admin-Tool)        (Mitarbeiter) │
│                                                         │
│   "Hallo, wir sind    "Tenants, Stores,   "Audits       │
│    KORE, buche eine    User verwalten"     durchführen,  │
│    Beratung"                               Tools nutzen" │
└────────┬──────────────────┬──────────────────┬──────────┘
         │                  │                  │
         │    Alle 3 reden mit der API:        │
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    🔧 API (Express)                      │
│                    Port 3001                             │
│                                                         │
│   Was die API macht:                                    │
│   • Login/Logout (JWT Tokens)                           │
│   • Daten lesen/schreiben (Tenants, Stores, User...)    │
│   • Dateien hochladen (Audit-Fotos)                     │
│   • E-Mails senden (Kontaktformular)                    │
│                                                         │
│   Die API ist wie ein KELLNER im Restaurant:             │
│   Die Gäste (Website/Dashboard/App) bestellen,          │
│   der Kellner holt es aus der Küche (Datenbank).        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 💾 SQLite Datenbank                       │
│                 data/kore.db                             │
│                                                         │
│   Speichert ALLES: User, Tenants, Stores, Tools,       │
│   Audit-Sessions, Ergebnisse, Fotos...                  │
└─────────────────────────────────────────────────────────┘
```

### Einfach erklärt

| Teil | Vergleich | Wer nutzt es? |
|------|-----------|---------------|
| **Website** | Schaufenster eines Ladens | Potenzielle Kunden, Besucher |
| **Dashboard** | Büro hinter dem Laden | KORE-Admins, Tenant-Admins |
| **App** | Werkzeug für Mitarbeiter | Store Manager, Verkäufer |
| **API** | Der Laden-Computer im Hintergrund | Niemand direkt — wird von den anderen 3 benutzt |

**Die API sieht man nie direkt.** Sie ist der unsichtbare Dienst, der im Hintergrund läuft. Wenn du dich im Dashboard einloggst, schickt das Dashboard deine E-Mail/Passwort an die API, die prüft es und schickt ein "OK" zurück.

---

## 2. Was ist was?

### 2.1 Das Monorepo (ein Git-Repo für fast alles)

```
/Users/nicolemunozbonilla/Desktop/KORE/
│
├── apps/
│   ├── web/              ← 🌐 Marketing-Website
│   │   ├── src/          ← React-Code
│   │   └── dist/         ← Fertig gebaute Website (HTML/CSS/JS)
│   │
│   ├── dashboard/        ← 📊 Admin-Dashboard
│   │   ├── src/          ← React-Code
│   │   └── dist/         ← Fertig gebautes Dashboard (HTML/CSS/JS)
│   │
│   └── api/              ← 🔧 Backend-Server
│       ├── src/          ← TypeScript-Code
│       ├── dist/         ← Kompilierter Server (JavaScript)
│       └── prisma/       ← Datenbank-Schema + Seed-Daten
│
├── packages/             ← 📦 Geteilter Code (von mehreren Apps genutzt)
│   ├── types/            ← TypeScript-Typen (UserRole, Store, etc.)
│   ├── validators/       ← Validierungs-Regeln (Login-Form, etc.)
│   └── ui/               ← Geteilte UI-Komponenten (Button, Input, etc.)
│
├── app.js                ← 🚀 Start-Datei für den Server (Plesk/Passenger)
├── deploy.sh             ← 📜 Deployment-Script (läuft auf dem Server)
├── seed-production.js    ← 🌱 Füllt die Produktions-DB mit Demo-Daten
├── package.json          ← Projekt-Konfiguration
├── pnpm-workspace.yaml   ← Definiert die Workspace-Struktur
└── turbo.json            ← Build-Konfiguration (Reihenfolge)
```

### 2.2 Die Kunden-App (eigenes Repo)

```
/Users/nicolemunozbonilla/Desktop/kore-app/
│
├── src/                  ← 📱 React-Code (PWA)
│   ├── pages/            ← Seiten (Login, Home, Tools, Profil)
│   ├── tools/            ← Tool-Module (Store Excellence Audit)
│   ├── components/       ← UI-Komponenten
│   ├── hooks/            ← React Hooks (useAuth, useTools, useAudit)
│   └── lib/
│       └── api.ts        ← Verbindung zur KORE-API
│
├── dist/                 ← Fertig gebaute App (HTML/CSS/JS)
├── package.json
└── vite.config.ts        ← PWA-Konfiguration (offline-fähig)
```

**Warum ein eigenes Repo?**
- Andere Zielgruppe (Mitarbeiter statt Admins)
- Kann unabhängig deployt werden
- Mobile-first PWA (installierbar auf dem Handy)

---

## 3. Wie hängt alles zusammen?

### Was passiert bei einem Login im Dashboard?

```
1. User tippt E-Mail + Passwort im Dashboard ein
2. Dashboard schickt: POST /api/auth/login { email, password }
                                    │
3. API empfängt die Anfrage ◄───────┘
4. API sucht den User in der SQLite-Datenbank
5. API vergleicht das Passwort (bcrypt Hash)
6. API erstellt einen JWT-Token
7. API schickt zurück: { user: {...}, accessToken: "abc123" }
                                    │
8. Dashboard empfängt den Token ◄───┘
9. Dashboard speichert den Token im Speicher
10. Bei jeder weiteren Anfrage schickt das Dashboard:
    Authorization: Bearer abc123
```

### API-Routen Überblick

| Route | Methode | Was es macht | Wer nutzt es? |
|-------|---------|-------------|---------------|
| `/api/auth/login` | POST | Einloggen | Dashboard, App |
| `/api/auth/me` | GET | Eigenes Profil | Dashboard, App |
| `/api/admin/tenants` | GET/POST | Tenants verwalten | Dashboard |
| `/api/admin/stores` | GET/POST | Stores verwalten | Dashboard |
| `/api/admin/users` | GET/POST | User verwalten | Dashboard |
| `/api/tools` | GET | Meine zugewiesenen Tools | App |
| `/api/tools/sea/*` | GET/POST | Store Excellence Audit | App |
| `/api/contact` | POST | Kontaktformular | Website |
| `/health` | GET | Server-Status prüfen | Monitoring |

---

## 4. Lokale Entwicklung

### Voraussetzungen
- Node.js 20+ installiert
- pnpm installiert: `npm install -g pnpm`

### Monorepo starten (API + Website + Dashboard)

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE

# 1. Dependencies installieren
pnpm install

# 2. Alles auf einmal starten
pnpm dev
```

Das startet:
| App | URL | Port |
|-----|-----|------|
| Website | http://localhost:5173 | 5173 |
| Dashboard | http://localhost:5174 | 5174 |
| API | http://localhost:3001 | 3001 |

### Kunden-App starten (separates Terminal)

```bash
cd /Users/nicolemunozbonilla/Desktop/kore-app

# 1. Dependencies installieren
npm install

# 2. Starten
npm run dev
```

| App | URL | Port |
|-----|-----|------|
| Kunden-App | http://localhost:5175 | 5175 |

### Wichtig: Die API muss laufen!
Dashboard und App funktionieren NICHT ohne die API. Immer zuerst `pnpm dev` im Monorepo starten (das startet die API mit), dann erst die Kunden-App.

### Test-Logins (lokale Entwicklung)

Nach `pnpm --filter @kore/api run db:seed`:

| E-Mail | Passwort | Rolle |
|--------|----------|-------|
| admin@kore-retail.de | admin1234 | KORE Admin |
| ta@modehouse.de | demo1234 | Tenant Admin |
| sm@modehouse.de | demo1234 | Store Manager |
| learner@modehouse.de | demo1234 | Learner |

---

## 5. Server & Hosting (Plesk)

### Server-Informationen

| | |
|---|---|
| **Server** | craft.serverforall.de |
| **IP** | 213.165.77.153 |
| **OS** | Ubuntu 22.04 LTS |
| **Panel** | Plesk Obsidian 18.0.75 |
| **Node.js** | via Phusion Passenger |
| **DNS** | Hetzner Robot (robotdns.de) |

### Wie Plesk den Server startet

```
Plesk → Phusion Passenger → app.js → apps/api/dist/index.js
                               │
                               ├── Erstellt data/ Ordner
                               ├── Erstellt SQLite DB (wenn nötig)
                               └── Startet Express Server
```

**Phusion Passenger** ist wie ein Aufpasser, der den Node.js-Prozess startet und überwacht. Er kann nur CommonJS (require/module.exports), deshalb gibt es `app.js` als Wrapper, der dann den modernen ESM-Code (import/export) lädt.

### Was der Express-Server in Produktion serviert

```
https://kore-retail.de
│
├── /                     → Website (apps/web/dist/)
├── /dashboard/           → Dashboard SPA (apps/dashboard/dist/)
├── /api/*                → API-Routen (Express)
├── /health               → Server-Status
└── /api/uploads/*        → Hochgeladene Dateien (auth-geschützt)
```

**Alles läuft über EINEN Server-Prozess.** Der Express-Server ist gleichzeitig:
- API (Daten)
- Webserver für die Website (statische Dateien)
- Webserver für das Dashboard (statische Dateien)

### Plesk Umgebungsvariablen (Node.js)

| Variable | Wert | Bedeutung |
|----------|------|-----------|
| `NODE_ENV` | `production` | Produktionsmodus |
| `DATABASE_URL` | `file:./data/kore.db` | Pfad zur SQLite-Datenbank |
| `JWT_SECRET` | (geheimer Schlüssel) | Zum Signieren von Login-Tokens |
| `JWT_REFRESH_SECRET` | (geheimer Schlüssel) | Zum Erneuern von Tokens |
| `CORS_ORIGIN` | `https://kore-retail.de,https://dashboard.kore-retail.de,https://app.kore-retail.de` | Erlaubte Domains |

---

## 6. Deployment Schritt für Schritt

### 6.1 Monorepo deployen (Website + Dashboard + API)

**Einmalig: Git-Repository in Plesk einrichten**

1. Plesk → kore-retail.de → **Git**
2. Repository-URL: `https://github.com/nicoleplanyvo/kore-retail.git`
3. Branch: `main`
4. Zielverzeichnis: `/httpdocs`
5. Post-Deploy-Aktionen: `bash deploy.sh`

**Bei jedem Update:**

1. Lokal ändern und committen:
   ```bash
   cd /Users/nicolemunozbonilla/Desktop/KORE
   git add .
   git commit -m "Beschreibung der Änderung"
   git push origin main
   ```

2. In Plesk → kore-retail.de → **Git** → **Pull** klicken
   (oder `deploy.sh` wird automatisch ausgeführt)

3. Plesk → **Node.js** → **Restart App** klicken

**Was deploy.sh macht:**
```
1. Node.js finden (Plesk-Pfad)
2. pnpm install (Dependencies)
3. Prisma Client generieren
4. Datenbank-Schema synchronisieren
5. Alles bauen (Website + Dashboard + API)
```

### 6.2 Datenbank erstmals füllen (Seed)

Nach dem ersten Deploy ist die Datenbank leer. So füllst du sie:

1. Plesk → kore-retail.de → **Node.js** → **Command Runner**
2. Eingeben:
   ```
   exec -- node seed-production.js
   ```
3. **Restart App** klicken

### 6.3 Kunden-App deployen (app.kore-retail.de)

Die Kunden-App ist ein eigenes Repo und muss separat deployt werden.

**Option A: Statische Dateien hochladen (einfachste)**

1. Lokal bauen:
   ```bash
   cd /Users/nicolemunozbonilla/Desktop/kore-app
   VITE_API_URL=https://kore-retail.de npm run build
   ```

2. Den Inhalt von `dist/` nach Plesk hochladen:
   - Plesk → app.kore-retail.de → **Dateimanager**
   - Alles in `httpdocs/` hochladen

3. `.htaccess` für SPA-Routing erstellen (in `httpdocs/`):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

**Option B: Git-Repository in Plesk (automatisch)**

1. Plesk → app.kore-retail.de → **Git**
2. Repository: `https://github.com/nicoleplanyvo/kore-app.git`
3. Branch: `main`
4. Zielverzeichnis: `/httpdocs`

Danach muss die App allerdings auf dem Server gebaut werden, oder du pushst den `dist/`-Ordner mit ins Repo.

---

## 7. Domains & DNS

### Aktuelle Domain-Struktur

| Domain | Zeigt auf | Inhalt |
|--------|-----------|--------|
| `kore-retail.de` | 213.165.77.153 | Website + API + Dashboard (/dashboard/) |
| `dashboard.kore-retail.de` | 213.165.77.153 | (geplant: Dashboard als eigenständige Subdomain) |
| `app.kore-retail.de` | 213.165.77.153 | (geplant: Kunden-App PWA) |

### DNS verwalten

DNS-Records werden bei **Hetzner Robot** verwaltet (NICHT in Plesk):
- Login: https://robot.hetzner.com
- DNS-Zone: kore-retail.de
- Nameserver: ns1-ns4.robotdns.de

### SSL-Zertifikate

Werden in **Plesk** verwaltet:
- Plesk → Domain → **SSL/TLS-Zertifikate**
- Let's Encrypt für alle Domains/Subdomains

---

## 8. Datenbank

### Datenbank-Typ: SQLite

- **Datei**: `data/kore.db` (auf dem Server)
- **Lokal**: `apps/api/dev.db` (für Entwicklung)
- **Keine separate Installation nötig** (keine MySQL/PostgreSQL)
- **Prisma ORM** verwaltet das Schema

### Tabellen-Übersicht

```
Tenant (Kundenunternehmen)
  └── Store (Filiale)
        ├── StoreToolAssignment (welche Tools diese Filiale hat)
        └── UserStoreAssignment (welche User Zugriff haben)

User (Benutzer)
  ├── gehört zu einem Tenant
  └── ist Stores zugewiesen

ToolDefinition (verfügbare Tools)
  z.B. "Checklisten", "KPI Dashboard", "Training Hub"

AuditTemplate → AuditCategory → AuditCriterion
  (Vorlagen für Store Excellence Audits)

AuditSession → AuditResponse
  (durchgeführte Audits mit Bewertungen)
```

### Datenbank lokal zurücksetzen

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE/apps/api
rm -f dev.db           # Alte DB löschen
pnpm exec prisma db push   # Schema neu erstellen
pnpm run db:seed           # Demo-Daten einfügen
```

---

## 9. Benutzer & Rollen

### Rollen-Hierarchie (höchste → niedrigste)

| Rolle | Kann sehen | Typischer User |
|-------|-----------|----------------|
| `kore_admin` | ALLES | KORE-Mitarbeiter (Nicole) |
| `tenant_admin` | Alle Stores des Tenants | Geschäftsführer des Kunden |
| `regional_manager` | Zugewiesene Stores (Region) | Regionalleiter |
| `multisite_manager` | Zugewiesene Stores (mehrere) | Multi-Store-Manager |
| `store_manager` | Zugewiesene Stores (einzeln) | Filialleiter |
| `learner` | Eigener Store, nur Tools nutzen | Verkäufer/Mitarbeiter |

### Wer nutzt was?

| Rolle | Website | Dashboard | App |
|-------|---------|-----------|-----|
| Besucher | ✅ | ❌ | ❌ |
| kore_admin | ✅ | ✅ | ✅ |
| tenant_admin | ❌ | ✅ | ✅ |
| store_manager | ❌ | ❌ | ✅ |
| learner | ❌ | ❌ | ✅ |

---

## 10. Troubleshooting

### API startet nicht (Passenger Error)

**Symptom**: Weiße Seite mit "Web application could not be started"

**Lösung**:
1. Plesk → Node.js → Command Runner
2. `exec -- npx --yes pnpm@latest install`
3. `exec -- node seed-production.js` (falls DB leer)
4. **Restart App** klicken

### "Cannot find package 'xyz'"

**Ursache**: pnpm-Dependencies nicht korrekt installiert

**Lösung**:
```
exec -- npx --yes pnpm@latest install
```
Dann **Restart App**.

### Dashboard zeigt leere Seite

**Prüfen**: Ist die API erreichbar?
```
curl https://kore-retail.de/health
```
Sollte `{"status":"ok"}` zurückgeben.

### Login schlägt fehl

**Prüfen**: Ist die Datenbank geseeded?
```
curl -X POST https://kore-retail.de/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kore-retail.de","password":"admin1234"}'
```

Wenn "Bad Request" → Datenbank ist leer → `node seed-production.js` ausführen.

### CORS-Fehler im Browser

**Symptom**: Netzwerkfehler, "blocked by CORS policy"

**Lösung**: In Plesk → Node.js → Umgebungsvariablen prüfen:
- `CORS_ORIGIN` muss die Domain enthalten, von der die Anfrage kommt
- Mehrere Domains mit Komma trennen (ohne Leerzeichen)

### Subdomain zeigt Plesk-Default-Seite

**Ursache**: Die Subdomain hat keine eigenen Dateien

**Lösung**: Dateien in die `httpdocs/` der Subdomain hochladen (siehe Kapitel 6.3)

---

## Zusammenfassung

```
ENTWICKLUNG (lokal)                PRODUKTION (Plesk-Server)
─────────────────                  ──────────────────────────

Terminal 1:                        GitHub → Plesk Git Pull
  cd KORE                            ↓
  pnpm dev                         deploy.sh
  → Website :5173                    → pnpm install
  → Dashboard :5174                  → prisma generate
  → API :3001                        → pnpm build
                                     ↓
Terminal 2:                        Passenger → app.js
  cd kore-app                        → Express Server
  npm run dev                        → Website: kore-retail.de
  → App :5175                        → Dashboard: /dashboard/
                                     → API: /api/*
                                     → DB: data/kore.db
```
