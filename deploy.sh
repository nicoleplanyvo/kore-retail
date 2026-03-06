#!/bin/bash
# ──────────────────────────────────────────────────
# KORE — Plesk Deployment Script
# ──────────────────────────────────────────────────
# Verwendung: bash deploy.sh
# Oder als Plesk Git-Hook (post-receive / post-deploy)
# ──────────────────────────────────────────────────
#
# Plesk-Setup (3 Domains, 1 Repo):
#   kore-retail.de             → Document Root: apps/web/dist/
#   dashboard.kore-retail.de   → Document Root: apps/dashboard/dist/
#   api.kore-retail.de         → Node.js App (PM2, Port 3001)
#
# Voraussetzungen auf dem Server:
#   - Node.js >= 20
#   - pnpm >= 10  (npm install -g pnpm)
#   - PM2         (npm install -g pm2)
# ──────────────────────────────────────────────────

set -e

echo "══════════════════════════════════════════════"
echo "  KORE Deployment"
echo "══════════════════════════════════════════════"

# 1. Dependencies installieren
echo ""
echo "→ Dependencies installieren..."
pnpm install --frozen-lockfile

# 2. Prisma Client generieren
echo ""
echo "→ Prisma Client generieren..."
cd apps/api
pnpm exec prisma generate

# 3. Datenbank-Schema synchronisieren (SQLite)
echo ""
echo "→ Datenbank-Schema synchronisieren..."
mkdir -p data
pnpm exec prisma db push --skip-generate
cd ../..

# 4. Alle Packages + Apps bauen (Turbo cached)
echo ""
echo "→ Build starten (turbo)..."
pnpm build

# 5. API mit PM2 neustarten
echo ""
echo "→ API neustarten (PM2)..."
cd apps/api
mkdir -p logs
if pm2 describe kore-api > /dev/null 2>&1; then
  pm2 restart kore-api
  echo "  kore-api neugestartet"
else
  pm2 start ecosystem.config.cjs
  pm2 save
  echo "  kore-api gestartet und gespeichert"
fi
cd ../..

echo ""
echo "══════════════════════════════════════════════"
echo "  Deployment abgeschlossen"
echo "══════════════════════════════════════════════"
echo ""
echo "  API:        http://localhost:3001/health"
echo "  Web:        apps/web/dist/"
echo "  Dashboard:  apps/dashboard/dist/"
echo ""
