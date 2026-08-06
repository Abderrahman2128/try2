import { Router } from 'express';

import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

/**
 * Mount feature routers here.
 * One line per feature — that's the whole "framework".
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

export default router;
