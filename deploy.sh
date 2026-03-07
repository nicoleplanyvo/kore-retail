#!/bin/bash
# ──────────────────────────────────────────────────
# KORE — Plesk Server-Side Deployment Script
# ──────────────────────────────────────────────────
# Wird direkt auf dem Server ausgeführt (z.B. als Plesk Git-Hook).
#
# Unified Server: Website + API + Dashboard
# Alles läuft auf kore-retail.de (eine Domain, ein Node.js-Prozess)
#
# Voraussetzungen:
#   - Node.js >= 20
#   - pnpm >= 10  (npm install -g pnpm)
#   - PM2         (npm install -g pm2)
# ──────────────────────────────────────────────────

set -e

echo "══════════════════════════════════════════════"
echo "  KORE — Unified Server Deployment"
echo "══════════════════════════════════════════════"

# 1. Dependencies installieren
echo ""
echo "→ Dependencies installieren..."
pnpm install --frozen-lockfile

# 2. Production-Env für Frontends (Same-Origin API)
echo ""
echo "→ Production-Env erstellen..."
[ ! -f apps/web/.env.production ] && echo "VITE_API_URL=" > apps/web/.env.production
[ ! -f apps/dashboard/.env.production ] && echo "VITE_API_URL=" > apps/dashboard/.env.production

# 3. Prisma Client generieren
echo ""
echo "→ Prisma Client generieren..."
cd apps/api
pnpm exec prisma generate

# 4. Datenbank-Schema synchronisieren (SQLite)
echo ""
echo "→ Datenbank-Schema synchronisieren..."
mkdir -p data
pnpm exec prisma db push --skip-generate
cd ../..

# 5. Alle Packages + Apps bauen (Turbo cached)
echo ""
echo "→ Build starten (turbo)..."
pnpm build

# 6. Server mit PM2 neustarten
echo ""
echo "→ Server neustarten (PM2)..."
cd apps/api
mkdir -p logs
if pm2 describe kore-server > /dev/null 2>&1; then
  pm2 restart kore-server
  echo "  kore-server neugestartet"
else
  pm2 start ecosystem.config.cjs
  pm2 save
  echo "  kore-server gestartet und gespeichert"
fi
cd ../..

echo ""
echo "══════════════════════════════════════════════"
echo "  Deployment abgeschlossen!"
echo "══════════════════════════════════════════════"
echo ""
echo "  Website:   https://kore-retail.de"
echo "  Dashboard: https://kore-retail.de/dashboard/"
echo "  Health:    https://kore-retail.de/health"
echo ""
