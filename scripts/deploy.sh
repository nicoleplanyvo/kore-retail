#!/bin/bash
# ──────────────────────────────────────────────────
# KORE — Deployment Script für Plesk
# ──────────────────────────────────────────────────
# Verwendung:
#   ./scripts/deploy.sh              # Alles bauen + deployen
#   ./scripts/deploy.sh web          # Nur Frontend
#   ./scripts/deploy.sh api          # Nur API
# ──────────────────────────────────────────────────

set -e

# ─── Konfiguration ──────────────────────────────
# Anpassen an dein Plesk-Setup:
PLESK_USER="koreretail"
PLESK_HOST="dein-server.de"
WEB_REMOTE_PATH="/var/www/vhosts/koreretail.de/httpdocs"
API_REMOTE_PATH="/var/www/vhosts/api.koreretail.de"

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

TARGET=${1:-all}

echo ""
echo "══════════════════════════════════════════"
echo "  KORE — Deployment ($TARGET)"
echo "══════════════════════════════════════════"
echo ""

# ─── Build ──────────────────────────────────────
info "Installiere Dependencies..."
pnpm install --frozen-lockfile

info "Baue Projekt..."
pnpm build

# ─── Web Deploy ─────────────────────────────────
if [[ "$TARGET" == "all" || "$TARGET" == "web" ]]; then
  echo ""
  info "Deploye Frontend → $PLESK_HOST:$WEB_REMOTE_PATH"

  rsync -avz --delete \
    --exclude='.DS_Store' \
    apps/web/dist/ \
    "$PLESK_USER@$PLESK_HOST:$WEB_REMOTE_PATH/"

  info "Frontend deployed ✓"
fi

# ─── API Deploy ─────────────────────────────────
if [[ "$TARGET" == "all" || "$TARGET" == "api" ]]; then
  echo ""
  info "Deploye API → $PLESK_HOST:$API_REMOTE_PATH"

  # API-Dateien synchronisieren
  rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.env' \
    --exclude='logs' \
    --exclude='src' \
    --exclude='tsconfig.tsbuildinfo' \
    apps/api/dist/ \
    apps/api/package.json \
    apps/api/ecosystem.config.cjs \
    "$PLESK_USER@$PLESK_HOST:$API_REMOTE_PATH/"

  # Auch validators-Paket deployen (wird von API gebraucht)
  rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='src' \
    packages/validators/dist/ \
    packages/validators/package.json \
    "$PLESK_USER@$PLESK_HOST:$API_REMOTE_PATH/node_modules/@kore/validators/"

  # Dependencies auf Server installieren & PM2 neustarten
  ssh "$PLESK_USER@$PLESK_HOST" << 'REMOTE'
    cd /var/www/vhosts/api.koreretail.de
    npm install --production --omit=dev
    mkdir -p logs

    # PM2 neustarten
    if pm2 describe kore-api > /dev/null 2>&1; then
      pm2 restart kore-api
    else
      pm2 start ecosystem.config.cjs
    fi
    pm2 save
REMOTE

  info "API deployed & neugestartet ✓"
fi

echo ""
echo "══════════════════════════════════════════"
echo "  ✓ Deployment abgeschlossen"
echo "══════════════════════════════════════════"
echo ""
