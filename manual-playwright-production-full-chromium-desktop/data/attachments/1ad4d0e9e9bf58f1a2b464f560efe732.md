# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/account/address-book.spec.ts >> Address book >> MS-ACC-012 saved addresses show a name, phone and address, with one marked 기본 배송
- Location: tests/e2e/storefront/account/address-book.spec.ts:23:3

# Error details

```
Error: address card 1 shows no phone number

expect(locator).toContainText(expected) failed

Locator: locator('[data-testid^="account-address-book-item-"]:not([data-testid*="-menu-"])').nth(1)
Expected pattern: /\d{2,3}-?\d{3,4}-?\d{4}/
Received string:  "testtests집"
Timeout: 10000ms

Call log:
  - address card 1 shows no phone number with timeout 10000ms
  - waiting for locator('[data-testid^="account-address-book-item-"]:not([data-testid*="-menu-"])').nth(1)
    14 × locator resolved to <div data-radius="md" data-v-0e4f5317="" data-v-cad021a9="" data-tone="default" data-padding="none" data-emphasis="soft" data-bordered="default" class="ui-card account-address-book-card" data-testid="account-address-book-item-drop-0">…</div>
       - unexpected value "testtests집"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "Musticker" [ref=e7] [cursor=pointer]:
          - /url: /kr
          - img "musticker logo" [ref=e8]
        - generic [ref=e9]:
          - button "공지사항 열기" [ref=e11] [cursor=pointer]:
            - img [ref=e13]
          - button "layout.header.search" [ref=e15] [cursor=pointer]:
            - img [ref=e16]
          - generic [ref=e19]:
            - button "알림 열기" [ref=e20] [cursor=pointer]:
              - img [ref=e22]
            - generic: "4"
          - generic [ref=e24]:
            - button "장바구니" [ref=e25] [cursor=pointer]:
              - img [ref=e26]
            - generic: "1"
          - button "계정" [ref=e29] [cursor=pointer]:
            - img "Rome Tester" [ref=e32]
      - navigation "Primary":
        - link "스티커" [ref=e33] [cursor=pointer]:
          - /url: javascript:;
        - link "롤스티커" [ref=e34] [cursor=pointer]:
          - /url: javascript:;
        - link "판스티커" [ref=e35] [cursor=pointer]:
          - /url: javascript:;
  - main [ref=e36]:
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - generic [ref=e40]:
            - img "Rome Tester" [ref=e41]
            - img "Bumper Boss (Level 3)" [ref=e42]
          - generic [ref=e43]:
            - heading "Rome Tester" [level=5] [ref=e44]
            - paragraph [ref=e45]: MuScout (등급 1)
        - generic [ref=e46]:
          - generic [ref=e47]:
            - img "Orders" [ref=e48]
            - generic [ref=e49]:
              - paragraph [ref=e50]: 주문
              - paragraph [ref=e51]: "24"
          - generic [ref=e52]:
            - img "Points" [ref=e53]
            - generic [ref=e54]:
              - paragraph [ref=e55]: 포인트
              - paragraph [ref=e56]: 10,001,167
          - generic [ref=e57]:
            - img "Coupons" [ref=e58]
            - generic [ref=e59]:
              - paragraph [ref=e60]: 쿠폰
              - paragraph [ref=e61]: "0"
          - generic [ref=e62]:
            - img "Total spent" [ref=e63]
            - generic [ref=e64]:
              - paragraph [ref=e65]: 총 결제 금액
              - paragraph [ref=e66]: 16,700원
      - navigation [ref=e67]:
        - link "프로필" [ref=e68] [cursor=pointer]:
          - /url: /kr/account/profile
          - img [ref=e69]
          - generic [ref=e71]: 프로필
        - link "주소록" [ref=e72] [cursor=pointer]:
          - /url: /kr/account/address-book
          - img [ref=e73]
          - generic [ref=e75]: 주소록
        - link "주문 내역" [ref=e76] [cursor=pointer]:
          - /url: /kr/account/orders
          - img [ref=e77]
          - generic [ref=e79]: 주문 내역
        - link "포인트" [ref=e80] [cursor=pointer]:
          - /url: /kr/account/points
          - img [ref=e81]
          - generic [ref=e83]: 포인트
        - link "쿠폰" [ref=e84] [cursor=pointer]:
          - /url: /kr/account/coupons
          - img [ref=e85]
          - generic [ref=e87]: 쿠폰
        - link "내 리뷰" [ref=e88] [cursor=pointer]:
          - /url: /kr/account/reviews
          - img [ref=e89]
          - generic [ref=e91]: 내 리뷰
      - generic [ref=e93]:
        - generic [ref=e94]:
          - heading "주소록" [level=4] [ref=e95]
          - button "새 주소 추가" [ref=e96] [cursor=pointer]:
            - img [ref=e97]
            - generic [ref=e99]: 새 주소 추가
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]:
              - heading "배송지 주소" [level=2] [ref=e104]
              - paragraph [ref=e105]: 주문을 받을 배송지 입니다.
            - generic [ref=e108]:
              - generic [ref=e109]:
                - generic [ref=e110]:
                  - heading "Rome Tester" [level=6] [ref=e111]
                  - generic [ref=e112]:
                    - img [ref=e113]
                    - generic [ref=e115]: 기본 배송
                - button [ref=e117] [cursor=pointer]:
                  - img [ref=e119]
              - generic [ref=e121]:
                - generic [ref=e122]:
                  - paragraph [ref=e123]: "01000000000"
                  - paragraph [ref=e124]: 서울 강동구 양재대로123길 7 05315
                  - generic [ref=e125]: Rome Inc.
                - generic [ref=e126]: 집
          - generic [ref=e127]:
            - generic [ref=e128]:
              - heading "위탁 배송" [level=2] [ref=e129]
              - paragraph [ref=e130]: 고객님 대신 저희가 제품 제작부터 포장, 배송까지 직접 처리하여 고객님의 주문처로 바로 보내드리는 서비스입니다.
            - generic [ref=e133]:
              - generic [ref=e134]:
                - heading "test" [level=6] [ref=e136]
                - button [ref=e138] [cursor=pointer]:
                  - img [ref=e140]
              - generic [ref=e142]:
                - generic [ref=e144]: tests
                - generic [ref=e145]: 집
    - navigation "네이버 톡톡으로 문의하기" [ref=e146]:
      - link "카카오채널로 문의하기" [ref=e147] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e149]
      - link "네이버 톡톡 으로 문의하기" [ref=e150] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e152]
      - button "이메일로 문의하기" [ref=e153] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e155]
  - contentinfo [ref=e156]:
    - generic [ref=e158]: © 2026 GLOPHICS Corp. All rights reserved.
```

