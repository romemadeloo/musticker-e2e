# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/configuration/product-config.spec.ts >> Product config >> MS-CFG-006 product review carousel is usable
- Location: tests/e2e/storefront/configuration/product-config.spec.ts:73:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 28

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] [NUXT_E5002]",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 27

- Array []
+ Array [
+   "403 https://www.musticker.com/_nuxt/home.DHffY7bY.css",
+   "403 https://www.musticker.com/_nuxt/ProductHeroSlice.BwiV8wA7.css",
+   "403 https://www.musticker.com/_nuxt/MuViewer.CA0FtUqA.css",
+   "403 https://www.musticker.com/_nuxt/ProductOptionsSlice.CuuqYweK.css",
+   "403 https://www.musticker.com/_nuxt/Index.D-ACRMRc.css",
+   "403 https://www.musticker.com/_nuxt/ProductCategoryDetails.XcYOuLJT.css",
+   "403 https://www.musticker.com/_nuxt/CartUploadModalStudio.DLnrUfho.css",
+   "403 https://www.musticker.com/_nuxt/MuThumbnail.BM_zdGP3.css",
+   "403 https://www.musticker.com/_nuxt/Index.bI9_22u4.css",
+   "403 https://www.musticker.com/_nuxt/Index.DwURnCjZ.css",
+   "403 https://www.musticker.com/_nuxt/Index.CRQ8y2wV.css",
+   "403 https://www.musticker.com/_nuxt/BO-YTvH5.js",
+   "403 https://www.musticker.com/_nuxt/Bx81MMr2.js",
+   "403 https://www.musticker.com/_nuxt/productFaqSection.BFTQnP4N.css",
+   "403 https://www.musticker.com/_nuxt/ProductReviewsSection.DZyUkQDP.css",
+   "403 https://www.musticker.com/_nuxt/BSx9ZVLu.js",
+   "403 https://www.musticker.com/_nuxt/ns88erTb.js",
+   "403 https://www.musticker.com/_nuxt/BwxYN_H6.js",
+   "403 https://www.musticker.com/_nuxt/DUjHYOMo.js",
+   "403 https://www.musticker.com/_nuxt/Do_Pu1qZ.js",
+   "403 https://www.musticker.com/_nuxt/CowYzDaD.js",
+   "403 https://www.musticker.com/logos/full/colored/musticker.svg",
+   "403 https://www.musticker.com/illustrations/under-construction/bg-page.png",
+   "403 https://www.musticker.com/icons/sprite.svg?v=1788835890778",
+   "403 https://www.musticker.com/_nuxt/builds/meta/82bac2e7-6945-4fa5-9eec-8972b3cfc511.json",
+ ]
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /\ub2e4\uc74c \ub9ac\ubdf0/ }).first()

```

# Page snapshot

```yaml
- main [ref=e3]:
  - img "musticker logo" [ref=e4]
  - paragraph [ref=e5]: "500"
  - heading "앗! 문제가 발생했습니다." [level=1] [ref=e6]
  - paragraph [ref=e7]: 일시적인 오류로 페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
  - button "홈으로 돌아가기" [ref=e8] [cursor=pointer]:
    - img [ref=e9]
    - generic [ref=e10]: 홈으로 돌아가기
