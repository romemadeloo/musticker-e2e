# How the suite is built

- [The big picture](#the-big-picture)
- [Configuration](#configuration)
- [The extended test](#the-extended-test)
- [Environments and URLs](#environments-and-urls)
- [Page objects](#page-objects)
- [Sessions](#sessions)
- [Storefront to admin](#storefront-to-admin)
- [Pricing suite](#pricing-suite)
- [Resilience: firewall, hydration, copy drift](#resilience-firewall-hydration-copy-drift)
- [Test data and cleanup](#test-data-and-cleanup)
- [Known defects in code](#known-defects-in-code)
- [Fixture reference](#fixture-reference)

## The big picture

```
spec (tests/e2e/…)                     says WHAT is checked, in user terms
  │ imports { test, expect } from
  ▼
fixtures/e2e-test.ts                   extended test: console/HTTP guard, member session,
fixtures/admin-test.ts                 + admin browser context and admin API
  │ spec calls
  ▼
page objects (tests/pom/…)             say HOW: locators, actions, reusable assertions
  │ read copy and data from
  ▼
fixtures/*-data.ts, pricing/*.csv      Korean copy, products, price tables, status codes
```

A spec never uses raw selectors. It calls page-object methods, and every copy string comes from a
data module, so a storefront wording change is a one-line fix.

## Configuration

[playwright.config.ts](../playwright.config.ts):

- **Projects.** `chromium-desktop` (default), `firefox-desktop`, `webkit-desktop`, and
  `chromium-mobile` (Pixel 7). A run uses one project, chosen by `E2E_BROWSER_PROJECT`. Desktop
  projects skip `@mobile`, and the mobile project runs only `@mobile`.
- **Locale.** `ko-KR`, timezone `Asia/Seoul`, matching the storefront's real audience.
- **Retries.** 2 in CI, 1 locally. **Workers.** `PW_WORKERS`, otherwise 2 in CI and 1 locally.
- **Timeouts.** 60s per test, 10s per assertion. Long journeys raise their own (`test.setTimeout`).
- **Artifacts.** A screenshot and video are kept for each failure, and a trace on the first retry.
  Trace is switched off whenever an internal-origin key is in use, because CI artifacts are public
  and a trace records request headers, including the key.
- **Global teardown.** [tests/setup/global-teardown.ts](../tests/setup/global-teardown.ts) deletes
  members that tests created (see [Test data and cleanup](#test-data-and-cleanup)). It is a
  `globalTeardown` rather than a teardown project because every npm script filters with `--grep`,
  and a project would be filtered out too.
- **Reporters.** list and html, plus JUnit in CI, Allure when `ALLURE_RESULTS_DIR` is set, and
  the self-heal reporter always.

## The extended test

Every spec imports `test` and `expect` from [tests/fixtures/e2e-test.ts](../tests/fixtures/e2e-test.ts),
or from [tests/fixtures/admin-test.ts](../tests/fixtures/admin-test.ts) for tests that also drive
the admin panel. It adds:

**A console and HTTP guard on `page`.** While the test runs it records every console error or
warning, and every response of 400 or above from Musticker hosts. At teardown it soft-asserts that
both lists are empty. **A test can pass every assertion and still fail because the page logged an
error.** That is deliberate: it catches broken pages that happen to render the asserted text.

Some failures are known and expected in a given flow. For example, a guest session gets a 401 from
`/user/me`. For those, a spec opts in to a named allowance:

```ts
test.use({ allowGuestUserMe401: true, allowTransientApiCorsFailures: true });
```

Each allowance forgives one specific, documented pattern and nothing else. The full list is the
`GuardOptions` type at the top of `e2e-test.ts`.

**`asMember`.** Starts the test signed in as the seeded member (see [Sessions](#sessions)).

**`adminPage` and `adminApi`** (admin-test.ts only). A second browser context signed in to the admin
panel, and read-only admin API helpers built on its cookies.

**The internal-origin header.** When a key is configured, every request to a musticker.com host
carries the firewall exemption header. It is added per request, never context-wide, so the key
can never reach third-party hosts such as analytics.
[tests/e2e/storefront/security/](../tests/e2e/storefront/security) asserts that scoping.

## Environments and URLs

[tests/fixtures/environments.ts](../tests/fixtures/environments.ts) is the only place a server URL
is written down: storefront and API per environment, plus `adminPanelUrls` for the environments
that have an admin panel. [tests/fixtures/env.ts](../tests/fixtures/env.ts) resolves the active
one and provides:

- `appPath('./stickers')`: a storefront path under the locale prefix (`/kr`).
- `apiPath('/sys/kr/…')`: an absolute API URL.
- `adminBaseUrl()`: the admin panel origin, or `undefined`, and admin specs skip on `undefined`.
- `internalOriginKey()`: the production or dev firewall key, whichever matches the environment.
  It never hands the production key to a dev host.

## Page objects

`tests/pom/storefront/` and `tests/pom/admin/`. Conventions:

- One class per page, drawer or dialog, named for what the user sees: `CartDrawer`,
  `AdminItemDrawer`, `AccountOrderDetail`.
- The constructor builds locators. Methods are either **actions** (`addToCart()`,
  `sendFinalProof()`) or **assertions** (`expectOrderConfirmed()`, `expectItemStatus()`), and an
  action waits for its own effect before returning.
- Locator preference: role, then label, then placeholder, then text, then test id. CSS classes are
  the documented last resort. The admin panel has **no** test ids, so its page objects use roles,
  text and a few stable BEM classes, each explained in a comment.
- Storefront navigation goes through `gotoStorefront()` (see [Resilience](#resilience-firewall-hydration-copy-drift)).
  Admin navigation uses `page.goto('/orders/…')` against the admin context's `baseURL`.
- Imports use the `.js` extension even for `.ts` files. The project is ESM (`"type": "module"`).

## Sessions

| Who | How | Where it lives | Lifetime |
| --- | --- | --- | --- |
| Seeded member | `POST /sys/kr/auth/login` from the API, once per worker (`member-auth.ts`) | `.auth/member.json`, for debugging only | One run |
| Admin | A person runs `npm run admin:login` and enters the emailed code (`tests/setup/admin-login.setup.ts`) | `.auth/admin-<environment>.json` | About a week, and ends early if anyone signs in to that panel elsewhere |
| Guest | A mail.tm disposable inbox receives the checkout code (`mail-tm.ts`) | Nothing saved | One test |

Tests that are about sign-in itself (MS-V2-034, 035, 094, 104) use the form. Everything else takes a
session from the table above.

The member login endpoint answers **HTTP 200 with `success: false`** when it refuses a login, so
`member-auth.ts` checks the response body, not the status code. The admin API does the same.

## Storefront to admin

[tests/e2e/admin/orders/order-processing.spec.ts](../tests/e2e/admin/orders/order-processing.spec.ts)
(MS-ADM-001) drives two browser contexts at once: `page` is the customer on the storefront and
`adminPage` is staff in the admin panel. After every hand-off it checks three things: the admin UI,
the customer's UI, and the admin API's per-item activity log.

The order lifecycle it walks is documented in the workbook's **Business Rules** tab. In short:

```
customer uploads design  →  staff evaluate (Failed → customer resubmits → Passed)
  →  staff send final proof  →  customer approves proof
  →  staff: Move to Production → Mark as Printing → Add Tracking → Send → mark delivered
```

Only the header actions move an **order** forward (BP → FP → SP → CP). The finer stage lives on the
**item**, and the activity log reports it as a code (SA, CA, FE, PE, NA, A-FPA, PO, P, RS, OD, DE).
[tests/fixtures/admin-data.ts](../tests/fixtures/admin-data.ts) maps codes to labels.

## Pricing suite

`tests/e2e/storefront/pricing/` checks the pricing API against the price tables staff maintain. Those
tables are committed as CSV under
[tests/fixtures/pricing/](../tests/fixtures/pricing) (see its README):

- **Price table.** Every grid row of every product's CSV matches the API's quote, which is
  2,104 generated tests.
- **Interpolation.** Sizes and quantities between grid rows are priced between their neighbours.
- **Mapping.** Each product is served by the pricing table it should be, and products that share
  a table agree.

Pricing table IDs differ per server, so `pricing-products.ts` holds a registry per environment.
Fractional per-unit prices (`8.582원`) are intended behaviour, confirmed by Korean staff on
2026-08-13. No test asserts whole-won per-unit prices.

## Resilience: firewall, hydration, copy drift

**The firewall.** Production's firewall rate-limits a single IP address under full-suite load and
answers with a bare 403 page for 35 to 90 seconds at a time. `gotoStorefront()` in
[navigation.ts](../tests/fixtures/navigation.ts) retries with growing delays (about 54 seconds
over six attempts) before a test ever asserts on content. The console/HTTP guard forgives exactly
the 403s that were retried past. The internal-origin key, when configured, avoids the problem.

**Hydration.** Nuxt serves fully rendered HTML, and clicks land before Vue has bound its handlers.
[hydration.ts](../tests/fixtures/hydration.ts) waits until a form is actually interactive. It uses
the password visibility toggle as the signal, because Nuxt exposes no hydration flag.

**Copy drift (self-healing locators).** Storefront copy changes without notice: the 2026-09-24
product rename turned 57 tests red without breaking a page. Where a step identifies something by its
text, [self-heal.ts](../tests/fixtures/self-heal.ts) falls back to a stable identifier: the H1 plus
the URL, a card's href slug, or the single cart line matching the configured options. The test
continues and records a `self-healed` annotation.

The [self-heal reporter](../tests/reporters/self-heal-reporter.ts) lists every heal in
`test-results/self-heal-report.md` and the job summary. That list is the to-do: update
`storefront-data.ts`, then confirm with `SELF_HEAL=off`. A heal never accepts something the stable
identifier does not vouch for, such as a 404 page, a different slug, or an ambiguous cart.

## Test data and cleanup

- **Accounts.** Registration and password-rotation tests register real members on a dev server.
  Each one is appended to `.auth/created-accounts.jsonl`
  ([test-data-ledger.ts](../tests/fixtures/test-data-ledger.ts)). The global teardown deletes
  them when `TEST_DATA_USER_DELETE_ENDPOINT` is set, and otherwise keeps the ledger for a later run.
- **Carts.** MS-V2-104 adds to the seeded member's real cart and removes the line again.
- **Orders.** MS-V2-025 creates a dev order. MS-ADM-001 takes one existing dev order to 주문 완료.
  Neither can be undone, which is why both are gated and dev-only.
- **Upload files.** `tests/fixtures/files/`: `sample-design.png` (the customer's design) and
  `qa-proof.png` (a transparent PNG, which the admin proof upload requires).
- **Emails.** Guest flows use mail.tm inboxes. Admin processing emails the seeded member at each
  notification step.

## Known defects in code

A confirmed product defect is recorded **as data with an explanation**, never by weakening an
assertion, so that new occurrences still fail:

- `KNOWN_STOREFRONT_VIOLATIONS` in [axe.ts](../tests/fixtures/axe.ts): accessibility violations
  in the baseline, each with a count tripwire.
- `KNOWN_FALLING_PRICE_INTERVALS` in `price-interpolation.spec.ts`: price intervals where the
  price falls as the size grows.
- Admin defects found on 2026-09-25 are commented where the spec deliberately does not assert
  them, and logged in the workbook's Defect Log.

## Fixture reference

| Module | Provides |
| --- | --- |
| `e2e-test.ts` | The extended `test`: console/HTTP guard, `asMember`, allowances |
| `admin-test.ts` | `test` with `adminPage` and `adminApi` on top |
| `admin-auth.ts` | Admin session path, validity check, skip messages |
| `admin-api.ts` | Read-only admin API: find order, items, activity log, tracking, status polling |
| `admin-data.ts` | Order and item status codes and labels, admin and storefront copy, tracking number format |
| `env.ts`, `environments.ts` | Environment resolution and URL builders |
| `hosts.ts` | Musticker host patterns shared by the guard and the internal-origin scope |
| `internal-origin.ts` | Adds the firewall exemption header to Musticker requests only |
| `navigation.ts` | `gotoStorefront()` with the 403 retry ladder |
| `member-auth.ts` | Seeded member API login |
| `mail-tm.ts` | Disposable inboxes, message polling, OTP extraction |
| `storefront-data.ts` | Korean storefront copy, product fixtures, checkout profile, thresholds |
| `money.ts` | `parseWon` / `formatWon` |
| `sheet-packing.ts` | The A5 sheet layout formula and its boundary cases |
| `self-heal.ts`, `self-heal-annotation.ts` | Copy-drift fallbacks and their annotations |
| `hydration.ts` | Waiting for Nuxt forms to become interactive |
| `resilient-locator.ts` | First matching or visible locator from a list of candidates |
| `axe.ts` | WCAG scan helper and the known-violation baseline |
| `test-data-ledger.ts` | Created-account ledger for the teardown |
| `types.ts` | Shared product and cart-line types |
| `pricing/` | Price tables (CSV), pricing API client, product-to-table registry |
