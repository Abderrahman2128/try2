import * as healthService from '../services/health.service.js';
import { asyncHandler } from '../../utils/httpError.js';

export const check = asyncHandler(async (req, res) => {
  res.json({ success: true, data: healthService.status() });
});
