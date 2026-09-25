# Musticker Storefront Test Cases

Generated: 2026-08-10

Target production URL: `https://www.musticker.com/kr`

## Scope

This test plan covers production-safe Playwright E2E automation for the public Musticker storefront, with destructive purchase/payment scenarios separated for dev or explicitly enabled production-safe seeded accounts.

Scanned pages:

- `https://www.musticker.com/`
- `https://www.musticker.com/kr/stickers`
- `https://www.musticker.com/kr/roll-stickers`
- `https://www.musticker.com/kr/sheet-stickers`
- `https://www.musticker.com/kr/stickers/die-cut-sticker`
- `https://www.musticker.com/kr/roll-stickers/die-cut-roll`
- `https://www.musticker.com/kr/sheet-stickers/die-cut-sheet`
- `https://www.musticker.com/kr/sheet-stickers/circle-sheet`
- `https://www.musticker.com/kr/sheet-stickers/oval-sheet`
- `https://www.musticker.com/kr/sheet-stickers/square-sheet`
- `https://www.musticker.com/kr/sheet-stickers/rectangle-sheet`
- `https://www.musticker.com/kr/sheet-stickers/rounded-sheet`
- `https://www.musticker.com/kr/faq`
- `https://www.musticker.com/kr/terms-of-use`
- `https://www.musticker.com/kr/privacy-policy`

## Automation Standards

- Write tests from the user's perspective and assert visible outcomes.
- Prefer Playwright locators in this order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`, then CSS only as a documented fallback.
- Use Page Object Model classes under `tests/pom` for page actions and reusable assertions.
- Keep tests isolated and parallel-safe. Do not depend on test order.
- Use Playwright web-first assertions and avoid `page.waitForTimeout()`.
- Use Playwright `request` for direct API contract checks. Keep production API tests read-only unless explicitly tagged `@destructive`.
- Use `BASE_URL=https://www.musticker.com/kr` for production-safe runs.
- Tag tests for selective execution: `@smoke`, `@regression`, `@production`, `@mobile`, `@auth`, `@api`, `@pricing`, `@purchasing`, `@validation`, `@a11y`, `@credentialed`, `@visual`, `@destructive`, `@slow`.
- Do not create orders, submit payments, or mutate durable production data unless the test is explicitly tagged `@destructive` and guarded by environment variables.
- Keep credentialed authentication checks optional and skip them unless `AUTH_TEST_EMAIL` and `AUTH_TEST_PASSWORD` are provided.
- A test that needs a member session but is not *about* signing in takes one from the API with `test.use({ asMember: true })` rather than driving the login form. Only the tests whose subject is authentication itself (`MS-V2-034`, `MS-V2-035`, `MS-V2-094`, `MS-V2-104`) go through the form.
- Any test that creates or mutates real data must restore what it can before it ends, and must record anything it cannot (accounts, via `recordCreatedAccount`) so the run's global teardown can clean up.
- A known, tracked product defect is recorded as data with a note explaining it -- `KNOWN_STOREFRONT_VIOLATIONS` in `tests/fixtures/axe.ts`, `KNOWN_FALLING_PRICE_INTERVALS` in `price-interpolation.spec.ts` -- not suppressed by weakening an assertion. New occurrences must still fail.
- A test whose value depends on a precondition (a member existing on the environment under test, a fixture quantity falling on one side of a threshold) asserts that precondition explicitly, so a misconfigured run fails loudly instead of passing while proving nothing.

## Recommended Test Data

- Public anonymous user for discovery, navigation, FAQ, inquiry validation, search, product configuration, and cart UI checks.
- Seeded member only for `@auth` and account/cart persistence tests.
- Credentialed auth tests should use a non-admin seeded member with no saved payment method and no sensitive production data.
- Disposable dev member only for full registration, checkout, upload, and payment regression.
- Runtime-generated PNG/PDF/ZIP files for upload validation.

## Test Case Matrix

