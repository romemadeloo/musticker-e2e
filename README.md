# Musticker E2E Suite

End-to-end tests for Musticker (머스티커), in Playwright and TypeScript. One suite covers both
applications and the journeys between them:

- **Storefront** (`www.musticker.com/kr`): browsing, product configuration, pricing, cart, checkout,
  sign-in, and the customer's order history.
- **Admin panel** (`admin-panel.musticker.com`): order processing, from design review and proofs
  through production and shipping.

The test cases themselves (what each test checks, its steps and expected results, and the columns
for recording manual runs) are in the workbook [docs/test-cases.xlsx](docs/test-cases.xlsx).

The code lives in AWS CodeCommit, in the `Musticker_Tester` repository (region ap-northeast-2).

| If you want to… | Read |
| --- | --- |
| Run the tests | [docs/RUNNING.md](docs/RUNNING.md): setup, commands, environments, variables |
| See what is covered, or run cases by hand | [docs/test-cases.xlsx](docs/test-cases.xlsx) |
| Understand how the suite is built | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): fixtures, page objects, sign-in, safety guards |
| Write or change a test | [docs/CONVENTIONS.md](docs/CONVENTIONS.md): IDs, tags, locators, data rules, review checklist |

## 1. Before you start

You need:

- **Node.js 22** and **Git**.
- **VS Code** (recommended), with the Playwright Test extension.
- **CodeCommit HTTPS Git credentials**: a username and password made in the AWS console under
  IAM → Security credentials → HTTPS Git credentials for AWS CodeCommit. Ask the QA lead if you
  don't have AWS access.
