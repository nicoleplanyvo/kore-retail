import express from 'express';
import cors from 'cors';
import { contactRouter } from './routes/contact.js';
import { auditRouter } from './routes/audit.js';

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CORS_ORIGIN, methods: ['POST', 'OPTIONS'] }));
app.use(express.json());

// Routes
app.use('/api/contact', contactRouter);
app.use('/api/audit', auditRouter);

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
