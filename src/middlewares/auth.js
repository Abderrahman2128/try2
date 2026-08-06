import jwt from 'jsonwebtoken';

import config from '../config/index.js';
import { HttpError } from '../utils/httpError.js';

/** Protect routes: `router.get('/me', auth, controller.me)` */
export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new HttpError(401, 'Missing Bearer token'));

  try {
    req.user = jwt.verify(token, config.jwt.secret);
    return next();
  } catch {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
}
