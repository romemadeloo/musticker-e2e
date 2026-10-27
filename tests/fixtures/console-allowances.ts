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
  }
};
