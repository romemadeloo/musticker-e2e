import { test, expect } from '@playwright/test';
import { resolveEnvironment } from '../fixtures/environment-resolver.js';
import { cleanupEndpoint, sameCleanupScope } from '../fixtures/cleanup-scope.js';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { recordCreatedAccount, readCreatedAccounts, ledgerPath } from '../fixtures/test-data-ledger.js';
import { environments } from '../fixtures/environments.js';
import { DEV_API_HOST, DEV_STOREFRONT_HOST } from '../fixtures/hosts.js';

for (let number = 1; number <= 6; number++) {
  const name = `dev-${number}`;
  const suffix = number === 1 ? '' : `-${number}`;
  const baseURL = `https://shared-dev-static-sf${suffix}.musticker.com/kr`;
  const apiURL = `https://shared-dev-static-api${suffix}.musticker.com/index.php`;
  const adminURL = `https://shared-dev-static-admin${suffix}.musticker.com`;

  test(`${name} resolves Dev-Shared ${number} by selector and storefront origin`, () => {
    const expected = { baseURL, apiURL, adminURL, name };
    expect(resolveEnvironment({ E2E_ENVIRONMENT: name })).toEqual(expected);
    expect(resolveEnvironment({ BASE_URL: new URL(baseURL).origin })).toEqual(expected);
    expect(new RegExp(`^${DEV_API_HOST}$`).test(new URL(apiURL).hostname)).toBe(true);
    expect(new RegExp(`^${DEV_STOREFRONT_HOST}$`).test(new URL(baseURL).hostname)).toBe(true);
    const scope = { runId: 'unit', storefrontOrigin: new URL(baseURL).origin, apiOrigin: new URL(apiURL).origin };
    expect(cleanupEndpoint(`${scope.apiOrigin}/qa/users`, scope)).toBe(`${scope.apiOrigin}/qa/users`);
  });
}

test('unsupported selectors and mismatched shared environments are refused', () => {
  expect(Object.keys(environments)).toEqual(['production', 'dev-1', 'dev-2', 'dev-3', 'dev-4', 'dev-5', 'dev-6']);
  for (const name of ['dev-0', 'dev-99']) {
    expect(() => resolveEnvironment({ E2E_ENVIRONMENT: name })).toThrow(/Unsupported/);
  }
  expect(() => resolveEnvironment({
    BASE_URL: 'https://shared-dev-static-sf.musticker.com',
    API_BASE_URL: 'https://shared-dev-static-api-2.musticker.com/index.php'
  })).toThrow(/different environment/);
  expect(new RegExp(`^${DEV_API_HOST}$`).test('shared-dev-static-api.mustickerAcom')).toBe(false);
  expect(() => cleanupEndpoint('https://shared-dev-static-sf.musticker.com/qa/users', {
    runId: 'unit', storefrontOrigin: 'https://shared-dev-static-sf.musticker.com', apiOrigin: 'https://shared-dev-static-sf.musticker.com'
  })).toThrow(/dev API/);
});

test('no implicit production target and no mixed named environment', () => {
  expect(() => resolveEnvironment({})).toThrow(/explicitly/);
  expect(() => resolveEnvironment({ E2E_ENVIRONMENT: 'dev-1', BASE_URL: 'https://shared-dev-static-sf-6.musticker.com/kr' })).toThrow(/conflicts/);
  expect(() => resolveEnvironment({ BASE_URL: 'https://shared-dev-static-sf-6.musticker.com/kr', API_BASE_URL: 'https://api.musticker.com/index.php' })).toThrow(/different environment/);
});

test('dev-6 resolves a coherent storefront/API/admin set with locale', () => {
  const result = resolveEnvironment({ BASE_URL: 'https://shared-dev-static-sf-6.musticker.com/' });
  expect(result).toEqual({ baseURL: 'https://shared-dev-static-sf-6.musticker.com/kr', apiURL: 'https://shared-dev-static-api-6.musticker.com/index.php', adminURL: 'https://shared-dev-static-admin-6.musticker.com', name: 'dev-6' });
});

test('unknown dev servers never get a production API fallback', () => {
  const result = resolveEnvironment({ BASE_URL: 'https://shared-dev-static-sf-99.musticker.com/kr' });
  expect(result.apiURL).toBeUndefined();
  expect(() => resolveEnvironment({ E2E_ENVIRONMENT: 'production', PROMOTION_VALIDATION: 'true' })).toThrow(/dev servers/);
  expect(() => resolveEnvironment({ BASE_URL: 'https://user:secret@shared-dev-static-sf-6.musticker.com/' })).toThrow(/credentials/);
});

test('cleanup is bound to both run and environment; production endpoints are refused', () => {
  const scope = { runId: 'run-one', storefrontOrigin: 'https://shared-dev-static-sf-6.musticker.com', apiOrigin: 'https://shared-dev-static-api-6.musticker.com' };
  expect(sameCleanupScope({ ...scope }, scope)).toBe(true);
  expect(sameCleanupScope({ ...scope, runId: 'run-two' }, scope)).toBe(false);
  expect(sameCleanupScope({ ...scope, apiOrigin: 'https://shared-dev-static-api.musticker.com' }, scope)).toBe(false);
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