| ID | Area | Tags | Scenario | Priority |
| --- | --- | --- | --- | --- |
| MS-V2-001 | Home | `@smoke @production` | Homepage loads with primary hero, product nav, CTA buttons, reviews, inquiry entry, and footer | P0 |
| MS-V2-002 | Header | `@smoke @production` | Header navigation opens product categories from home | P0 |
| MS-V2-003 | Search | `@smoke @production` | Search opens from header and returns relevant product/content results | P0 |
| MS-V2-004 | Cart | `@smoke @production` | Empty cart opens from header and shows a non-broken empty state | P0 |
| MS-V2-005 | Account | `@smoke @production` | Account icon routes anonymous users to authentication without console/page failure | P0 |
| MS-V2-006 | Category | `@regression @production` | Sticker category lists all scanned sticker product links | P1 |
| MS-V2-007 | Category | `@regression @production` | Roll sticker category lists all scanned roll product links | P1 |
| MS-V2-008 | Category | `@regression @production` | Sheet sticker category lists all scanned sheet product links | P1 |
| MS-V2-009 | Product | `@regression @production @purchasing` | Die-cut sticker detail supports size and quantity selection with recalculated price | P0 |
| MS-V2-010 | Product | `@regression @production @purchasing` | Die-cut roll sticker detail supports size and quantity selection with recalculated price | P0 |
| MS-V2-011 | Product | `@regression @production @purchasing` | Die-cut sheet sticker detail supports material, sheet size, and quantity selection | P0 |
| MS-V2-012 | Product | `@validation @production` | Product custom size and custom quantity controls validate required/min/max inputs | P1 |
| MS-V2-013 | Product | `@regression @production` | Product page delivery/free-shipping/production promise copy is visible | P1 |
| MS-V2-014 | Product | `@regression @production` | Product page reviews carousel advances and returns without losing content | P2 |
| MS-V2-015 | FAQ | `@smoke @production` | FAQ page loads category topics and expands common questions | P0 |
| MS-V2-016 | FAQ | `@regression @production` | FAQ search filters or surfaces matching FAQ content | P1 |
| MS-V2-017 | Inquiry | `@validation @production` | Inquiry form validates required fields before submission | P0 |
| MS-V2-018 | Inquiry | `@validation @production` | Inquiry form accepts supported attachment types and rejects unsupported/oversized files | P1 |
| MS-V2-019 | External Links | `@regression @production` | Kakao and Naver inquiry links open expected external destinations | P2 |
| MS-V2-020 | Legal/Footer | `@smoke @production` | Footer business details, phone, email, terms, privacy, and FAQ links are visible | P0 |
| MS-V2-021 | Localization | `@regression @production` | Korean locale selector is visible and does not break the current page | P2 |
| MS-V2-022 | Mobile | `@smoke @production @mobile` | Core home, nav, search, cart, and inquiry flows work on mobile viewport | P0 |
| MS-V2-023 | Accessibility | `@regression @production` | Main interactive controls have accessible names and keyboard focus behavior | P1 |
| MS-V2-024 | Visual | `@visual @production` | Home, category, product, FAQ, and inquiry drawer visual snapshots stay stable | P2 |
| MS-V2-025 | Checkout | `@e2e @destructive @slow` | Dev-only anonymous/member product-to-checkout flow with upload and order placement | P0 |
| MS-V2-026 | Auth | `@smoke @production @auth` | Login entry opens from account navigation and renders the authentication screen | P0 |
| MS-V2-027 | Auth | `@smoke @production @auth` | Login form exposes usable email, password, submit, register, and recovery controls | P0 |
| MS-V2-028 | Auth | `@validation @production @auth` | Login form blocks blank required fields with user-facing validation | P0 |
| MS-V2-029 | Auth | `@validation @production @auth` | Login form rejects malformed email input without starting an auth session | P1 |
| MS-V2-030 | Auth | `@validation @production @auth` | Invalid credentials show a safe failure message and keep the user anonymous | P0 |
| MS-V2-031 | Auth | `@regression @production @auth` | Password field remains masked or the visibility toggle works without exposing credentials in the URL | P1 |
| MS-V2-032 | Auth | `@regression @production @auth` | Forgot-password entry opens recovery flow and validates blank/invalid email safely | P1 |
| MS-V2-033 | Auth | `@regression @production @auth` | Register entry is reachable from login without creating a production account | P1 |
| MS-V2-034 | Auth | `@smoke @production @auth @credentialed` | Valid seeded member credentials log in and reveal member-only account state | P0 |
| MS-V2-035 | Auth | `@regression @production @auth @credentialed` | Authenticated session survives reload and navigation, reaches a member-only route, and logout clears it | P0 |
| MS-V2-036 | API | `@smoke @production @api` | Navigation categories API returns public category data used by the storefront | P0 |
| MS-V2-037 | API | `@smoke @production @api` | Inquiry types API returns selectable inquiry metadata without requiring login | P1 |
| MS-V2-038 | API | `@smoke @production @api` | Anonymous user session API rejects unauthenticated users safely | P0 |
| MS-V2-039 | About | `@smoke @production` | About page loads hero, sub-nav anchors, stats, and CTAs | P2 |
| MS-V2-040 | Catalog | `@regression @production` | Every sitemap product detail page not already covered loads with a heading and options panel | P1 |
| MS-V2-041 | Checkout | `@regression @production` | Checkout page (reached via cart) renders shipping fields, payment method options, and order summary without submitting | P1 |
| MS-V2-042 | Checkout | `@validation @production` | Checkout blocks payment submission when required shipping/contact fields are blank | P1 |
| MS-V2-043 | Errors | `@regression @production` | Unknown route serves the branded 404 page with a working "홈으로 돌아가기" button back to the homepage | P2 |
| MS-V2-044 | Auth | `@regression @production` | Re-verification of MS-V2-031 password visibility toggle against current production behavior | P1 |
| MS-V2-050 | Product | `@regression @production @purchasing` | Circle/oval/square/rectangle/rounded sheet sticker configurators support material, individual size, and sheet-quantity selection through to cart (parameterized x5) | P0 |
| MS-V2-051 | Product | `@regression @production @purchasing` | Circle sheet sticker custom individual size (가로x세로) input recalculates the whole sheet-quantity price ladder live | P1 |
| MS-V2-052 | Product | `@regression @production @purchasing` | Circle sheet sticker bulk quantity tiers surface a discount badge that smaller tiers do not | P2 |
| MS-V2-053 | Product | `@regression @production @purchasing` | Circle sheet sticker design-upload modal accepts an order note and a design file before adding to cart | P1 |
| MS-V2-054 | Cart | `@regression @production @purchasing` | Cart preview drawer "상품 수정" dialog updates material and recalculates the line price | P1 |
| MS-V2-055 | Cart | `@regression @production @purchasing` | Cart preview drawer "장바구니 보기" hands off to the full cart page with the item intact | P2 |
| MS-V2-056 | Cart | `@regression @production @purchasing` | Full cart page "사이즈 변경" dialog exposes material + individual size only (no quantity) and updates price | P1 |
| MS-V2-057 | Cart | `@regression @production @purchasing` | Full cart page row-level quantity select updates price without a separate confirm step | P1 |
| MS-V2-058 | Product | `@regression @production` | Sheet sticker size-guide illustrations expose meaningful, localized alt text (parameterized x5) — currently failing on development-3, documents a live defect | P1 |
| ~~MS-V2-059~~ | Product | — | ~~Sheet sticker per-unit price is always a whole-won amount~~ **Withdrawn 2026-08-13**: a fractional per-unit readout (e.g. `8.582원`) was confirmed with Korean staff to be expected pricing behavior, not a defect. Not automated, and must not be re-added. | — |
| MS-V2-073 | Product | `@regression @purchasing` | Custom individual size that fits only one sticker per sheet is rejected: error message, every quantity tier at 0원, `다음 단계` disabled (parameterized x5) | P0 |
| MS-V2-074 | Product | `@regression @purchasing` | The 138x97 gate is exact on circle sheet — 138x97 orderable, 138x98 rejected | P1 |
| MS-V2-075 | Product | `@regression @purchasing` | Sheet sticker preset sizes match the shape-family table and every preset fits at least two stickers per sheet (parameterized x5) | P1 |
| MS-V2-076 | Cart | `@regression @purchasing` | Both cart edit dialogs (drawer `사이즈 및 수량 수정`, cart page `사이즈 변경`) reject a one-per-sheet custom size and disable `업데이트` | P1 |
| MS-V2-077 | Product | `@regression @purchasing` | A5 `배치 가이드` modal rejects a one-per-sheet custom size and disables `적용하기` | P2 |
| MS-V2-078 | Product | `@regression @purchasing` | Rendered per-sheet count matches the A5 layout formula across the gate boundary, and the gate follows it (parameterized x11) | P1 |
| MS-V2-079 | Auth | `@smoke @production @auth` | Register form exposes name, email, password, masking toggle, terms/privacy links, and submit | P0 |
| MS-V2-080 | Auth | `@validation @production @auth` | Blank register submit is blocked with required-field validation and requests no account | P0 |
| MS-V2-081 | Auth | `@validation @production @auth` | Malformed register email is rejected before any verification code is requested | P1 |
| MS-V2-082 | Auth | `@validation @production @auth` | A password below the form's stated policy is rejected | P1 |
| MS-V2-083 | Auth | `@validation @production @auth` | Registration is blocked until the terms checkbox is agreed, and the error clears when it is | P1 |
| MS-V2-084 | Auth | `@regression @production @auth` | Register password visibility toggle masks and unmasks without exposing the value in the URL | P2 |
| MS-V2-085 | Auth | `@regression @production @auth` | Login entry is reachable from register and restores the login form | P2 |
| MS-V2-086 | Auth | `@regression @production @auth @credentialed` | Registering an already-registered email offers sign-in instead of creating a duplicate account | P1 |
| MS-V2-087 | Auth | `@destructive @slow @auth` | A wrong email verification code is rejected and creates no account | P1 |
| MS-V2-088 | Auth | `@destructive @slow @auth` | A correct verification code creates the account, signs the member in, and lands on profile onboarding | P0 |
| MS-V2-089 | Auth | `@smoke @production @auth @credentialed` | Account profile exposes current/new/confirm password fields, submit, and recovery entry | P0 |
| MS-V2-090 | Auth | `@validation @production @auth @credentialed` | `비밀번호 변경` stays disabled until all three password fields are filled | P1 |
| MS-V2-091 | Auth | `@validation @production @auth @credentialed` | A mismatched password confirmation is rejected | P0 |
| MS-V2-092 | Auth | `@validation @production @auth @credentialed` | A new password below the policy is rejected | P1 |
| MS-V2-093 | Auth | `@validation @production @auth @credentialed` | A wrong current password is rejected without changing the credential | P0 |
| MS-V2-094 | Auth | `@destructive @slow @auth` | A successful password change rotates the credential: the new password logs in and the old one no longer does | P0 |
| MS-V2-095 | Auth | `@regression @production @auth` | A member-only account route is not reachable by an anonymous visitor | P0 |
| MS-V2-096 | Auth | `@regression @production @auth` | Non-member mode swaps the password form for guest email + order-number lookup | P2 |
| MS-V2-060 | Product | `@regression @production @purchasing` | Plain die-cut shape stickers under /kr/stickers support size and quantity selection through to cart (parameterized x8) | P1 |
| MS-V2-061 | Product | `@regression @production @purchasing` | Plain die-cut roll stickers under /kr/roll-stickers support size and quantity selection through to cart (parameterized x7) | P1 |
| MS-V2-062 | Product | `@regression @production @purchasing` | Circle sticker custom individual size recalculates the price | P1 |
| MS-V2-063 | Product | `@regression @production @purchasing` | Circle roll sticker custom individual size recalculates the price | P1 |
| MS-V2-064 | Product | `@regression @production @purchasing` | Circle sticker bulk quantity tiers surface a discount that smaller tiers do not | P2 |
| MS-V2-065 | Product | `@regression @production @purchasing` | Circle roll sticker bulk quantity tiers surface a discount that smaller tiers do not | P2 |
| MS-V2-070 | Product | `@regression @production @purchasing` | Custom sheet sticker supports material, sheet size, and quantity selection through to cart | P1 |
| MS-V2-071 | Product | `@regression @production @purchasing` | Lettering sticker supports color, custom text, and quantity selection through to cart | P1 |
| MS-V2-072 | Product | `@regression @production @purchasing` | Full-color lettering (transfer) sticker supports color, size, and quantity selection through to cart | P1 |
| MS-V2-097 | Money path | `@regression @production @purchasing` | The quoted tier price survives product page -> cart drawer -> cart page -> checkout 소계 unchanged, and the checkout summary adds up (소계 + 배송비 - 할인 = 합계) | P0 |
| MS-V2-098 | Money path | `@regression @production @purchasing` | An order below the 5만원 free-shipping threshold is charged a shipping fee | P1 |
| MS-V2-099 | Money path | `@regression @production @purchasing` | An order at or above the 5만원 free-shipping threshold ships free and its total equals its subtotal | P1 |
| MS-V2-100 | Cart | `@regression @production @purchasing` | Removing the only line item leaves a usable empty cart in the drawer, the header badge, and the cart page | P0 |
| MS-V2-101 | Cart | `@regression @production @purchasing` | Two distinct products become two lines whose prices sum to the cart total | P0 |
| MS-V2-102 | Cart | `@smoke @regression @production @purchasing` | A guest cart survives a full document reload with its line price intact | P0 |
| MS-V2-103 | Cart | `@regression @production @purchasing` | The cart page confirms a removal before acting; cancelling is a no-op, confirming empties the cart | P1 |
| MS-V2-104 | Cart | `@regression @purchasing @credentialed @destructive @slow` | A guest cart is merged additively into the member cart on login, and the test restores the member's cart afterwards | P0 |
| MS-V2-105 | Cart | `@regression @production` | An empty cart page offers featured and discover product links rather than a dead end | P2 |
| MS-V2-106 | Accessibility | `@regression @a11y @production` | Home, sticker category, product, FAQ, login, and empty cart have no WCAG 2.1 AA critical/serious violations beyond the recorded baseline (parameterized x6) | P1 |
| MS-V2-107 | Orders | `@smoke @regression @production @auth @credentialed` | Order history lists the member's orders, each with a distinct order number and an order date | P0 |
| MS-V2-108 | Orders | `@regression @production @auth @credentialed` | Selecting an order routes to /kr/account/orders/<id> and opens that order's invoice, not the placeholder | P0 |
| MS-V2-109 | Orders | `@regression @production @auth @credentialed` | The 진행 중 / 이전 내역 segmented control switches the list to a disjoint set and reports state via aria-pressed | P1 |
| MS-V2-110 | Orders | `@regression @production @auth @credentialed` | Order search narrows the list to the searched order on submit, and clearing it restores the full list | P1 |
| MS-V2-111 | Orders | `@regression @production @auth @credentialed` | Order history search, date, filter, and segment controls are present and named | P2 |
| MS-V2-112 | Auth | `@auth @production @validation` | Guest order lookup refuses an unknown order number and leaves the visitor anonymous | P1 |
| MS-V2-113 | Auth | `@auth @production @validation` | Blank guest order lookup marks both fields required and never calls the lookup endpoint | P1 |
| MS-V2-114 | Auth | `@auth @production @validation @credentialed` | Guest order lookup refuses a registered and an unregistered address identically, so it is not an account-existence oracle | P0 |

