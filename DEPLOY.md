# KORE — Plesk Deployment (VERALTET)

> **Hinweis:** Dieses Dokument ist veraltet. Bitte nutze stattdessen [DEPLOYMENT.md](./DEPLOYMENT.md).

## Architektur

Ein Git-Repo, drei Dienste auf zwei Domains:

| App | Domain | Typ | Build-Output |
|-----|--------|-----|-------------|
| Landing Page | `kore-retail.de` | Statische Website | `apps/web/dist/` |
| Dashboard | `dashboard.kore-retail.de` | Statische SPA | `apps/dashboard/dist/` |
| API | `api.kore-retail.de` | Node.js (PM2) | `apps/api/dist/` |

## Server-Voraussetzungen

```bash
# Node.js 20+
node -v

# pnpm (Package Manager)
npm install -g pnpm

# PM2 (Process Manager)
npm install -g pm2
```

## 1. Git-Repository auf Plesk einrichten

In Plesk unter **Git** das Repository verbinden:

- **Repository URL:** `https://github.com/nicoleplanyvo/kore-retail.git`
- **Deploy-Aktion:** `bash deploy.sh`

Das Repo wird einmal geklont (z.B. unter `kore-retail.de`). Beide Domains (`kore-retail.de` und `dashboard.kore-retail.de`) zeigen auf verschiedene Unterordner im selben Repo.

## 2. Environment-Variablen

Erstelle `apps/api/.env` auf dem Server:

```bash
cd /var/www/vhosts/kore-retail.de/kore-retail/apps/api
cp .env.example .env
nano .env
```

Pflichtfelder:

```env
DATABASE_URL="file:./data/kore.db"
JWT_SECRET="<mindestens-32-zeichen-generieren>"
JWT_REFRESH_SECRET="<mindestens-32-zeichen-generieren>"
CORS_ORIGIN="https://dashboard.kore-retail.de,https://kore-retail.de"
PORT=3001
NODE_ENV=production
```

Secrets generieren:

```bash
openssl rand -base64 32  # Für JWT_SECRET
openssl rand -base64 32  # Für JWT_REFRESH_SECRET
```

Optional (E-Mail-Versand):

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
NOTIFICATION_EMAIL=hello@planyvo.com
FROM_EMAIL=noreply@kore-retail.de
```

## 3. Erstes Deployment

```bash
bash deploy.sh
```

Beim ersten Mal zusätzlich die Demo-Daten laden (optional):

```bash
cd apps/api && pnpm db:seed
```

## 4. Plesk Domain-Konfiguration

### Landing Page (`kore-retail.de`)

- **Document Root:** `kore-retail/apps/web/dist`
- **SSL:** Let's Encrypt aktivieren

### Dashboard (`dashboard.kore-retail.de`)

- **Document Root:** `kore-retail/apps/dashboard/dist`
- **SSL:** Let's Encrypt aktivieren
- **Apache/Nginx:** SPA-Fallback konfigurieren (alle Routen auf `index.html`)

Nginx-Regel (Plesk → Apache & nginx Einstellungen → Zusätzliche nginx-Direktiven):

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### API (`api.kore-retail.de`)

Nginx Reverse Proxy (Plesk → Apache & nginx Einstellungen → Zusätzliche nginx-Direktiven):

```nginx
location / {
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

## 5. PM2 Befehle

```bash
pm2 status              # Status anzeigen
pm2 logs kore-api       # Logs anzeigen
pm2 restart kore-api    # Neustarten
pm2 stop kore-api       # Stoppen
```

## 6. Updates deployen

Auf Plesk: **Git → Pull** klicken, oder automatisch per Webhook.

Manuell auf dem Server:

```bash
cd /var/www/vhosts/kore-retail.de/kore-retail
git pull origin main
bash deploy.sh
```
