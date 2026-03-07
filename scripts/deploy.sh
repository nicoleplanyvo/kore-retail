#!/bin/bash
# ──────────────────────────────────────────────────
# KORE — Deployment Script (rsync → Plesk)
# ──────────────────────────────────────────────────
# Unified Server: Website + API + Dashboard
# auf einer Domain (kore-retail.de)
#
# Verwendung:
#   ./scripts/deploy.sh
# ──────────────────────────────────────────────────

set -e

# ─── Konfiguration ──────────────────────────────
PLESK_USER="kore-retail"
PLESK_HOST="craft.serverforall.de"
REMOTE_PATH="/var/www/vhosts/kore-retail.de"

# ─── Farben ─────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# ─── Voraussetzungen ────────────────────────────
command -v pnpm >/dev/null 2>&1 || error "pnpm ist nicht installiert"
command -v rsync >/dev/null 2>&1 || error "rsync ist nicht installiert"

echo ""
echo "══════════════════════════════════════════"
echo "  KORE — Unified Deployment"
echo "  → $PLESK_HOST"
echo "══════════════════════════════════════════"
echo ""

# ─── Build ──────────────────────────────────────
info "Installiere Dependencies..."
pnpm install --frozen-lockfile

info "Erstelle Production-Env (falls nicht vorhanden)..."
[ ! -f apps/web/.env.production ] && echo "VITE_API_URL=" > apps/web/.env.production
[ ! -f apps/dashboard/.env.production ] && echo "VITE_API_URL=" > apps/dashboard/.env.production

info "Baue Projekt..."
pnpm build

# ─── Deploy: API ────────────────────────────────
echo ""
info "Deploye API..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='logs' \
  --exclude='data' \
  --exclude='src' \
  apps/api/dist/ \
  "$PLESK_USER@$PLESK_HOST:$REMOTE_PATH/apps/api/dist/"

rsync -avz \
  apps/api/package.json \
  apps/api/ecosystem.config.cjs \
  "$PLESK_USER@$PLESK_HOST:$REMOTE_PATH/apps/api/"

rsync -avz \
  apps/api/prisma/schema.prisma \
  "$PLESK_USER@$PLESK_HOST:$REMOTE_PATH/apps/api/prisma/"

# ─── Deploy: Website ───────────────────────────
info "Deploye Website..."
rsync -avz --delete \
  --exclude='.DS_Store' \
  apps/web/dist/ \
  "$PLESK_USER@$PLESK_HOST:$REMOTE_PATH/apps/web/dist/"

# ─── Deploy: Dashboard ─────────────────────────
info "Deploye Dashboard..."
rsync -avz --delete \
  --exclude='.DS_Store' \
  apps/dashboard/dist/ \
  "$PLESK_USER@$PLESK_HOST:$REMOTE_PATH/apps/dashboard/dist/"

# ─── Deploy: Shared Packages ───────────────────
for pkg in validators types; do
  if [ -d "packages/$pkg/dist" ]; then
    info "Deploye @kore/$pkg..."
    rsync -avz --delete \
      --exclude='node_modules' \
      --exclude='src' \
      "packages/$pkg/dist/" \
      "packages/$pkg/package.json" \
      "$PLESK_USER@$PLESK_HOST:$REMOTE_PATH/apps/api/node_modules/@kore/$pkg/"
  fi
done

info "Alle Dateien synchronisiert"

# ─── Server: Install + Restart ──────────────────
echo ""
info "Server-Setup: Dependencies + PM2..."

ssh "$PLESK_USER@$PLESK_HOST" << 'REMOTE'
  cd /var/www/vhosts/kore-retail.de/apps/api
  npm install --production --omit=dev
  npx prisma generate
  mkdir -p logs data

  if pm2 describe kore-server > /dev/null 2>&1; then
    pm2 restart kore-server
    echo "  kore-server neugestartet"
  else
    pm2 start ecosystem.config.cjs
    pm2 save
    echo "  kore-server gestartet"
  fi
REMOTE

echo ""
echo "══════════════════════════════════════════"
echo "  Deployment abgeschlossen!"
echo ""
echo "  Website:   https://kore-retail.de"
echo "  Dashboard: https://kore-retail.de/dashboard/"
echo "  Health:    https://kore-retail.de/health"
echo "══════════════════════════════════════════"
echo ""
