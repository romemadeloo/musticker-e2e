#!/usr/bin/env node
/**
 * Moves a saved admin panel session between a laptop and CI.
 *
 * Admin sign-in always ends in a verification code emailed to sales@musticker.com -- for the
 * automation account too, and from a known device too (checked on dev-1, 2026-10-27) -- so CI
 * cannot sign in with ADMIN_EMAIL / ADMIN_PASSWORD alone. Instead a person captures a session with
 * `npm run admin:login` (the credentials in .env fill the form; only the code is typed), exports it
 * into the ADMIN_SESSION_<ENV> secret, and CI restores it. A session lasts about a week, or until
 * the account signs in somewhere else.
 *
 *   node scripts/ci/admin-session.mjs export dev-1 | clip    # copy the secret value (Windows)
 *   node scripts/ci/admin-session.mjs restore dev-1           # CI: ADMIN_SESSION_DEV1 -> .auth/
 *   node scripts/ci/admin-session.mjs check dev-1 <api base> <admin origin>
 *
 * `check` never fails the job: an expired session makes every admin spec skip, which is not a
 * product failure, but it must not go unnoticed either -- so it raises a GitHub warning and a step
 * summary line instead. Nothing here prints the session itself except `export`, on request.
 */
/* global console, fetch */
import { Buffer } from 'node:buffer';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { URL } from 'node:url';

const [command, environment, apiBase, adminOrigin] = process.argv.slice(2);

if (!/^dev-[1-6]$/.test(environment ?? '')) {
  console.error('Usage: admin-session.mjs export|restore|check dev-N [api base] [admin origin]');
  process.exit(2);
}

const file = `.auth/admin-${environment}.json`;
const secretName = `ADMIN_SESSION_${environment.replace('-', '').toUpperCase()}`;

function report(message) {
  console.log(`::warning title=Admin session (${environment})::${message}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n### Admin session (${environment})\n${message}\n`);
  }
}

if (command === 'export') {
  if (!existsSync(file)) {
    console.error(`No ${file}. Run: npm run admin:login`);
    process.exit(1);
  }
  process.stdout.write(Buffer.from(readFileSync(file)).toString('base64'));
} else if (command === 'restore') {
  const value = process.env[secretName]?.trim();
  if (!value) {
    report(`${secretName} is not set, so admin specs will skip. See .env.example for how to set it.`);
    process.exit(0);
  }
  const json = Buffer.from(value, 'base64').toString('utf8');
  JSON.parse(json); // A malformed secret should fail here, not as a confusing skip later.
  mkdirSync('.auth', { recursive: true });
  writeFileSync(file, json, { mode: 0o600 });
  console.log(`Restored ${file} from ${secretName}.`);
} else if (command === 'check') {
  if (!existsSync(file)) process.exit(0); // restore already reported the missing secret
  const state = JSON.parse(readFileSync(file, 'utf8'));
  // The cookies a browser would send to the API host: those scoped to it or to a parent domain.
  const apiHost = new URL(apiBase).hostname;
  const cookie = state.cookies
    .filter((c) => apiHost === c.domain.replace(/^\./, '') || apiHost.endsWith(`.${c.domain.replace(/^\./, '')}`))
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  const response = await fetch(`${apiBase}/sys/kr/auth/admin/me`, {
    headers: { cookie, origin: adminOrigin, referer: `${adminOrigin}/`, accept: 'application/json' }
  }).catch(() => undefined);
  const body = response ? await response.json().catch(() => ({})) : {};

  if (response?.ok && body.success === true) {
    const token = state.cookies.find((c) => c.name === 'dev_admin_token');
    const days = token?.expires > 0 ? Math.floor((token.expires * 1000 - Date.now()) / 86_400_000) : undefined;
    console.log(`Admin session for ${environment} is valid${days === undefined ? '' : ` (about ${days} day(s) left)`}.`);
    if (days !== undefined && days <= 1) report(`The session expires within a day. Refresh ${secretName} soon.`);
  } else {
    report(
      `The saved session was rejected (HTTP ${response?.status ?? 'n/a'}), so admin specs will skip. ` +
        `Refresh it: npm run admin:login, then update ${secretName}.`
    );
  }
} else {
  console.error(`Unknown command "${command}".`);
  process.exit(2);
}
