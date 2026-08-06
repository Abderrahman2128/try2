import 'dotenv/config';

/**
 * Centralized, typed configuration.
 * One import — `config` — everywhere. No process.env scattered around.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT) || 8000,

  /** Fork one worker per CPU core (vertical scalability) */
  cluster: process.env.CLUSTER === 'true',

  corsOrigin: process.env.CORS_ORIGIN || '*',

  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  logLevel: process.env.LOG_LEVEL || 'info',
};

export default Object.freeze(config);
