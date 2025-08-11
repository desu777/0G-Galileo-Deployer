import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { compilationRouter } from './routes/compilation';
import { logger } from './utils/logger';
import { db } from './utils/db';
import { authRouter } from './routes/auth';
import { statsRouter } from './routes/stats';
import { deploymentsRouter } from './routes/deployments';

const app = express();
const PORT = process.env.PORT || 3999;

// Trust proxy (Nginx) - must be before rate limiting
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.disable('x-powered-by');

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120, // 120 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration - allow frontend connection
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3998',
    'http://localhost:3998',
    'http://localhost:5173', // Keep for local development
    'https://deployer.desu0g.xyz', // Production frontend domain
    'https://compiler.desu0g.xyz', // Compiler domain (if needed)
    'http://deployer.desu0g.xyz', // HTTP fallback
    'http://compiler.desu0g.xyz' // HTTP fallback
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  // quick DB test
  let dbok = true;
  try { db.pragma('user_version'); } catch { dbok = false; }
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: '0G Contract Compiler',
    db: dbok ? 'ok' : 'error'
  });
});

// API routes
app.use('/api/compile', compilationRouter);
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);
app.use('/api/deployments', deploymentsRouter);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 0G Contract Compiler running on port ${PORT}`);
  logger.info(`📡 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔧 Compilation API: http://localhost:${PORT}/api/compile`);
  // Touch DB on boot to ensure init
  db.pragma('user_version');
}); 