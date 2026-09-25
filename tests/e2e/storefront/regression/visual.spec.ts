import { fileURLToPath } from 'node:url';

import type { Page } from '@playwright/test';

import { test, expect } from '../../fixtures/e2e-test.js';
import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';

const runVisual = process.env.RUN_VISUAL_E2E === 'true';

const volatileStylesheet = fileURLToPath(new URL('./visual-volatile.css', import.meta.url));

// Review carousels show the latest customer reviews and their running count ("사진 후기 226개"), so
// their pixels change whenever someone posts one. They are masked; the layout around them is not.
const reviewSectionTestIds = ['home-reviews-section', 'product-category-reviews-section'];

test.describe('storefront v2 visual snapshots', { tag: ['@visual', '@production'] }, () => {
  test.skip(!runVisual, 'Set RUN_VISUAL_E2E=true after approving baselines for visual snapshot coverage.');
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  for (const [name, path] of [
    ['home', ''],
    ['stickers', './stickers'],
    ['roll-stickers', './roll-stickers'],
    ['sheet-stickers', './sheet-stickers'],
    ['die-cut-sticker', './stickers/die-cut-sticker'],
    ['faq', './faq']
  ] as const) {
    test(`MS-V2-024 ${name} visual snapshot`, async ({ page }) => {
      await gotoStorefront(page, appPath(path));
      await settleForSnapshot(page);

      await expect(page).toHaveScreenshot(`storefront-${name}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
        stylePath: volatileStylesheet,
        mask: reviewSectionTestIds.map((testId) => page.getByTestId(testId))
      });
    });
  }
});

/**
 * Waits for content that renders after `load`. Without this, whichever of the page's late parts had
 * arrived decided the snapshot: the die-cut-sticker baseline was captured with no H1 and 0 reviews,
 * and the next run -- with both -- was 560px taller.
 */
async function settleForSnapshot(page: Page): Promise<void> {
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);

  // Lazy sections and images only load once scrolled near, and a full-page screenshot does not
  // scroll. Walk the page once so they are requested, then return to the top.
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight, 400);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    window.scrollTo(0, 0);
  });

  // A review section fetches its cards separately; give it the chance to fill in before it is
  // measured. Masking hides what the cards say, not how much room they take. A section that stays
  // empty is left as it is -- that is for the snapshot to report.
  await page
    .waitForFunction(
      (testIds) =>
        testIds.every((testId) => {
          const section = document.querySelector(`[data-testid="${testId}"]`);
          return !section || section.querySelector('img, [data-testid*="review-card"], [data-testid*="reviews-card"]');
        }),
      reviewSectionTestIds,
      { timeout: 15_000 }
    )
    .catch(() => undefined);

  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(() => Array.from(document.images).every((image) => image.complete), undefined, { timeout: 15_000 })
    .catch(() => undefined);
}
