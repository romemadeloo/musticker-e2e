import { test } from '../../../fixtures/e2e-test.js';
import { appPath } from '../../../fixtures/env.js';
import { gotoStorefront } from '../../../fixtures/navigation.js';
import { ko, v2Products } from '../../../fixtures/storefront-data.js';
import { HeaderComponent } from '../../../pom/storefront/header-component.js';
import { InquiryV2Form } from '../../../pom/storefront/inquiry-form.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

test.describe('Mobile critical path', { tag: ['@smoke', '@production', '@mobile'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  test('MS-NAV-008 home, search, cart, product config, and inquiry work on mobile', async ({ page }) => {
    await gotoStorefront(page, appPath());
    await page.getByRole('heading', { name: ko.homeHero }).waitFor({ state: 'visible' });

    // Inquiry is embedded on home; inspect it before leaving instead of loading home again.
    const inquiry = new InquiryV2Form(page);
    await inquiry.open();
    await inquiry.expectVisible();

    const header = new HeaderComponent(page);
    const searchDialog = await header.openSearch();
    await searchDialog.searchFor('\uc2a4\ud2f0\ucee4');
    await searchDialog.closeWithEscape().catch(() => undefined);

    await header.openCart();
    await page.keyboard.press('Escape').catch(() => undefined);

    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;
    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.expectNextStepEnabled();
  });
});
