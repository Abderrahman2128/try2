import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';

import config from './config/index.js';
import logger from './utils/logger.js';
import routes from './api/routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();

// Security & performance
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (silent in tests)
if (config.env !== 'test') {
  app.use(pinoHttp({ logger }));
}

// API routes
app.use('/api', routes);

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);

export default app;
