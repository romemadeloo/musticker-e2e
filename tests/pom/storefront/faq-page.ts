import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { gotoStorefront } from '../fixtures/navigation.js';
import { ko } from '../fixtures/storefront-data.js';

export class FaqV2Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await gotoStorefront(this.page, appPath('./faq'));
    await expect(this.page.locator('body')).toContainText(ko.faqHero);
  }

  async expectTopics(): Promise<void> {
    for (const topic of [
      '\uba64\ubc84\uc2ed',
      '\uc8fc\ubb38',
      '\ub514\uc790\uc778 \ud30c\uc77c \uc5c5\ub85c\ub4dc',
      '\uc778\uc1c4',
      '\uacb0\uc81c',
      '\ubc18\ud488/\ud658\ubd88'
    ]) {
      await expect(this.page.getByText(topic, { exact: true }).first()).toBeVisible();
    }
  }

  async openOrderQuestion(): Promise<void> {
    await this.page.getByText(ko.orderTopic, { exact: true }).first().click().catch(() => undefined);
    const question = this.page
      .getByRole('button', { name: ko.guestOrderQuestion })
      .or(this.page.getByRole('button').filter({ hasText: /\uc8fc\ubb38|\ube44\ud68c\uc6d0|\ud61c\ud0dd/ }))
      .first();
    await expect(question).toBeVisible();
    await question.click();
    await expect(this.page.locator('body')).toContainText(/\ube44\ud68c\uc6d0|\uc8fc\ubb38|\ud61c\ud0dd|\uba64\ubc84\uc2ed/);
  }

  async search(query: string): Promise<void> {
    await this.page.getByPlaceholder(ko.faqSearchPlaceholder).fill(query);
  }

  async expectSearchResults(query: string): Promise<void> {
    await expect(this.page.locator('body')).toContainText(query);
  }

  async clearSearchAndExpectDefaultList(): Promise<void> {
    await this.page.getByPlaceholder(ko.faqSearchPlaceholder).clear();
    await expect(this.page.getByRole('button', { name: /\ud68c\uc6d0\uac00\uc785/ }).first()).toBeVisible();
  }
}
