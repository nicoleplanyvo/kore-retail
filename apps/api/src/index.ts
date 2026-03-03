import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { contactRouter } from './routes/contact.js';
import { auditRouter } from './routes/audit.js';
import { authRouter } from './routes/auth.js';
import { adminTenantsRouter } from './routes/admin/tenants.js';
import { adminToolsRouter } from './routes/admin/tools.js';

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';

// Parse allowed origins (comma-separated für mehrere Domains)
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Erlaube Requests ohne Origin (z.B. Health Checks, Server-to-Server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes — Website
app.use('/api/contact', contactRouter);
app.use('/api/audit', auditRouter);

// Routes — Auth
app.use('/api/auth', authRouter);

// Routes — Admin Dashboard
app.use('/api/admin/tenants', adminTenantsRouter);
app.use('/api/admin/tools', adminToolsRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'kore-api' });
});

// Start
app.listen(PORT, () => {
  console.log(`✓ KORE API running on port ${PORT}`);
  console.log(`  CORS origin: ${CORS_ORIGIN}`);
  console.log(`  Resend: ${process.env['RESEND_API_KEY'] ? 'configured' : 'not configured (dev mode)'}`);
});
