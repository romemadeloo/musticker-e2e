# Musticker Storefront E2E v2

Playwright TypeScript tests for the Musticker storefront v2 suite described in `test-case.md`.

The default target is production-safe:

```powershell
npm.cmd install
npx.cmd playwright install chromium
npm.cmd run test:e2e:list
```

## Commands

```powershell
npm.cmd run test:e2e
npm.cmd run test:e2e:list
npm.cmd run test:prod:smoke
npm.cmd run test:prod:full
npm.cmd run test:prod:mobile
npm.cmd run test:env:smoke
npm.cmd run test:env:full
npm.cmd run test:env:mobile
npm.cmd run test:smoke
npm.cmd run test:regression
npm.cmd run test:purchasing
npm.cmd run test:validation
npm.cmd run test:visual
npm.cmd run test:visual:update
npm.cmd run test:a11y
npm.cmd run test:flake
npm.cmd run test:api
npm.cmd run test:ci
npm.cmd run typecheck
npm.cmd run lint
```

## Environments

musticker runs one production server and 5 development/staging servers, each with its own git branch of the same name. Branch names match the keys in `tests/fixtures/environments.ts` exactly.

| Environment | Branch | Storefront (`BASE_URL`) | API (`API_BASE_URL`) |
| --- | --- | --- | --- |
| Production | `production` | `https://www.musticker.com/kr` | `https://api.musticker.com/index.php` |
| Static/QA | `development-static` | `https://dev-static-1.musticker.com/kr` | `https://dev-static-1-api.musticker.com/index.php` |
| Dev 1 | `development-1` | `https://dev.musticker.com/kr` | `https://dev-api.musticker.com/index.php` |
| Dev 2 | `development-2` | `https://dev-2.musticker.com/kr` | `https://dev-2-api.musticker.com/index.php` |
| Dev 3 | `development-3` | `https://dev-3.musticker.com/kr` | `https://dev-3-api.musticker.com/index.php` |
| Dev 4 | `development-4` | `https://dev-4.musticker.com/kr` | `https://dev-4-api.musticker.com/index.php` |

`smoke.yml` and `pr-checks.yml` pick the environment automatically from the branch name (`E2E_ENVIRONMENT: ${{ github.ref_name }}`) — no per-branch conditionals needed. `manual-playwright.yml` exposes the same 6 as a workflow-dispatch dropdown.

Locally, either:

```powershell
$Env:E2E_ENVIRONMENT = "development-2"
npm.cmd run test:env:smoke
```

or set `BASE_URL`/`API_BASE_URL` directly (these always take precedence over `E2E_ENVIRONMENT`). `npm run test:prod:*` remains a production-only shortcut.

> `development-1`'s frontend host (`dev.musticker.com`) did not resolve during setup on 2026-08-11, while its API host (`dev-api.musticker.com`) responded correctly. Confirm that hostname before relying on `development-1` storefront (non-API) tests.

## Environment Variables

