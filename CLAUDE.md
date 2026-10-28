# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Playwright + TypeScript E2E suite for Musticker (머스티커): the Korean storefront (`www.musticker.com/kr`)
and the admin panel, including journeys that cross from one to the other. The detailed docs are
authoritative; read the relevant one before non-trivial changes:

- `docs/RUNNING.md`: setup, every command, environments, variables, tags, CI
- `docs/ARCHITECTURE.md`: fixtures, page objects, sessions, resilience, cleanup
- `docs/CONVENTIONS.md`: case IDs, file placement, locator/data rules, PR checklist
- `docs/PROMOTION.md`: how incoming ticket automation is staged, validated and applied
- `docs/test-cases.xlsx`: the single source of test cases (IDs, steps, Defect Log)

## Commands

```bash
npm run typecheck              # tsc --noEmit
npm run lint                   # eslint .
npm run test:framework         # hermetic checks: node --test scripts/tests + playwright.unit.config.ts; no server
npm run test:e2e:list          # list all tests without running (count should change only by what you add/remove)
npx playwright test tests/e2e/storefront/cart/cart-lifecycle.spec.ts -g "MS-CRT-001"   # one test
E2E_BROWSER_PROJECT=chromium-mobile npx playwright test --grep @mobile       # other project
npm run test:api               # playwright.api.config.ts (api specs, 1 worker)
npm run test:prod:smoke        # production, read-only tags only
npm run admin:login            # human-in-the-loop admin session capture (emailed code)
```

Other npm scripts select by tag (`test:smoke`, `test:regression`, `test:auth`, `test:destructive`, …); see `package.json`.

## Environment

- Everything is configured from `.env` (gitignored; template and full variable docs in `.env.example`).
  `E2E_ENVIRONMENT` picks the target: `qa` (dev-1, falling back to dev-2 if dev-1 fails readiness),
  `dev-1` … `dev-6`, or `production`. Suite runs need an explicit environment.
- `tests/fixtures/environments.ts` is the only place server URLs are written; `env.ts` resolves the
  active one (`appPath`, `apiPath`, `adminBaseUrl`, `internalOriginKey`). Don't hardcode hosts.
- `playwright.config.ts` imports `tests/setup/resolve-qa-environment.ts` (top-level await that turns
  `qa` into a concrete server) *before* dynamically importing `env.ts`; keep that ordering.
- Destructive tests are gated by `RUN_PAYMENT_E2E`, `RUN_AUTH_DESTRUCTIVE_E2E`,
  `RUN_ADMIN_DESTRUCTIVE_E2E` and refuse production. Order-changing admin specs refuse anything but `dev-1`.
- When an internal-origin (WAF) key is set, tracing is turned off because CI artifacts are public.

## Architecture

```
spec (tests/e2e/…)  → imports { test, expect } from fixtures/e2e-test.ts (or admin-test.ts)
  → page objects (tests/pom/storefront|admin)  → copy/data from fixtures/*-data.ts
```

- **The extended `test` fails a test on any console error/warning or ≥400 response from Musticker
  hosts**, even if all assertions pass. Expected noise is allowed only via named options
  (`test.use({ allowGuestUserMe401: true })`); the list is `GuardOptions` in `e2e-test.ts`.
- `asMember` seeds a member session via API (`member-auth.ts`); `admin-test.ts` adds `adminPage`
  (second browser context from the saved `.auth/admin-<env>.json`) and read-only `adminApi`.
  Only sign-in tests drive login forms. Login APIs return HTTP 200 with `success: false` on refusal.
- Storefront navigation goes through `gotoStorefront()` (`navigation.ts`), which retries the
  production WAF's 403s. Nuxt hydration races are handled in `hydration.ts`.
- Self-healing locators (`self-heal.ts`) fall back to stable identifiers when storefront copy
  drifts and record a `self-healed` annotation; the self-heal reporter lists them in
  `test-results/self-heal-report.md`. Fix `storefront-data.ts`, then confirm with `SELF_HEAL=off`.
- Created accounts are recorded in `.auth/runs/<run-id>/created-accounts.jsonl` and deleted by
  `tests/setup/global-teardown.ts` when `TEST_DATA_USER_DELETE_ENDPOINT` is set.
- Admin order journeys (`tests/e2e/admin/orders/order-lifecycle.ts`) drive customer `page` and staff
  `adminPage` together and verify each hand-off in admin UI, customer UI, and the admin API activity log.

## Conventions that matter

- ESM project: imports use `.js` extensions even for `.ts` files.
- Test titles start with the case ID `MS-<MODULE>-###` matching the workbook; folders mirror workbook
  Areas, spec files and top-level `describe` titles mirror Sub-Areas. IDs are never reused.
- Tags go on the `describe`; `@destructive`, `@payment`, `@slow` are mandatory when they apply, plus
  `@production` only if safe there. CI selects by tag, never by folder.
- No raw selectors in specs, no Korean copy inline in page objects (use `storefront-data.ts` /
  `admin-data.ts`), no `page.waitForTimeout()`. Locator order: role, label, placeholder, text, test id, CSS last.
  The admin panel has no test ids.
- Known product defects are recorded as data with a note (e.g. `KNOWN_STOREFRONT_VIOLATIONS` in
  `axe.ts`), never by loosening assertions. Missing credentials skip, not fail.
- Adding/changing/withdrawing a test also requires updating `docs/test-cases.xlsx` (see CONVENTIONS.md).

## Remotes

- `github`: GitHub, where CI runs (`.github/workflows`) and secrets live as Actions secrets.
- `origin`: AWS CodeCommit (`Musticker_Tester`, ap-northeast-2); no CI or secret store.
- `production` tracks `github`, so push to CodeCommit explicitly: `git push origin <branch>`.
- This clone is shallow. If CodeCommit rejects a push with "Unknown commit", the history is cut
  off at a `.git/shallow` boundary.
