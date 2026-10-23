import { request } from '@playwright/test';

import { readCreatedAccounts, retainCreatedAccounts, ledgerPath, currentCleanupScope } from '../fixtures/test-data-ledger.js';
import type { CreatedAccount } from '../fixtures/test-data-ledger.js';
import { cleanupEndpoint, sameCleanupScope } from '../fixtures/cleanup-scope.js';

/**
 * Deletes the throwaway members the destructive auth tests registered during this run.
 *
 * Wired as `globalTeardown` rather than as a teardown *project* on purpose: every npm script in this
 * repo selects tests with `--grep`, and a project's tests are grep-filtered like any others, so a
 * teardown project would silently not run for `--grep @destructive` (its own title carries no tag).
 * A global teardown always runs.
 *
 * Deleting needs an admin endpoint the storefront does not expose, so this is a no-op -- loud, but
 * not a failure -- until `TEST_DATA_USER_DELETE_ENDPOINT` is configured. The ledger is left intact in
 * that case so the scoped records remain available for explicit reconciliation.
 */
export default async function globalTeardown(): Promise<void> {
  const accounts = readCreatedAccounts();

  if (!accounts.length) {
    return;
  }

  const configuredEndpoint = process.env.TEST_DATA_USER_DELETE_ENDPOINT;

  if (!configuredEndpoint) {
    if (process.env.REQUIRE_TEST_DATA_CLEANUP === 'true') {
      throw new Error('Required account cleanup endpoint is missing; the run ledger has been retained.');
    }
    console.warn(
      [
        `[teardown] ${accounts.length} throwaway account(s) were registered by this run and could not be deleted:`,
        ...accounts.map((account) => `  - ${account.email} (${account.createdBy})`),
        '[teardown] Set TEST_DATA_USER_DELETE_ENDPOINT to have them cleaned up automatically.',
        `[teardown] They remain recorded in ${ledgerPath()}.`
      ].join('\n')
    );
    return;
  }

  const scope = currentCleanupScope();
  const endpoint = cleanupEndpoint(configuredEndpoint, scope);

  const api = await request.newContext();
  const undeleted: CreatedAccount[] = [];

  try {
    for (const account of accounts) {
      if (!sameCleanupScope(account, scope)) {
        undeleted.push(account);
        continue;
      }
      const response = await api
        .delete(`${endpoint.replace(/\/$/, '')}/${encodeURIComponent(account.email)}`, {
          headers: process.env.API_TOKEN ? { authorization: `Bearer ${process.env.API_TOKEN}` } : {},
          failOnStatusCode: false
        })
        .catch((error: Error) => error);

      if (response instanceof Error) {
        console.error(`[teardown] DELETE failed for ${account.email}: ${response.message}`);
        undeleted.push(account);
        continue;
      }

      // An already-absent account is a successful outcome, not a failure worth retrying forever.
      if (response.ok() || response.status() === 404) {
        console.log(`[teardown] deleted ${account.email} (HTTP ${response.status()})`);
        continue;
      }

      console.error(`[teardown] DELETE ${account.email} answered HTTP ${response.status()}`);
      undeleted.push(account);
    }
  } finally {
    await api.dispose();
  }

  retainCreatedAccounts(undeleted);

  if (undeleted.length) {
    console.error(
      `[teardown] ${undeleted.length} of ${accounts.length} throwaway account(s) could not be deleted; ` +
        `they are still recorded in ${ledgerPath()}.`
    );
    if (process.env.REQUIRE_TEST_DATA_CLEANUP === 'true') {
      throw new Error('Dev E2E cleanup is incomplete; the run ledger has been retained for reconciliation.');
    }
  }
}