## Detailed Test Cases

### MS-V2-001 - Homepage Critical Content

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Assert page title contains `머스티커`.<br>3. Assert hero heading `스티커ㅋㅋㅋ, 이유가 있구나` is visible.<br>4. Assert product category links `스티커`, `롤스티커`, and `판스티커` are visible.<br>5. Assert CTAs `빠른 주문`, `바로 주문하기`, and `제작 문의하기` are visible.<br>6. Assert reviews section with `사진 후기 225개` is visible.<br>7. Assert footer includes `MUSTICKER / 머스티커`, `1899-5529`, `sales@musticker.com`, `이용약관`, and `개인정보처리방침`. | Homepage renders complete public content without client error. | Use `HomePage` POM and `expect(page.getByRole('heading', { name: /스티커/ })).toBeVisible()`. |

### MS-V2-002 - Header Product Navigation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Click `스티커`; assert URL includes `/stickers` and heading `스티커`.<br>3. Return to home.<br>4. Click `롤스티커`; assert URL includes `/roll-stickers` and heading `롤스티커`.<br>5. Return to home.<br>6. Click `판스티커`; assert URL includes `/sheet-stickers` and heading `판스티커`. | Header/category navigation routes to the correct category pages. | Use role links. Avoid asserting exact full URL when locale or query params may be present. |

### MS-V2-003 - Header Search

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Open header search using accessible name `layout.header.search`.<br>3. Search for `홀로그램`.<br>4. Assert relevant results or product links are visible.<br>5. Select a result. | Search opens, accepts text, returns matching content, and navigates to a relevant page. | If the search button keeps the translation key as its accessible name, add a product-facing aria label in the app and prefer that selector. |

### MS-V2-004 - Empty Cart Drawer/Page

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous clean browser context. | 1. Navigate to `/`.<br>2. Click `장바구니`.<br>3. Assert cart drawer or cart page is visible.<br>4. Assert empty-state copy or disabled checkout state is visible.<br>5. Close the cart, if shown as a drawer. | Anonymous empty cart can be opened and closed without error. | Use `CartDrawer` or `CartPage` POM. Start each cart test in a fresh context. |

### MS-V2-005 - Anonymous Account Entry

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Click `계정`.<br>3. Assert login/register page or auth modal is shown.<br>4. Assert email and password fields or registration controls are visible. | Account entry leads anonymous users to authentication. | Tag with `@auth`, but keep production version read-only. |

### MS-V2-006 - Sticker Category Product Discovery

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/stickers`.<br>2. Assert heading `스티커`.<br>3. Assert product links are visible: `자유형 조각스티커`, `원형 스티커`, `직사각형 스티커`, `정사각형 스티커`, `타원형 스티커`, `둥근 사각 스티커`, `도무송 스티커`, `판스티커`, `투명 스티커`, `홀로그램 스티커`, `풀 컬러 레터링 스티커`, `글자 커팅 스티커`.<br>4. Click representative product `자유형 조각스티커`.<br>5. Assert product page heading is visible. | Sticker category exposes all expected product routes. | Parameterize product link assertions from a fixture array. |

### MS-V2-007 - Roll Sticker Category Product Discovery

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/roll-stickers`.<br>2. Assert heading `롤스티커`.<br>3. Assert product links are visible: `자유형 롤 스티커`, `투명 롤 스티커`, `원형 롤 스티커`, `정사각형 롤 스티커`, `직사각형 롤 스티커`, `둥근 사각 롤 스티커`, `타원형 롤 스티커`, `종이 롤 스티커`.<br>4. Click representative product `자유형 롤 스티커`.<br>5. Assert product page heading is visible. | Roll sticker category exposes all expected product routes. | Run across desktop and mobile projects. |

### MS-V2-008 - Sheet Sticker Category Product Discovery

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/sheet-stickers`.<br>2. Assert heading `판스티커`.<br>3. Assert product links are visible: `자유형 판스티커`, `원형 판스티커`, `타원형 판스티커`, `정사각형 판스티커`, `직사각형 판스티커`, `둥근 사각 판스티커`.<br>4. Click representative product `자유형 판스티커`.<br>5. Assert product page heading is visible. | Sheet sticker category exposes all expected product routes. | Use `getByRole('link', { name })`; do not use product card CSS. |

### MS-V2-009 - Die-Cut Sticker Configuration

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/stickers/die-cut-sticker`.<br>2. Assert heading `자유형 조각스티커`.<br>3. Select size `중형 75x75`.<br>4. Select quantity `100개`.<br>5. Assert price updates from the default price.<br>6. Assert per-unit price is visible.<br>7. Click `다음 단계`.<br>8. Assert the next step, upload modal, cart transition, or auth/checkout gate appears. | Product options update the order summary and allow progression. | Use web-first assertions on price text. Avoid exact price assertions unless backed by stable fixture pricing. |

### MS-V2-010 - Die-Cut Roll Sticker Configuration

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/roll-stickers/die-cut-roll`.<br>2. Assert heading `자유형 롤 스티커`.<br>3. Select size `중형 75x75`.<br>4. Select quantity `300개`.<br>5. Assert price and per-unit price are visible.<br>6. Click `다음 단계`. | Roll sticker configuration accepts selected options and progresses. | Share product option helpers with sticker product tests. |

### MS-V2-011 - Die-Cut Sheet Sticker Configuration

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/sheet-stickers/die-cut-sheet`.<br>2. Assert heading `자유형 판스티커`.<br>3. Select material `투명`.<br>4. Select sheet size `A5 148x210`.<br>5. Select quantity `50시트`.<br>6. Assert template download and layout guide controls are visible.<br>7. Click `다음 단계`. | Sheet-specific material, sheet size, and quantity controls work together. | Keep sheet configuration in a dedicated POM method because the option model differs from ordinary stickers. |

### MS-V2-012 - Custom Size and Quantity Validation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to representative product page.<br>2. Open `원하는 크기 입력`.<br>3. Attempt to apply blank, non-numeric, too-small, and too-large width/height values.<br>4. Assert validation feedback and no invalid price calculation.<br>5. Open `원하는 수량 입력`.<br>6. Attempt to apply blank, non-numeric, zero, and unsupported values.<br>7. Assert validation feedback and no invalid progression. | Invalid custom values are rejected with user-facing feedback. | Prefer labels/placeholders inside the custom option modal. Use parameterized edge cases. |

### MS-V2-013 - Production Promise Content

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to representative product page.<br>2. Assert `5만원 이상 무료배송` is visible.<br>3. Assert `3시 이전 시안 확정 시 당일배송` is visible.<br>4. Assert delivery estimate with courier `CJ 대한통운` is visible when available.<br>5. Assert `오늘제작, 내일발송`, `빠른 시안 피드백`, and `뛰어난 내구성과 내수성` are visible. | Product trust and delivery information is present. | Date-specific delivery text should be regex-based, not hardcoded. |

### MS-V2-014 - Reviews Carousel

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to representative product or home page.<br>2. Assert reviews section is visible.<br>3. Capture the first visible review author or text.<br>4. Click `다음 리뷰`.<br>5. Assert a different review appears or carousel position changes.<br>6. Click `이전 리뷰`.<br>7. Assert the previous content returns. | Reviews carousel controls work without hiding all reviews. | Use soft assertions for individual review text because live review content can change. |

### MS-V2-015 - FAQ Topic Expansion

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/faq`.<br>2. Assert hero heading/copy `도움이 필요하신가요?`.<br>3. Assert topic tabs/buttons `멤버십`, `주문`, `디자인 파일 업로드`, `인쇄`, `결제`, `반품/환불`.<br>4. Click `주문`.<br>5. Expand `비회원으로도 주문이 가능한가요?`.<br>6. Assert an answer panel is visible. | FAQ categories and accordions are usable. | Use button roles for accordion headers. |

### MS-V2-016 - FAQ Search

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/faq`.<br>2. Fill search input `궁금한 사항을 입력해주세요.` with `쿠폰`.<br>3. Assert matching FAQ results include coupon-related questions.<br>4. Clear the input.<br>5. Assert the default FAQ list returns. | FAQ search narrows and resets results. | If filtering is debounce-based, assert result changes with Playwright auto-retrying expectations. |

### MS-V2-017 - Inquiry Required Field Validation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Open `1:1문의하기` or `제작 문의하기`.<br>3. Click `문의하기` with all fields blank.<br>4. Assert required validation for inquiry type, name, email, and message.<br>5. Fill invalid email format.<br>6. Assert email validation is shown. | Inquiry cannot submit incomplete or invalid data. | Keep production-safe by not submitting a valid inquiry. |

### MS-V2-018 - Inquiry Attachment Validation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session and generated local fixture files. | 1. Open inquiry form.<br>2. Attach allowed file types one at a time: `.eps`, `.ai`, `.psd`, `.pdf`, `.tif`, `.tiff`, `.zip`, `.png`, `.jpg`.<br>3. Assert accepted files are displayed.<br>4. Attempt more than 4 files.<br>5. Assert max-file validation.<br>6. Attempt unsupported file type and file set over 50MB.<br>7. Assert validation feedback. | Inquiry upload follows documented constraints: max 4 files and total 50MB. | Run oversized fixture generation only in local/dev CI where disk cost is acceptable. |

