# KORE — Plesk Deployment Guide

## Architektur

Alles läuft auf **einer Domain** mit **einem Node.js-Prozess**:

```
kore-retail.de/              → Website (React SPA)
kore-retail.de/dashboard/    → Dashboard (React SPA)
kore-retail.de/api/*         → Express API
kore-retail.de/health        → Health Check
```

Der Express-Server (`apps/api`) serviert in Production auch die statischen
Dateien der Website und des Dashboards. Keine Subdomains, kein Apache/Nginx nötig.

---

## 1. Voraussetzungen

### Auf dem Plesk-Server

```bash
# Node.js 20+ (über Plesk Node.js Extension)
node -v   # >= 20.0.0

# pnpm und PM2 global installieren
npm install -g pnpm pm2
```

### DNS

Nur **zwei** DNS-Einträge nötig:

```
kore-retail.de        A      → 213.165.77.153
www.kore-retail.de    CNAME  → kore-retail.de
```

---

## 2. Plesk-Konfiguration

### Node.js einrichten

In Plesk unter **kore-retail.de → Node.js**:

| Einstellung           | Wert                    |
| --------------------- | ----------------------- |
| Node.js Version       | 20.x (oder neuer)       |
| Application Root      | `/var/www/vhosts/kore-retail.de` |
| Application Startup File | `apps/api/dist/index.js` |
| Application Mode      | Production              |

### SSL/TLS

1. **Let's Encrypt** aktivieren für `kore-retail.de` + `www.kore-retail.de`
2. **HTTPS erzwingen** in den Hosting-Einstellungen

---

## 3. Umgebungsvariablen

### Server: `apps/api/.env`

```env
# Database (SQLite)
DATABASE_URL="file:./data/kore.db"

# JWT Secrets (mindestens 32 Zeichen!)
JWT_SECRET="dein-jwt-secret-min-32-zeichen-hier"
JWT_REFRESH_SECRET="dein-refresh-secret-min-32-zeichen"

# Resend — https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxx

# E-Mails
NOTIFICATION_EMAIL=hello@planyvo.com
FROM_EMAIL=noreply@kore-retail.de

# Server
PORT=3001
NODE_ENV=production
```

> **Hinweis:** `CORS_ORIGIN` wird in Production nicht benötigt, da alles
> Same-Origin läuft (Website, Dashboard und API auf derselben Domain).

### Frontends: `apps/web/.env.production` + `apps/dashboard/.env.production`

```env
# Leer = Same-Origin (API auf derselben Domain)
VITE_API_URL=
```

Diese Dateien werden automatisch vom Deploy-Script erstellt, falls sie fehlen.

---

## 4. Erstmalige Einrichtung

### Auf dem Server

```bash
# 1. Repository klonen
cd /var/www/vhosts/kore-retail.de
git clone <REPO_URL> .

# 2. .env für API erstellen
nano apps/api/.env
# → Werte aus Abschnitt 3 eintragen

# 3. Erstmaliges Deployment ausführen
bash deploy.sh
```

Das `deploy.sh`-Script erledigt alles:
- Dependencies installieren
- Prisma Client generieren
- Datenbank erstellen/migrieren
- Alle Apps bauen
- PM2 starten

### Datenbank initialisieren (optional)

```bash
cd apps/api
pnpm exec prisma db seed   # Demo-Daten laden
```

---

## 5. Deployment

### Option A: Plesk Git-Integration (empfohlen)

1. In Plesk: **Git** → Repository hinzufügen
2. Repository-URL eintragen
3. **Auto-Deploy** aktivieren
4. **Post-Deploy Script**: `bash deploy.sh`

Bei jedem Push wird automatisch gebaut und deployed.

### Option B: Manuell per rsync

```bash
# Lokal ausführen — baut lokal und deployed per rsync
./scripts/deploy.sh
```

> **Hinweis:** In `scripts/deploy.sh` vorher `PLESK_USER` und `PLESK_HOST` anpassen.

---

## 6. Externe Dienste

### Resend (E-Mail)

1. Account erstellen: https://resend.com
2. Domain `kore-retail.de` verifizieren (DNS-Einträge setzen)
3. API Key generieren → in `apps/api/.env` eintragen

DNS für Resend:
```
_dmarc.kore-retail.de       TXT   → "v=DMARC1; p=none"
resend._domainkey...        CNAME → ... (von Resend)
```

### Google Analytics 4

1. GA4 Property erstellen: https://analytics.google.com
2. Measurement ID → in `apps/web/.env.production` eintragen:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Neu bauen & deployen

---

## 7. Troubleshooting

```bash
# Server Logs anschauen
pm2 logs kore-server

# Server Status
pm2 status

# Server neustarten
pm2 restart kore-server

# Health Check
curl https://kore-retail.de/health
# → { "status": "ok", "service": "kore-server", "mode": "production" }

# Website testen (SPA-Routing)
curl -I https://kore-retail.de/consulting
# → 200 OK

# Dashboard testen
curl -I https://kore-retail.de/dashboard/
# → 200 OK
```

### Häufige Probleme

| Problem | Lösung |
| ------- | ------ |
| 502 Bad Gateway | PM2-Prozess läuft nicht → `pm2 start ecosystem.config.cjs` |
| Dashboard zeigt Blank Page | Vite `base` nicht auf `/dashboard/` gesetzt → prüfe `vite.config.ts` |
| API gibt CORS-Fehler | In Production nicht nötig (Same-Origin). Im Dev: `CORS_ORIGIN` prüfen |
| Prisma-Fehler | `npx prisma generate && npx prisma db push` |
