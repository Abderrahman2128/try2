import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';

const { default: app } = await import('../src/app.js');
const { default: http } = await import('node:http');

const withServer = async (fn) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
};

test('GET /api/health returns ok', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/health`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'ok');
  });
});

test('unknown route returns 404', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/nope`);
    assert.equal(res.status, 404);
  });
});

test('POST /api/auth/login issues a JWT', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.data.token.length > 20);
  });
});
