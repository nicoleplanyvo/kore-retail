// ──────────────────────────────────────────────────
// KORE — PM2 Konfiguration für Plesk
// ──────────────────────────────────────────────────
// Unified Server: Serviert Website + API + Dashboard
// auf einer einzelnen Domain (kore-retail.de)
//
// Starten:  pm2 start ecosystem.config.cjs
// Status:   pm2 status
// Logs:     pm2 logs kore-server
// Restart:  pm2 restart kore-server
// ──────────────────────────────────────────────────

module.exports = {
  apps: [
    {
      name: 'kore-server',
      script: './dist/index.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DASHBOARD_ONLY: 'true',
      },

      // Logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,

      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
