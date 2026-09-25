import { test } from '@playwright/test';
import type { Page, Response } from '@playwright/test';

import { internalOriginKey } from './env.js';
import { DEV_STOREFRONT_HOST } from './hosts.js';
import { INTERNAL_ORIGIN_HEADER } from './internal-origin.js';

// The storefront sits behind a WAF that rate-limits our single CI egress IP under full-suite load:
// the document request comes back as a bare nginx 403 Forbidden page instead of the app, in
// contiguous windows lasting from ~35s to well over a minute. Nothing is wrong with the site --
// the same URLs answer 200 on a manual re-check moments later.
//
// Playwright's own `retries: 2` cannot ride that out. Its three attempts run back-to-back with no
// backoff, so all of them land inside the same block window and the test dies on whatever content
// assertion follows the navigation ("element(s) not found" on a heading or the header banner),
// which says nothing about the real cause. Navigating through this helper instead re-requests the
// page with a growing delay before the caller ever asserts on content.
//
// The delays below spend ~54s over six attempts. Combined with Playwright's own retries that is
// ~168s of coverage, against a longest-observed window of ~100s (production run #99, 2026-09-01:
// both MS-V2-078 circle-sheet cases died on /kr/sheet-stickers/circle-sheet between 20:43:14 and
// 20:44:51 UTC, bracketed by passes on the identical URL six seconds before and immediately after).
// The previous ladder spent ~29s, so its three Playwright attempts covered ~96s and fell a few
// seconds short of that window -- the whole failure.
//
// The wait does not come out of the caller's assertion budget; see waitOutBlock. Without that, a
// ladder this long would hand a navigation that recovers on the last rung about five seconds to
// assert in, and the 60s per-test timeout would start failing tests that the throttling only
// delayed.
const throttleRetryDelaysMs = [2_000, 4_000, 8_000, 15_000, 25_000];

// One initial request plus one per rung. Exported so the hermetic coverage in
// tests/e2e/storefront/security/throttle-detection.spec.ts counts what the ladder actually does rather than
// restating a number that has now changed twice.
export const throttleRetryAttempts = throttleRetryDelaysMs.length + 1;

// A block does not always hit the document. Observed on production 2026-08-28: the document
// answered 200 while every _nuxt chunk and stylesheet behind it came back 403, so the shell arrived,
// Nuxt never hydrated, and the caller failed on a missing heading -- the same misdiagnosis this
// helper exists to prevent, one layer down. That shape gets no retry from the document check alone.
//
// Three rather than one: a lone 403 on some individual asset is a real finding and must not be
// relabelled as throttling. A block refuses everything at once -- 45+ assets in the run that
// prompted this.
const subresourceBlockThreshold = 3;

const storefrontUrlPattern = new RegExp(`^https://${DEV_STOREFRONT_HOST}/`, 'i');

// 403s this helper deliberately navigated past, per page. The guard in e2e-test.ts records every
// failed response as it happens -- before this helper has seen the status -- so it cannot skip them
// at listen time; it subtracts them at assertion time instead. Keyed weakly so nothing outlives the
// page it belongs to.
const retriedThrottleBlocks = new WeakMap<Page, number>();

export function isThrottleBlockResponse(status: number, url: string): boolean {
  return status === 403 && storefrontUrlPattern.test(url);
}

// The browser logs the blocked document request to the console as well, so a forgiven 403 has to
// clear its console message alongside its response entry. Matched by prefix because the trailing
// parenthesised status text varies with what the blocker sends: the live WAF page omits it
// entirely ("... status of 403 ()"), other responders spell it out ("... status of 403
// (Forbidden)").
export function isThrottleBlockConsoleError(text: string): boolean {
  return text.startsWith('Failed to load resource: the server responded with a status of 403');
}

export function retriedThrottleBlockCount(page: Page): number {
  return retriedThrottleBlocks.get(page) ?? 0;
}