- `E2E_ENVIRONMENT`: selects a named environment from `tests/fixtures/environments.ts` (see table above). Ignored for any URL that `BASE_URL`/`API_BASE_URL` already sets explicitly.
- `BASE_URL`: storefront URL override. Defaults to `https://www.musticker.com/kr` if neither this nor `E2E_ENVIRONMENT` is set.
- `API_BASE_URL`: API origin/path override for direct API checks. Falls back to `E2E_ENVIRONMENT`'s API URL, then to a `BASE_URL`-derived guess (only correct for hostnames starting with `dev.`).
- `E2E_BROWSER_PROJECT`: `chromium-desktop`, `firefox-desktop`, `webkit-desktop`, `chromium-mobile`, or `all-desktop`.
- `RUN_VISUAL_E2E=true`: enables visual snapshot tests. See [Visual baselines](#visual-baselines).
- `SELF_HEAL=off`: turns off copy self-healing, so a renamed product fails instead of being healed.
  Use it to confirm a fixture update is complete. See [Self-healing locators](#self-healing-locators).
- `RUN_PAYMENT_E2E=true`: enables the destructive checkout test (`MS-V2-025`). Dev environments only.
- `RUN_AUTH_DESTRUCTIVE_E2E=true`: enables the tests that create or mutate real member state --
  registration OTP completion (`MS-V2-087`/`088`), the password rotation (`MS-V2-094`), and the
  guest-to-member cart merge (`MS-V2-104`). Dev environments only; `manual-playwright.yml` refuses to
  run them against production.
- `AUTH_TEST_EMAIL` / `AUTH_TEST_PASSWORD`: seeded member for the `@credentialed` tests. Must exist on
  the environment under test -- each `development-*` server has its own user database. Unset means
  those tests skip, not fail.
- `TEST_DATA_USER_DELETE_ENDPOINT` (+ optional `API_TOKEN`): lets the global teardown delete the
  throwaway members the destructive auth tests register. See [Test data](#test-data).
- `PW_BLOB_REPORT=true`: swaps the HTML/JUnit reporters for a merge-able `blob` report. Set by the
  sharded workflows; you rarely want it locally.

## Test Categories

- `@smoke`: v2 critical public storefront checks.
- `@regression`: v2 category, FAQ, accessibility, and broader storefront checks.
- `@production`: production-safe tests.
- `@mobile`: mobile-only critical path.
- `@purchasing`: production-safe product configuration checks.
- `@validation`: inquiry validation/contract checks.
- `@api`: production-safe read-only API contract checks.
- `@visual`: gated screenshot comparisons.
- `@a11y`: axe-core WCAG 2.1 AA scans.
- `@credentialed`: needs `AUTH_TEST_EMAIL`/`AUTH_TEST_PASSWORD`; skips cleanly without them.
- `@destructive`: creates or mutates real data. Gated behind `RUN_PAYMENT_E2E` or
  `RUN_AUTH_DESTRUCTIVE_E2E`, and excluded from every scheduled production run.

## Structure

- `tests/e2e`: v2 specs only.
- `tests/pom`: v2 page objects plus shared header/search/cart helpers.
- `tests/fixtures`: v2 test data, environment helpers, and guarded Playwright fixture.
- `tests/setup`: the global teardown that cleans up test-created accounts.
- `test-case.md`: source test-case matrix.

## Signing in

Tests that need a member session but are not *about* signing in take one from the API instead of
driving the login form:

```ts
test.use({ asMember: true });
test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);
```

`POST /sys/kr/auth/login` returns a `*_customer_token` cookie scoped to `.musticker.com`, so the same
session works on the storefront host. It is fetched at most once per worker
([tests/fixtures/member-auth.ts](tests/fixtures/member-auth.ts)) and parked at `.auth/member.json`
for inspection — that file holds a live session and is gitignored.

This replaced a UI login in `beforeEach`, which cost roughly 15s per test and made every credentialed
test fail whenever the login form's hydration race bit. `MS-V2-034`, `MS-V2-035`, `MS-V2-094` and
`MS-V2-104` still go through the form, because the form is what they are testing.

With no credentials configured, `asMember` silently yields an anonymous context — so a spec that
assumes a member session must skip itself, as above.

## Test data

`MS-V2-088` and `MS-V2-094` register real members through a live emailed OTP, and `MS-V2-104` adds a
line to the seeded member's cart. Each cleans up after itself as far as it can, and the accounts are
recorded in `.auth/created-accounts.jsonl` so the run's global teardown
([tests/setup/global-teardown.ts](tests/setup/global-teardown.ts)) can delete them:

- With `TEST_DATA_USER_DELETE_ENDPOINT` set, the teardown issues
  `DELETE <endpoint>/<url-encoded email>` for each, sending `API_TOKEN` as a bearer token if present.
- Without it, the teardown prints what it could not delete and leaves the ledger intact, so a later
  configured run still clears the backlog.

It is a `globalTeardown` rather than a teardown *project* because every npm script here selects tests
with `--grep`, and a project's tests are grep-filtered like any others — a teardown project would
quietly not run for `--grep @destructive`.

## Visual baselines

Snapshot names include the platform, and the committed baselines are `*-win32.png`, captured on a
maintainer's Windows machine. An Ubuntu runner cannot use them, which is why `@visual` never ran in
CI.

[`visual-regression.yml`](.github/workflows/visual-regression.yml) runs the scan inside the pinned
`mcr.microsoft.com/playwright` container so rendering is reproducible, and fails the run if that
container's version has drifted from the installed `@playwright/test`. To switch comparison on:

1. Dispatch the workflow with **update_baselines = true**.
2. Download the `visual-baselines-linux` artifact.
3. Commit the `*-linux.png` files alongside the existing win32 ones.

Until then the scheduled run fails with `snapshot doesn't exist`, which is the honest outcome —
accepting whatever a run captured would report coverage that cannot detect anything.

Baselines never update themselves. What changes on its own is kept out of the pixels instead:
[`visual-volatile.css`](tests/e2e/regression/visual-volatile.css) hides time-boxed announcement bars
and the floating chat buttons, the review carousels are masked, and the spec scrolls the page and
waits for lazy sections, reviews, fonts, and images before capturing. A diff that remains is a real
change: review it in the Playwright report, then recapture with the steps above.

## Self-healing locators

Storefront copy changes without notice; the 2026-09-24 product rename turned 57 nightly tests red in
one run without breaking a single page. Where a step identifies a product page, category card, nav
link, or cart line by its text, [`self-heal.ts`](tests/fixtures/self-heal.ts) falls back to a stable
identifier when that text is gone — the page's H1 (still gated on the product options panel), the
card's href slug, the nav link's href, or the only cart line with the configured size, quantity, and
price. The test keeps running and records the drift.

Every heal is listed at the end of the run, in `test-results/self-heal-report.md`, and in the GitHub
job summary, together with the text the storefront now shows. That list is the to-do: update
[`storefront-data.ts`](tests/fixtures/storefront-data.ts), then confirm with `SELF_HEAL=off`.

A heal never accepts something the stable identifier does not vouch for: a 404, a card with a
different slug, or a cart with more than one candidate line still fails.

## Sharding

`nightly-regression.yml` and `production-full-suite.yml` split the suite across shards (8 by default
for production, 4 for the nightly run; both selectable on dispatch). Each shard sets
`PW_BLOB_REPORT=true` and uploads its `blob-report` plus its `allure-results`; a merge job
([`.github/actions/merge-shard-reports`](.github/actions/merge-shard-reports)) recombines them into
the single HTML/JUnit/Allure artifact the publish step expects.

Unsharded, the nightly job pushed over 2,000 tests through two workers inside one 90-minute budget,
so a slow night timed out instead of reporting.

How the same concurrency is spread matters against production. Its WAF rate-limits per egress IP and
a runner has exactly one, so `production-full-suite.yml` sets `PW_WORKERS=1` and doubles the shard
count instead: eight runners driving one browser each produce half the per-IP request rate of four
runners driving two, for the same eight browsers and the same wall clock. `PW_WORKERS` overrides
`workers` in `playwright.config.ts` for any run; unset, CI keeps two and a local run keeps one.
