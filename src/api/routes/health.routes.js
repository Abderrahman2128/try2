import { Router } from 'express';

import * as controller from '../controllers/health.controller.js';

const router = Router();

router.get('/', controller.check);

export default router;