/**
 * Navigates to a storefront path, retrying with backoff while the WAF answers 403.
 *
 * Returns the final response so callers can assert on its status, exactly like `page.goto`. Throws
 * a described error rather than returning a blocked response, so an exhausted retry budget reports
 * the throttling itself instead of surfacing as a downstream missing-element failure.
 */
export async function gotoStorefront(
  page: Page,
  path: string,
  options?: Parameters<Page['goto']>[1]
): Promise<Response | null> {
  let blockedSubresources = 0;
  // Kept alongside the count so an exhausted ladder can report what the refusal actually looked like
  // on the wire, in the shape where the document answered 200 and its assets did not.
  let lastBlockedSubresource: Response | null = null;

  const countBlockedSubresource = (response: Response): void => {
    if (
      response.request().resourceType() !== 'document' &&
      isThrottleBlockResponse(response.status(), response.url())
    ) {
      blockedSubresources += 1;
      lastBlockedSubresource = response;
    }
  };

  page.on('response', countBlockedSubresource);

  try {
    let response = await page.goto(path, options);
    let attempts = 1;

    for (const delayMs of throttleRetryDelaysMs) {
      if (!isAttemptBlocked(response, blockedSubresources)) {
        return response;
      }

      countThrottleBlocks(page, blockedRequestCount(response, blockedSubresources));
      await waitOutBlock(delayMs);

      blockedSubresources = 0;
      lastBlockedSubresource = null;
      response = await page.goto(path, options);
      attempts += 1;
    }

    if (isAttemptBlocked(response, blockedSubresources)) {
      // Counted as well, so the guard reports this one failure rather than trailing it with its own
      // soft assertions about the same blocked requests.
      countThrottleBlocks(page, blockedRequestCount(response, blockedSubresources));

      throw new Error(
        await describeExhaustedRetries(
          response,
          path,
          attempts,
          blockedSubresources,
          lastBlockedSubresource
        )
      );
    }

    return response;
  } finally {
    page.off('response', countBlockedSubresource);
  }
}

/**
 * Sleeps out a block window without spending the caller's assertion budget.
 *
 * Time lost to the WAF is not the test's doing, so it is added back to the deadline: a navigation
 * that recovers on the last rung must hand its caller the same time to assert in as one that
 * recovered on the first. A test that then genuinely hangs still fails on its own timeout, only
 * later by however long it actually waited here.
 *
 * `test.info()` throws when nothing is running -- a global setup driving a page object, say -- and
 * a zero timeout means the run has them disabled. Neither is a reason to skip the wait.
 */
