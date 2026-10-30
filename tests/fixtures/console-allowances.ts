import type { GuardOptions } from './e2e-test.js';

/**
 * Why each console/response-guard exemption in e2e-test.ts exists.
 *
 * The guard failing a test on an unexpected browser error is what caught the static-CDN font CORS
 * defect (MS-CFG-024, 2026-10-27), so exemptions must not pile up unexamined:
 *
 * - `by-design`: the error is correct application behaviour for the scenario (a guest's 401, a
 *   deliberate 404). Permanent.
 * - `workaround`: the error is application noise or a known defect the suite tolerates for now.
 *   It carries a `reviewBy` date; tests/unit/console-allowances.spec.ts fails once that date has
 *   passed, so someone has to re-check whether the noise is gone (delete the option) or still
 *   there (link a ticket and push the date).
 *
 * Typed as a Record over GuardOptions, so a new allow* option does not compile without an entry.
 */
export type ConsoleAllowance =
  | { kind: 'by-design'; reason: string }
  | { kind: 'workaround'; reason: string; owner: string; reviewBy: string; ticket?: string };

export const consoleAllowances: Record<keyof GuardOptions, ConsoleAllowance> = {
  allowGuestUserMe401: {
    kind: 'by-design',
    reason: 'An anonymous shopper\'s /user/me lookup correctly answers 401.'
  },
  allowKnownPriceWarnings: {
    kind: 'by-design',
    reason: 'The configurator cancels an in-flight quotation when a newer one supersedes it.'
  },
  allowIncompletePricingWarnings: {
    kind: 'by-design',
    reason: 'Tests that deliberately leave a configuration incomplete see the "missing data" pricing warning.'
  },
  allowExpectedAuthFailures: {
    kind: 'by-design',
    reason: 'Negative auth/validation tests expect the API to refuse their input with 4xx.'
  },
  allowGuestCheckoutBootstrap401: {
    kind: 'by-design',
    reason: 'Guest checkout bootstraps member-only data (addresses, points, coupons) that correctly 401s.'
  },
  allowExpectedNotFound: {
    kind: 'by-design',
    reason: 'The 404-page test navigates to a route that must answer 404.'
  },
  allowSheetSizeValidationWarnings: {
    kind: 'by-design',
    reason: 'Sheet size-rule tests enter out-of-range sizes on purpose.'
  },
  allowPostLogout401: {
    kind: 'by-design',
    reason: 'Member reads already in flight when the logout test signs out land after the session is gone.'
  },
  allowKnownNuxtPayloadFailures: {
    kind: 'workaround',
    reason: 'Nuxt _payload.json answers 500 on some routes; the page re-renders without it. A server error, not a test concern.',
    owner: 'QA',
    reviewBy: '2027-01-31'
  },
  allowTransientCartCreateFailures: {
    kind: 'workaround',
    reason: 'Dev API cart/create intermittently fails CORS or the fetch under suite load; the storefront retries.',
    owner: 'QA',
    reviewBy: '2027-01-31'
  },
  allowTransientApiCorsFailures: {
    kind: 'workaround',
    reason: 'Dev API intermittently answers without CORS headers (likely WAF/edge errors) under suite load.',
    owner: 'QA',
    reviewBy: '2027-01-31'
  },
  allowTransientProductPageFailures: {
    kind: 'workaround',
    reason: 'Dev storefront product routes intermittently answer 502/503 under suite load.',
    owner: 'QA',
    reviewBy: '2027-01-31'
  },
  allowStudioModelLoadNoise: {
    kind: 'workaround',
    reason: 'The studio\'s in-browser background-removal model warns about threading and a missing tokenizer_config.json (404).',
    owner: 'QA',
    reviewBy: '2027-01-31'
  },
  allowKnownArtworkReminderFailure: {
    kind: 'workaround',
    reason: 'After a member pays, POST /orders/checkout/complete/send/artwork/<id> answers 500 on dev-1, so no artwork reminder email is sent. A product defect, tolerated so MS-ADMO-019 can check every other email.',
    owner: 'QA',
    reviewBy: '2026-12-31',
    ticket: 'MUS-QA-025'
  },
  allowNavigationAbortedFetches: {
    kind: 'by-design',
    reason: 'Navigating away cancels the page\'s in-flight API fetches, which the storefront logs as "TypeError: Failed to fetch" (API calls) or Nuxt as "[NUXT_E5002]" (its app manifest). Forgiven only when an aborted first-party request of the same kind was seen within a second of the message.'
  }
};
