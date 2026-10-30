import { test as base, expect } from '@playwright/test';
import type { Request } from '@playwright/test';

import { DEV_API_HOST, DEV_STOREFRONT_HOST } from './hosts.js';
import { applyInternalOriginHeader } from './internal-origin.js';
import { hasMemberCredentials, seedMemberStorageState } from './member-auth.js';
import type { MemberStorageState } from './member-auth.js';
import {
  isThrottleBlockConsoleError,
  isThrottleBlockResponse,
  retriedThrottleBlockCount
} from './navigation.js';

type SessionOptions = {
  /**
   * Starts the test already signed in as the seeded member, by seeding the browser context with a
   * session obtained from the API rather than driving the login form (see member-auth.ts).
   *
   * Opt in per file with `test.use({ asMember: true })`, and guard the file with
   * `test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS)` -- with no credentials
   * configured this falls back to an anonymous context rather than failing, so a test that assumes
   * a member session must skip itself.
   */
  asMember: boolean;
};

type SessionWorkerFixtures = {
  /**
   * Authenticates at most once per worker, on first use. Exposed as a getter rather than as the
   * state itself so that anonymous runs -- the overwhelming majority -- never make the call: the
   * `storageState` override below depends on this fixture for every test, and a plain value fixture
   * would therefore log in on every worker whether or not anything asked to be a member.
   */
  memberAuthState: () => Promise<MemberStorageState>;
};

// Every option needs an entry in console-allowances.ts, which records why it exists and, for
// workarounds, when it must be re-checked.
export type GuardOptions = {
  allowGuestUserMe401: boolean;
  allowKnownPriceWarnings: boolean;
  allowIncompletePricingWarnings: boolean;
  allowExpectedAuthFailures: boolean;
  allowKnownNuxtPayloadFailures: boolean;
  allowTransientCartCreateFailures: boolean;
  allowTransientApiCorsFailures: boolean;
  allowTransientProductPageFailures: boolean;
  allowGuestCheckoutBootstrap401: boolean;
  allowExpectedNotFound: boolean;
  allowSheetSizeValidationWarnings: boolean;
  allowPostLogout401: boolean;
  allowStudioModelLoadNoise: boolean;
  allowKnownArtworkReminderFailure: boolean;
  allowNavigationAbortedFetches: boolean;
};

function isExpectedGuestUserMe401(status: number, url: string): boolean {
  return status === 401 && url.includes('/sys/kr/user/me');
}

// The checkout page eagerly bootstraps account-linked data (saved addresses, points balance,
// coupon eligibility) even for anonymous shoppers with a guest cart; those calls correctly 401
// for a guest and are not indicative of a bug.
function isExpectedGuestCheckoutBootstrap401(status: number, url: string): boolean {
  return status === 401 && /\/sys\/kr\/(?:user-address|user-point\/points|coupon\/applicable|address\/validate)(?:\?|$)/i.test(url);
}

// The app logs this warning alongside any 401 it handles, so it accompanies both of the 401s
// forgiven below: the guest-checkout bootstrap calls and the post-logout member-data reads. It
// carries no URL, so it cannot be attributed to one or the other -- each caller that forgives the
// response has to forgive the warning too, or the request is forgiven and its console echo still
// fails the run.
function isUnauthorizedActionWarning(text: string): boolean {
  return text === 'Unauthorized action!';
}

// Logging out races the member-scoped reads the page had already started: a cart recalculation or
// an account-overview fetch that was in flight lands after the session cookie is gone and comes
// back 401. Those responses are moot by then -- the shopper is anonymous, the cart is re-fetched as
// a guest cart and the account view is left behind -- so they say nothing about the logout under
// test. Only tests that deliberately log out opt in.
function isPostLogoutMemberDataUnauthorized(status: number, url: string): boolean {
  return status === 401 && /\/sys\/kr\/(?:cart\/(?:calculate|get)|profile\/overview)(?:\?|$)/i.test(url);
}