async function waitOutBlock(delayMs: number): Promise<void> {
  try {
    const info = test.info();

    if (info.timeout > 0) {
      info.setTimeout(info.timeout + delayMs);
    }
  } catch {
    // No running test whose deadline could be extended.
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function describeExhaustedRetries(
  response: Response | null,
  path: string,
  attempts: number,
  blockedSubresources: number,
  lastBlockedSubresource: Response | null
): Promise<string> {
  const totalWaitSeconds = throttleRetryDelaysMs.reduce((sum, delay) => sum + delay, 0) / 1_000;
  const key = internalOriginKey();
  const refused = isBlocked(response) ? response : lastBlockedSubresource;

  return [
    `Storefront returned 403 Forbidden for ${response?.url() ?? path} on all ${attempts} attempts ` +
      `over ~${totalWaitSeconds}s.`,
    isBlocked(response)
      ? 'The document request itself was refused.'
      : `The document answered ${response?.status() ?? '(no response)'} but ${blockedSubresources} of ` +
        'its assets were refused, so Nuxt never hydrated and the page stayed an empty shell.',
    'This is WAF/rate-limit throttling of the CI egress IP, not a broken page: the same URL',
    'normally answers 200 on a manual re-check.',
    '',
    ...(await describeRefusal(refused)),
    '',
    // Which of the failure modes this is decides who can fix it, and the answer is not otherwise
    // visible in a published report: traces are off whenever the key is in play, precisely so the
    // key cannot leak into one, so the lines above are this run's only account of what went out.
    key
      ? 'An x-internal-origin key was configured for this run. If the header reached the refused ' +
        'request above and it was refused anyway, the exemption is not being honoured, and that is ' +
        'a question for whoever owns the rule rather than a test fix. If the header was absent, it ' +
        'never reached the wire and the fault is ours: see applyInternalOriginHeader in ' +
        'tests/fixtures/internal-origin.ts.'
      : 'No x-internal-origin key was sent for this run, so the WAF exemption was never in play. ' +
        'Check that INTERNAL_ORIGIN_KEY (production) or DEV_INTERNAL_ORIGIN_KEY (development-*) is ' +
        'set for this job; env.ts picks by target environment.',
    '',
    'Failing that, widen throttleRetryDelaysMs in tests/fixtures/navigation.ts if the block windows',
    'have grown.'
  ].join('\n');
}

// Response headers that name the box which refused us. A bare origin nginx, a CDN edge and a WAF
// appliance all answer 403 with a body worth nothing, and only these separate them -- which is what
// decides whether the x-internal-origin exemption was ever evaluated at all.
const refusalHeaderNames = [
  'server',
  'via',
  'cf-ray',
  'cf-mitigated',
  'x-cache',
  'x-amz-cf-id',
  'x-amzn-requestid',
  'x-amzn-errortype',
  'retry-after'
];

/**
 * What the refused request and its refusal actually looked like on the wire.
 *
 * The key branch above can only report whether a key existed in this process. A header that never
 * left, a key the blocker has never been told about, and a key it deliberately rejects are
 * indistinguishable from that alone, and they have three different owners -- so the report has to
 * say whether the refused request carried the header, and who answered it.
 *
 * The value is never printed. This repository is public and its Allure reports are published to
 * Pages; presence and length are enough to catch an unsent, truncated or whitespace-padded secret
 * while disclosing nothing about a correct one.
 */
async function describeRefusal(refused: Response | null): Promise<string[]> {
  if (!refused) {
    return ['No refused response was captured, so nothing about the block itself can be reported.'];
  }

  const headers = refused.headers();
  const named = refusalHeaderNames
    .filter((name) => headers[name])
    .map((name) => `${name}: ${headers[name]}`);

  return [
    `Refused ${refused.status()} ${refused.url()}`,
    `  x-internal-origin on that request: ${await describeSentOriginHeader(refused)}`,
    `  answered by: ${named.length > 0 ? named.join(', ') : '(no identifying response headers)'}`,
    `  body: ${await describeRefusalBody(refused)}`
  ];
}

async function describeSentOriginHeader(refused: Response): Promise<string> {
  try {
    const value = (await refused.request().allHeaders())[INTERNAL_ORIGIN_HEADER];

    return value ? `present (${value.length} chars)` : 'absent';
  } catch {
    return 'unknown (request headers unavailable)';
  }
}

// A refusal page is either a two-word nginx stub or a full branded HTML document. Its <title> is the
// one line that identifies either, so prefer it and fall back to the first non-empty line.
async function describeRefusalBody(refused: Response): Promise<string> {
  try {
    const body = await refused.text();
    const title = body.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
    const firstLine = body
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0);

    return (title || firstLine || '(empty)').slice(0, 160);
  } catch {
    return '(unavailable)';
  }
}

// A 200 is only trustworthy if the assets under it were not being refused at the same time. See the
// note on subresourceBlockThreshold.
function isAttemptBlocked(response: Response | null, blockedSubresources: number): boolean {
  return isBlocked(response) || blockedSubresources >= subresourceBlockThreshold;
}

// How many refusals this attempt produced, which is how many entries the guard has to forgive: one
// for a blocked document, plus one per refused asset.
function blockedRequestCount(response: Response | null, blockedSubresources: number): number {
  return (isBlocked(response) ? 1 : 0) + blockedSubresources;
}

function isBlocked(response: Response | null): boolean {
  return Boolean(response && isThrottleBlockResponse(response.status(), response.url()));
}

function countThrottleBlocks(page: Page, count: number): void {
  retriedThrottleBlocks.set(page, retriedThrottleBlockCount(page) + count);
}
