import 'dotenv/config';
import prisma from './lib/prisma.js';
import { createApp } from './app.js';
// ── Env-Validation ───────────────────────────────
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const isProduction = NODE_ENV === 'production';
if (isProduction) {
    const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error(`✗ Fehlende Umgebungsvariablen: ${missing.join(', ')}`);
        process.exit(1);
    }
    if ((process.env['JWT_SECRET'] ?? '').length < 32) {
        console.error('✗ JWT_SECRET muss mindestens 32 Zeichen lang sein.');
        process.exit(1);
    }
    if ((process.env['JWT_REFRESH_SECRET'] ?? '').length < 32) {
        console.error('✗ JWT_REFRESH_SECRET muss mindestens 32 Zeichen lang sein.');
        process.exit(1);
    }
}
const app = createApp();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
// Health Check — prüft auch die Datenbankverbindung
app.get('/health', async (_req, res) => {
    try {
        // Einfacher DB-Ping: Zählt Tenants (leichtgewichtige Query)
        await prisma.tenant.count();
        res.json({ status: 'ok', service: 'kore-api', mode: NODE_ENV, db: 'connected' });
    }
    catch {
        res.status(503).json({ status: 'error', service: 'kore-api', mode: NODE_ENV, db: 'disconnected' });
    }
});
// ── Start ─────────────────────────────────────────
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ??
    'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,https://kore-retail.de,https://www.kore-retail.de,https://dashboard.kore-retail.de,https://app.kore-retail.de';
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());
const server = app.listen(PORT, () => {
    console.log(`✓ KORE API running on port ${PORT} (${NODE_ENV})`);
    console.log(`  CORS: ${allowedOrigins.join(', ')}`);
    console.log(`  Lettermint: ${process.env['LETTERMINT_API_TOKEN'] ? 'configured' : 'not configured (dev mode)'}`);
});
// Graceful Shutdown — Verbindungen sauber beenden
function gracefulShutdown(signal) {
    console.log(`\n${signal} empfangen, Server wird beendet...`);
    server.close(async () => {
        try {
            await prisma.$disconnect();
        }
        catch {
            // Ignoriere Disconnect-Fehler
        }
        console.log('✓ Server beendet.');
        process.exit(0);
    });
    // Falls der Server nicht innerhalb von 10s stoppt, forcieren
    setTimeout(() => {
        console.error('✗ Timeout beim Shutdown, erzwinge Beendigung.');
        process.exit(1);
    }, 10_000);
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
//# sourceMappingURL=index.js.map