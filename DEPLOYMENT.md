# KORE — Plesk Deployment Guide

## Architektur

```
koreretail.de          → Statische SPA (React)     → apps/web/dist/
api.koreretail.de      → Node.js API (Express)     → apps/api/
```

---

## 1. Voraussetzungen auf dem Server

```bash
# Node.js 20+ installiert (über Plesk Node.js Extension)
node -v   # >= 20.0.0

# PM2 global installieren
npm install -g pm2
```

---

## 2. Domain-Setup in Plesk

### 2a. Frontend: `koreretail.de`

1. **Domain hinzufügen**: `koreretail.de`
2. **Document Root**: `/var/www/vhosts/koreretail.de/httpdocs`
3. **SSL/TLS**: Let's Encrypt Zertifikat aktivieren
4. **Apache .htaccess**: Wird automatisch aus `apps/web/dist/.htaccess` verwendet
5. Die gebauten Dateien aus `apps/web/dist/` in den Document Root kopieren

### 2b. API: `api.koreretail.de`

1. **Subdomain hinzufügen**: `api.koreretail.de`
2. **SSL/TLS**: Let's Encrypt Zertifikat aktivieren
3. **Node.js App** in Plesk einrichten:
   - **Node.js Version**: 20.x
   - **Application Root**: `/var/www/vhosts/api.koreretail.de`
   - **Application Startup File**: `dist/index.js`
   - **Application Mode**: Production

**ODER** PM2 manuell verwenden:
```bash
cd /var/www/vhosts/api.koreretail.de
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Autostart nach Server-Reboot
```

### 2c. Reverse Proxy (Alternative zu Subdomain)

Falls du **keine Subdomain** nutzen willst, kannst du in Plesk einen Reverse Proxy einrichten:

1. Gehe zu `koreretail.de` → **Apache & nginx Settings**
2. Unter **Additional nginx directives** einfügen:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Bei dieser Variante: `VITE_API_URL=https://koreretail.de` (kein `/api` Suffix nötig)

---

## 3. Umgebungsvariablen

### Frontend: `apps/web/.env.production`

```env
VITE_API_URL=https://api.koreretail.de
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### API: `apps/api/.env` (auf dem Server)

```env
# Resend — https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxx

# E-Mails
NOTIFICATION_EMAIL=hello@planyvo.com
FROM_EMAIL=noreply@koreretail.de

# CORS — Frontend-URL erlauben
CORS_ORIGIN=https://koreretail.de

# Server
PORT=3001
NODE_ENV=production
```

---

## 4. Erstmalige Einrichtung

### Lokal

```bash
# 1. Frontend-Env erstellen
cp apps/web/.env.production.example apps/web/.env.production
# → VITE_API_URL und VITE_GA_MEASUREMENT_ID eintragen

# 2. Projekt bauen
pnpm install
pnpm build

# 3. Deploy-Script konfigurieren
# → In scripts/deploy.sh die Server-Daten anpassen:
#   PLESK_USER, PLESK_HOST, WEB_REMOTE_PATH, API_REMOTE_PATH
```

### Auf dem Server

```bash
# 1. API-Env erstellen
cd /var/www/vhosts/api.koreretail.de
nano .env
# → Alle Werte aus .env.example eintragen

# 2. Dependencies installieren
npm install --production

# 3. PM2 starten
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 5. Deployment

```bash
# Alles deployen (Frontend + API)
./scripts/deploy.sh

# Nur Frontend
./scripts/deploy.sh web

# Nur API
./scripts/deploy.sh api
```

---

## 6. Externe Dienste einrichten

### 6a. Resend (E-Mail)

1. Account erstellen: https://resend.com
2. Domain verifizieren: `koreretail.de` (DNS-Einträge setzen)
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
4. Sitemap einreichen: `https://koreretail.de/sitemap.xml`

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
curl https://api.koreretail.de/health

# Frontend testen (SPA-Routing)
curl -I https://koreretail.de/consulting
# → Sollte 200 OK zurückgeben (nicht 404)
```

---

## 8. DNS-Einträge

Bei deinem Domain-Provider (z.B. Strato, IONOS, Hetzner):

```
koreretail.de        A      → [Plesk-Server-IP]
www.koreretail.de    CNAME  → koreretail.de
api.koreretail.de    A      → [Plesk-Server-IP]
```

Für Resend (E-Mail-Verifizierung):
```
# Diese Werte bekommst du von Resend nach Domain-Verifizierung
_dmarc.koreretail.de    TXT   → "v=DMARC1; p=none"
resend._domainkey...     CNAME → ... (von Resend)
```
