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
- [Visual baselines](#visual-baselines)

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env        # then fill in what you need; every value is optional
npm run test:e2e:list       # confirms the suite loads: 2,467 desktop tests in 31 files
```

The desktop projects skip `@mobile` tests; `E2E_BROWSER_PROJECT=chromium-mobile` lists the one
mobile test (MS-V2-022). The suite is 2,468 tests in 32 files in total.

On Windows PowerShell, use `npm.cmd` / `npx.cmd` if script execution is restricted.

`.env` is gitignored and loaded automatically. **Check `E2E_ENVIRONMENT` in it before every run.**
It pins which server the tests hit, and a stale value is the most common reason a run lands
somewhere unexpected.

## Commands

**Everyday.** All of these are read-only and safe on production:

| Script | Runs |
| --- | --- |
| `npm run test:prod:smoke` | `@smoke` against production |
| `npm run test:prod:full` | Everything production-safe against production (excludes `@payment @slow @destructive @visual`) |
| `npm run test:prod:auth` | `@auth` against production |
| `npm run test:prod:mobile` | `@mobile` on the Pixel 7 project against production |
| `npm run test:env:smoke` / `:full` / `:auth` / `:mobile` | The same four, against whichever server `E2E_ENVIRONMENT` selects |
| `npm run test:smoke` / `:regression` / `:purchasing` / `:validation` / `:auth` / `:api` / `:a11y` | One tag, against the configured environment |
| `npm run test:pricing` | The price-table suite (2,286 tests, 4 workers). `:prod`, `:dev1` and `:static2` pin a server |
| `npm run test:ci` | What CI runs on every PR: everything except `@slow @destructive @payment @visual` |
| `npm run test:flake` | Smoke tests three times each with no retries, to surface flaky tests |

**Tests that change data.** Dev servers only:

| Script | Runs |
| --- | --- |
| `npm run test:destructive` | Guest checkout (MS-V2-025), registration, password rotation and cart merge |
| `npm run test:destructive:auth` | Only the account-changing tests in `storefront/auth` |
| `npm run admin:login` | Captures an admin panel session (a person enters the code). See [below](#admin-panel-runs) |
| `npm run test:admin:destructive` | Storefront-to-admin order processing (MS-ADM-001) on development-static |

**Other:**

| Script | Does |
| --- | --- |
| `npm run test:e2e:list` | Lists every test without running any |
| `npm run test:e2e:ui` | Playwright UI mode, for stepping through a test |
| `npm run test:e2e:headed` | Runs with a visible browser |
| `npm run test:visual` / `:visual:update` | Screenshot comparisons, or re-capture baselines |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint. Both must pass before a PR |

To run a single test by ID, filter on its title:

```bash
npx playwright test -g "MS-V2-097"
```

## Environments

Musticker runs one production server and several development servers, each with a git branch of
the same name. The keys in [tests/fixtures/environments.ts](../tests/fixtures/environments.ts)
match the branch names exactly.

| `E2E_ENVIRONMENT` | Storefront | API | Admin panel |
| --- | --- | --- | --- |
| `production` | https://www.musticker.com/kr | https://api.musticker.com/index.php | https://admin-panel.musticker.com (read-only for tests) |
| `development-static` | https://dev-static-1.musticker.com/kr | https://dev-static-1-api.musticker.com/index.php | https://dev-static-1-admin-panel.musticker.com |
| `development-static-2` | https://dev-static-2.musticker.com/kr | https://dev-static-2-api.musticker.com/index.php | none known |
| `development-1` | https://dev.musticker.com/kr | https://dev-api.musticker.com/index.php | none known |
| `development-2` | https://dev-2.musticker.com/kr | https://dev-2-api.musticker.com/index.php | none known |
| `development-3` | https://dev-3.musticker.com/kr | https://dev-3-api.musticker.com/index.php | none known |
| `development-4` | https://dev-4.musticker.com/kr | https://dev-4-api.musticker.com/index.php | none known |

Each development server has its **own user database**. The seeded member in `.env` has to exist on
the server you point at.

Precedence: `BASE_URL` / `API_BASE_URL` / `ADMIN_BASE_URL` override `E2E_ENVIRONMENT`, and with
neither set the storefront defaults to production. There is no default admin panel: with none
configured, admin specs skip.

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
| `RUN_PAYMENT_E2E=true` | Enables guest checkout, which creates a real order (MS-V2-025) |
| `RUN_AUTH_DESTRUCTIVE_E2E=true` | Enables registration, password rotation and cart merge (MS-V2-087/088/094/104) |
| `RUN_ADMIN_DESTRUCTIVE_E2E=true` | Enables admin order processing (MS-ADM-001) |
| `ADMIN_E2E_ORDER_NO` | The order MS-ADM-001 processes (see [below](#admin-panel-runs)) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional. Pre-fill the form in `npm run admin:login` |
| `RUN_VISUAL_E2E=true` | Enables screenshot comparisons |
| `SELF_HEAL=off` | Makes renamed copy fail instead of self-healing. See [ARCHITECTURE.md](ARCHITECTURE.md#self-healing-locators) |
| `TEST_DATA_USER_DELETE_ENDPOINT`, `API_TOKEN` | Let the teardown delete members created by tests |
| `PW_BLOB_REPORT=true` | Produces merge-able blob reports. Set by the sharded workflows |

## Tags

Tags select what runs. Every test carries at least one.

| Tag | Meaning |
| --- | --- |
| `@smoke` | The critical storefront paths. Fast; runs on every push |
| `@regression` | Broader coverage; runs nightly |
| `@production` | Explicitly verified safe and valid against production |
| `@purchasing` | Product configuration, cart, and checkout up to (not including) payment |
| `@pricing` | Price-table checks against the pricing API |
| `@auth` | Sign-in, registration, password and account access |
| `@credentialed` | Needs `AUTH_TEST_EMAIL`/`AUTH_TEST_PASSWORD`; skips cleanly without them |
| `@api` | Direct, read-only API contract checks |
| `@validation` | Form validation |
| `@security` | Security properties of the suite and the site (e.g. where secrets may be sent) |
| `@discovery` | Category and catalog browsing |
| `@a11y` | axe-core WCAG 2.1 AA scans |
| `@visual` | Screenshot comparisons; needs `RUN_VISUAL_E2E=true` |
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
inspection. Only the tests about sign-in itself use the form: MS-V2-034, 035, 094 and 104.

**Admin.** See the next section.

## Admin panel runs

Admin sign-in needs a verification code that is emailed to **sales@musticker.com**, and each
account allows **one active session**. So tests never sign in. A person captures a session once,
and it lasts about a week:

```bash
npx cross-env E2E_ENVIRONMENT=development-static npm run admin:login
```

1. A browser window opens on the admin login page. The form is pre-filled when `ADMIN_EMAIL` and
   `ADMIN_PASSWORD` are set; otherwise type them in yourself, with **Keep me signed in** ticked.
2. Enter the verification code from the sales@ inbox.
3. When the dashboard loads, the session is saved to `.auth/admin-development-static.json`.

Signing in to the same admin panel anywhere else ends the saved session. Admin specs then skip
with a message telling you to run `admin:login` again. If the panel shows **Active Session
Detected**, choosing *Logout & Continue* signs the account out everywhere else, including your
own browser.

**MS-ADM-001** takes one order all the way from design upload to 주문 완료. Checkout on
dev-static-1 currently blocks automated browsers with a Cloudflare check before payment, so the
test starts from an order the seeded member already placed:

```bash
npx cross-env ADMIN_E2E_ORDER_NO=AO-2609180004-dev npm run test:admin:destructive
```

The order must belong to `AUTH_TEST_EMAIL`, be fully paid, and have exactly one item at
디자인 파일 미제출. **Each run uses the order up.** The workbook's Test Data tab lists candidates.

The admin browser is never recorded (no screenshots, video or trace), because the panel shows
real customers' details and this repository's CI artifacts are public.

## Reports

| Output | Where | Notes |
| --- | --- | --- |
| HTML report | `playwright-report/` | Open with `npx playwright show-report` |
| JUnit | `test-results/junit.xml` | CI only |
| Allure | `allure-results/` when `ALLURE_RESULTS_DIR` is set | CI publishes it to the Allure report server |
| Self-heal report | `test-results/self-heal-report.md` and the GitHub job summary | Copy that changed and was healed. See [ARCHITECTURE.md](ARCHITECTURE.md#self-healing-locators) |
| Failure artifacts | `test-results/<test>/` | Screenshot, video and trace, except where an internal-origin key is in use or for the admin context |

## CI

| Workflow | Trigger | Runs |
| --- | --- | --- |
| `pr-checks.yml` | Pull request to an environment branch | Lint, typecheck, production smoke |
| `smoke.yml` | Push to an environment branch | `@smoke` against that branch's server |
| `production-full-suite.yml` | Push to `production`, daily 20:00 UTC (05:00 KST), manual | Lint, typecheck, then production-safe tests in 8 shards |
| `nightly-regression.yml` | Daily 18:00 UTC (03:00 KST), manual | `@regression` in 4 shards |
| `visual-regression.yml` | Daily 21:00 UTC (06:00 KST), manual | `@visual` inside the pinned Playwright container |
| `manual-playwright.yml` | Manual | Any suite, environment and browser. Refuses destructive runs against production |
| `deploy-allure-storage.yml` | Manual | Infrastructure for the Allure report server |

The workflows use these secrets: `INTERNAL_ORIGIN_KEY`, `DEV_INTERNAL_ORIGIN_KEY`, `AUTH_TEST_EMAIL`,
`AUTH_TEST_PASSWORD`, `DEV_AUTH_TEST_EMAIL`, `DEV_AUTH_TEST_PASSWORD` and
`ALLURE_SERVICE_ACCESS_TOKEN`. Production runs use the `AUTH_TEST_*` pair and dev runs use
`DEV_AUTH_TEST_*`.

Admin specs do not run in CI yet. That waits on a way to get the verification code without a person.

**Sharding.** The production and nightly suites are split across runners, and a merge job
recombines the reports. Against production, `production-full-suite.yml` uses `PW_WORKERS=1` with
twice the shards. Production's firewall rate-limits per IP address, so eight runners with one
browser each stay under its limit where four runners with two browsers each would not.

## Visual baselines

Committed baselines are named per platform (`*-win32.png`). `visual-regression.yml` renders inside
the pinned `mcr.microsoft.com/playwright` container, so comparisons in CI need `*-linux.png`
baselines. To create them:

1. Dispatch `visual-regression.yml` with **update_baselines = true**.
2. Download the `visual-baselines-linux` artifact.
3. Commit the `*-linux.png` files next to the win32 ones in
   `tests/e2e/storefront/regression/visual.spec.ts-snapshots/`.

Baselines never update themselves. Anything that changes on its own is kept out of the screenshots
instead: [visual-volatile.css](../tests/e2e/storefront/regression/visual-volatile.css) hides
announcement bars and chat buttons, review carousels are masked, and the spec waits for lazy
content before capturing. A diff that remains is a real change.
