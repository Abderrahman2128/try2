import http from 'node:http';

import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';

const server = http.createServer(app);

const start = () =>
  new Promise((resolve, reject) => {
    server.listen(config.port, config.host, () => {
      logger.info(
        `Worker ${process.pid} listening on http://${config.host}:${config.port} [${config.env}]`
      );
      resolve(server);
    });
    server.on('error', reject);
  });

/** Graceful shutdown — finish in-flight requests, then exit. */
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('All connections closed. Bye!');
    process.exit(0);
  });
  // Force-exit if connections hang
  setTimeout(() => process.exit(1), 10_000).unref();
};

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

export default { start, server };
