# KORE — Plesk Deployment Guide

## Architektur

```
kore-retail.de              → Statische SPA (React)     → apps/web/dist/
dashboard.kore-retail.de    → Statische SPA (React)     → apps/dashboard/dist/
api.kore-retail.de          → Node.js API (Express)     → apps/api/
```

---

## 1. Voraussetzungen auf dem Server

```bash
# Node.js 20+ installiert (über Plesk Node.js Extension)
node -v   # >= 20.0.0

# pnpm und PM2 global installieren
npm install -g pnpm pm2
```

---

## 2. Domain-Setup in Plesk

### 2a. Frontend: `kore-retail.de`

1. **Domain hinzufügen**: `kore-retail.de`
2. **Document Root**: `/var/www/vhosts/kore-retail.de/httpdocs`
3. **SSL/TLS**: Let's Encrypt Zertifikat aktivieren
4. **Apache .htaccess** für SPA-Routing erstellen:

```apache
# /var/www/vhosts/kore-retail.de/httpdocs/.htaccess
RewriteEngine On
RewriteBase /

# Bestehende Dateien und Ordner direkt ausliefern
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Alles andere an index.html weiterleiten (SPA)
RewriteRule ^ index.html [QSA,L]

# Caching für statische Assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip-Kompression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
```

### 2b. Dashboard: `dashboard.kore-retail.de`

1. **Subdomain hinzufügen**: `dashboard.kore-retail.de`
2. **Document Root**: `/var/www/vhosts/dashboard.kore-retail.de/httpdocs`
3. **SSL/TLS**: Let's Encrypt Zertifikat aktivieren
4. **Apache .htaccess** wie bei 2a (gleiche SPA-Routing-Regeln)

### 2c. API: `api.kore-retail.de`

1. **Subdomain hinzufügen**: `api.kore-retail.de`
2. **SSL/TLS**: Let's Encrypt Zertifikat aktivieren
3. **Option A — Plesk Node.js App** (empfohlen):
   - Node.js Version: 20.x
   - Application Root: `/var/www/vhosts/api.kore-retail.de`
   - Application Startup File: `dist/index.js`
   - Application Mode: Production

4. **Option B — PM2 manuell**:
```bash
cd /var/www/vhosts/api.kore-retail.de
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Autostart nach Server-Reboot
```

---

## 3. Umgebungsvariablen

### Frontend: `apps/web/.env.production`

```env
VITE_API_URL=https://api.kore-retail.de
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Dashboard: `apps/dashboard/.env.production`

```env
VITE_API_URL=https://api.kore-retail.de
```

### API: `apps/api/.env` (auf dem Server)

```env
# Database (SQLite)
DATABASE_URL="file:./data/kore.db"

# JWT
JWT_SECRET="dein-jwt-secret-min-32-zeichen"
JWT_REFRESH_SECRET="dein-refresh-secret-min-32-zeichen"

# Resend — https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxx

# E-Mails
NOTIFICATION_EMAIL=hello@planyvo.com
FROM_EMAIL=noreply@kore-retail.de

# CORS — Frontend-URLs erlauben
CORS_ORIGIN=https://kore-retail.de,https://www.kore-retail.de,https://dashboard.kore-retail.de

# Server
PORT=3001
NODE_ENV=production
```

---

## 4. Erstmalige Einrichtung

### Lokal bauen

```bash
# 1. Frontend-Env erstellen
cp apps/web/.env.production.example apps/web/.env.production
# → VITE_API_URL und VITE_GA_MEASUREMENT_ID eintragen

# 2. Projekt bauen
pnpm install
pnpm build

# 3. Deploy-Script konfigurieren
# → In scripts/deploy.sh PLESK_USER und PLESK_HOST anpassen
```

### Auf dem Server

```bash
# 1. API-Verzeichnis vorbereiten
cd /var/www/vhosts/api.kore-retail.de
mkdir -p data logs prisma

# 2. .env erstellen
nano .env
# → Alle Werte aus Abschnitt 3 eintragen

# 3. Dependencies installieren
npm install --production

# 4. Prisma Client generieren & DB initialisieren
npx prisma generate
npx prisma db push

# 5. PM2 starten
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 5. Deployment

### Mit dem Deploy-Script (empfohlen)

```bash
# Alles deployen (Frontend + Dashboard + API)
./scripts/deploy.sh

# Nur Frontend
./scripts/deploy.sh web

# Nur Dashboard
./scripts/deploy.sh dashboard

# Nur API
./scripts/deploy.sh api
```

### Mit Plesk Git-Integration

1. In Plesk: **Git** → Repository hinzufügen
2. Repository-URL eintragen
3. **Auto-Deploy** aktivieren
4. **Post-Deploy Script**: `bash deploy.sh`

Bei dieser Variante wird `deploy.sh` (im Root) direkt auf dem Server ausgeführt.

---

## 6. Externe Dienste einrichten

### 6a. Resend (E-Mail)

1. Account erstellen: https://resend.com
2. Domain verifizieren: `kore-retail.de` (DNS-Einträge setzen)
3. API Key generieren → in `.env` auf Server eintragen

### 6b. Google Analytics 4

1. GA4 Property erstellen: https://analytics.google.com
2. Measurement ID (G-XXXXXXXXXX) → in `apps/web/.env.production` eintragen
3. Neu bauen & deployen

### 6c. Google Search Console

1. Property hinzufügen: https://search.google.com/search-console
2. Verifizierungscode holen
3. In `apps/web/index.html` eintragen:
   ```html
   <meta name="google-site-verification" content="DEIN_CODE" />
   ```
4. Sitemap einreichen: `https://kore-retail.de/sitemap.xml`

---

## 7. Troubleshooting

```bash
# API Logs anschauen
pm2 logs kore-api

# API Status
pm2 status

# API neustarten
pm2 restart kore-api

# Health Check
curl https://api.kore-retail.de/health

# Frontend testen (SPA-Routing)
curl -I https://kore-retail.de/consulting
# → Sollte 200 OK zurückgeben (nicht 404)

# Dashboard testen
curl -I https://dashboard.kore-retail.de
```

---

## 8. DNS-Einträge

Bei deinem Domain-Provider:

```
kore-retail.de              A      → [Plesk-Server-IP]
www.kore-retail.de          CNAME  → kore-retail.de
api.kore-retail.de          A      → [Plesk-Server-IP]
dashboard.kore-retail.de    A      → [Plesk-Server-IP]
```

Für Resend (E-Mail-Verifizierung):
```
# Diese Werte bekommst du von Resend nach Domain-Verifizierung
_dmarc.kore-retail.de       TXT   → "v=DMARC1; p=none"
resend._domainkey...        CNAME → ... (von Resend)
```
