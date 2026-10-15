# Writing and changing tests

These rules keep the suite readable, safe against production, and in step with the test case
workbook. They replace the "Automation Standards" section of the retired `test-case.md`.

- [Test case IDs](#test-case-ids)
- [Where a test goes](#where-a-test-goes)
- [Anatomy of a spec](#anatomy-of-a-spec)
- [Locators and assertions](#locators-and-assertions)
- [Data, safety and cleanup](#data-safety-and-cleanup)
- [Known defects and preconditions](#known-defects-and-preconditions)
- [Keeping the workbook current](#keeping-the-workbook-current)
- [Pull request checklist](#pull-request-checklist)

## Test case IDs

Every test title starts with its case ID. The workbook uses the same ID, which is what links a
row in [test-cases.xlsx](test-cases.xlsx) to the code.

Since workbook v1.2 the prefix names the module (the workbook's Area), so an ID tells you where a
case belongs: `MS-<MODULE>-###`.

| Prefix | Module (workbook Area) | Example |
| --- | --- | --- |
| `MS-NAV-###` | 1. Smoke & core navigation | `MS-NAV-001 homepage loads with critical public content` |
| `MS-DSC-###` | 2. Discovery & content | `MS-DSC-001 sticker category lists expected product links` |
| `MS-CFG-###` | 3. Product configuration | `MS-CFG-001 die-cut sticker supports size and quantity selection` |
| `MS-SHT-###` | 4. Sheet sticker size rules | `MS-SHT-001 원형 판스티커 rejects a custom size that fits only one sticker per sheet` |
| `MS-CRT-###` | 5. Cart | `MS-CRT-001 removing the only line item leaves an empty cart, not a broken one` |
| `MS-CHK-###` | 6. Checkout & money path | `MS-CHK-004 the quoted tier price survives …` |
| `MS-PRC-<product>` | 7. Pricing, one generated test per price-table row | `MS-PRC-circle-sticker area 900 (30x30) matches …` |
| `MS-PRC-INT-<product>` | 7. Pricing interpolation | `MS-PRC-INT-die-cut-sticker quantity 15 interpolates …` |
| `MS-PRC-MAP` | 7. Pricing table mapping | `MS-PRC-MAP die-cut-sticker is served by pricing table 51` |
| `MS-AUTH-###` | 8. Sign-in & registration | `MS-AUTH-001 account navigation opens login` |
| `MS-ACC-###` | 9. Account & order history | `MS-ACC-001 order history lists the member's orders with a number and a date each` |
| `MS-INQ-###` | 10. Inquiry & validation | `MS-INQ-001 inquiry form validates blank and invalid email submissions` |
| `MS-API-###` | 11. Public API | `MS-API-001 navigation categories API returns public category data` |
| `MS-UX-###` | 12. Accessibility, visual & errors | `MS-UX-001 core controls are named and keyboard reachable` |
| `MS-SEC-###`, `MS-WAF-###` | 13. Suite safety & resilience | `MS-SEC-001 first-party musticker hosts are in scope` |
| `MS-ADMO-###` | 14. Admin - order processing, including storefront-to-admin journeys | `MS-ADMO-001 artwork review, customer proof approval, …` |
| `MS-ADMA-###` | 15. Admin - access & order management | `MS-ADMA-001 (planned: admin login verification code)` |

- IDs are never reused. A withdrawn case keeps its ID, is struck through in the workbook, and gets a
  note explaining why (see MS-CFG-016).
- Take the next free number in the case's module: the module's last row in the Test Cases tab has
  the highest number.
- The workbook's **Legacy ID** column keeps each case's pre-v1.2 ID (`MS-V2-###` / `MS-ADM-###`),
  so older defect reports, notes and Allure history can still be traced. Do not fill it for new
  cases.
- In the workbook, the pricing suite is grouped into cases a person can execute
  (`MS-PRC-TBL-<product>`, `MS-PRC-INT-<template>`, `MS-PRC-MAP-<n>`). Each row states how many
  generated tests it covers.

## Where a test goes

```
tests/e2e/storefront/<module>/<suite>.spec.ts    customer-facing behaviour
tests/e2e/admin/<module>/<suite>.spec.ts         admin panel behaviour and journeys that start on the storefront
tests/pom/storefront/<page>.ts                    storefront page objects
tests/pom/admin/<page>.ts                         admin page objects
tests/fixtures/<topic>.ts                         shared helpers and data, used by both apps
```

The folders mirror the workbook, so a case is found the same way in both:

| Workbook | Playwright | Example |
|---|---|---|
| Area (module) | folder | `8. Sign-in & registration` → `storefront/auth/` |
| Sub-Area (suite) | spec file, and its top-level `test.describe` title | `Registration` → `registration.spec.ts`, `test.describe('Registration', …)` |
| TC ID and title | `test(...)` title | `MS-AUTH-012 register form exposes expected controls` |

| Module | Folder |
|---|---|
| NAV | `storefront/navigation/` |
| DSC | `storefront/discovery/` |
| CFG | `storefront/configuration/` |
| SHT | `storefront/sheet-size-rules/` |
| CRT | `storefront/cart/` |
| CHK | `storefront/checkout/` |
| PRC | `storefront/pricing/` |
| AUTH | `storefront/auth/` |
| ACC | `storefront/account/` |
| INQ | `storefront/inquiry/` |
| API | `storefront/api/` |
| UX | `storefront/ux/` |
| SEC, WAF | `storefront/security/` |
| ADMO | `admin/orders/` |
| ADMA | `admin/access/` (when its first spec is written) |

- **One suite per spec file.** The suite name is the top-level `describe` title, written exactly as the
  workbook's Sub-Area. Nested `describe`s inside a suite are fine for shared settings (`seeded member`,
  `session lifecycle`) or data (one per pricing product).
- **A new case goes into the spec file of its suite.** A new suite gets a new spec file and a new
  Sub-Area value. A new module gets a folder, a row in the table above, and a workbook Area.
- Workflows select tests by tag, never by folder, so moving a spec does not change which CI suites run it.

## Anatomy of a spec

From [product-config.spec.ts](../tests/e2e/storefront/configuration/product-config.spec.ts):

```ts
import { test } from '../../../fixtures/e2e-test.js';               // or admin-test.js
import { v2Products } from '../../../fixtures/storefront-data.js';   // data, not inline strings
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

test.describe('Product config', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({ allowGuestUserMe401: true });                          // named guard allowances only

  test('MS-CFG-001 die-cut sticker supports size and quantity selection', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.clickNextStepAndExpectProgression();
  });
});
```

- **Title.** Case ID, then the behaviour in plain words, as the workbook's Title column states it.
- **Tags.** On the `describe`: one or more purpose tags (`@smoke`, `@regression`) plus `@production`
  if it is safe and meaningful there. `@destructive`, `@payment` and `@slow` are mandatory when
  they apply. The full list is in [RUNNING.md](RUNNING.md#tags).
- **Gates first.** `test.skip(...)` for flags, environment and credentials sits at the top of the
  `describe`, with a reason that tells the reader how to enable the test.
- **Steps.** Long journeys use `test.step('who: what happens', …)`. The step names read as the
  workbook's Test Steps and show in the report.
- **Comments explain why, not what.** Record what was verified, where and when ("verified on
  static-1, 2026-09-25"), because that is what a later reader can't reconstruct.

## Locators and assertions

- Write from the user's perspective and assert visible outcomes.
- Locator order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`, then CSS
  as a documented fallback. Locators live in page objects, not specs.
- Copy (Korean labels, messages) comes from `storefront-data.ts` or `admin-data.ts`, never inline in
  a page object.
- Use web-first assertions (`await expect(locator).toBeVisible()`). Never `page.waitForTimeout()`
  in a committed test; wait for the condition instead (`expect.poll`, `waitForResponse`).
- Tests are isolated and parallel-safe. No test depends on another having run.
- An action method waits for its own effect (a toast, a dialog closing, a status change) before
  returning, so the next step never races it.
- When the UI and the API can disagree, check both. Admin steps are verified on screen and in the
  activity log.

## Data, safety and cleanup

- **Production is read-only.** A test that creates orders, submits payments, registers accounts or
  changes admin data is tagged `@destructive`, is gated by its own `RUN_*` flag, and refuses to run
  against production.
- **Admin production** is limited to reading. The only order a test may open there is the
  designated test order. Every order-changing admin spec checks `activeEnvironment` and refuses
  anything but `static-1`.
- **Sessions.** Use `asMember` or `adminPage`. Don't drive a login form unless sign-in is what the
  test is about.
- **Clean up** what you can before the test ends, and record what you can't (created accounts go
  in `recordCreatedAccount`), so the global teardown can clear it.
- **Secrets** never appear in code, logs or artifacts. The admin context is deliberately not
  recorded. The internal-origin key is scoped to Musticker hosts.
- **Credentialed tests** skip, not fail, when credentials are missing:
  `test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS)`.

## Known defects and preconditions

- A confirmed, tracked product defect is recorded as data with a note (`KNOWN_STOREFRONT_VIOLATIONS`,
  `KNOWN_FALLING_PRICE_INTERVALS`), not hidden by loosening an assertion. New occurrences must
  still fail.
- When product hasn't decided which side of a discrepancy is wrong, leave it unasserted and say
  so in a comment. MS-ADMO-001 did this for the proof-approval wording until product changed the
  copy (MUS-QA-004), and asserts it now. Don't encode the bug as the expectation.
- A test whose value depends on a precondition (a member existing on the server, a quantity on one
  side of a threshold, a seed order at the right stage) asserts that precondition first. A
  misconfigured run then fails loudly instead of passing while proving nothing.
- Log every defect in the workbook's Defect Log, and reference its ID from the case's Notes.

## Keeping the workbook current

[test-cases.xlsx](test-cases.xlsx) is the single test case source. When you:

| Change | Update in the workbook |
| --- | --- |
| Add a test | A new row on Test Cases: ID, area, title, priority, steps, expected, spec path, Automation = Automated |
| Change what a test asserts | That row's Steps and Expected Result, plus a Changelog line |
| Rename or move a spec | The Playwright Spec column |
| Withdraw a test | Strike through the row and give the reason in Notes. Never delete it |
| Find a defect | A Defect Log row. Put its ID on the failing case |
| Plan a test not yet written | A row with Automation = Planned and the spec left blank |

The Coverage Summary tab counts from the Test Cases tab by formula. Don't edit its numbers.

## Pull request checklist

- [ ] `npm run typecheck` and `npm run lint` pass.
- [ ] `npm run test:e2e:list` still lists every test (the count only changes by what you added or removed).
- [ ] New tests carry an ID, the right tags, and their gates.
- [ ] No `waitForTimeout`, no raw selectors in specs, and no copy strings outside the data modules.
- [ ] Destructive tests refuse production and clean up after themselves.
- [ ] The workbook row exists or has been updated, and `docs/` reflects any new command or variable.