```

# Test source

```ts
  343 |     for (const [index, preset] of presets.entries()) {
  344 |       const pill = grid.locator('.option-pill').nth(index);
  345 |       await expect(pill.locator('.size-pill-name'), `size preset ${index} label`).toHaveText(preset.label);
  346 |       await expect(pill.locator('.size-pill-dim'), `size preset ${index} dimensions`).toHaveText(preset.dimensions);
  347 |     }
  348 | 
  349 |     // The custom-size pill trails the presets, so the count is presets + 1.
  350 |     await expect(grid.locator('.option-pill')).toHaveCount(presets.length + 1);
  351 |   }
  352 | 
  353 |   async selectSizePreset(label: string): Promise<void> {
  354 |     await this.sizeGrid().locator('.option-pill').filter({ hasText: label }).first().click();
  355 |   }
  356 | 
  357 |   async expectMinimumTwoPerSheetError(): Promise<void> {
  358 |     await expect(this.optionsPanel.getByText(ko.minimumTwoPerSheetError)).toBeVisible();
  359 |   }
  360 | 
  361 |   async expectNoMinimumTwoPerSheetError(): Promise<void> {
  362 |     await expect(this.optionsPanel.getByText(ko.minimumTwoPerSheetError)).toHaveCount(0);
  363 |   }
  364 | 
  365 |   // A rejected size shows only the minimum-two-per-sheet message -- an oversized entry does not get
  366 |   // a separate "가로 138mm × 세로 200mm 이내로 작업해 주세요." line. Confirmed intended on
  367 |   // the dev storefront (2026-08-26), so this asserts the absence rather than treating it as a gap.
  368 |   async expectNoMaxWorkAreaMessage(): Promise<void> {
  369 |     await expect(this.optionsPanel.getByText(/가로 \d+mm × 세로 \d+mm 이내로 작업해 주세요\./)).toHaveCount(0);
  370 |   }
  371 | 
  372 |   // Every sheet-quantity tier zeroes out while the chosen size is rejected, not just the selected
  373 |   // one, so a shopper cannot switch tiers to find a priced combination.
  374 |   async expectAllQuantityTiersZeroPriced(): Promise<void> {
  375 |     const prices = this.quantityGrid().locator('.qty-pill-price');
  376 |     const count = await prices.count();
  377 |     expect(count, 'Expected sheet-quantity tiers to be present').toBeGreaterThan(0);
  378 | 
  379 |     for (let index = 0; index < count; index += 1) {
  380 |       await expect(prices.nth(index), `quantity tier ${index} price`).toHaveText('0원');
  381 |     }
  382 |   }
  383 | 
  384 |   async expectNextStepDisabled(): Promise<void> {
  385 |     await expect(this.nextStepButton()).toBeDisabled();
  386 |   }
  387 | 
  388 |   async openSizeGuide(): Promise<Locator> {
  389 |     await this.optionsPanel.getByText(ko.sizeGuideOpen).first().click();
  390 |     const dialog = this.page.getByRole('dialog').first();
  391 |     await expect(dialog).toBeVisible();
  392 | 
  393 |     return dialog;
  394 |   }
  395 | 
  396 |   // The size-guide modal's inputs are `#sheet-width`/`#sheet-height` and carry no `type` attribute,
  397 |   // so an `input[type=...]` selector finds nothing here.
  398 |   async enterSizeGuideCustomSize(dialog: Locator, widthMm: number, heightMm: number): Promise<void> {
  399 |     await dialog.getByText(ko.sizeGuideCustomSize).first().click({ force: true });
  400 | 
  401 |     const width = dialog.locator('#sheet-width');
  402 |     await expect(width).toBeVisible();
  403 |     await width.fill(String(widthMm));
  404 | 
  405 |     const height = dialog.locator('#sheet-height');
  406 |     await height.fill(String(heightMm));
  407 |     await height.blur();
  408 |   }
  409 | 
  410 |   async expectNextStepEnabled(): Promise<void> {
  411 |     await expect(this.nextStepButton()).toBeEnabled();
  412 |   }
  413 | 
  414 |   async clickNextStepAndExpectProgression(): Promise<void> {
  415 |     await this.nextStepButton().click();
  416 |     await expect(
  417 |       this.page
  418 |         .getByRole('dialog')
  419 |         .or(this.page.getByText(/\uc5c5\ub85c\ub4dc|\ub514\uc790\uc778|\uc7a5\ubc14\uad6c\ub2c8|Upload|Cart/i))
  420 |         .first()
  421 |     ).toBeVisible();
  422 |   }
  423 | 
  424 |   async expectProductionPromises(): Promise<void> {
  425 |     await expect(this.page.locator('body')).toContainText('5\ub9cc\uc6d0 \uc774\uc0c1 \ubb34\ub8cc\ubc30\uc1a1');
  426 |     await expect(this.page.locator('body')).toContainText('12\uc2dc \uc774\uc804 \uc2dc\uc548 \ud655\uc815 \uc2dc \ub2f9\uc77c\ubc30\uc1a1');
  427 |     await expect(this.page.locator('body')).toContainText(/\ub3c4\ucc29 \uc608\uc815\uc77c|CJ \ub300\ud55c\ud1b5\uc6b4/);
  428 |     await expect(this.page.locator('body')).toContainText('\uc624\ub298\uc81c\uc791, \ub0b4\uc77c\ubc1c\uc1a1');
  429 |     await expect(this.page.locator('body')).toContainText('\ube60\ub978 \uc2dc\uc548 \ud53c\ub4dc\ubc31');
  430 |     await expect(this.page.locator('body')).toContainText('\ub6f0\uc5b4\ub09c \ub0b4\uad6c\uc131\uacfc \ub0b4\uc218\uc131');
  431 |   }
  432 | 
  433 |   async expectReviewCarouselUsable(): Promise<void> {
  434 |     const body = this.page.locator('body');
  435 |     await expect(body).toContainText(ko.reviews225);
  436 | 
  437 |     const nextButton = this.page.getByRole('button', { name: /\ub2e4\uc74c \ub9ac\ubdf0/ }).first();
  438 |     const previousButton = this.page.getByRole('button', { name: /\uc774\uc804 \ub9ac\ubdf0/ }).first();
  439 | 
  440 |     await expect(nextButton).toBeVisible();
  441 |     // A click before hydration lands on an inert button and the track never moves.
  442 |     await waitForNuxtHydration(this.page);
> 443 |     await nextButton.click();
      |                      ^ Error: locator.click: Test timeout of 60000ms exceeded.
  444 |     // 이전 리뷰 starts disabled on the first slide and enables once the track has moved.
  445 |     await expect(previousButton).toBeEnabled();
  446 |     await previousButton.click();
  447 |     await expect(body).toContainText(ko.reviews225);
  448 |   }
  449 | 
  450 |   async expectCustomControlsOpen(): Promise<void> {
  451 |     // The option panel is server-rendered, so it is visible well before the storefront has finished
  452 |     // with it: after hydration the app applies a default size and then a default quantity, each of
  453 |     // which re-renders the grids. A click that lands in that window is either swallowed or has the
  454 |     // input it just opened torn down by the re-render, so wait for the defaults to settle -- the
  455 |     // next-step button enables only once both have been applied -- before reaching for the controls.
  456 |     await expect(this.nextStepButton()).toBeEnabled();
  457 | 
  458 |     const customSizeButton = this.optionsPanel.getByRole('button', { name: ko.customSize }).first();
  459 |     await expect(customSizeButton).toBeVisible();
  460 |     await customSizeButton.click();
  461 |     await expect(this.page.getByRole('dialog').or(this.optionsPanel.getByRole('spinbutton')).first()).toBeVisible();
  462 |     await this.closeTransientDialog();
  463 | 
  464 |     const customQuantityButton = this.optionsPanel.getByRole('button', { name: ko.customQuantity }).first();
  465 |     await expect(customQuantityButton).toBeVisible();
  466 |     await customQuantityButton.click();
  467 |     await expect(this.page.getByRole('dialog').or(this.optionsPanel.getByRole('spinbutton')).first()).toBeVisible();
  468 |     await this.closeTransientDialog();
  469 |   }
  470 | 
  471 |   async expectSheetTemplateControls(): Promise<void> {
  472 |     await expect(this.page.locator('body')).toContainText(/\uc2dc\ud2b8 \uc2a4\ud2f0\ucee4 \ud15c\ud50c\ub9bf \ub2e4\uc6b4\ub85c\ub4dc/);
  473 |     await expect(this.page.locator('body')).toContainText(/\ubc30\uce58 \uac00\uc774\ub4dc \ubcf4\uae30/);
  474 |   }
  475 | 
  476 |   private sizeGrid(): Locator {
  477 |     return this.optionsPanel.locator('.option-grid.option-grid-size').first();
  478 |   }
  479 | 
  480 |   // The size grid and the quantity grid are both `.option-grid`; only the size grid carries the
  481 |   // `option-grid-size` modifier, so the quantity grid is the one without it.
  482 |   private quantityGrid(): Locator {
  483 |     return this.optionsPanel.locator('.option-grid:not(.option-grid-size)').last();
  484 |   }
  485 | 
  486 |   private async readCount(pattern: RegExp): Promise<number | undefined> {
  487 |     const match = (await this.optionsPanel.innerText()).match(pattern);
  488 | 
  489 |     return match?.[1] ? Number(match[1].replace(/,/g, '')) : undefined;
  490 |   }
  491 | 
  492 |   private nextStepButton(): Locator {
  493 |     return this.optionsPanel.getByRole('button', { name: ko.nextStep });
  494 |   }
  495 | 
  496 |   private async closeTransientDialog(): Promise<void> {
  497 |     const cancelButton = this.page.getByRole('button', { name: ko.cancel }).last();
  498 |     if (await cancelButton.isVisible().catch(() => false)) {
  499 |       await cancelButton.click();
  500 |       return;
  501 |     }
  502 | 
  503 |     await this.page.keyboard.press('Escape').catch(() => undefined);
  504 |   }
  505 | }
  506 | 
  507 | function escapeRegExp(value: string): string {
  508 |   return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  509 | }
  510 | 
  511 | 
```