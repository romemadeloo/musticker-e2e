import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { parseWon } from '../../fixtures/money.js';

/**
 * The web design studio: `?studio=1` on a product page, reached from the order chooser's
 * 스튜디오 이동 (see ProductV2Page.openStudio). New in early October 2026 and live on production
 * and static-1; mapped on 2026-10-14. Every control carries a `design-studio-*` test id.
 *
 * The studio carries the configurator's size and quantity over and prices every tier 5% below the
 * configurator (스튜디오 주문 -5% 추가 할인), rounded to 10원. Its 장바구니 담기 stays disabled until a
 * design is attached that prints at an acceptable resolution for the chosen size: a 200px image at
 * 75mm (about 57dpi) is refused with a warning, a 1,200px one is accepted.
 *
 * Attaching a design happens entirely in the browser -- no request leaves the page until the
 * shopper confirms the order -- which is what lets these checks run on production. The order-ready
 * confirmation after 장바구니 담기 is deliberately not driven here: its preview took about 40
 * seconds to unlock in a headed browser and never unlocked headless (MUS-QA-015).
 */
export class DesignStudio {
  readonly page: Page;
  readonly widthInput: Locator;
  readonly heightInput: Locator;
  readonly quantityButton: Locator;
  readonly orderPrice: Locator;
  readonly attachButton: Locator;
  readonly addToCartButton: Locator;
  readonly resolutionWarning: Locator;
  readonly settingsTab: Locator;
  readonly settingsPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.widthInput = page.getByRole('spinbutton', { name: '가로 (mm)' });
    this.heightInput = page.getByRole('spinbutton', { name: '세로 (mm)' });
    this.quantityButton = page.getByTestId('design-studio-qty-button');
    this.orderPrice = page.getByTestId('design-studio-order-price');
    this.attachButton = page.getByTestId('design-studio-attach-button');
    this.addToCartButton = page.getByTestId('design-studio-add-to-cart-button');
    this.resolutionWarning = page.getByRole('button', { name: /이미지 해상도 경고/ });
    this.settingsTab = page.getByTestId('design-studio-tab-settings');
    this.settingsPanel = page.getByTestId('design-studio-settings-tab');
  }

  /** The studio takes several seconds to open: it loads its editor and image model first. */
  async expectOpen(): Promise<void> {
    await expect(this.page).toHaveURL(/[?&]studio=1/, { timeout: 30_000 });
    await expect(this.attachButton).toBeVisible({ timeout: 30_000 });
  }

  async expectSize(widthMm: number, heightMm: number): Promise<void> {
    await expect(this.widthInput).toHaveValue(String(widthMm));
    await expect(this.heightInput).toHaveValue(String(heightMm));
  }

  async expectQuantity(quantity: number): Promise<void> {
    await expect(this.quantityButton).toContainText(`${quantity.toLocaleString('en-US')}개`);
  }

  async currentPrice(): Promise<number> {
    await expect(this.orderPrice).toHaveText(/[1-9][\d,]*원/);
    return parseWon(await this.orderPrice.innerText());
  }

  /** The studio's own price for a quantity tier, from the 사이즈/수량 tab. */
  async tierPrice(quantity: number): Promise<number> {
    await this.settingsTab.click();
    const tier = this.settingsPanel.getByRole('button', {
      name: new RegExp(`^${quantity.toLocaleString('en-US')}(?:개|시트) [\\d,]+원$`)
    });

    await expect(tier).toBeVisible();
    return parseWon(await tier.innerText());
  }

  async attachDesign(filePath: string): Promise<void> {
    const chooser = this.page.waitForEvent('filechooser');
    await this.attachButton.click();
    await (await chooser).setFiles(filePath);
    // The attach prompt gives way to the design on the canvas.
    await expect(this.attachButton).toBeHidden({ timeout: 30_000 });
  }

  async expectLowResolutionRefused(): Promise<void> {
    await expect(this.resolutionWarning).toBeVisible({ timeout: 30_000 });
    await expect(this.addToCartButton).toBeDisabled();
  }

  async expectReadyForCart(): Promise<void> {
    await expect(this.addToCartButton).toBeEnabled({ timeout: 30_000 });
    await expect(this.resolutionWarning).toHaveCount(0);
  }
}

/** The studio's tier price for a configurator price: 5% off, rounded half-up to the nearest 10원. */
export function studioPrice(configuratorPrice: number): number {
  return Math.round((configuratorPrice * 0.95) / 10) * 10;
}
