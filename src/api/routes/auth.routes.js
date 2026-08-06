import { Router } from 'express';

import * as controller from '../controllers/auth.controller.js';
import auth from '../../middlewares/auth.js';

const router = Router();

router.post('/login', controller.login);
router.get('/me', auth, controller.me);

export default router;
