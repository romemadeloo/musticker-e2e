# Running the suite

- [Setup](#setup)
- [Commands](#commands)
- [Environments](#environments)
- [Environment variables](#environment-variables)
- [Tags](#tags)
- [Signing in](#signing-in)
- [Admin panel runs](#admin-panel-runs)
- [Reports](#reports)
- [CI](#ci)

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env        # then fill in what you need; every value is optional
npm run test:e2e:list       # confirms the suite loads: 2,467 desktop tests in 31 files
```

The desktop projects skip `@mobile` tests; `E2E_BROWSER_PROJECT=chromium-mobile` lists the one
mobile test (MS-NAV-008). The suite is 2,468 tests in 32 files in total.

On Windows PowerShell, use `npm.cmd` / `npx.cmd` if script execution is restricted.

`.env` is gitignored and loaded automatically. **Check `E2E_ENVIRONMENT` in it before every run.**
It pins which server the tests hit, and a stale value is the most common reason a run lands
somewhere unexpected.

## Commands

**Everyday.** All of these are read-only and safe on production:

| Script | Runs |
| --- | --- |
| `npm run test:prod:smoke` | `@smoke` against production |
| `npm run test:api` | Eight browser-free API contracts and authorization/auth-validation checks against the selected environment |
| `npm run test:ui:smoke` | Five `@critical` UI scenarios; excludes API, payment, destructive and slow tests |
| `npm run test:ui:full` | All production-safe UI checks, including accessibility; API tests run separately |
| `npm run test:ui:regression` | Production-safe `@regression` UI selection, excluding API tests |
| `npm run test:prod:full` | Everything production-safe against production (excludes `@payment @slow @destructive`) |
| `npm run test:prod:auth` | `@auth` against production |
| `npm run test:prod:mobile` | `@mobile` on the Pixel 7 project against production |
| `npm run test:env:smoke` / `:full` / `:auth` / `:mobile` | The same four, against whichever server `E2E_ENVIRONMENT` selects |
| `npm run test:smoke` / `:regression` / `:purchasing` / `:validation` / `:auth` / `:api` / `:a11y` | One tag, against the configured environment |
| `npm run test:ci` | What CI runs on every PR: everything except `@slow @destructive @payment` |
| `npm run test:flake` | Smoke tests three times each with no retries, to surface flaky tests |

**Tests that change data.** Dev servers only:

| Script | Runs |
| --- | --- |
| `npm run test:destructive` | Guest checkout (MS-CHK-001), registration, password rotation and cart merge |
| `npm run test:destructive:auth` | Only the account-changing tests in `storefront/auth` |
| `npm run admin:login` | Captures an admin panel session (a person enters the code). See [below](#admin-panel-runs) |
| `npm run test:admin:destructive` | Storefront-to-admin order processing (MS-ADMO-001) on dev-1 |
| `npm run test:e2e:dev` | Five destructive storefront sandbox/email journeys, one worker, no retries; requires preflight configuration below |

**Other:**

| Script | Does |
| --- | --- |
| `npm run test:e2e:list` | Lists every test without running any |
| `npm run test:e2e:ui` | Playwright UI mode, for stepping through a test |
| `npm run test:e2e:headed` | Runs with a visible browser |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint. Both must pass before a PR |

To run a single test by ID, filter on its title:

```bash
npx playwright test -g "MS-CHK-004"
```

## Environments

Musticker runs production and six Dev-Shared environments in **ap-northeast-2**.
The `dev-1` through `dev-6` selectors and CI branch names map to Dev-Shared #1–#6.
The registry is [tests/fixtures/environments.ts](../tests/fixtures/environments.ts).
Dev-Shared #1 uses hostnames without a numeric suffix; #2–#6 use `-2` through `-6`.

| `E2E_ENVIRONMENT` | Storefront | API | Admin panel |
| --- | --- | --- | --- |
| `production` | https://www.musticker.com/kr | https://api.musticker.com/index.php | https://admin-panel.musticker.com (read-only for tests) |
| `dev-1` | https://shared-dev-static-sf.musticker.com/kr | https://shared-dev-static-api.musticker.com/index.php | https://shared-dev-static-admin.musticker.com (the only panel order-changing specs may use) |
| `dev-2` | https://shared-dev-static-sf-2.musticker.com/kr | https://shared-dev-static-api-2.musticker.com/index.php | https://shared-dev-static-admin-2.musticker.com |
| `dev-3` | https://shared-dev-static-sf-3.musticker.com/kr | https://shared-dev-static-api-3.musticker.com/index.php | https://shared-dev-static-admin-3.musticker.com |
| `dev-4` | https://shared-dev-static-sf-4.musticker.com/kr | https://shared-dev-static-api-4.musticker.com/index.php | https://shared-dev-static-admin-4.musticker.com |
| `dev-5` | https://shared-dev-static-sf-5.musticker.com/kr | https://shared-dev-static-api-5.musticker.com/index.php | https://shared-dev-static-admin-5.musticker.com |
| `dev-6` | https://shared-dev-static-sf-6.musticker.com/kr | https://shared-dev-static-api-6.musticker.com/index.php | https://shared-dev-static-admin-6.musticker.com |

Deployment names and environment IDs supplied for these targets:

| Dev-Shared | Storefront environment | Admin environment | API environment |
| --- | --- | --- | --- |
| #1 | `2026-Dev-MS-Static-SF-Shared` (`e-p4bhe3vgnm`) | `2026-Dev-MS-Static-Admin-Shared` (`e-snbpzaztmv`) | `2026-Dev-MS-Static-API-Shared` (`e-nzxwymb2ra`) |
| #2 | `2026-Dev-MS-Static-SF-Shared-2` (`e-na3vxsrz75`) | `2026-Dev-MS-Static-Admin-Shared-2` (`e-qawj3nszgw`) | `2026-Dev-MS-Static-API-Shared-2` (`e-cjmi2jzemh`) |
| #3 | `2026-Dev-MS-Static-SF-Shared-3` (`e-3h2d7ch7bx`) | `2026-Dev-MS-Static-Admin-Shared-3` (`e-i94kznagda`) | `2026-Dev-MS-Static-API-Shared-3` (`e-snq2m53h5b`) |
| #4 | `2026-Dev-MS-Static-SF-Shared-4` (`e-pwggn53jur`) | `2026-Dev-MS-Static-Admin-Shared-4` (`e-surqyjqjtw`) | `2026-Dev-MS-Static-API-Shared-4` (`e-bv5pz4iemk`) |
| #5 | `2026-Dev-MS-Static-SF-Shared-5` (`e-cbesb7mfmb`) | `2026-Dev-MS-Static-Admin-Shared-5` (`e-k3mhsjmzi6`) | `2026-Dev-MS-Static-API-Shared-5` (`e-8vixqvsnqm`) |
| #6 | `2026-Dev-MS-Static-SF-Shared-6` (`e-yhvepjx8c2`) | `2026-Dev-MS-Static-Admin-Shared-6` (`e-piipkcrtg5`) | `2026-Dev-MS-Static-API-Shared-6` (`e-x35abgdrpv`) |

The test URLs retain `/kr` for storefront routes and `/index.php` for API routes.

Each development server has its **own user database**. The seeded member in `.env` has to exist on
the server you point at.

Set `E2E_ENVIRONMENT` or `BASE_URL` explicitly; there is no implicit production
target. URL overrides must agree with a named environment and with each other.
Known environments resolve storefront/API/admin together. Unknown dev/custom
hosts need explicit API/admin URLs when those apps are used. Conflicting stale
`.env` values fail before execution. See [promotion validation](PROMOTION.md) for
strict dev-only qualification and run-scoped cleanup.

## Environment variables

All of them are documented, with examples, in [.env.example](../.env.example).

| Variable | Purpose |
| --- | --- |
| `E2E_ENVIRONMENT` | Selects a server from the table above |
| `BASE_URL`, `API_BASE_URL`, `ADMIN_BASE_URL` | Per-URL overrides |
| `E2E_BROWSER_PROJECT` | `chromium-desktop` (default), `firefox-desktop`, `webkit-desktop`, `chromium-mobile`, or `all-desktop` |
| `PW_WORKERS` | Worker count override. Defaults: 1 locally, 2 in CI |
| `AUTH_TEST_EMAIL`, `AUTH_TEST_PASSWORD` | Seeded member for `@credentialed` tests. Unset means those tests skip |
| `INTERNAL_ORIGIN_KEY`, `DEV_INTERNAL_ORIGIN_KEY` | Firewall exemption keys (production / dev). Unset means the tests fall back to retrying 403s |
| `RUN_PAYMENT_E2E=true` | Enables guest checkout, which creates a real order (MS-CHK-001) |
| `RUN_AUTH_DESTRUCTIVE_E2E=true` | Enables registration, password rotation and cart merge (MS-AUTH-020/MS-AUTH-021/MS-AUTH-027/MS-CRT-005) |
| `RUN_ADMIN_DESTRUCTIVE_E2E=true` | Enables admin order processing (MS-ADMO-001) |
| `ADMIN_E2E_ORDER_NO` | The order MS-ADMO-001 processes (see [below](#admin-panel-runs)) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional. Pre-fill the form in `npm run admin:login` |
| `SELF_HEAL=off` | Makes renamed copy fail instead of self-healing. See [ARCHITECTURE.md](ARCHITECTURE.md#self-healing-locators) |
| `TEST_DATA_USER_DELETE_ENDPOINT`, `API_TOKEN` | Let the teardown delete members created by tests |
| `PW_BLOB_REPORT=true` | Produces merge-able blob reports. Set by the sharded workflows |

## Tags

Tags select what runs. Every test carries at least one.

| Tag | Meaning |
| --- | --- |
| `@smoke` | The critical storefront paths. Fast; runs on every push |
| `@regression` | Broader coverage; runs in the production full suite |
| `@production` | Explicitly verified safe and valid against production |
| `@purchasing` | Product configuration, cart, and checkout up to (not including) payment |
| `@auth` | Sign-in, registration, password and account access |
| `@credentialed` | Needs `AUTH_TEST_EMAIL`/`AUTH_TEST_PASSWORD`; skips cleanly without them |
| `@api` | Direct, read-only API contract checks |
| `@validation` | Form validation |
| `@security` | Security properties of the suite and the site (e.g. where secrets may be sent) |
| `@discovery` | Category and catalog browsing |
| `@a11y` | axe-core WCAG 2.1 AA scans |
| `@mobile` | Mobile-only; runs only on the `chromium-mobile` project |
| `@admin` | Drives the admin panel; needs a saved admin session |
| `@e2e` | Crosses the whole flow (order placement, storefront to admin) |
| `@destructive` | Creates or changes real data. Gated, and never run against production |
| `@payment` | Completes a (sandbox) payment |
| `@slow` | Takes minutes, not seconds |

## Signing in

**Members.** Tests that need a signed-in customer, but aren't testing sign-in itself, get a
session from the API instead of filling in the login form:

```ts
test.use({ asMember: true });
test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);
```

The session is fetched once per worker and parked at `.auth/member.json` (gitignored) for
inspection. Only the tests about sign-in itself use the form: MS-AUTH-009, MS-AUTH-010, MS-AUTH-027 and MS-CRT-005.

**Admin.** See the next section.

## Admin panel runs

Admin sign-in needs a verification code that is emailed to **sales@musticker.com**, and each
account allows **one active session**. So tests never sign in. A person captures a session once,
and it lasts about a week:

```bash
npx cross-env E2E_ENVIRONMENT=dev-1 npm run admin:login
```

1. A browser window opens on the admin login page. The form is pre-filled when `ADMIN_EMAIL` and
   `ADMIN_PASSWORD` are set; otherwise type them in yourself, with **Keep me signed in** ticked.
2. Enter the verification code from the sales@ inbox.
3. When the dashboard loads, the session is saved to `.auth/admin-dev-1.json`.

Signing in to the same admin panel anywhere else ends the saved session. Admin specs then skip
with a message telling you to run `admin:login` again. If the panel shows **Active Session
Detected**, choosing *Logout & Continue* signs the account out everywhere else, including your
own browser.

**MS-ADMO-001** takes one order all the way from design upload to order completion.
The test starts from a paid order the seeded member already placed:

```bash
npx cross-env ADMIN_E2E_ORDER_NO=AO-2609070006-dev npm run test:admin:destructive
```

The order must belong to `AUTH_TEST_EMAIL`, be fully paid, and have exactly one item at
디자인 파일 미제출. **Each run uses the order up**, so swap in an unused one from the workbook's Test
Data tab.

The admin browser is never recorded (no screenshots, video or trace), because the panel shows
real customers' details and this repository's CI artifacts are public. Playwright's failure
screenshots and traces cover every open page, not just the customer's, so an admin spec turns
both off with a top-level `test.use({ screenshot: 'off', trace: 'off' })`, and the `adminPage`
fixture refuses to start without it.

## Reports

| Output | Where | Notes |
| --- | --- | --- |
| HTML report | `playwright-report/` | Open with `npx playwright show-report` |
| JUnit | `test-results/junit.xml` | CI only |
| Allure | `allure-results/` when `ALLURE_RESULTS_DIR` is set | CI publishes it to the Allure report server |
| Self-heal report | `test-results/self-heal-report.md` and the GitHub job summary | Copy that changed and was healed. See [ARCHITECTURE.md](ARCHITECTURE.md#self-healing-locators) |
| QA Control Center summary | `qacc-summary` artifact (`qacc-summary.json`) | CI only: totals and failed or flaky test titles, written by `scripts/ci/qacc-summary.mjs` from `allure-results/`. The QA Control Center website reads it to show pass/fail counts and failed TC IDs |
| Failure artifacts | `test-results/<test>/` | Screenshot, video and trace, except where an internal-origin key is in use or for the admin context |

## CI

| Workflow | Trigger | Runs |
| --- | --- | --- |
| `pr-checks.yml` | Pull request to an environment branch | Parallel API and quality/critical-UI jobs, separate promotion/affected regression, then aggregate `PR gate` |
| `smoke.yml` | Branch push, manual, or `storefront-deployed` repository dispatch | API contracts followed by five critical UI checks on the selected target |
| `production-full-suite.yml` | Daily 20:00 UTC (04:00 Manila / 05:00 KST), manual | Browser-free API stage followed by production-safe UI in 8 shards; no full run on each push |
| `release-checks.yml` | Manual, dev-1 through dev-6 | API checks, Chromium/Firefox/WebKit/mobile UI and accessibility, then optional sandbox E2E |
| `manual-playwright.yml` | Manual | Safe functional/API suites, environment and browser; destructive tests excluded from all selections |
| `deploy-allure-storage.yml` | Manual | Infrastructure for the Allure report server |

The workflows use these secrets: `INTERNAL_ORIGIN_KEY`, `DEV_INTERNAL_ORIGIN_KEY`, `AUTH_TEST_EMAIL`,
`AUTH_TEST_PASSWORD`, `DEV_AUTH_TEST_EMAIL`, `DEV_AUTH_TEST_PASSWORD` and
`ALLURE_SERVICE_ACCESS_TOKEN`. Production runs use the `AUTH_TEST_*` pair and dev runs use
`DEV_AUTH_TEST_*`.

Admin specs do not run in CI yet. That waits on a way to get the verification code without a person.

**Required PR check.** Configure the repository ruleset/branch protection to require `PR gate`.
It fails if quality/UI, API, or promotion validation fails, is cancelled, or is skipped. The local
workflow files do not change GitHub repository protection settings. The existing reviewed
promotion-manifest requirement remains in effect for test/POM/fixture changes.

**After deployment.** A push in this test repository does not prove the application was deployed.
Have the application deployment pipeline send a GitHub repository-dispatch event to this repository
after a successful deployment, or dispatch `smoke.yml` manually. The event body is:

```json
{"event_type":"storefront-deployed","client_payload":{"environment":"production"}}
```

Use `dev-1` through `dev-6` to verify a dev deployment. Unknown targets are rejected.

**Controlled E2E.** `release-checks.yml` defaults `run_e2e` to false. Enabling it requires:

- A confirmed sandbox target, with the environment/repository variable `DEV_PAYMENT_SANDBOX_ENABLED=true`.
- Seeded `DEV_AUTH_TEST_EMAIL` and `DEV_AUTH_TEST_PASSWORD` secrets.
- `PROMOTION_USER_DELETE_ENDPOINT` pointing to the selected dev API's account-cleanup endpoint.
- `TEST_DATA_API_TOKEN` if that cleanup endpoint requires authorization.

The dedicated E2E config refuses production, unknown/mixed targets, missing credentials, disabled
flags, or an invalid cleanup origin before running tests. Cleanup failures fail this tier and retain
the run ledger. Admin order-processing is excluded. The generic manual workflow no longer exposes
destructive toggles; use the controlled release workflow for these journeys. Run the same tier locally by setting
`E2E_ENVIRONMENT=dev-1`, `RUN_PAYMENT_E2E=true`, `RUN_AUTH_DESTRUCTIVE_E2E=true`,
`DEV_PAYMENT_SANDBOX_ENABLED=true`, credentials, and `TEST_DATA_USER_DELETE_ENDPOINT` before
`npm run test:e2e:dev`. Do not point the sandbox flag at a live payment provider.

**Coverage boundaries.** API tests exercise backend contracts directly; UI tests retain client-side
validation, navigation and rendering assertions. Axe scans detect new issues against the existing
known-violation baseline; they do not certify full WCAG compliance. Keyboard/screen-reader review
remains part of release QA. Visual and exhaustive pricing suites remain removed.

**Sharding.** The production suite is split across runners, and a merge job
recombines the reports. Against production, `production-full-suite.yml` uses `PW_WORKERS=1` with
twice the shards. Production's firewall rate-limits per IP address, so eight runners with one
browser each stay under its limit where four runners with two browsers each would not.