### MS-V2-019 - External Inquiry Links

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Click `카카오채널로 문의하기`.<br>3. Assert a new page opens with host `pf.kakao.com`.<br>4. Return and click `네이버 톡톡 으로 문의하기`.<br>5. Assert a new page opens with host `talk.naver.com`. | External support links open the correct third-party destinations. | Use `page.waitForEvent('popup')`; do not interact with third-party pages beyond host assertion. |

### MS-V2-020 - Footer Legal and Business Links

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Assert footer business information is visible.<br>3. Click `이용약관`.<br>4. Assert URL includes `/terms-of-use`.<br>5. Navigate back and click `개인정보처리방침`.<br>6. Assert URL includes `/privacy-policy`.<br>7. Navigate back and click `자주 묻는 질문`.<br>8. Assert URL includes `/faq`. | Footer legal and support links are reachable. | Use accessible link names and URL regex assertions. |

### MS-V2-021 - Locale Selector

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Locate `KR` locale control.<br>3. Open the locale selector.<br>4. Assert current locale remains available.<br>5. Close selector without changing locale. | Locale control is visible and does not break navigation. | If only Korean is supported in production, assert stability rather than alternate locales. |

### MS-V2-022 - Mobile Critical Flow

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session using mobile Chromium project. | 1. Navigate to `/`.<br>2. Assert hero and category navigation are visible or reachable through mobile menu.<br>3. Open search.<br>4. Open cart.<br>5. Navigate to `/stickers/die-cut-sticker`.<br>6. Select size and quantity.<br>7. Open inquiry form. | Critical anonymous flows remain usable on mobile. | Use the configured `chromium-mobile` project and avoid desktop-only assumptions. |

### MS-V2-023 - Keyboard and Accessibility Smoke

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Use keyboard tabbing through header controls.<br>3. Assert focus reaches search, cart, account, product category links, and main CTA.<br>4. Press Enter on search and assert it opens.<br>5. Press Escape and assert modal/drawer closes. | Core controls are keyboard reachable and operable. | Prefer role/name assertions. Track untranslated accessible names as bugs. |

### MS-V2-024 - Visual Snapshot Coverage

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Stable production or controlled visual baseline environment. | 1. Capture full-page screenshots for home, sticker category, roll category, sheet category, representative product, FAQ, and inquiry drawer.<br>2. Compare against approved baselines.<br>3. Fail only on meaningful visual regressions. | Major layout regressions are detected. | Keep visual tests separate from smoke because live reviews and notices can change. |

### MS-V2-025 - Dev-Only Full Product-to-Checkout Flow

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Dev/staging environment, disposable account or seeded member, upload fixture, payment sandbox enabled. | 1. Register or log in as test user.<br>2. Navigate to representative product page.<br>3. Configure size, material if applicable, and quantity.<br>4. Continue to upload step.<br>5. Upload traceable artwork file.<br>6. Add configured product to cart.<br>7. Proceed to checkout.<br>8. Fill shipping/contact information.<br>9. Use sandbox payment method.<br>10. Assert order confirmation page displays matching order details.<br>11. Clean up created test data where API support exists. | Full purchase journey succeeds in non-production test environment. | Tag `@destructive @slow @payment`; guard with `RUN_PAYMENT_E2E=true`. |

### MS-V2-026 - Login Entry From Account Navigation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/`.<br>2. Click the account/member icon or link in the header.<br>3. Assert the page routes to login or an authentication modal opens.<br>4. Assert the auth surface has a clear login heading or form region.<br>5. Assert no console/page error is raised during the transition. | Anonymous users can reach authentication from the storefront header. | Use `HeaderComponent` and a new `LoginPage` POM. Prefer role/name selectors and URL regex checks over implementation-specific selectors. |

### MS-V2-027 - Login Form Controls

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate directly to the discovered login route or open it from the account entry.<br>2. Assert the email or username field is visible and editable.<br>3. Assert the password field is visible and has password masking.<br>4. Assert the login submit button is visible.<br>5. Assert register/signup and forgot-password recovery entries are visible when offered by the UI.<br>6. Assert social login buttons are visible if they are part of the public login page. | The login page exposes the expected controls with accessible names. | Do not click social login providers in production automation. Only verify the entry points are present. |

### MS-V2-028 - Blank Login Validation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open the login page.<br>2. Submit the form with both fields blank.<br>3. Assert required-field validation appears or focus moves to the first invalid field.<br>4. Assert the user remains on the login/auth route. | Blank login attempts are blocked before authentication is attempted. | Use Playwright web-first assertions for validation text, `aria-invalid`, or focused invalid controls. |

### MS-V2-029 - Malformed Email Login Validation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open the login page.<br>2. Fill the email field with `not-an-email`.<br>3. Fill the password field with any non-secret dummy value.<br>4. Submit the form.<br>5. Assert email-format validation appears.<br>6. Assert no authenticated member UI appears. | Malformed email input is rejected and does not create a session. | Avoid asserting exact validation copy unless the copy is stable. Prefer regex or invalid-control state. |

### MS-V2-030 - Invalid Credentials Handling

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open the login page.<br>2. Fill the email field with a reserved invalid address such as `invalid-login-e2e@example.com`.<br>3. Fill the password field with a reserved invalid password.<br>4. Submit the form.<br>5. Assert a generic login failure message is visible.<br>6. Assert the URL, cookies, local storage, and header still reflect an anonymous user. | Invalid credentials fail safely without exposing whether the email exists. | Keep retry count low for this test to avoid account lockout behavior. Never use a real customer email for negative testing. |

### MS-V2-031 - Password Masking And Visibility

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open the login page.<br>2. Fill the password field with a dummy value.<br>3. Assert the password input is masked by default.<br>4. If a visibility toggle exists, click it and assert the input switches visibility.<br>5. Click the toggle again and assert the input returns to masked mode.<br>6. Assert the password value is not written into the URL. | Password entry behaves securely and predictably. | Implement conditional assertions only around optional visibility controls; the baseline password masking check should always run. Current production observation on 2026-08-10: the visibility toggle is rendered but does not change the password input from masked to visible, so the automated test is tracked as `fixme` until the product behavior is corrected. |

### MS-V2-032 - Forgot Password Flow

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open the login page.<br>2. Click the forgot-password/recovery entry.<br>3. Assert the recovery route or modal is shown.<br>4. Submit the recovery form blank.<br>5. Assert required-field validation appears.<br>6. Fill a malformed email and assert format validation appears. | Password recovery is reachable and validates inputs without sending a real recovery request. | Do not submit a valid email address in production unless a disposable inbox and cleanup policy are provided. |

### MS-V2-033 - Register Entry From Login

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open the login page.<br>2. Click the register/signup entry.<br>3. Assert the registration route or modal is shown.<br>4. Assert core registration fields or social registration options are visible.<br>5. Navigate back to login.<br>6. Assert the login form is restored. | Users can discover registration from login without accidentally creating an account. | Keep production automation read-only. Full registration belongs in dev/staging with disposable test data. |

### MS-V2-034 - Valid Seeded Member Login

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| `AUTH_TEST_EMAIL` and `AUTH_TEST_PASSWORD` are configured for a non-admin seeded member. | 1. Open the login page.<br>2. Fill the configured email and password.<br>3. Submit the form.<br>4. Assert login succeeds by checking member-only header/account state.<br>5. Assert anonymous login/register prompts are no longer primary account actions.<br>6. Save authenticated storage state only for downstream credentialed tests in the same CI run. | Seeded member credentials authenticate successfully and expose member UI. | Skip this test when credentials are absent. Never print credential values in logs, screenshots, traces, or assertion messages.<br><br>Production observation on 2026-08-10: valid member login succeeds with `POST /sys/kr/auth/login` 200, followed by `GET /sys/kr/user/me` 200 and the `로그인에 성공했습니다.` toast. The login page should wait for Nuxt hydration and bootstrap API responses before filling credentials. |

### MS-V2-035 - Session Persistence And Logout

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| `AUTH_TEST_EMAIL` and `AUTH_TEST_PASSWORD` are configured. | 1. Log in with the seeded credentials and assert the member menu.<br>2. Reload the page and assert the member menu survives a full document load.<br>3. Navigate to a category page and assert the member menu is still there.<br>4. Open `./account/profile` and assert the member-only page renders.<br>5. Log out and assert the header returns to its guest state. | Login persists across reload and navigation, reaches member-only routes, and logout fully clears it. | Now covers the reload/navigation persistence this case always specified — the earlier implementation only asserted login then logout. The member-only route in step 4 is the strongest available signal the session is genuinely live; MS-V2-095 asserts the anonymous half of the same boundary. |

### MS-V2-036 - Public Navigation Categories API

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous API request context. | 1. Send `GET /index.php/sys/kr/navigation/categories` against `API_BASE_URL`.<br>2. Assert the response is 2xx.<br>3. Assert the response content type is JSON.<br>4. Assert the payload is not empty.<br>5. Assert the payload includes known storefront category slugs such as `stickers`, `roll-stickers`, or `sheet-stickers`. | Public navigation category metadata is available for storefront bootstrap. | Use Playwright `request`. Do not require browser UI setup for this test. |

