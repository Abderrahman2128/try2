import * as authService from '../services/auth.service.js';
import { asyncHandler, HttpError } from '../../utils/httpError.js';

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) throw new HttpError(400, 'username and password are required');

  const token = await authService.login(username, password);
  res.json({ success: true, data: { token } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});