function isExpectedAuthFailure(status: number, url: string): boolean {
  if (![400, 401, 403, 404, 422].includes(status)) {
    return false;
  }

  return /auth|login|register|order|guest|non-member|user\/me/i.test(url);
}

function isKnownNuxtPayloadFailure(status: number, url: string): boolean {
  return status === 500 && /\/kr\/.*_payload\.json/i.test(url);
}

function isSupersededPricingRequest(text: string): boolean {
  return (
    new RegExp(
      `Pricing request failed! FetchError: \\[GET\\] "https://${DEV_API_HOST}/.*/pricing/quotation/[^"]+": <no response> Canceled due to newer request\\.`
    ).test(text) || text === 'Pricing request failed! AbortError: The user aborted a request.'
  );
}

// A navigation cancels whatever API fetches the page still had open, and the storefront logs each
// one as a bare "TypeError: Failed to fetch" (prefixed for quotations). MS-SHT-004 logged it on
// dev-1 (2026-10-30) 1ms after its circle-sheet quotation was aborted by the test's own navigation.
// The same navigation can cancel Nuxt's app-manifest fetch (/_nuxt/builds/meta/<build>.json), which
// Nuxt reports as a bare "[NUXT_E5002]": MS-CHK-002 logged it on dev-1 (2026-10-30) 2ms after its
// goto to the checkout aborted the product page's manifest fetch.
// Neither message names a request, so each is only forgiven when an aborted first-party request of
// its own kind was seen close to it; a fetch that failed for any other reason still fails the run.
const ABORTED_FETCH_MATCH_WINDOW_MS = 1_000;

export type AbortedFetchKind = 'api' | 'appManifest';

export function abortedFetchConsoleKind(text: string): AbortedFetchKind | undefined {
  if (/^(?:Pricing request failed! )?TypeError: Failed to fetch$/.test(text)) return 'api';
  if (text === '[NUXT_E5002]') return 'appManifest';
  return undefined;
}

// Chromium, Firefox and WebKit each word a cancelled request differently.
function abortedRequestKind(request: Request): AbortedFetchKind | undefined {
  if (
    !['fetch', 'xhr'].includes(request.resourceType()) ||
    !['net::ERR_ABORTED', 'NS_BINDING_ABORTED', 'cancelled'].includes(request.failure()?.errorText ?? '')
  ) {
    return undefined;
  }
  if (new RegExp(`^https://${DEV_API_HOST}/`, 'i').test(request.url())) return 'api';
  if (new RegExp(`^https://${DEV_STOREFRONT_HOST}/_nuxt/builds/meta/[^/]+\\.json(?:\\?|$)`, 'i').test(request.url())) {
    return 'appManifest';
  }
  return undefined;
}

// The storefront re-quotes whenever a configuration control changes, and logs this warning when the
// configuration it is handed cannot be priced yet. The custom size and quantity controls open
// empty, so merely opening one schedules a quote that cannot be computed; the warning lands roughly
// 200ms later -- usually after the test that caused it has finished, which is the only reason it is
// not seen on every run. Tests that deliberately leave a configuration incomplete opt in; anywhere
// else a configuration that should price and does not must still fail the run.
function isIncompletePricingWarning(text: string): boolean {
  return text === 'There are missing data that is required in pricing.';
}

function isCartCreateCorsFailure(text: string): boolean {
  return new RegExp(`Access to fetch at 'https://${DEV_API_HOST}/.*/cart/create' .*CORS policy`, 'i').test(text);
}

function isCartCreateFetchFailure(text: string): boolean {
  return new RegExp(
    `FetchError: \\[POST\\] "https://${DEV_API_HOST}/.*/cart/create": <no response> Failed to fetch`,
    'i'
  ).test(text);
}

function isTransientApiCorsFailure(text: string): boolean {
  return new RegExp(
    `Access to fetch at 'https://${DEV_API_HOST}/.*' from origin 'https://${DEV_STOREFRONT_HOST}' has been blocked by CORS policy`,
    'i'
  ).test(text);
}

