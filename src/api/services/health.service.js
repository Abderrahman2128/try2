export const status = () => ({
  status: 'ok',
  pid: process.pid,
  uptime: process.uptime(),
  memory: process.memoryUsage().rss,
  timestamp: new Date().toISOString(),
});