### MS-V2-037 - Public Inquiry Types API

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous API request context. | 1. Send `GET /index.php/sys/kr/inquiry/types` against `API_BASE_URL`.<br>2. Assert the response is 2xx.<br>3. Assert the response content type is JSON.<br>4. Assert the payload is not empty. | Inquiry type metadata is available without login so the inquiry form can render its selectable options. | Keep assertions schema-light unless the API team publishes a stable response contract. |

### MS-V2-038 - Anonymous User Session API Boundary

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous API request context. | 1. Send `GET /index.php/sys/kr/user/me` against `API_BASE_URL` without credentials.<br>2. Assert the response status is `401`.<br>3. Assert the response body does not expose stack traces, SQL details, or raw exception text. | The session endpoint rejects anonymous callers cleanly without leaking implementation details. | This is a production-safe negative API check. Authenticated `200` coverage belongs with credentialed auth tests. |

### MS-V2-039 - About Page Content

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/about`.<br>2. Assert the hero heading containing `우리가 만드는 것은` is visible.<br>3. Assert stats `10년+` and `수십만 건` are visible.<br>4. Assert sub-nav buttons `왜 만들었나`, `우리의 철학`, `왜 빠른가`, and `우리가 가는 길` are visible.<br>5. Assert CTA buttons `우리의 이야기 보기` and `바로 주문하기` are visible.<br>6. Assert footer brand and terms/privacy links are visible. | The About page renders its full public content without client error. | Use `AboutV2Page` POM. Discovered via sitemap.xml on 2026-08-11; previously untested. |

### MS-V2-040 - Full Catalog Crawl

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. For each product path listed in `sitemap.xml` that is not already deep-tested by `v2Products` (23 pages across sticker/roll/sheet shape variants, hologram, lettering, and sheet products), navigate directly to the page.<br>2. Assert the URL did not silently redirect elsewhere (a missing catalog path must reach the 404 page covered by MS-V2-043, not a quiet redirect).<br>3. Assert a level-1 heading is visible.<br>4. Assert the product options panel is visible. | Every catalog product page renders independently, not only when reached through its category listing link. | One parameterized test per path via `ProductV2Page.expectCatalogEntryRenders()`, tagged `@regression`. This is render-only coverage (heading + options panel), not full size/quantity configuration — that remains covered by the 3 representative products in `product-config.spec.ts`. |

### MS-V2-041 - Checkout Page Renders

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with one item added to cart. | 1. Configure the representative die-cut sticker product (size + quantity) and click `장바구니 담기` in the next-step dialog. Production observation on 2026-08-11: adding to cart does **not** require a design file upload first — the dialog explicitly says the file can be uploaded later from the cart or post-checkout dashboard.<br>2. Navigate to `/checkout`.<br>3. Assert contact email, name, and postal code fields are visible.<br>4. Assert Kakao Pay and credit card payment method options are visible.<br>5. Assert the order summary shows a coupon-discount line.<br>6. Assert the `결제하기` (pay) button is visible. Do not click it. | The checkout page renders its full shipping/payment form for a real (non-empty) cart, entirely without submitting. | Confirmed live that navigating directly to `/checkout` with an **empty** cart redirects to `/cart` (see MS-V2-004), so this test must add an item to cart first via the new `ProductV2Page.addToCart()` helper. |

### MS-V2-042 - Checkout Blank Submission Blocked

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with one item added to cart (same setup as MS-V2-041). | 1. Reach the checkout page with a populated cart and all shipping/contact fields left blank.<br>2. Click `결제하기`.<br>3. Assert the page stays on `/checkout` (no navigation to a payment gateway or confirmation page).<br>4. Assert a validation/error indicator becomes visible. | Checkout cannot proceed to payment when required fields are blank. | This replaces an originally-planned "invalid coupon code" test. Production observation on 2026-08-11: no manual coupon-code input exists on the anonymous checkout page (only a static "쿠폰 할인" summary line), so that scenario isn't testable as scoped. Confirmed via network capture that clicking pay while blank fires no order/payment API call — only page-load bootstrap calls (`coupon/applicable`, `shipping/shipping-methods-local`, `address/validate`). |

### MS-V2-043 - Unknown Route Handling

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to a nonsense path under the current locale (e.g. `/this-page-does-not-exist-e2e-check`).<br>2. Assert the response status is `404`.<br>3. Assert the branded not-found page renders ("앗! 페이지를 찾을 수 없습니다.").<br>4. Click "홈으로 돌아가기" and assert the homepage hero heading is visible. | Unknown routes fail safely, with a real 404 status and a recovery path home. | Production behavior changed after the 2026-08-11 observation. Unknown `/kr/*` routes no longer redirect to the homepage with a `200`; they now return `404` and render a dedicated not-found page. The test asserts that page plus its back-home button, and opts into the `allowExpectedNotFound` guard option so the deliberate 404 response (and the console error the browser logs for it) is not reported as a failure. |

### MS-V2-044 - Password Visibility Toggle Re-Verification

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Re-run MS-V2-031 against current production.<br>2. Confirm the password input's `type` attribute transitions password → text → password across two toggle clicks. | The visibility toggle behaves correctly. | Production observation on 2026-08-11: masked → visible → masked all confirmed via a live browser check. The bug noted in the MS-V2-031 automation notes on 2026-08-10 (toggle rendered but did not unmask) is no longer reproducible, so the `test.fixme` on MS-V2-031 has been removed rather than kept. |

### MS-V2-050 - Sheet Sticker Configurator (Circle/Oval/Square/Rectangle/Rounded)

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. For each of the five shape variants (`./sheet-stickers/circle-sheet`, `oval-sheet`, `square-sheet`, `rectangle-sheet`, `rounded-sheet`), navigate to the product page and assert its heading (`원형 판스티커`, `타원형 판스티커`, `정사각형 판스티커`, `직사각형 판스티커`, `둥근 사각형 시트 스티커`).<br>2. Select material `홀로그램`.<br>3. Select preset individual size `중형`.<br>4. Select quantity `20시트`.<br>5. Assert the price is visible and `다음 단계` is enabled.<br>6. Click `다음 단계` and assert the `디자인 파일 업로드` modal appears with the accepted-format note and a file-select button.<br>7. Click `장바구니 담기` without uploading a file.<br>8. Assert the cart preview drawer shows a line item for the product with quantity `20시트`. | All five shape variants support the material/individual-size/sheet-quantity configurator identically and add to cart without requiring a design file upload. | Verified live against development-3 (`dev-3.musticker.com`) on 2026-08-13. This is the individual-sticker sheet configurator (material + per-sticker size + sheet quantity), distinct from the die-cut sheet's A5-template flow in MS-V2-011; these five paths were previously only render-only smoke tested via MS-V2-040. Implemented as `ProductV2Page` + `CartDrawer` in `tests/e2e/purchasing/sheet-sticker-configurator.spec.ts`. |

### MS-V2-051 - Custom Individual Size Recalculates The Price Ladder

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/sheet-stickers/circle-sheet`.<br>2. Open `원하는 크기 입력` and fill 가로/세로 (both number inputs, no explicit apply button) with `20` and `20`.<br>3. Assert a price is visible and `다음 단계` is enabled. | Entering a custom individual size live-recalculates every sheet-quantity tier's price (all default to `0원` until both dimensions are filled). | The custom-size row occasionally did not mount on the first click on development-3, alongside a `Hydration completed but contains mismatches` console warning; the POM helper (`ProductV2Page.selectCustomIndividualSize`) retries the click once before failing, which resolved an observed intermittent 60s timeout on `getByPlaceholder('가로')`. |

### MS-V2-052 - Bulk Quantity Discount Badge

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/sheet-stickers/circle-sheet`.<br>2. Select quantity `5시트`. Assert no `-NN%` discount badge is visible.<br>3. Select quantity `1,000시트`. Assert a `-NN%` discount badge is visible. | Bulk tiers surface a discount badge that smaller tiers do not. | Discount percentage/original-price values are dynamic (observed `-62%`/`-84%` on different runs); assert badge presence, not an exact value. |

### MS-V2-053 - Design Upload Modal Accepts Note And File

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session and a local PNG fixture (`tests/fixtures/files/sample-design.png`). | 1. Navigate to `/sheet-stickers/circle-sheet`, select quantity `10시트`, click `다음 단계`.<br>2. Upload the fixture file via the modal's file input and assert the dropzone switches to the accepted-file state (filename shown, `이미지 교체`/`업로드한 디자인 삭제` affordances).<br>3. Fill `기타 요청 사항` with an order note.<br>4. Click `장바구니 담기` and assert the cart preview drawer shows the line item.<br>5. View the full cart page and assert the row shows an image-state link (`이미지 추가` or `이미지 변경`). | The upload modal accepts an optional note and file and still adds the item to cart. | Open question, not asserted as a defect: with this minimal 67-byte fixture PNG, the dropzone shows the file as attached client-side, but no upload network request was observed firing, and the cart page still showed `이미지 추가` (not `이미지 변경`) afterward. Could not rule out this being an artifact of the tiny fixture file rather than a real "upload doesn't persist" bug, so the test only asserts that *some* image-state link is present, not which one. Worth re-checking with a realistic image file. |

### MS-V2-054 - Cart Preview Drawer Material Edit

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with a circle sheet sticker (`PVC 매트`, `5시트`) in the cart. | 1. Open the cart preview drawer and click the item's `상품 수정` (edit) control.<br>2. In the `사이즈 및 수량 수정` dialog, select material `홀로그램` and click `업데이트`.<br>3. Assert the dialog closes and the drawer total changes to match the hologram tier price shown on the product page. | Editing material from the drawer recalculates the line price. | Added `CartDrawer.editFirstItemMaterial()`. The existing `editFirstItemSizeAndQuantity()` helper assumes a numeric-mm size dropdown (die-cut/roll products); it is not compatible with this configurator's named-preset size dropdown (`소형 40x40mm`, `중형 60x60mm`, ...), so a dedicated material-only helper was added rather than reusing it. Verifying this test also surfaced that the shared harness (`tests/fixtures/e2e-test.ts`) only recognized `dev-api`/`api.musticker.com` in its known-issue allowlist for superseded-pricing-request console warnings, not the numbered `dev-2-api`/`dev-3-api`/`dev-4-api` hosts added when multi-environment testing was wired up — causing a spurious failure on development-3. Generalized the guard regexes (`DEV_API_HOST`, `DEV_STOREFRONT_HOST`) to cover all environments in `environments.ts`; re-ran the full pre-existing suite (product-config, checkout-page, catalog-crawl — 31 tests) against development-3 afterward with no regressions. |

### MS-V2-055 - Drawer To Full Cart Page Handoff

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with a circle sheet sticker (`PVC 매트`, `5시트`, no file uploaded) in the cart. | 1. From the cart preview drawer, click `장바구니 보기`.<br>2. Assert the URL is `/kr/cart` and the row shows `30x30mm`, `PVC 매트`, `5시트`.<br>3. Assert the row shows `이미지 추가` (no file was uploaded). | The cart preview drawer and full cart page agree on the item's configuration. | New `CartV2Page` POM (`tests/pom/cart-page.ts`), scoped via `data-testid="cart-page-row"`. |

### MS-V2-056 - Full Cart Page Material/Size Edit Dialog

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with a circle sheet sticker (`PVC 매트`, `5시트`) in the cart. | 1. On the full cart page, click the row's `사이즈 변경` link.<br>2. Assert the dialog title is `사이즈 변경` and it exposes only `소재` and `개별 사이즈` — no `수량` control.<br>3. Select material `홀로그램` and click `업데이트`.<br>4. Assert the dialog closes and the row/summary price updates. | Unlike the drawer's combined `사이즈 및 수량 수정` dialog, the full cart page's edit dialog is material+size only; quantity is edited exclusively via the row-level select (see MS-V2-057). This is confirmed live behavior, not a defect — the test asserts it explicitly so a future change (e.g. someone re-adding a quantity field to one surface but not the other) is caught either way. | `CartV2Page.changeMaterialViaSizeChangeDialog()`. |

### MS-V2-057 - Full Cart Page Row Quantity Select

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with a circle sheet sticker (`PVC 매트`, `5시트`) in the cart. | 1. On the full cart page, click the row's quantity select (`button.cart-qty-select-trigger`, showing `5시트`).<br>2. Select `500시트` from the listbox.<br>3. Assert the row and order-summary total update to the `500시트` price immediately, without an separate confirm/update step. | Row-level quantity changes apply immediately, unlike material/size changes which require the `사이즈 변경` dialog's `업데이트` button. | `CartV2Page.changeQuantityViaRowSelect()`. |

### MS-V2-058 - Size Guide Illustration Alt Text (Known Defect)

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. For each of the five shape variants, navigate to the product page.<br>2. Read the `alt` attribute of each of the four `.mini-feature-image` size-guide illustrations (소형/중형/대형/초대형 use-case icons).<br>3. Assert no `alt` text is a raw untranslated i18n key (`^product\.sizes\.`) and none looks like an unrelated sheet/paper-size label (`^A\d+\s`, `^\d+x\d+$`). | Size-guide illustrations have meaningful, localized alt text. | **Currently fails on development-3 for all five shapes** — two distinct defects found while verifying this suite on 2026-08-13:<br><br>- `circle-sheet`, `oval-sheet`, `rectangle-sheet`: `alt` renders the raw, untranslated i18n key, e.g. `product.sizes.small40x40.label`.<br>- `square-sheet`, `rounded-sheet`: `alt` renders unrelated content — paper/sheet size labels (`A6 105x148`, `A5 148x210`, `A4 210x297`, `72x170`) instead of the actual use-case description, suggesting the wrong translation data source is wired up for these two products specifically.<br><br>This test is left asserting correct behavior (not `test.fixme`'d) so it keeps failing loudly until product/eng fixes the underlying i18n/content wiring. |

### ~~MS-V2-059 - Per-Unit Price Is Always Whole Won~~ (Withdrawn 2026-08-13)

> **Withdrawn.** A fractional per-unit readout (e.g. `(1매당 8.582원)`) was confirmed with Korean
> staff on 2026-08-13 to be expected and acceptable pricing behavior, not a defect. No test asserts
> whole-won per-unit prices, and none should be re-added -- see the note at the top of
> `tests/e2e/purchasing/sheet-sticker-configurator.spec.ts`. The original write-up is kept below
> for provenance.

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate to `/sheet-stickers/circle-sheet`.<br>2. Enter custom individual size `20`x`20` and select quantity `1,000시트`.<br>3. Assert the sticker-yield summary reads `40 시트당 스티커 수량` / `합계: 40,000 스티커`.<br>4. Read the `(1매당 X원)` per-unit price readout and assert `X` has no decimal point. | KRW has no sub-won denomination, so the per-unit price should always render as a whole number. | **Currently fails on development-3** — observed `(1매당 8.582원)` and, on a later run, `(1매당 7.463원)` (the fractional value drifts slightly between runs, presumably tied to a live promo/discount calculation, but the fractional-won *format* itself is consistently reproduced). The Figma export for this same screen showed the sticker-yield summary in English (`40 stickers per sheet` / `Total: 40,000 Stickers`); the live development-3 implementation renders it in Korean (`40 시트당 스티커 수량` / `합계: 40,000 스티커`) instead. That divergence is not asserted as a defect here — Korean copy is plausibly correct for a KR storefront — but it is worth confirming with design/product whether the Figma copy or the live copy is the intended source of truth. |


## Sheet Sticker Size Rules (Minimum Two Stickers Per Sheet)

Added 2026-08-26 alongside a storefront change that re-cut the preset size tables for the five
individual-sticker sheet products and introduced a hard rule: an A5 sheet must fit at least two
stickers, so any individual size that packs one (or zero) is priced at 0원 and cannot be ordered.

The five products now share two preset tables by shape family:

| Family | 소형 | 중형 | 대형 | 초대형 |
| --- | --- | --- | --- | --- |
| circle / square / rounded | 30x30 | 50x50 | 75x75 | 90x90 |
| oval / rectangle | 40x20 | 50x30 | 75x50 | 90x60 |

Shopper-facing message (Korean): `더 작은 사이즈를 입력해 주세요. 한 시트에 최소 2개의 스티커가 들어가야 합니다.`
English equivalent: "Please enter a smaller size. At least 2 stickers must fit on each sheet."

All five tests are verified against development-1 and are deliberately **not** tagged `@production`.
Production still serves the older, wider preset tables in which seven presets pack a single sticker
per sheet and remain orderable — `circle` 초대형 100x100, `square`/`rounded` 대형 100x100 and 초대형
125x125, `oval`/`rectangle` 초대형 125x100 — which is the defect this rule closes. MS-V2-075 will
fail on production by design until those tables are promoted; add `@production` to the describe
block at that point.

### A5 Sheet Layout Formula

All expected sticker counts in this suite are derived from the storefront's layout formula, not
restated. It lives in `tests/fixtures/sheet-packing.ts`:

```
Columns            = floor((148 - 5) / (Width  + 5))
Rows               = floor((210 - 5) / (Height + 5))
Stickers per sheet = Columns x Rows
```

The A5 sheet is 148x210mm, 5mm is lost to the sheet edge, and each sticker reserves a further 5mm
gap — hence the `+ 5` on each dimension. A size is orderable only when it packs at least two.

**The gate is 138x97.** 138mm is the widest a single column can be (139mm leaves zero columns), and
at that width 97mm is the tallest two rows can be (98mm leaves one row, so one sticker per sheet).

Verified on development-1 (2026-08-26): the formula reproduces the live `1시트 = 스티커 N개` readout
for all eight shipped presets and across the whole boundary region.

| Size | Columns | Rows | Per sheet | Orderable |
| --- | --- | --- | --- | --- |
| 138x97 | 1 | 2 | 2 | yes — the gate |
| 97x97 | 1 | 2 | 2 | yes |
| 66x97 | 2 | 2 | 4 | yes |
| 67x97 | 1 | 2 | 2 | yes |
| 66x200 | 2 | 1 | 2 | yes — allowed via the width axis |
| 98x98 | 1 | 1 | 1 | no |
| 138x98 | 1 | 1 | 1 | no — 1mm over the gate height |
| 67x200 | 1 | 1 | 1 | no |
| 123x123 | 1 | 1 | 1 | no |
| 139x97 | 0 | 2 | 0 | no — 1mm over the gate width |
| 200x300 | 0 | 0 | 0 | no |

### MS-V2-073 - One-Per-Sheet Custom Size Is Rejected

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. For each of the five shape variants, navigate to the product page.<br>2. Open `원하는 크기 입력` and enter `123` x `123`.<br>3. Assert the message `더 작은 사이즈를 입력해 주세요. 한 시트에 최소 2개의 스티커가 들어가야 합니다.` is visible.<br>4. Assert **every** sheet-quantity tier shows `0원`, not just the selected one.<br>5. Assert `다음 단계` is disabled.<br>6. Assert no separate max-work-area message is shown.<br>7. Assert `1시트 = 스티커 N개` and `총 스티커 수량` show the page's default 소형 preset values (20/100 for circle/square/rounded, 24/120 for oval/rectangle). | A size that fits only one sticker per sheet cannot be priced or ordered on any of the five products. | `ProductV2Page.expectMinimumTwoPerSheetError()`, `expectAllQuantityTiersZeroPriced()`, `expectNextStepDisabled()`. Steps 6 and 7 assert **intended** behavior confirmed on development-1 on 2026-08-26, not defects: an oversized entry (144x206 and up, which packs zero) deliberately reuses the same minimum-two message rather than getting its own `가로 138mm × 세로 200mm 이내로 작업해 주세요.` line, and the two count readouts deliberately fall back to the default preset while the entered size is rejected. Both are asserted so a silent change to either is caught. |

### MS-V2-074 - The 138x97 Gate Is Exact

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session on `./sheet-stickers/circle-sheet`. | 1. Enter custom size `138` x `97`.<br>2. Assert no error, `1시트 = 스티커 2개`, a visible price, and `다음 단계` enabled.<br>3. Change the height to `98`.<br>4. Assert the minimum-two-per-sheet error and `다음 단계` disabled. | The documented gate holds exactly: at full column width, two rows fit at 97mm and only one at 98mm. | Expected counts come from `stickersPerSheet()` rather than being hard-coded. Step 3 also covers the allowed-then-blocked transition within one session, which is a distinct path from landing on a blocked size on a fresh page (MS-V2-078) — on this path the count readout falls back to the previous valid size's count rather than the page default. |

### MS-V2-075 - Preset Sizes Match The Shape-Family Table

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. For each of the five shape variants, navigate to the product page.<br>2. Assert the four `.option-grid-size` preset pills read exactly the shape family's labels and dimensions, and that the grid holds those four plus the trailing `원하는 크기 입력` pill.<br>3. Select each preset in turn and assert its rendered per-sheet count equals the layout formula's count exactly, that the formula's count is at least two, that no error shows, and that `다음 단계` stays enabled. | No shipped preset is a size the custom-size input would reject. | This is the invariant behind the whole change, and the one production currently violates — see the section preamble. Fixture data lives in `sheetStickerConfiguratorProducts` (`sizePresets`) in `tests/fixtures/storefront-data.ts`. |

### MS-V2-076 - Cart Edit Dialogs Enforce The Same Rule

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session with a circle sheet sticker (`PVC 매트`, `5시트`) in the cart. | 1. In the cart preview drawer, open `사이즈 및 수량 수정`.<br>2. Choose `맞춤 사이즈` from the 개별 사이즈 select and enter `123` x `123`.<br>3. Assert the minimum-two-per-sheet error is visible and `업데이트` is disabled.<br>4. Reload, go to the full cart page, open the row's `사이즈 변경` dialog and repeat.<br>5. Assert the same error and a disabled `업데이트`. | The rule cannot be bypassed by editing an already-carted item on either cart surface. | Both dialogs surface the custom option as `맞춤 사이즈` inside a ui-select listbox (not the product page's `원하는 크기 입력` pill), and their inputs are `.cart-item-edit-inline-input` pre-filled with the line item's current size. Shared helper: `tests/pom/cart-size-dialog.ts`. |

### MS-V2-077 - Size Guide Modal Enforces The Same Rule

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session on `./sheet-stickers/circle-sheet`. | 1. Open the `배치 가이드 보기` modal.<br>2. Click `직접 입력` and enter `123` x `123`.<br>3. Assert the minimum-two-per-sheet error is visible and `적용하기` is disabled. | The rule is enforced on the third surface that accepts a custom size, so it cannot be applied to the configurator from the guide. | The modal's inputs are `#sheet-width`/`#sheet-height` and carry no `type` attribute, so an `input[type=...]` selector matches nothing there. |

### MS-V2-078 - Per-Sheet Count Matches The Layout Formula

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session on `./sheet-stickers/circle-sheet`. | 1. For each size in the boundary table above, enter it as a custom individual size.<br>2. Where the formula packs two or more: assert no error, assert `1시트 = 스티커 N개` equals the formula's count exactly, assert a visible price and `다음 단계` enabled.<br>3. Where the formula packs fewer than two: assert the minimum-two-per-sheet error, every quantity tier at `0원`, and `다음 단계` disabled. | The storefront's own arithmetic agrees with the layout formula on both sides of the gate, not merely on the shipped presets. | Parameterized from `sheetPackingBoundaryCases` in `tests/fixtures/sheet-packing.ts`; each case's expected count is cross-checked against `stickersPerSheet()` so the table cannot drift from the formula. Covers both gate axes — width (138 vs 139) and height (97 vs 98) — and the case where two columns rather than two rows satisfy the rule (`66x200`).<br><br>Note on rejected sizes: the counts fall back to the **last valid** configuration, which on a freshly loaded page is the default 소형 preset. Step 3 therefore asserts only the gate, while MS-V2-073 asserts the fallback values explicitly. |

## Registration And Password Management

The register form and the account profile's password section were mapped live against
`development-1` on 2026-08-27. Two behaviours shape every case below:

* **Registration is two-stage.** `계정 만들기` validates client-side, then
  `POST /auth/register/verification` (201) opens a 4-digit code modal. The account does not exist
  until that emailed code is confirmed via `POST /auth/register` — 201 on success, 200 with
  `success: false` on a mismatch. Everything up to the code modal is non-destructive and safe to
  run anywhere.
* **Rejections arrive as HTTP 200.** Both `POST /auth/login` and `PUT /profile/password` answer
  200 and carry the outcome in the body, so no test can assert on a 4xx. Assertions go through
  the rendered field error instead.

The forms also label their errors differently: the register form and the forgot-password dialog
use the shared `ui-form-field-error-message` test id, while the login form uses per-field ids
(`auth-login-member-email-error`, `auth-login-member-password-error`). Neither locator
substitutes for the other.

One more shared constraint: Nuxt serves these pages fully rendered roughly 1.2s before it binds
their client-side handlers, so a click that lands early hits an inert form and silently does
nothing. `waitForPasswordFormInteractive` in `tests/fixtures/hydration.ts` closes that window by
round-tripping a password visibility toggle before any test interacts with the form.

### MS-V2-079 - Register Form Controls

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Assert the 회원가입 heading, name, email, and password fields are visible.<br>3. Assert the password field is masked and carries a visibility toggle.<br>4. Assert the terms and privacy links point at `/kr/terms-of-use` and `/kr/privacy-policy`.<br>5. Assert the marketing opt-in checkbox and the 계정 만들기 submit are present.<br>6. Assert the stated password policy copy is rendered. | The register page exposes every control needed to create an account, with its policy stated up front. | `RegisterPage` POM. Read-only — nothing is submitted. |

### MS-V2-080 - Blank Register Validation

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Submit with every field blank.<br>3. Assert 필수 항목입니다. is shown.<br>4. Assert the URL is still the register route.<br>5. Assert no verification-code modal opened. | A blank registration is stopped client-side and requests no account. | The register form reports blank fields with `필수 항목입니다.`, which differs from the login form's `필수 입력 항목입니다.` — `authCopy` keeps both. |

### MS-V2-081 - Malformed Register Email

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Fill a valid name and password with the email `not-an-email`.<br>3. Submit.<br>4. Assert 이메일 형식이 올바르지 않습니다. is shown.<br>5. Assert no verification-code modal opened. | A malformed address never reaches the verification endpoint. | Validation short-circuits on the first failing rule, so this case fills a valid password to be sure the email rule is what fires. |

### MS-V2-082 - Register Password Policy

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Fill a valid name and a unique email, with the password `abc`.<br>3. Agree to the terms and submit.<br>4. Assert 비밀번호가 요구 사항을 충족하지 않습니다. is shown.<br>5. Assert no verification-code modal opened. | The stated policy — at least 6 characters including an uppercase letter, digit, or special character — is actually enforced. | `abc` fails on both length and character class. The email is unique per run so a previously registered address cannot mask the password rule. |

### MS-V2-083 - Terms Agreement Required

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Fill valid name, unique email, and a policy-compliant password, leaving the terms checkbox unchecked.<br>3. Submit.<br>4. Assert the terms row is in its error state and its explainer control is shown.<br>5. Assert no verification-code modal opened.<br>6. Check the terms box and assert the error state clears. | An account cannot be requested without agreeing to the terms, and the error resolves once the shopper does. | The terms row has no inline `ui-form-field-error-message`; it flips the label's `data-state` to `error` and reveals a danger-toned tooltip button (`auth-register-terms-error`) whose only text is the screen-reader label 약관 오류 정보. Assert on the state and the control, not on visible copy. |

### MS-V2-084 - Register Password Masking

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Fill the password field with a dummy value.<br>3. Assert the input is masked.<br>4. Toggle visibility and assert it unmasks.<br>5. Toggle again and assert it re-masks.<br>6. Assert the value never appears in the URL. | Password entry on register behaves the same as on login. | Mirrors MS-V2-031/044. Note the toggle's test id here is `auth-register-password-toggle`, without the `-button` suffix the login page uses. |

### MS-V2-085 - Login Entry From Register

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/register`.<br>2. Click 여기서 로그인하세요.<br>3. Assert the login route is shown.<br>4. Assert the member login controls are restored. | Registration and login are reachable from one another, closing the loop MS-V2-033 opens. | Read-only. |

### MS-V2-086 - Existing Email Offers Sign-In

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| `AUTH_TEST_EMAIL` is configured for an already-registered member. | 1. Open `./auth/register`.<br>2. Fill the seeded member's email with a valid name and password, and agree to the terms.<br>3. Submit.<br>4. Assert the 이미 등록된 이메일입니다. modal opens with a masked password field, a 계속 button, and a forgot-password link.<br>5. Assert no verification-code modal opened. | A duplicate registration is converted into a sign-in prompt rather than a second account or a dead end. | The verification endpoint answers 200 with `email_already_taken`; the app opens `auth-email-registered-modal` in response. Non-destructive — the modal is asserted on but never completed, so no session is created. Skips when `AUTH_TEST_EMAIL` is unset. |

### MS-V2-087 - Wrong Verification Code Rejected

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| `RUN_AUTH_DESTRUCTIVE_E2E=true` against a dev environment. | 1. Create a disposable mail.tm inbox.<br>2. Register with that address and wait for the code modal.<br>3. Read the emailed code, then submit a deliberately different one.<br>4. Assert the response status is not 201.<br>5. Assert 입력하신 인증번호가 일치하지 않습니다. is shown and the modal stays open. | A wrong code cannot create an account. | The mismatch is an HTTP 200 with `success: false`, so the assertion is `not.toBe(201)` plus the rendered message — a 4xx never arrives. The wrong code is derived from the real one so it can never collide with it. |

### MS-V2-088 - Successful Registration

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| `RUN_AUTH_DESTRUCTIVE_E2E=true` against a dev environment. | 1. Create a disposable mail.tm inbox.<br>2. Register with that address and wait for the code modal.<br>3. Assert the verification email comes from `system@musticker.com`.<br>4. Submit the emailed code.<br>5. Assert the response is 201.<br>6. Assert the app lands on `/kr/auth/profile` with the welcome heading and the new member's email prefilled. | A correct code creates the account, signs the new member straight in, and hands off to profile onboarding. | Creates a real member on the target environment — gated behind `RUN_AUTH_DESTRUCTIVE_E2E`, never run against production. The mailbox is disposable, so the account is unreachable afterwards and needs no cleanup. |

### MS-V2-089 - Password Section Controls

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Seeded member is logged in. | 1. Open `./account/profile`.<br>2. Assert the account shell and its profile tab are shown.<br>3. Assert current, new, and confirm password fields are visible and masked.<br>4. Assert 비밀번호 변경 and the forgot-password entry are visible.<br>5. Assert the password policy copy is rendered. | The change-password form is discoverable and states its rules. | `AccountProfilePage` POM. Read-only. |

### MS-V2-090 - Change Password Requires Every Field

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Seeded member is logged in. | 1. Open `./account/profile`.<br>2. Assert 비밀번호 변경 is disabled.<br>3. Fill the current password; assert it is still disabled.<br>4. Fill the new password; assert it is still disabled.<br>5. Fill the confirmation; assert it becomes enabled. | The form cannot be submitted half-filled. | Unlike the login and register forms, this one gates on the button's disabled state rather than on submit-time validation. |

### MS-V2-091 - Mismatched Confirmation Rejected

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Seeded member is logged in. | 1. Open `./account/profile`.<br>2. Enter the correct current password and a valid new password, with a different confirmation.<br>3. Submit.<br>4. Assert 비밀번호가 일치하지 않습니다. is shown. | A typo in the confirmation cannot silently change the password. | The request is still sent and answered 200; the rejection is only visible in the rendered error. The seeded member's password is unchanged by this case. |

### MS-V2-092 - New Password Policy Enforced

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Seeded member is logged in. | 1. Open `./account/profile`.<br>2. Enter the correct current password with `abc` as both new password and confirmation.<br>3. Submit.<br>4. Assert 비밀번호가 설정 요구사항을 충족하지 않습니다. is shown. | The policy applies to changed passwords, not just new registrations. | Note the wording differs from the register form's 비밀번호가 요구 사항을 충족하지 않습니다.; `authCopy` keeps both. |

### MS-V2-093 - Wrong Current Password Rejected

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Seeded member is logged in. | 1. Open `./account/profile`.<br>2. Enter a deliberately wrong current password with a valid new password and confirmation.<br>3. Submit.<br>4. Assert 비밀번호가 올바르지 않습니다. is shown. | Knowing the current password is required, so a hijacked session cannot lock the owner out. | Each failure mode has a distinct message, so this assertion cannot pass on a mismatch or policy failure by accident. |

### MS-V2-094 - Password Change Rotates The Credential

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| `RUN_AUTH_DESTRUCTIVE_E2E=true` against a dev environment. | 1. Register a throwaway member through the full OTP flow.<br>2. Open `./account/profile` and change its password.<br>3. Assert the form clears with no error.<br>4. Clear cookies and log in with the new password; assert the member menu appears.<br>5. Clear cookies and attempt the old password; assert it is rejected and the user stays anonymous. | A successful change really does rotate the credential — the new password works and the old one stops working. | Registers its own account rather than touching the seeded member, whose password every other `@credentialed` test depends on. There is no success toast on this form: an accepted change is signalled only by the cleared fields, which is what step 3 asserts. |

### MS-V2-095 - Member-Only Route Is Gated

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Navigate directly to `./account/profile`.<br>2. Assert the account profile section never renders.<br>3. Assert the browser does not remain on the account route. | Account pages are not reachable without a session. | Observed behaviour on development-1 is a redirect to the storefront home, not to the login form — the assertion is therefore "not on the account route and no account content", which holds whichever of the two the app chooses. |

### MS-V2-096 - Non-Member Order Lookup

| Preconditions | Steps | Expected Result | Automation Notes |
| --- | --- | --- | --- |
| Anonymous session. | 1. Open `./auth/login`.<br>2. Switch to 비회원 mode.<br>3. Assert the email and order-number fields and the lookup submit are visible.<br>4. Assert the member password field is gone. | Guest shoppers can look up an order without an account, and that mode offers no password entry. | Read-only — nothing is submitted, so no order lookup is performed. |

## Suggested Spec Organization

- `tests/e2e/smoke/storefront-smoke.spec.ts`
- `tests/e2e/api/public-api.spec.ts`
- `tests/e2e/auth/login.spec.ts`
- `tests/e2e/discovery/category-discovery.spec.ts`
- `tests/e2e/purchasing/product-config.spec.ts`
- `tests/e2e/validation/inquiry-validation.spec.ts`
- `tests/e2e/discovery/faq.spec.ts`
- `tests/e2e/smoke/mobile-critical.spec.ts`
- `tests/e2e/regression/accessibility.spec.ts`
- `tests/e2e/regression/visual.spec.ts`
- `tests/e2e/discovery/about.spec.ts`
- `tests/e2e/discovery/catalog-crawl.spec.ts`
- `tests/e2e/purchasing/checkout-page.spec.ts`
- `tests/e2e/regression/error-pages.spec.ts`
- `tests/e2e/purchasing/sheet-sticker-configurator.spec.ts`
- `tests/e2e/purchasing/sheet-sticker-size-rules.spec.ts`

## Suggested POM Updates

- `HomePage`: hero, category links, review carousel, inquiry CTA, footer assertions.
- `HeaderComponent`: search, cart, account, locale, product navigation.
- `LoginPage`: open, fill credentials, submit, assert validation, assert anonymous/authenticated state, open recovery, open registration.
- `ProductPage`: select size, custom size, select quantity, custom quantity, material selection, price summary, next step, add to cart, catalog-entry render check, custom individual sheet size, sticker-yield summary, bulk-discount badge, per-unit-price whole-won check, size-guide alt-text audit, design-upload modal (accept note + file).
- `InquiryForm`: open, choose inquiry type, fill fields, attach files, assert validation, cancel.
- `FaqPage`: search, select topic, expand question, assert answer.
- `AboutPage`: hero/stats assertions, sub-nav visibility, CTA visibility, footer assertions.
- `CheckoutPage`: open, assert form renders, assert blank-submission is blocked.
- `CartPage` (full `/kr/cart` page, distinct from the header `CartDrawer` preview): row assertions, change material via the `사이즈 변경` dialog, change quantity via the row-level select, image-attachment link state.

## Production-Safe Command Examples

```powershell
npm.cmd run test:prod:smoke
npm.cmd run test:api
npm.cmd run test:prod:full
npm.cmd run test:prod:mobile
```

## Credentialed Auth Command Examples

```powershell
$Env:AUTH_TEST_EMAIL = "seeded-member@example.com"
$Env:AUTH_TEST_PASSWORD = "replace-with-secret"
npx.cmd playwright test tests/e2e/auth/login.spec.ts --grep "@credentialed" --project chromium-desktop
```

## Dev/Destructive Command Examples

```powershell
$Env:RUN_PAYMENT_E2E = "true"
$Env:SKIP_SEEDED_AUTH_SETUP = "true"
npm.cmd run test:e2e:member-regression
```

```powershell
# Registration OTP completion and the password rotation. Creates real accounts -- dev only.
$Env:E2E_ENVIRONMENT = "development-1"
$Env:RUN_AUTH_DESTRUCTIVE_E2E = "true"
npm.cmd run test:destructive:auth
```