function isTransientApiFetchFailure(text: string): boolean {
  return new RegExp(
    `FetchError: \\[(?:GET|POST|PUT|PATCH|DELETE)\\] "https://${DEV_API_HOST}/.*": <no response> Failed to fetch`,
    'i'
  ).test(text);
}

// Only for tests that deliberately navigate to a route the storefront is expected to reject: the
// branded 404 page answers with a real 404 status, and the browser logs that document failure to
// the console as well, so the response and its console message are cleared together as one pair.
function isExpectedStorefrontNotFound(status: number, url: string): boolean {
  return status === 404 && new RegExp(`^https://${DEV_STOREFRONT_HOST}/`, 'i').test(url);
}

// Hydrating the 404 page re-runs the failed route resolution client-side, so Nuxt logs the same
// not-found error again during app initialization. The class name is minified and changes per
// build, so match on the surrounding message instead.
function isNuxtPageNotFoundError(text: string): boolean {
  return /\[nuxt\] error caught during app initialization[\s\S]*Page not found/i.test(text);
}

function isNotFoundResourceConsoleError(text: string): boolean {
  return text === 'Failed to load resource: the server responded with a status of 404 ()';
}

// MUS-QA-025: after a member pays, the confirmation page asks the API to send the artwork reminder
// email and dev-1 answers 500, every time since at least 2026-10-28 (orders 2630, 2633).
function isArtworkReminderServerFailure(status: number, url: string): boolean {
  return status === 500 && /\/sys\/kr\/orders\/checkout\/complete\/send\/artwork\/\d+$/.test(url);
}

function isArtworkReminderConsoleError(text: string): boolean {
  return (
    text === 'Critical Server Error. Please contact support.' ||
    /^Order artwork reminder email failed: FetchError: \[POST\] "[^"]*\/sys\/kr\/orders\/checkout\/complete\/send\/artwork\/\d+": 500\b/.test(text)
  );
}

function isTransientProductPageServerFailure(status: number, url: string): boolean {
  return (
    [502, 503].includes(status) &&
    new RegExp(`^https://${DEV_STOREFRONT_HOST}/kr/(?:stickers|roll-stickers|sheet-stickers)/[^/?#]+`, 'i').test(url)
  );
}

// Any first-party host: dev-1 logs the same unused-preload warning as production (2026-10-14).
function isBenignUnusedPreloadWarning(text: string): boolean {
  return /The resource https:\/\/[\w.-]*musticker\.com\/illustrations\/products\/.* was preloaded using link preload but not used within a few seconds/i.test(
    text
  );
}

// Firefox reports a metadata warning for the storefront's two Pretendard subsets. The font still
// renders, and the same warning appears on unrelated routes, so it does not describe the behavior
// any individual test is asserting. Keep the match limited to these exact first-party font files.
export function isBenignPretendardMetadataWarning(text: string): boolean {
  return new RegExp(
    `^\\[JavaScript Warning: "downloadable font: name: name records are not sorted\\. \\(font-family: "Pretendard" style:normal weight:100\\.\\.900 stretch:100 src index:0\\) source: https://${DEV_STOREFRONT_HOST}/fonts/PretendardVariable\\.(?:latin|kr)\\.woff2"\\]$`
  ).test(text);
}

export function isBenignPretendardPreloadWarning(text: string): boolean {
  return new RegExp(
    `^\\[JavaScript Warning: "The resource at .https://${DEV_STOREFRONT_HOST}/fonts/PretendardVariable\\.(?:latin|kr)\\.woff2. preloaded with link preload was not used within a few seconds\\. Make sure all attributes of the preload tag are set correctly\\." \\{file: "https://${DEV_STOREFRONT_HOST}/kr(?:/[a-z0-9/-]+)?" line: 0\\}\\]$`
  ).test(text);
}

