import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { gotoStorefront } from '../fixtures/navigation.js';
import { expectHeadingOrHeal, locateOrHeal } from '../fixtures/self-heal.js';
import type { CategoryProduct } from '../fixtures/storefront-data.js';

export class CategoryV2Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string, heading: string): Promise<void> {
    await gotoStorefront(this.page, appPath(path));
    await expectHeadingOrHeal(this.page, heading, `category heading ${path}`);
  }

  async expectProductLinks(products: readonly CategoryProduct[]): Promise<void> {
    for (const product of products) {
      await expect(await this.productLink(product)).toBeVisible();
    }
  }

  async openProduct(product: CategoryProduct): Promise<void> {
    await (await this.productLink(product)).click();
    await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(productHref(product))}/?$`));
  }

  // Found by its name, or -- after a rename -- by the card's href, which carries the product slug.
  private async productLink(product: CategoryProduct): Promise<Locator> {
    return locateOrHeal({
      preferred: this.page.getByRole('link', { name: new RegExp(escapeRegExp(product.name)) }),
      stable: this.page.locator(`a[href$="${productHref(product)}"]`).filter({ visible: true }),
      target: `category card ${product.path}`,
      expected: product.name,
      describeActual: async (link) => {
        const cardHeading = link.getByRole('heading').first();
        return (await cardHeading.count()) ? cardHeading.innerText() : link.innerText();
      }
    });
  }
}

function productHref(product: CategoryProduct): string {
  return `/${product.path.replace(/^\.\//, '')}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