# Test source

```ts
  1  | import { test, expect } from '../../../fixtures/e2e-test.js';
  2  | import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
  3  | import { accountCopy } from '../../../fixtures/storefront-data.js';
  4  | import { AccountAddressBookPage } from '../../../pom/storefront/account-address-book-page.js';
  5  | 
  6  | const copy = accountCopy.addressBook;
  7  | 
  8  | // /kr/account/address-book, verified live against dev-1 on 2026-11-02 with a member holding one
  9  | // default shipping address.
  10 | //
  11 | // Read-only: the add form is opened and cancelled, never saved (its 저장 posts even when blank),
  12 | // and the card menu is opened without choosing anything from it.
  13 | test.describe('Address book', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  14 |   test.use({
  15 |     asMember: true,
  16 |     allowGuestUserMe401: true,
  17 |     allowExpectedAuthFailures: true,
  18 |     allowKnownNuxtPayloadFailures: true
  19 |   });
  20 | 
  21 |   test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);
  22 | 
  23 |   test('MS-ACC-012 saved addresses show a name, phone and address, with one marked 기본 배송', async ({ page }) => {
  24 |     const addressBook = new AccountAddressBookPage(page);
  25 |     await addressBook.goto();
  26 | 
  27 |     const count = await addressBook.addressCards().count();
  28 |     test.skip(count === 0, 'MS-ACC-012 needs a member with at least one saved address.');
  29 | 
  30 |     const cards = addressBook.addressCards();
  31 |     for (let index = 0; index < count; index += 1) {
  32 |       const card = cards.nth(index);
> 33 |       await expect(card, `address card ${index} shows no phone number`).toContainText(/\d{2,3}-?\d{3,4}-?\d{4}/);
     |                                                                         ^ Error: address card 1 shows no phone number
  34 |       // A Korean street address carries a 5-digit postcode. The card runs it straight into the next
  35 |       // line's text ("… 7 05315Rome Inc."), so digit lookarounds rather than word boundaries.
  36 |       await expect(card, `address card ${index} shows no postcode`).toContainText(/(?<!\d)\d{5}(?!\d)/);
  37 |     }
  38 | 
  39 |     const shipping = await addressBook.shippingCards().count();
  40 |     test.skip(shipping === 0, 'MS-ACC-012 checks the default only among shipping addresses, and there are none.');
  41 |     await expect(addressBook.shippingCards().filter({ hasText: copy.defaultBadge })).toHaveCount(1);
  42 |   });
  43 | 
  44 |   test('MS-ACC-013 새 주소 추가 opens the address form, and 취소 closes it without adding anything', async ({ page }) => {
  45 |     const addressBook = new AccountAddressBookPage(page);
  46 |     await addressBook.goto();
  47 |     const before = await addressBook.addressCards().count();
  48 | 
  49 |     await addressBook.openAddDialog();
  50 |     const dialog = addressBook.addDialog;
  51 |     await expect(dialog.getByRole('textbox', { name: copy.nameField, exact: true })).toBeEditable();
  52 |     // The postcode is filled only by the address search, never typed.
  53 |     await expect(dialog.getByRole('textbox', { name: copy.postcodeField, exact: true })).toBeDisabled();
  54 |     await expect(dialog.getByRole('button', { name: copy.findAddressButton, exact: true })).toBeVisible();
  55 |     await expect(dialog.getByRole('button', { name: copy.saveButton, exact: true })).toBeVisible();
  56 | 
  57 |     await addressBook.cancelAddDialog();
  58 |     await expect(addressBook.addressCards()).toHaveCount(before);
  59 |   });
  60 | 
  61 |   test('MS-ACC-014 an address card\'s menu offers edit, delete and make-default', async ({ page }) => {
  62 |     const addressBook = new AccountAddressBookPage(page);
  63 |     await addressBook.goto();
  64 | 
  65 |     const count = await addressBook.addressCards().count();
  66 |     test.skip(count === 0, 'MS-ACC-014 needs a member with at least one saved address.');
  67 | 
  68 |     const menu = await addressBook.openMenu(addressBook.addressCards().first());
  69 |     await expect(menu.getByRole('button')).toHaveText([...copy.menuItems]);
  70 |   });
  71 | });
  72 | 
```