// WebKit warns when Nuxt preloads a first-party JS chunk or route payload but the current route
// does not use it immediately. Firefox emits its own wording for the route payload. These are
// browser scheduling warnings, not failed requests or app exceptions.
export function isBenignNuxtPreloadWarning(text: string): boolean {
  const routePayload = `https://${DEV_STOREFRONT_HOST}/kr(?:/[a-z0-9/-]+)?/_payload\\.json\\?_b=[a-f0-9-]+`;
  return (
    new RegExp(
      `^The resource https://${DEV_STOREFRONT_HOST}/_nuxt/[A-Za-z0-9_-]+\\.js was preloaded using link preload but not used within a few seconds from the window's load event\\. Please make sure it wasn't preloaded for nothing\\.$`
    ).test(text) ||
    new RegExp(
      `^The resource ${routePayload} was preloaded using link preload but not used within a few seconds from the window's load event\\. Please make sure it wasn't preloaded for nothing\\.$`
    ).test(text) ||
    new RegExp(
      `^\\[JavaScript Warning: "The resource at “${routePayload}” preloaded with link preload was not used within a few seconds\\. Make sure all attributes of the preload tag are set correctly\\." \\{file: "https://${DEV_STOREFRONT_HOST}/kr(?:/[a-z0-9/-]+)?(?:\\?studio=1)?" line: 0\\}\\]$`
    ).test(text)
  );
}

export function isBenignFirefoxIllustrationPreloadWarning(text: string): boolean {
  return new RegExp(
    `^\\[JavaScript Warning: "The resource at “https://${DEV_STOREFRONT_HOST}/illustrations/products/[a-z0-9/-]+\\.svg” preloaded with link preload was not used within a few seconds\\. Make sure all attributes of the preload tag are set correctly\\." \\{file: "https://${DEV_STOREFRONT_HOST}/kr/[a-z0-9/-]+" line: 0\\}\\]$`
  ).test(text);
}

// The design worker uses its lightweight model when Firefox has no WebGPU adapter. The workflow
// still completes; retain every other WebGPU warning and every console error as a finding.
export function isBenignWorkerModelFallbackWarning(text: string): boolean {
  return text === '[Worker] WebGPU 어댑터 조회 실패 — 가벼운 모델을 씁니다 Error';
}

// Opening the design studio (?studio=1) loads a background-removal model in the browser (ONNX,
// fetched from huggingface.co). onnxruntime warns that it cannot multi-thread outside a
// cross-origin-isolated page, and the model loader asks for a tokenizer_config.json the model repo
// does not have (404) -- both seen on every studio open on 2026-10-14, neither stops the studio
// working. Only studio tests opt in, so the same noise anywhere else still fails the run.
function isStudioModelLoadWarning(text: string): boolean {
  return (
    /^env\.wasm\.numThreads is set to \d+, but this will not work unless you enable crossOriginIsolated mode\./.test(text) ||
    text === 'WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading.'
  );
}

