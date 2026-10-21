import { test, expect } from '@playwright/test';
import { resolveEnvironment } from '../fixtures/environment-resolver.js';
import { cleanupEndpoint, sameCleanupScope } from '../fixtures/cleanup-scope.js';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { recordCreatedAccount, readCreatedAccounts, ledgerPath } from '../fixtures/test-data-ledger.js';

test('no implicit production target and no mixed named environment', () => {
  expect(() => resolveEnvironment({})).toThrow(/explicitly/);
  expect(() => resolveEnvironment({ E2E_ENVIRONMENT: 'static-1', BASE_URL: 'https://dev-static-9.musticker.com/kr' })).toThrow(/conflicts/);
  expect(() => resolveEnvironment({ BASE_URL: 'https://dev-static-9.musticker.com/kr', API_BASE_URL: 'https://api.musticker.com/index.php' })).toThrow(/different environment/);
});

test('static-9 resolves a coherent storefront/API/admin set with locale', () => {
  const result = resolveEnvironment({ BASE_URL: 'https://dev-static-9.musticker.com/' });
  expect(result).toEqual({ baseURL: 'https://dev-static-9.musticker.com/kr', apiURL: 'https://dev-static-9-api.musticker.com/index.php', adminURL: 'https://dev-static-9-admin-panel.musticker.com', name: 'static-9' });
});

test('unknown dev servers never get a production API fallback', () => {
  const result = resolveEnvironment({ BASE_URL: 'https://dev-static-99.musticker.com/kr' });
  expect(result.apiURL).toBeUndefined();
  expect(() => resolveEnvironment({ E2E_ENVIRONMENT: 'production', PROMOTION_VALIDATION: 'true' })).toThrow(/dev servers/);
  expect(() => resolveEnvironment({ BASE_URL: 'https://user:secret@dev-static-9.musticker.com/' })).toThrow(/credentials/);
});

test('cleanup is bound to both run and environment; production endpoints are refused', () => {
  const scope = { runId: 'run-one', storefrontOrigin: 'https://dev-static-9.musticker.com', apiOrigin: 'https://dev-static-9-api.musticker.com' };
  expect(sameCleanupScope({ ...scope }, scope)).toBe(true);
  expect(sameCleanupScope({ ...scope, runId: 'run-two' }, scope)).toBe(false);
  expect(sameCleanupScope({ ...scope, apiOrigin: 'https://dev-static-1-api.musticker.com' }, scope)).toBe(false);
  expect(sameCleanupScope({}, scope)).toBe(false);
  expect(cleanupEndpoint(`${scope.apiOrigin}/qa/users`, scope)).toBe(`${scope.apiOrigin}/qa/users`);
  expect(() => cleanupEndpoint('https://api.musticker.com/qa/users', scope)).toThrow(/match/);
});

test('created-account ledgers are partitioned by run and retain their server identity', () => {
  const previous = process.env.E2E_RUN_ID;
  const id = `unit-${randomUUID()}`;
  process.env.E2E_RUN_ID = id;
  const owned = path.dirname(ledgerPath());
  const base = path.resolve('.auth/runs');
  if (!owned.startsWith(base + path.sep) || path.basename(owned) !== id) throw new Error('Unexpected unit ledger cleanup path.');
  try {
    recordCreatedAccount({ email: 'synthetic@example.test', createdBy: 'unit-check' });
    expect(readCreatedAccounts()[0]).toMatchObject({ runId: id, storefrontOrigin: 'http://127.0.0.1:9', apiOrigin: 'http://127.0.0.1:9' });
    process.env.E2E_RUN_ID = `unit-${randomUUID()}`;
    expect(readCreatedAccounts()).toEqual([]);
  } finally {
    rmSync(owned, { recursive: true, force: true });
    if (previous === undefined) delete process.env.E2E_RUN_ID;
    else process.env.E2E_RUN_ID = previous;
  }
});
