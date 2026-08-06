/**
 * PM2 — production process manager.
 * `npm run start:pm2` starts the app in cluster mode on all cores.
 */
module.exports = {
  apps: [
    {
      name: 'nodetopicss',
      script: 'src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production' },
      max_memory_restart: '512M',
    },
  ],
};
