# Musticker E2E Suite

End-to-end tests for Musticker (머스티커), in Playwright and TypeScript. One suite covers both
applications and the journeys between them:

- **Storefront** (`www.musticker.com/kr`): browsing, product configuration, pricing, cart, checkout,
  sign-in, and the customer's order history.
- **Admin panel** (`admin-panel.musticker.com`): order processing, from design review and proofs
  through production and shipping.

The test cases themselves (what each test checks, its steps and expected results, and the columns
for recording manual runs) are in the workbook [docs/test-cases.xlsx](docs/test-cases.xlsx).

## Start here

| If you want to… | Read |
| --- | --- |
| Run the tests | [docs/RUNNING.md](docs/RUNNING.md): setup, commands, environments, variables, CI |
| See what is covered, or run cases by hand | [docs/test-cases.xlsx](docs/test-cases.xlsx) |
| Understand how the suite is built | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): fixtures, page objects, sign-in, safety guards |
| Write or change a test | [docs/CONVENTIONS.md](docs/CONVENTIONS.md): IDs, tags, locators, data rules, review checklist |

## Quick start

```bash
npm install
npx playwright install chromium
npm run test:e2e:list      # list every test without running anything
npm run test:prod:smoke    # read-only smoke checks against production
```

Every test is safe on production unless it is tagged `@destructive`. Those tests are off by
default, each is gated by its own environment variable, and CI refuses to run them against
production.

## Layout

```
tests/
  e2e/
    storefront/          customer-facing specs, one folder per area
      smoke/  discovery/  purchasing/  pricing/  auth/  account/
      api/  validation/  regression/  security/
    admin/               admin panel specs
      orders/            storefront-to-admin order processing
  pom/
    storefront/          page objects for storefront pages, drawers and dialogs
    admin/               page objects for admin panel pages and drawers
  fixtures/              the extended `test`, environments, sign-in, API helpers, test data
    pricing/             price tables (CSV) and the pricing API client
    files/               upload fixtures (design file, proof image)
  reporters/             self-heal report
  setup/                 global teardown, and the admin session capture (npm run admin:login)
docs/                    documentation and the test case workbook
.github/workflows/       CI (see docs/RUNNING.md#ci)
```

## Numbers

As of 2026-09-25: **2,468 Playwright tests in 32 spec files** (2,467 on the desktop projects plus one
mobile test), documented as **171 test cases**: 139 automated (3 of them only partly, with the rest
to check by hand), 30 planned admin cases, and 2 withdrawn. Pricing makes up 2,286 of the tests,
generated from the price tables. The workbook's Coverage Summary tab has the per-area breakdown.

## Owner

The QA team. Report suite problems as issues on this repository, and product defects in the
workbook's Defect Log.
