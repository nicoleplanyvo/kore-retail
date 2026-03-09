#!/bin/bash
# ──────────────────────────────────────────────────
# KORE — Plesk Server-Side Deployment Script
# ──────────────────────────────────────────────────
# Dashboard-Subdomain: dashboard.kore-retail.de
# Nutzt npx pnpm@latest statt globaler pnpm-Installation.
# ──────────────────────────────────────────────────

set -e

echo "══════════════════════════════════════════════"
echo "  KORE Dashboard — Deployment"
echo "══════════════════════════════════════════════"

# 0. Node.js finden (Plesk: /opt/plesk/node/<version>/bin/)
echo ""
echo "→ Node.js suchen..."
for NODE_DIR in $(ls -rd /opt/plesk/node/*/bin 2>/dev/null); do
  if [ -x "$NODE_DIR/node" ]; then
    export PATH="$NODE_DIR:$PATH"
    echo "  Gefunden: $NODE_DIR ($(node --version))"
    break
  fi
done
export PATH="$HOME/.local/share/pnpm:$HOME/.npm-global/bin:/usr/local/bin:$PATH"

if ! command -v node &> /dev/null; then
  echo "  FEHLER: Node.js nicht gefunden!"
  exit 1
fi
echo "  Node: $(node --version)  npm: $(npm --version)"

# 1. Dependencies installieren (npx pnpm — keine globale Installation nötig)
echo ""
echo "→ Dependencies installieren..."
npx --yes pnpm@latest install --frozen-lockfile 2>&1 || npx --yes pnpm@latest install 2>&1

# 2. Production-Env
echo ""
echo "→ Production-Env erstellen..."
[ ! -f apps/dashboard/.env.production ] && echo "VITE_API_URL=" > apps/dashboard/.env.production

# 3. Prisma Client generieren
echo ""
echo "→ Prisma Client generieren..."
cd apps/api
npx --yes pnpm@latest exec prisma generate 2>&1

# 4. Datenbank-Schema synchronisieren (SQLite)
echo ""
echo "→ Datenbank synchronisieren..."
mkdir -p data
npx --yes pnpm@latest exec prisma db push --skip-generate 2>&1
cd ../..

# 5. Build (Turbo)
echo ""
echo "→ Build starten..."
npx --yes pnpm@latest build 2>&1

echo ""
echo "══════════════════════════════════════════════"
echo "  ✓ Build abgeschlossen!"
echo "══════════════════════════════════════════════"
