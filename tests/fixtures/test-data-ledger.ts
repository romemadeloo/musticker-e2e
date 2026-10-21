import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';
import type { CleanupScope } from './cleanup-scope.js';

/**
 * An append-only record of the member accounts destructive tests create, so the run can delete them
 * afterwards instead of leaving them behind forever.
 *
 * MS-AUTH-020/MS-AUTH-021 (registration) and MS-AUTH-027 (password rotation) each register a real member on the
 * target dev server through a live emailed OTP. Nothing cleaned them up before this ledger existed,
 * so every `RUN_AUTH_DESTRUCTIVE_E2E=true` run grew the user table by up to three rows.
 *
 * JSON Lines rather than a JSON array so parallel workers can append without reading first and
 * clobbering each other. Lives under `.auth/` because that is already gitignored.
 */
export function currentCleanupScope(): CleanupScope {
  const runId = process.env.E2E_RUN_ID;
  if (!runId || !/^[a-zA-Z0-9_-]+$/.test(runId)) throw new Error('A valid E2E_RUN_ID is required for account cleanup records.');
  if (!env.API_BASE_URL) throw new Error('API_BASE_URL is required for account cleanup records.');
  return { runId, storefrontOrigin: new URL(env.BASE_URL).origin, apiOrigin: new URL(env.API_BASE_URL).origin };
}

export type CreatedAccount = CleanupScope & {
  email: string;
  /** ISO 8601. Absolute so a stale ledger is still readable months later. */
  createdAt: string;
  /** Which test made it, so an un-deletable row can be traced back. */
  createdBy: string;
};

export function recordCreatedAccount(entry: Pick<CreatedAccount, 'email' | 'createdBy'>): void {
  const record: CreatedAccount = { ...entry, ...currentCleanupScope(), createdAt: new Date().toISOString() };

  mkdirSync(dirname(ledgerPath()), { recursive: true });
  appendFileSync(ledgerPath(), `${JSON.stringify(record)}\n`, 'utf8');
}

export function readCreatedAccounts(): CreatedAccount[] {
  if (!existsSync(ledgerPath())) {
    return [];
  }

  return readFileSync(ledgerPath(), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as CreatedAccount);
}

/**
 * Rewrites the ledger with only the accounts that could not be deleted, so a partial cleanup keeps
 * the leftovers on the books for the next run instead of losing track of them.
 */
export function retainCreatedAccounts(remaining: CreatedAccount[]): void {
  mkdirSync(dirname(ledgerPath()), { recursive: true });
  writeFileSync(ledgerPath(), remaining.map((entry) => `${JSON.stringify(entry)}\n`).join(''), 'utf8');
}

export function ledgerPath(): string {
  const runId = process.env.E2E_RUN_ID;
  if (!runId || !/^[a-zA-Z0-9_-]+$/.test(runId)) throw new Error('A valid E2E_RUN_ID is required.');
  return join(fileURLToPath(new URL('../../.auth/runs/', import.meta.url)), runId, 'created-accounts.jsonl');
}
