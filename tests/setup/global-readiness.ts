import { request } from '@playwright/test';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { activeEnvironment, env, internalOriginKey, apiPath } from '../fixtures/env.js';
import { checkReadiness } from '../fixtures/readiness.js';
import type { ReadinessResult, ReadinessTarget } from '../fixtures/readiness.js';

export default async function globalReadiness() {
  const results: ReadinessResult[] = [];
  const targets: ReadinessTarget[] = [
    { name: 'storefront', url: env.BASE_URL, expectedBuild: process.env.EXPECTED_STOREFRONT_BUILD?.trim(), buildHeader: process.env.STOREFRONT_BUILD_HEADER },
    { name: 'api', url: apiPath('/sys/kr/navigation/categories'), expectedBuild: process.env.EXPECTED_API_BUILD?.trim(), buildHeader: process.env.API_BUILD_HEADER }
  ];
  const required = process.env.REQUIRE_BUILD_IDENTITY === 'true';
  const key = internalOriginKey();
  for (const target of targets) {
    if (required && !target.expectedBuild) {
      results.push({ target: target.name, status: 'blocked', build: 'unverified', durationMs: 0, reason: 'Expected build is required for this deployment verification' });
      continue;
    }
    // Separate contexts prevent cookies from one origin affecting the other check.
    const client = await request.newContext({ extraHTTPHeaders: {
      ...(key ? { 'x-internal-origin': key } : {}),
      ...(target.name === 'api' ? { Origin: new URL(env.BASE_URL).origin, Accept: 'application/json' } : {})
    } });
    try {
      results.push(await checkReadiness(client, target));
    } finally {
      await client.dispose();
    }
  }
  mkdirSync('readiness-results', { recursive: true });
  writeFileSync(`readiness-results/${randomUUID()}.json`, JSON.stringify({
    schema: 'environment-readiness/1', environment: activeEnvironment || 'custom',
    generated_at: new Date().toISOString(), results
  }, null, 2));
  const summary = results.map(r => `- ${r.target}: ${r.status}; HTTP ${r.httpStatus ?? 'n/a'}; build ${r.build}${r.reason ? `; ${r.reason}` : ''}`).join('\n');
  console.log(`Environment readiness (${activeEnvironment || 'custom'})\n${summary}`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n### Environment readiness\n${summary}\n`);
  if (results.some(r => r.status === 'blocked')) {
    throw new Error('Environment readiness blocked the suite. Review readiness-results; no product tests were run.');
  }
}
