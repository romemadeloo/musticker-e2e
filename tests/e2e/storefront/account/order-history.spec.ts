import { test, expect } from '../../fixtures/e2e-test.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../fixtures/member-auth.js';
import { orderHistoryCopy } from '../../fixtures/storefront-data.js';
import { AccountOrdersPage } from '../../pom/account-orders-page.js';

// Order history had no coverage at all: everything after the payment succeeded was untested, which
// for a print-to-order business is where the shopper spends most of their time with the site.
//
// Verified live against development-1 on 2026-08-27 with a seeded member holding 67 orders:
//
//   * 진행 중 lists 61 cards, 이전 내역 lists 6, and the segmented control reports which is showing
//     through `aria-pressed`.
//   * Selecting a card routes to /kr/account/orders/<id> and fills the detail pane with that order's
//     invoice (상품 금액 / 배송비 / 총계 rows).
//   * The search box filters on Enter, not as you type: 61 cards became 1 for an exact order number.
//
// Read-only throughout -- nothing here places, alters, or cancels an order -- so it runs against
// production alongside the rest of the credentialed suite.
//
// Which segment holds the orders is NOT fixed, and these tests must not assume it. 진행 중 lists only
// orders still in flight, so it empties as orders complete, and the two environments sat on opposite
// sides of that on 2026-08-31: the dev member had 61 orders in 진행 중, while production's had all 12
// of its orders aged into 이전 내역 and 진행 중 correctly showing 모든 주문을 확인하셨습니다!.
// Anything needing cards goes through openSegmentWithOrders() and skips when the member holds no
// orders in either segment.
test.describe('storefront v2 order history', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-V2-107 order history lists the member\'s orders with a number and a date each @smoke', async ({ page }) => {
    const orders = new AccountOrdersPage(page);

    await orders.goto();
    const { count: cardCount } = await orders.openSegmentWithOrders();
    test.skip(cardCount === 0, 'MS-V2-107 needs a member holding at least one order in either segment.');

    // Every card has to identify its order -- a card a shopper cannot trace back to an order number
    // is not usable, and captureOrderNumbers() fails the test naming the offending card.
    const orderNumbers = await orders.captureOrderNumbers();
    expect(orderNumbers).toHaveLength(cardCount);
    expect(new Set(orderNumbers).size, 'each card must show a distinct order number').toBe(orderNumbers.length);

    // Order dates, as the second thing that makes a card identifiable.
    const cards = orders.orderCards();
    for (let index = 0; index < Math.min(cardCount, 5); index += 1) {
      await expect(cards.nth(index), `order card ${index} shows no order date`).toContainText(
        /주문일:\s*\d{4}년\s*\d{1,2}월\s*\d{1,2}일/
      );
    }

    // The advertised count has to be a real number. It is deliberately NOT asserted equal to the
    // rendered card count: on development-1 the badge read 57 against 61 visible cards (and 3
    // against 6 on 이전 내역). Whether the badge excludes some states by design or is undercounting
    // is an open question for the storefront team -- asserting either way would be a guess.
    expect(await orders.captureDeclaredOrderCount()).toBeGreaterThan(0);
  });

  test('MS-V2-108 selecting an order opens that order, not a placeholder', async ({ page }) => {
    const orders = new AccountOrdersPage(page);

    await orders.goto();
    const { count } = await orders.openSegmentWithOrders();
    test.skip(count === 0, 'MS-V2-108 needs a member holding at least one order to open.');

    // The detail pane starts as a prompt, so "the invoice is showing" is a real state change.
    await orders.expectNoOrderSelected();

    const orderNumber = await orders.selectOrder(0);
    await orders.expectOrderDetail(orderNumber);
  });

  test('MS-V2-109 the 진행 중 / 이전 내역 control switches which orders are listed', async ({ page }) => {
    const orders = new AccountOrdersPage(page);

    await orders.goto();
    await orders.waitForListSettled();
    await orders.expectSelectedSegment('inProgress');

    // Either segment may legitimately be empty, so both lists are read as they come -- what has to
    // hold is that the control filters, which an empty segment demonstrates as well as a full one.
    const inProgress = await orders.captureOrderNumbers();

    await orders.switchTo('past');
    await orders.waitForListSettled();
    const past = await orders.captureOrderNumbers();

    test.skip(
      inProgress.length + past.length === 0,
      'MS-V2-109 needs a member holding at least one order; with both segments empty there is nothing to filter.'
    );

    // The two lists have to be genuinely different sets, not the same list relabelled.
    const overlap = past.filter((orderNumber) => inProgress.includes(orderNumber));
    expect(
      overlap,
      'an order cannot be both in progress and in the past; the segmented control is not filtering'
    ).toEqual([]);

    await orders.switchTo('inProgress');
    await orders.waitForListSettled();
    expect(await orders.captureOrderNumbers(), 'switching back must restore the in-progress list').toEqual(inProgress);
  });

  test('MS-V2-110 order search narrows the list to the order that was searched for', async ({ page }) => {
    const orders = new AccountOrdersPage(page);

    await orders.goto();
    const { count: totalBefore } = await orders.openSegmentWithOrders();
    test.skip(totalBefore < 2, 'MS-V2-110 needs a member with at least two orders to prove the list narrowed.');

    const [firstOrderNumber] = await orders.captureOrderNumbers();

    await orders.search(firstOrderNumber);

    await expect
      .poll(() => orders.orderCards().count(), {
        timeout: 20_000,
        message: `searching for ${firstOrderNumber} must narrow the ${totalBefore}-order list`
      })
      .toBe(1);
    await expect(orders.orderCards().first()).toContainText(firstOrderNumber);

    // Clearing has to bring the rest back, or the shopper is stranded in a filtered view.
    await orders.clearSearch();
    await expect
      .poll(() => orders.orderCards().count(), { timeout: 20_000, message: 'clearing the search must restore the list' })
      .toBe(totalBefore);
  });

  test('MS-V2-111 order history tools are present and named', async ({ page }) => {
    const orders = new AccountOrdersPage(page);

    await orders.goto();

    await expect(orders.header).toBeVisible();
    await expect(orders.searchInput).toBeVisible();
    await expect(orders.selectDateButton).toBeVisible();
    await expect(orders.filtersButton).toBeVisible();
    await expect(page.getByRole('button', { name: orderHistoryCopy.inProgressTab, exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: orderHistoryCopy.pastTab, exact: true })).toBeVisible();
  });
});