- **Your branch and test server**, assigned by the QA lead (see [Branches and servers](#3-branches-and-servers)).

## 2. Set up your machine

Run these in a terminal (PowerShell on Windows). The first clone asks for your CodeCommit Git
credentials; Windows remembers them afterwards.

```bash
git clone https://git-codecommit.ap-northeast-2.amazonaws.com/v1/repos/Musticker_Tester
cd Musticker_Tester
git checkout dev-2                 # your own branch: dev-1 … dev-6
npm install
npx playwright install chromium
cp .env.example .env               # PowerShell: Copy-Item .env.example .env
```

Open `.env` and set at least:

| Variable | What it does |
| --- | --- |
| `E2E_ENVIRONMENT` | Which server to test: `dev-1` … `dev-6`, `qa`, or `production`. Use your own server |
| `AUTH_TEST_EMAIL` / `AUTH_TEST_PASSWORD` | A test member on that server. Empty = sign-in tests are skipped |
| `DEV_INTERNAL_ORIGIN_KEY` | Pass through the dev firewall. Empty = slower runs |
| `HEADED` | `true` shows the browser while tests run |

Every variable is explained in `.env.example`. Ask the QA lead for secret values. `.env` is
never committed.

Check the install:

```bash
npm run test:e2e:list      # lists every test without opening a browser
```

If that prints a list of tests, you're ready. If it errors, the install or `.env` is wrong.

## 3. Branches and servers

Each tester works on the branch that matches their test server. The branch name is the same as the
`E2E_ENVIRONMENT` value.

| Branch | Test server | Storefront |
| --- | --- | --- |
| `production` | Production | `www.musticker.com/kr` (read-only tests only) |
| `dev-1` | Dev-Shared #1 | `shared-dev-static-sf.musticker.com/kr` |
| `dev-2` … `dev-6` | Dev-Shared #2 … #6 | `shared-dev-static-sf-N.musticker.com/kr` |

- Code on **your** branch only, and never push to someone else's.
- `production` is the shared, trusted suite. Changes reach it only with the QA lead's OK
  (see [Getting your work into production](#7-getting-your-work-into-production)).
- Each dev server has its own user database, so your test member must exist on your server.
- All server URLs are in `tests/fixtures/environments.ts`; the full table is in
  [docs/RUNNING.md](docs/RUNNING.md).

## 4. Run tests

| What | Command |
| --- | --- |
| UI mode: pick tests, watch them, step through (best for learning and debugging) | `npm run test:e2e:ui` |
| One test by case ID | `npx playwright test -g "MS-CRT-001"` |
| One spec file | `npx playwright test tests/e2e/storefront/cart/cart-lifecycle.spec.ts` |
| With the browser visible | `npm run test:e2e:headed` |
| Smoke tests | `npm run test:smoke` |
| Regression tests | `npm run test:regression` |
| Production smoke (read-only) | `npm run test:prod:smoke` |
| Framework checks (no server needed) | `npm run test:framework` |

**Your first run:** start `npm run test:e2e:ui`, type `MS-NAV-001` in the filter box, and press ▶.
It only opens the homepage, so it is safe on any server. Green tick = passed; red cross = failed,
click it to see the error and a screenshot.

**When a test fails**, open the report:

```bash
npx playwright show-report
```

It shows the failing step, a screenshot, and a trace you can replay step by step.

Tests run against whatever `E2E_ENVIRONMENT` says in `.env`. To try another server once without
editing `.env`, set it for one command, e.g. in PowerShell:
`$env:E2E_ENVIRONMENT="dev-3"; npx playwright test -g "MS-NAV-001"`.

## 5. How the suite is built

```
spec (tests/e2e/…)         the test: steps and checks, named by case ID
  → fixtures               ready-made setup: browser tab, error guard, optional sign-in
  → page objects (tests/pom)   ready-made actions for one page: selectSize(), addToCart()
  → data (fixtures/*-data.ts)  product paths, button text, expected copy
```

- **Page objects (POM)**: one class per page, drawer or dialog. Tests call its methods instead of
  finding buttons themselves, so when the site changes you fix one place.
- **Fixtures**: every spec imports `test` from `tests/fixtures/e2e-test.ts` (or `admin-test.ts`),
  not from Playwright directly. That gives you:
  - `page`: a browser tab with an **error guard**. A test fails on any console error or HTTP error
    from Musticker, even if its checks pass. Expected errors are allowed by name, e.g.
    `test.use({ allowGuestUserMe401: true })`.
  - `test.use({ asMember: true })`: start the test already signed in as the `.env` test member.
  - `adminPage`: a second browser in the admin panel (`admin-test.ts`).

### Layout

```
tests/
  e2e/
    storefront/          customer-facing specs, one folder per workbook module (Area)
      navigation/  discovery/  configuration/  sheet-size-rules/  cart/  checkout/
      auth/  account/  inquiry/  api/  ux/  security/
    admin/               admin panel specs
      orders/            storefront-to-admin order processing
  pom/
    storefront/          page objects for storefront pages, drawers and dialogs
    admin/               page objects for admin panel pages and drawers
  fixtures/              the extended `test`, environments, sign-in, API helpers, test data
    files/               upload fixtures (design file, proof image)
  reporters/             self-heal report
  setup/                 global teardown, and the admin session capture (npm run admin:login)
docs/                    documentation and the test case workbook
playwright.config.ts     Playwright settings
.env.example             template for your .env
```

The folders mirror the workbook: **Area** = folder, **Sub-Area** = spec file, **case ID + title**
= test title.

## 6. Write a test

A real test, from `tests/e2e/storefront/configuration/product-config.spec.ts`:

```ts
import { test } from '../../../fixtures/e2e-test.js';
import { v2Products } from '../../../fixtures/storefront-data.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

test.describe('Product config', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({ allowGuestUserMe401: true });

  test('MS-CFG-001 die-cut sticker supports size and quantity', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;
    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.expectVisiblePrice();
  });
});
```

The easiest way to start is to copy a test next to where yours belongs. The rules that matter:

- The test title starts with its **case ID** (`MS-<MODULE>-###`) from the workbook. IDs are never reused.
- Tags go on the `describe`. Add `@destructive`, `@payment` or `@slow` when they apply, and
  `@production` only if the test is safe there.
- No raw selectors in specs: use page object methods. No Korean text inside page objects: put it in
  `storefront-data.ts` / `admin-data.ts`. Never use `page.waitForTimeout()`.
- Imports end in `.js` even though the files are `.ts`.
- Add or update the case's row in `docs/test-cases.xlsx`.

Full rules: [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

## 7. Save your work and get it into production

### Commit and push to CodeCommit

```bash
git checkout dev-2          # your branch
git pull                    # start up to date
# … write and run your test …
npm run typecheck
npm run lint
git status                  # see what changed
git add tests/ docs/
git commit -m "MS-CRT-010 cart keeps qty after reload"
git push                    # uploads to your branch on CodeCommit
```

Nothing runs the tests automatically after a push, so run your test, `npm run typecheck` and
`npm run lint` first. Start commit messages with the case ID. Never commit `.env` or `.auth/`.
Prefer clicking? Use VS Code's Source Control panel: stage, write a message, Commit, Sync.

You can check your push arrived in the AWS console: CodeCommit → Repositories → Musticker_Tester →
Commits, then pick your branch.

### Getting your work into production

1. **Finish on your dev branch**: tests pass, typecheck and lint pass, everything pushed.
2. **Notify the QA lead** that your branch is ready, with the branch, the case IDs, and the server
   they passed on. For example: *"dev-2 is ready to merge into production. Cases: MS-CRT-010,
   MS-CRT-011. Passed on: dev-2. Typecheck and lint: pass."*
3. **Wait for the QA lead's OK.** Never merge into `production` without it.
4. **Merge in CodeCommit**: Musticker_Tester → Pull requests → Create pull request. Destination
   `production`, source your branch → Create → Merge.
5. Now and then, bring `production` back into your branch so it stays current:
   `git pull origin production`.

## 8. Safety

Every test is safe on production unless it is tagged `@destructive`. Those tests are off by
default, each is gated by its own variable (`RUN_PAYMENT_E2E`, `RUN_AUTH_DESTRUCTIVE_E2E`,
`RUN_ADMIN_DESTRUCTIVE_E2E`), and they refuse to run against production. Admin tests that change
orders run only on `dev-1`. Keep the `RUN_*` flags `false` unless you mean to create orders or
accounts on your dev server.

## 9. Stuck?

| Problem | Try |
| --- | --- |
| `git clone` or `git push` asks for a password again or is refused | Use your CodeCommit HTTPS Git credentials, not your AWS console password |
| `npm run test:e2e:list` errors | Re-run `npm install`; check `.env` exists and `E2E_ENVIRONMENT` is set |
| Browser won't start | `npx playwright install chromium` |
| Sign-in tests are skipped | `AUTH_TEST_EMAIL` / `AUTH_TEST_PASSWORD` are empty in `.env` |
| Sign-in fails | The test member must exist on the server you're pointing at |
| Test passes its checks but still fails | The error guard caught a console or HTTP error: see the report |
| Runs are slow or blocked on dev | Set `DEV_INTERNAL_ORIGIN_KEY` in `.env` |

## Numbers

Use `npm run test:e2e:list` to see the current automated test inventory. The dedicated pricing
and visual snapshot suites have been removed; historical case IDs remain reserved in the workbook.

## Owner

The QA team. Report suite problems to the QA lead, and product defects in the workbook's Defect Log.
