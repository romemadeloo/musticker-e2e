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

| Prefix | Scope | Example |
| --- | --- | --- |
| `MS-V2-###` | Storefront | `MS-V2-097 the quoted tier price survives …` |
| `MS-PRC-<product>` | Pricing, one generated test per price-table row | `MS-PRC-circle-sticker area 900 (30x30) matches …` |
| `MS-PRC-INT-<product>` | Pricing interpolation | `MS-PRC-INT-die-cut-sticker quantity 15 interpolates …` |
| `MS-PRC-MAP` | Pricing table mapping | `MS-PRC-MAP die-cut-sticker is served by pricing table 51` |
| `MS-ADM-###` | Admin panel, including storefront-to-admin journeys | `MS-ADM-001 artwork review, customer proof approval, …` |

- IDs are never reused. A withdrawn case keeps its ID, is struck through in the workbook, and gets a
  note explaining why (see MS-V2-059).
- Take the next free number in the prefix. The workbook's Test Cases tab is sorted by ID, so the
  last row is the highest.
- In the workbook, the pricing suite is grouped into cases a person can execute
  (`MS-PRC-TBL-<product>`, `MS-PRC-INT-<template>`, `MS-PRC-MAP-<n>`). Each row states how many
  generated tests it covers.

## Where a test goes

```
tests/e2e/storefront/<area>/<feature>.spec.ts     customer-facing behaviour
tests/e2e/admin/<area>/<feature>.spec.ts          admin panel behaviour and journeys that start on the storefront
tests/pom/storefront/<page>.ts                    storefront page objects
tests/pom/admin/<page>.ts                         admin page objects
tests/fixtures/<topic>.ts                         shared helpers and data, used by both apps
```

Storefront areas: `smoke`, `discovery`, `purchasing`, `pricing`, `auth`, `account`, `api`,
`validation`, `regression`, `security`. Add a new area folder only when a feature doesn't fit any
of them, and record it in the workbook's Area list.

## Anatomy of a spec

From [product-config.spec.ts](../tests/e2e/storefront/purchasing/product-config.spec.ts):

```ts
import { test } from '../../../fixtures/e2e-test.js';               // or admin-test.js
import { v2Products } from '../../../fixtures/storefront-data.js';   // data, not inline strings
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

test.describe('storefront v2 product configuration', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({ allowGuestUserMe401: true });                          // named guard allowances only

  test('MS-V2-009 die-cut sticker supports size and quantity selection', async ({ page }) => {
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
  so in a comment. MS-ADM-001 does this for the proof-approval wording. Don't encode the bug as the
  expectation.
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
