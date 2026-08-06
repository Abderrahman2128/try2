/**
 * NodeTopicss — entry point.
 *
 * Vertical scalability:
 *   CLUSTER=true forks one worker per CPU core (node:cluster).
 *
 * Horizontal scalability:
 *   The app is 100% stateless — run as many instances/containers
 *   as you want behind any load balancer (Nginx, PM2, K8s, etc).
 */
import cluster from 'node:cluster';
import os from 'node:os';

import config from './config/index.js';
import logger from './utils/logger.js';
import server from './server.js';

const startWorker = async () => {
  try {
    await server.start();
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
};

if (config.cluster && cluster.isPrimary) {
  const cpus = os.availableParallelism();
  logger.info(`Primary ${process.pid} — forking ${cpus} workers`);

  for (let i = 0; i < cpus; i++) cluster.fork();

  cluster.on('exit', (worker, code) => {
    logger.warn(`Worker ${worker.process.pid} died (code ${code}) — respawning`);
    cluster.fork();
  });
} else {
  startWorker();
}
