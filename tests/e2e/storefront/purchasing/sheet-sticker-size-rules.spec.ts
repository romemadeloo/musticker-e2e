import { expect } from '@playwright/test';

import { test } from '../../fixtures/e2e-test.js';
import {
  blockedCustomSize,
  ko,
  presetStickersPerSheet,
  sheetSizeBoundary,
  sheetStickerConfiguratorProducts
} from '../../fixtures/storefront-data.js';
import {
  fitsMinimumPerSheet,
  minimumStickersPerSheet,
  sheetPackingBoundaryCases,
  stickersPerSheet
} from '../../fixtures/sheet-packing.js';
import { CartDrawer } from '../../pom/cart-drawer.js';
import { CartV2Page } from '../../pom/cart-page.js';
import { ProductV2Page } from '../../pom/product-page.js';

// Individual-sticker sheet size rules for the five shape variants (circle/oval/square/rectangle/
// rounded). The configurator's happy path lives in sheet-sticker-configurator.spec.ts; this file
// covers the size constraint added on 2026-08-26: a sheet must fit at least two stickers, so any
// individual size that packs one (or zero) is priced at 0원 and cannot be ordered.
//
// Verified live against development-1 (dev.musticker.com) on 2026-08-26.
//
// Tagged @production as of 2026-08-28: the narrowed preset tables have been promoted, so the seven
// single-sticker presets that used to keep MS-V2-075 red on production are gone and all 24 tests
// here pass against www.musticker.com.
test.describe('storefront v2 sheet sticker size rules (minimum two stickers per sheet)', {
  tag: ['@regression', '@production', '@purchasing']
}, () => {
  test.use({
    // Every test here deliberately trips the size rule, which the storefront logs as a warning.
    allowSheetSizeValidationWarnings: true,
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  for (const data of sheetStickerConfiguratorProducts) {
    test(`MS-V2-073 ${data.heading} rejects a custom size that fits only one sticker per sheet`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.selectCustomIndividualSize(blockedCustomSize.widthMm, blockedCustomSize.heightMm);

      await product.expectMinimumTwoPerSheetError();
      await product.expectAllQuantityTiersZeroPriced();
      await product.expectNextStepDisabled();

      // An oversized entry deliberately reuses the same message rather than getting its own
      // max-work-area line -- confirmed intended, so its absence is asserted, not tolerated.
      await product.expectNoMaxWorkAreaMessage();

      // The readouts report the rejected size itself: it packs one sticker per sheet, and none of
      // them are orderable, so the total reads zero. Until 2026-08-31 both fell back to the page's
      // default 소형 preset instead, which said nothing about what had just been entered.
      await product.expectStickersPerSheet(stickersPerSheet(blockedCustomSize.widthMm, blockedCustomSize.heightMm));
      await product.expectTotalStickers(0);
    });
  }

  test('MS-V2-074 circle sheet sticker: the 138x97 gate is exact', async ({ page }) => {
    const product = new ProductV2Page(page);
    const { largestAllowed, smallestBlocked } = sheetSizeBoundary;
    await product.goto(sheetSizeBoundary.path, sheetSizeBoundary.heading);

    await product.selectCustomIndividualSize(largestAllowed.widthMm, largestAllowed.heightMm);
    await product.expectNoMinimumTwoPerSheetError();
    await product.expectStickersPerSheet(stickersPerSheet(largestAllowed.widthMm, largestAllowed.heightMm));
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();

    // One millimetre taller leaves a single row, so a single sticker per sheet, and must be refused.
    await product.selectCustomIndividualSize(smallestBlocked.widthMm, smallestBlocked.heightMm);
    await product.expectMinimumTwoPerSheetError();
    await product.expectNextStepDisabled();
  });

  // The rendered per-sheet readout must agree with the layout formula across the boundary region --
  // not just on the shipped presets. This is what ties the storefront's arithmetic to the spec.
  for (const boundaryCase of sheetPackingBoundaryCases) {
    const label = `${boundaryCase.widthMm}x${boundaryCase.heightMm}`;

    test(`MS-V2-078 circle sheet sticker: ${label} packs ${boundaryCase.expected} per sheet and is ${
      fitsMinimumPerSheet(boundaryCase.widthMm, boundaryCase.heightMm) ? 'orderable' : 'refused'
    }`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(sheetSizeBoundary.path, sheetSizeBoundary.heading);
      await product.selectCustomIndividualSize(boundaryCase.widthMm, boundaryCase.heightMm);

      if (fitsMinimumPerSheet(boundaryCase.widthMm, boundaryCase.heightMm)) {
        await product.expectNoMinimumTwoPerSheetError();
        await product.expectStickersPerSheet(boundaryCase.expected);
        await product.expectVisiblePrice();
        await product.expectNextStepEnabled();

        return;
      }

      // MS-V2-073 covers what the readouts show for a rejected size; only the gate is asserted here.
      await product.expectMinimumTwoPerSheetError();
      await product.expectAllQuantityTiersZeroPriced();
      await product.expectNextStepDisabled();
    });
  }

  for (const data of sheetStickerConfiguratorProducts) {
    test(`MS-V2-075 ${data.heading} preset sizes match the shape family table and all fit at least two per sheet`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.expectSizePresets(data.sizePresets);

      // The invariant behind the whole change: no preset may be a size the custom-size input would
      // reject. This is what production currently violates.
      for (const preset of data.sizePresets) {
        await product.selectSizePreset(preset.label);
        await product.expectNoMinimumTwoPerSheetError();
        await product.expectStickersPerSheet(presetStickersPerSheet(preset));
        expect(
          presetStickersPerSheet(preset),
          `preset ${preset.label} (${preset.dimensions}) must fit at least ${minimumStickersPerSheet} per sheet`
        ).toBeGreaterThanOrEqual(minimumStickersPerSheet);
        await product.expectNextStepEnabled();
      }
    });
  }

  test('MS-V2-076 circle sheet sticker: both cart edit dialogs reject a one-per-sheet custom size', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectMaterial(ko.pvcMatte);
    await product.selectQuantity(5);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectCustomSizeRejectedInEditDialog(blockedCustomSize.widthMm, blockedCustomSize.heightMm);

    // Reload to drop the drawer's still-open edit dialog before exercising the same rule on the
    // full cart page's own dialog.
    await page.reload();

    const cart = new CartV2Page(page);
    await cart.goto();
    await cart.expectCustomSizeRejectedInSizeChangeDialog(
      data.heading,
      blockedCustomSize.widthMm,
      blockedCustomSize.heightMm
    );
  });

  test('MS-V2-077 circle sheet sticker: the A5 배치 가이드 modal rejects a one-per-sheet custom size', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    const guide = await product.openSizeGuide();
    await product.enterSizeGuideCustomSize(guide, blockedCustomSize.widthMm, blockedCustomSize.heightMm);

    await expect(guide.getByText(ko.minimumTwoPerSheetError)).toBeVisible();
    await expect(guide.getByRole('button', { name: ko.sizeGuideApply })).toBeDisabled();
  });
});
