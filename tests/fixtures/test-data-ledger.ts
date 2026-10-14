import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const LEDGER_PATH = fileURLToPath(new URL('../../.auth/created-accounts.jsonl', import.meta.url));

export type CreatedAccount = {
  email: string;
  /** ISO 8601. Absolute so a stale ledger is still readable months later. */
  createdAt: string;
  /** Which test made it, so an un-deletable row can be traced back. */
  createdBy: string;
};

export function recordCreatedAccount(entry: Omit<CreatedAccount, 'createdAt'>): void {
  const record: CreatedAccount = { ...entry, createdAt: new Date().toISOString() };

  mkdirSync(dirname(LEDGER_PATH), { recursive: true });
  appendFileSync(LEDGER_PATH, `${JSON.stringify(record)}\n`, 'utf8');
}

export function readCreatedAccounts(): CreatedAccount[] {
  if (!existsSync(LEDGER_PATH)) {
    return [];
  }

  return readFileSync(LEDGER_PATH, 'utf8')
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
  mkdirSync(dirname(LEDGER_PATH), { recursive: true });
  writeFileSync(LEDGER_PATH, remaining.map((entry) => `${JSON.stringify(entry)}\n`).join(''), 'utf8');
}

export function ledgerPath(): string {
  return LEDGER_PATH;
}
