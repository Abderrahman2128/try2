import config from '../config/index.js';
import logger from '../utils/logger.js';

/** Centralized error handler — the ONLY place errors are formatted. */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (status >= 500) logger.error(err);

  res.status(status).json({
    success: false,
    message: status >= 500 && config.env === 'production' ? 'Internal Server Error' : err.message,
    ...(config.env === 'development' && { stack: err.stack }),
  });
}
