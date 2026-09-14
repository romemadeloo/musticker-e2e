import { test as base, expect } from '@playwright/test';

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

type GuardOptions = {
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

function isTransientProductPageServerFailure(status: number, url: string): boolean {
  return (
    [502, 503].includes(status) &&
    new RegExp(`^https://${DEV_STOREFRONT_HOST}/kr/(?:stickers|roll-stickers|sheet-stickers)/[^/?#]+`, 'i').test(url)
  );
}

function isBenignUnusedPreloadWarning(text: string): boolean {
  return /The resource https:\/\/www\.musticker\.com\/illustrations\/products\/.* was preloaded using link preload but not used within a few seconds/i.test(
    text
  );
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
      allowPostLogout401
    },
    use
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
      allowPostLogout401
    };
    const consoleFailures: string[] = [];
    const responseFailures: string[] = [];
    let hadSupersededPricingRequest = false;
    let pendingCartCreateNetworkFailures = 0;
    let pendingTransientApiNetworkFailures = 0;
    let pendingTransientProductPageFailures = 0;
    let pendingExpectedNotFoundResponses = 0;

    page.on('console', (message) => {
      if (!['error', 'warning'].includes(message.type())) {
        return;
      }

      const text = message.text();
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

      if (isKnownConsoleMessage(text, guardOptions)) {
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

      responseFailures.push(`${status} ${url}`);
    });

    await applyInternalOriginHeader(page);
    await use(page);

    // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
    // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
    // that nothing retried still fails the run.
    const throttleBlocks = retriedThrottleBlockCount(page);

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