function isStudioModelMissingTokenizerConfig(status: number, url: string): boolean {
  return status === 404 && /^https:\/\/huggingface\.co\/[^?#]+\/resolve\/[^/]+\/tokenizer_config\.json$/.test(url);
}

function isBenignWorkerCapabilityFallbackWarning(text: string): boolean {
  return /\[Worker\].*WebGPU.*shader-f16/i.test(text);
}

function isKnownConsoleMessage(text: string, options: GuardOptions): boolean {
  if (isBenignUnusedPreloadWarning(text)) {
    return true;
  }

  if (isBenignWorkerCapabilityFallbackWarning(text)) {
    return true;
  }

  if (
    (options.allowGuestCheckoutBootstrap401 || options.allowPostLogout401) &&
    isUnauthorizedActionWarning(text)
  ) {
    return true;
  }

  if (options.allowExpectedNotFound && isNuxtPageNotFoundError(text)) {
    return true;
  }

  if (options.allowStudioModelLoadNoise && isStudioModelLoadWarning(text)) {
    return true;
  }

  if (options.allowGuestUserMe401 && /401/.test(text)) {
    return true;
  }

  if (
    options.allowKnownPriceWarnings &&
    /Updating prices|Invalid data Proxy|Invalidd minimum quantity|Calculating carts|New Size:|price_per_mm/.test(text)
  ) {
    return true;
  }

  // A rejected sheet size has no orderable quantity to price, so the pricing engine echoes it as the
  // same incomplete-configuration warning that the custom controls produce.
  if (
    (options.allowIncompletePricingWarnings || options.allowSheetSizeValidationWarnings) &&
    isIncompletePricingWarning(text)
  ) {
    return true;
  }

  // The storefront logs `Size error: <the shopper-facing message>` whenever the minimum-two-per-
  // sheet rule rejects an individual size. That is the deliberate output of these tests. Tests that
  // exercise the rule opt in; everywhere else an unexpected size rejection should still fail the
  // run.
  if (options.allowSheetSizeValidationWarnings && /^Size error:/.test(text)) {
    return true;
  }

  if (
    options.allowKnownNuxtPayloadFailures &&
    (/Cannot load payload\s+\/kr\/.*_payload\.json/i.test(text) ||
      /Hydration completed but contains mismatches/i.test(text) ||
      /(?:Static|Public) review preload failed\.[\s\S]*getActivePinia\(\)/i.test(text) ||
      text === '[NUXT_E1005]' ||
      text === '[NUXT_E7002]' ||
      text === 'Failed to load resource: the server responded with a status of 500 ()')
  ) {
    return true;
  }

  return false;
}

// The guard stores console failures as "[error] <text>" and response failures as "<status> <url>";
// unwrap each back to the shape the navigation.ts predicates expect.
function isThrottleBlockConsoleFailure(entry: string): boolean {
  return isThrottleBlockConsoleError(entry.replace(/^\[(?:error|warning)\] /, ''));
}

function isThrottleBlockResponseFailure(entry: string): boolean {
  const [, status, url] = entry.match(/^(\d{3}) (\S+)$/) ?? [];

  return status && url ? isThrottleBlockResponse(Number(status), url) : false;
}

// Removes up to `limit` entries that the navigation retry already accounted for, keeping every
// other failure untouched -- a blocked request nothing retried past must still fail the run.
function dropForgiven(entries: string[], limit: number, isForgivable: (entry: string) => boolean): string[] {
  let remaining = limit;

  return entries.filter((entry) => {
    if (remaining > 0 && isForgivable(entry)) {
      remaining -= 1;
      return false;
    }

    return true;
  });
}


export const test = base.extend<GuardOptions & SessionOptions, SessionWorkerFixtures>({
  asMember: [false, { option: true }],

  memberAuthState: [
    // Playwright reads a fixture's dependencies off its destructuring pattern and rejects a plain
    // parameter name, so the empty pattern is required even though nothing is destructured.
    async ({}, use) => {
      let seeded: MemberStorageState | undefined;

      await use(async () => {
        seeded ??= await seedMemberStorageState();
        return seeded;
      });
    },
    { scope: 'worker' }
  ],

  storageState: async ({ asMember, memberAuthState, storageState }, use) => {
    if (!asMember || !hasMemberCredentials()) {
      await use(storageState);
      return;
    }

    await use(await memberAuthState());
  },

  allowGuestUserMe401: [false, { option: true }],
  allowKnownPriceWarnings: [true, { option: true }],
  allowIncompletePricingWarnings: [false, { option: true }],
  allowExpectedAuthFailures: [false, { option: true }],
  allowKnownNuxtPayloadFailures: [false, { option: true }],
  allowTransientCartCreateFailures: [false, { option: true }],
  allowTransientApiCorsFailures: [false, { option: true }],
  allowTransientProductPageFailures: [false, { option: true }],
  allowGuestCheckoutBootstrap401: [false, { option: true }],
  allowExpectedNotFound: [false, { option: true }],
  allowSheetSizeValidationWarnings: [false, { option: true }],
  allowPostLogout401: [false, { option: true }],
  allowStudioModelLoadNoise: [false, { option: true }],
  allowKnownArtworkReminderFailure: [false, { option: true }],
  allowNavigationAbortedFetches: [true, { option: true }],

  page: async (
    {
      page,
      allowGuestUserMe401,
      allowKnownPriceWarnings,
      allowIncompletePricingWarnings,
      allowExpectedAuthFailures,
      allowKnownNuxtPayloadFailures,
      allowTransientCartCreateFailures,
      allowTransientApiCorsFailures,
      allowTransientProductPageFailures,
      allowGuestCheckoutBootstrap401,
      allowExpectedNotFound,
      allowSheetSizeValidationWarnings,
      allowPostLogout401,
      allowStudioModelLoadNoise,
      allowKnownArtworkReminderFailure,
      allowNavigationAbortedFetches
    },
    use,
    testInfo
  ) => {
    const guardOptions = {
      allowGuestUserMe401,
      allowKnownPriceWarnings,
      allowIncompletePricingWarnings,
      allowExpectedAuthFailures,
      allowKnownNuxtPayloadFailures,
      allowTransientCartCreateFailures,
      allowTransientApiCorsFailures,
      allowTransientProductPageFailures,
      allowGuestCheckoutBootstrap401,
      allowExpectedNotFound,
      allowSheetSizeValidationWarnings,
      allowPostLogout401,
      allowStudioModelLoadNoise,
      allowKnownArtworkReminderFailure,
      allowNavigationAbortedFetches
    };
    const consoleFailures: string[] = [];
    const responseFailures: string[] = [];
    // Keep diagnostics usable when traces are disabled for internal-origin secrets.
    // Never collect headers, bodies, query strings, cookies, or entered form values.
    const networkFailures: object[] = [];
    const consoleSources: object[] = [];
    const safeURL = (value: string) => {
      try { const url = new URL(value); return `${url.origin}${url.pathname}`; }
      catch { return '(no source URL)'; }
    };
    page.on('requestfailed', request => {
      if (networkFailures.length >= 100) return;
      networkFailures.push({
        url: safeURL(request.url()), method: request.method(), resourceType: request.resourceType(),
        error: request.failure()?.errorText, timestamp: Date.now()
      });
    });
    // The console message and the request failure arrive in either order, so they are paired up
    // after the test rather than as they come in.
    const abortedFetches: Array<{ kind: AbortedFetchKind; at: number }> = [];
    const abortedFetchConsoleErrors: Array<{ kind: AbortedFetchKind; entry: string; at: number }> = [];
    page.on('requestfailed', request => {
      const kind = abortedRequestKind(request);
      if (kind) {
        abortedFetches.push({ kind, at: Date.now() });
      }
    });
    let hadSupersededPricingRequest = false;
    let pendingCartCreateNetworkFailures = 0;
    let pendingTransientApiNetworkFailures = 0;
    let pendingTransientProductPageFailures = 0;
    let pendingExpectedNotFoundResponses = 0;
    // The reminder's two console errors are only forgiven after its 500 has been seen, so the
    // generic "Critical Server Error" text still fails a test when anything else causes it.
    let seenArtworkReminderFailure = false;

    page.on('console', (message) => {
      if (!['error', 'warning'].includes(message.type())) {
        return;
      }

      const text = message.text();
      if (consoleSources.length < 100) {
        const location = message.location();
        consoleSources.push({ type: message.type(), source: safeURL(location.url), line: location.lineNumber, timestamp: Date.now() });
      }
      if (
        allowTransientProductPageFailures &&
        pendingTransientProductPageFailures > 0 &&
        /Failed to load resource: the server responded with a status of 50[23]/i.test(text)
      ) {
        pendingTransientProductPageFailures = Math.max(0, pendingTransientProductPageFailures - 1);
        return;
      }

      if (allowExpectedNotFound && pendingExpectedNotFoundResponses > 0 && isNotFoundResourceConsoleError(text)) {
        pendingExpectedNotFoundResponses = Math.max(0, pendingExpectedNotFoundResponses - 1);
        return;
      }

      if (allowKnownArtworkReminderFailure && seenArtworkReminderFailure && isArtworkReminderConsoleError(text)) {
        return;
      }

      if (allowTransientApiCorsFailures && isTransientApiCorsFailure(text)) {
        pendingTransientApiNetworkFailures += 1;
        return;
      }

      if (
        allowTransientApiCorsFailures &&
        pendingTransientApiNetworkFailures > 0 &&
        text === 'Failed to load resource: net::ERR_FAILED'
      ) {
        return;
      }

      if (allowTransientApiCorsFailures && isTransientApiFetchFailure(text)) {
        pendingTransientApiNetworkFailures = Math.max(0, pendingTransientApiNetworkFailures - 1);
        return;
      }

      if (allowTransientCartCreateFailures && isCartCreateCorsFailure(text)) {
        pendingCartCreateNetworkFailures += 1;
        return;
      }

      if (
        allowTransientCartCreateFailures &&
        pendingCartCreateNetworkFailures > 0 &&
        text === 'Failed to load resource: net::ERR_FAILED'
      ) {
        return;
      }

      if (allowTransientCartCreateFailures && isCartCreateFetchFailure(text)) {
        pendingCartCreateNetworkFailures = Math.max(0, pendingCartCreateNetworkFailures - 1);
        return;
      }

      if (allowKnownPriceWarnings && isSupersededPricingRequest(text)) {
        hadSupersededPricingRequest = true;
        return;
      }

      if (allowKnownPriceWarnings && hadSupersededPricingRequest && text === 'Unable to retrieve prices.') {
        hadSupersededPricingRequest = false;
        return;
      }

      if (
        message.type() === 'warning' &&
        (isBenignPretendardMetadataWarning(text) ||
          isBenignPretendardPreloadWarning(text) ||
          isBenignNuxtPreloadWarning(text) ||
          isBenignFirefoxIllustrationPreloadWarning(text) ||
          isBenignWorkerModelFallbackWarning(text))
      ) {
        return;
      }

      if (isKnownConsoleMessage(text, guardOptions)) {
        return;
      }

      const abortedKind = allowNavigationAbortedFetches ? abortedFetchConsoleKind(text) : undefined;
      if (abortedKind) {
        abortedFetchConsoleErrors.push({ kind: abortedKind, entry: `[${message.type()}] ${text}`, at: Date.now() });
        return;
      }

      consoleFailures.push(`[${message.type()}] ${text}`);
    });

    page.on('response', (response) => {
      const status = response.status();
      if (status < 400) {
        return;
      }

      const url = response.url();
      if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
        return;
      }

      if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
        return;
      }

      if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
        return;
      }

      if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
        pendingTransientProductPageFailures += 1;
        return;
      }

      if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
        pendingExpectedNotFoundResponses += 1;
        return;
      }

      if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
        return;
      }

      if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
        return;
      }

      if (allowStudioModelLoadNoise && isStudioModelMissingTokenizerConfig(status, url)) {
        return;
      }

      if (allowKnownArtworkReminderFailure && isArtworkReminderServerFailure(status, url)) {
        seenArtworkReminderFailure = true;
        return;
      }

      responseFailures.push(`${status} ${url}`);
    });

    await applyInternalOriginHeader(page);
    await use(page);

    // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
    // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
    // that nothing retried still fails the run.
    const throttleBlocks = retriedThrottleBlockCount(page);

    for (const { kind, entry, at } of abortedFetchConsoleErrors) {
      if (!abortedFetches.some((aborted) => aborted.kind === kind && Math.abs(aborted.at - at) <= ABORTED_FETCH_MATCH_WINDOW_MS)) {
        consoleFailures.push(entry);
      }
    }

    if (consoleFailures.length || responseFailures.length || testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('browser-diagnostics.json', {
        body: JSON.stringify({ networkFailures, consoleSources }), contentType: 'application/json'
      });
    }

    expect
      .soft(
        dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
        'Unexpected browser console errors or warnings'
      )
      .toEqual([]);
    expect
      .soft(
        dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
        'Unexpected failed HTTP responses'
      )
      .toEqual([]);
  }
});

export { expect };
