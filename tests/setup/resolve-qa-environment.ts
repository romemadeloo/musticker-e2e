import './load-env.js';

import { request } from '@playwright/test';
import { appendFileSync } from 'node:fs';

import { QA_ENVIRONMENT_ALIAS, selectQaEnvironment } from '../fixtures/environment-fallback.js';
import { environments } from '../fixtures/environments.js';
import { checkReadiness } from '../fixtures/readiness.js';

/**
 * Replaces E2E_ENVIRONMENT=qa with a concrete server before env.ts reads it.
 *
 * Imported first by playwright.config.ts, ahead of anything that imports env.ts, and finished with
 * top-level await so env.ts never sees the alias. It runs once, in the runner: workers inherit the
 * resolved name through process.env (the same way they inherit E2E_RUN_ID) and skip the probe.
 *
 * The probe is the global readiness check itself, so "ready" means the same thing in both places.
 * The chain is dev-only, so only the dev internal-origin key is ever sent.
 */
if (process.env.E2E_ENVIRONMENT?.trim() === QA_ENVIRONMENT_ALIAS) {
  const key = process.env.DEV_INTERNAL_ORIGIN_KEY?.trim();

  const decision = await selectQaEnvironment(async (name) => {
    const { baseUrl, apiBaseUrl } = environments[name];
    const results = [];

    for (const target of [
      { name: 'storefront' as const, url: baseUrl },
      { name: 'api' as const, url: `${apiBaseUrl}/sys/kr/navigation/categories` }
    ]) {
      const client = await request.newContext({
        extraHTTPHeaders: {
          ...(key ? { 'x-internal-origin': key } : {}),
          ...(target.name === 'api' ? { Origin: new URL(baseUrl).origin, Accept: 'application/json' } : {})
        }
      });
      try {
        results.push(await checkReadiness(client, target, 10_000));
      } finally {
        await client.dispose();
      }
    }

    return {
      ready: results.every((result) => result.status === 'ready'),
      detail: results.map((result) => `${result.target} HTTP ${result.httpStatus ?? 'n/a'}`).join(', ')
    };
  });

  process.env.E2E_ENVIRONMENT = decision.selected;

  const lines = decision.attempts.map(
    (attempt) => `- ${attempt.environment}: ${attempt.ready ? 'ready' : 'down'} (${attempt.detail})`
  );
  const headline = decision.fellBack
    ? `E2E_ENVIRONMENT=qa: main server down, FELL BACK to ${decision.selected}`
    : `E2E_ENVIRONMENT=qa resolved to ${decision.selected}`;

  console.log(`${headline}\n${lines.join('\n')}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n### Test server\n${headline}\n${lines.join('\n')}\n`);
  }
}
