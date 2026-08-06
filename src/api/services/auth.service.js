import jwt from 'jsonwebtoken';

import config from '../../config/index.js';
import { HttpError } from '../../utils/httpError.js';

/**
 * Demo login — replace with your own user store (MongoDB, Postgres, etc).
 * Business logic lives in services; controllers stay thin.
 */
export const login = async (username, password) => {
  // TODO: replace with a real credential check
  if (username !== 'admin' || password !== 'admin') {
    throw new HttpError(401, 'Invalid credentials');
  }

  return jwt.sign({ sub: username, role: 'admin' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};
