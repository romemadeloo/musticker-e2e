import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkReadiness } from '../fixtures/readiness.js';

const server = createServer((req, res) => {
  if (req.url?.startsWith('/disconnect')) { req.socket.destroy(); return; }
  if (req.url === '/timeout') return;
  if (req.url === '/redirect') { res.writeHead(302, { location: '/redirect-followed' }).end(); return; }
  if (req.url === '/redirect-followed') redirectFollowed = true;
  res.setHeader('x-build-sha', 'build-123');
  if (req.url === '/storefront' || req.url === '/redirect-followed') {
    res.setHeader('content-type', 'text/html');
    res.end('<html><body>Storefront</body></html>');
    return;
  }
  if (req.url === '/404') { res.writeHead(404).end('Not found'); return; }
  res.setHeader('content-type', 'application/json');
  res.end(req.url === '/invalid' ? 'invalid JSON' : JSON.stringify(
    req.url === '/api' ? { success: true, data: [{ id: 1 }] } : { success: false, data: [] }
  ));
});
let origin: string;
let redirectFollowed = false;

test.beforeAll(async () => {
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

test.afterAll(async () => { await new Promise<void>(resolve => server.close(() => resolve())); });

test('healthy HTML and API can verify independent exact build identities', async ({ request }) => {
  const storefront = await checkReadiness(request, { name: 'storefront', url: `${origin}/storefront`, expectedBuild: 'build-123' });
  const api = await checkReadiness(request, { name: 'api', url: `${origin}/api`, expectedBuild: 'build-123', buildHeader: 'X-Build-SHA' });
  expect(storefront).toMatchObject({ status: 'ready', build: 'verified', httpStatus: 200 });
  expect(api).toMatchObject({ status: 'ready', build: 'verified', httpStatus: 200 });
});

test('availability does not imply build identity; mismatched builds block testing', async ({ request }) => {
  expect(await checkReadiness(request, { name: 'api', url: `${origin}/api` })).toMatchObject({ status: 'ready', build: 'unverified' });
  expect(await checkReadiness(request, { name: 'api', url: `${origin}/api`, expectedBuild: 'other-build' })).toMatchObject({ status: 'blocked', build: 'mismatch' });
  expect(await checkReadiness(request, { name: 'api', url: `${origin}/api`, expectedBuild: 'build-123', buildHeader: 'missing-header' })).toMatchObject({ status: 'blocked', build: 'mismatch' });
});

test('HTTP errors, invalid JSON, and error envelopes cannot qualify the environment', async ({ request }) => {
  for (const path of ['/404', '/invalid', '/error']) {
    expect(await checkReadiness(request, { name: 'api', url: `${origin}${path}` })).toMatchObject({ status: 'blocked', build: 'unverified' });
  }
  expect(await checkReadiness(request, { name: 'storefront', url: `${origin}/api` })).toMatchObject({ status: 'blocked' });
});

test('redirects are refused without making a request to their destination', async ({ request }) => {
  const result = await checkReadiness(request, { name: 'storefront', url: `${origin}/redirect` });
  expect(result).toMatchObject({ status: 'blocked', httpStatus: 302 });
  expect(redirectFollowed).toBe(false);
});

test('network failures produce sanitized classifications', async ({ request }) => {
  const result = await checkReadiness(request, { name: 'api', url: `${origin}/disconnect?sensitive=do-not-log` });
  expect(result.status).toBe('blocked');
  expect(JSON.stringify(result)).not.toContain('do-not-log');
  expect(JSON.stringify(result)).not.toContain(origin);
});

test('readiness requests have a bounded timeout', async ({ request }) => {
  const result = await checkReadiness(request, { name: 'api', url: `${origin}/timeout` }, 100);
  expect(result).toMatchObject({ status: 'blocked', reason: 'Request failed, timed out, or returned invalid JSON' });
});

test('deployment identity requirements block the actual runner before product tests', async () => {
  const output = mkdtempSync(join(tmpdir(), 'readiness-runner-'));
  try {
    const result = await new Promise<{ code: number | null; log: string }>((resolve, reject) => {
      const child = spawn(process.execPath, [
        join(process.cwd(), 'node_modules/@playwright/test/cli.js'), 'test', '--config', join(process.cwd(), 'playwright.api.config.ts'),
        '--grep', 'MS-API-001', '--reporter=line', '--output', join(output, 'results')
      ], { cwd: output, env: {
        ...process.env, E2E_ENVIRONMENT: '', BASE_URL: `${origin}/storefront`, API_BASE_URL: `${origin}/api`,
        ADMIN_BASE_URL: '', REQUIRE_BUILD_IDENTITY: 'true', EXPECTED_STOREFRONT_BUILD: '', EXPECTED_API_BUILD: '',
        ALLURE_RESULTS_DIR: '', GITHUB_STEP_SUMMARY: ''
      } });
      let log = '';
      child.stdout.on('data', chunk => { log += chunk.toString(); });
      child.stderr.on('data', chunk => { log += chunk.toString(); });
      child.on('error', reject);
      child.on('close', code => resolve({ code, log }));
    });
    expect(result.code, result.log).toBe(1);
    expect(result.log).toContain('Expected build is required');
    expect(result.log).toContain('no product tests were run');
    expect(result.log).not.toContain('Running 1 test');
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});
