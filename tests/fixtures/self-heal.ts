import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { selfHealAnnotationType } from './self-heal-annotation.js';
import { ko } from './storefront-data.js';

// Storefront copy changes without notice -- the 2026-09-24 product rename (시트 스티커 -> 판스티커 and
// friends) turned 57 nightly tests red in one run, none of them because a page was actually broken.
// Where what a step really checks is "this product page / this category card / this cart line" and
// not the exact words on it, the helpers below fall back to a stable identifier (the page's H1 plus
// its URL, a card's href slug, a test id, the one cart line matching the configured options) when
// the expected text is gone. The test carries on, and the drift is recorded as a `self-healed`
// annotation that tests/reporters/self-heal-reporter.ts rolls up into the run summary -- so a rename
// shows up every run as "update the fixture" instead of as a wall of failures.
//
// A heal never widens what counts as success beyond the identifier it falls back to: a 404 page, an
// ambiguous cart, or a card with a different slug still fails exactly as before.
//
// SELF_HEAL=off restores strict matching, where every heal is the original failure. Run with it to
// confirm a fixture update is complete.

export type HealRecord = {
  /** What was being located, e.g. "product heading ./stickers/die-cut-sticker". */
  target: string;
  expected: string;
  actual: string;
};

// After the page has rendered something, how long the expected text still gets to appear before the
// fallback is accepted. Covers hydration swapping server-rendered copy for client copy.
const expectedTextGraceMs = 2_000;

export function selfHealEnabled(): boolean {
  return process.env.SELF_HEAL !== 'off';
}

export async function recordHeal(record: HealRecord): Promise<void> {
  const description = `${record.target}: expected "${record.expected}", found "${record.actual}"`;
  console.warn(`[self-heal] ${description}`);

  let info: ReturnType<typeof test.info>;
  try {
    info = test.info();
  } catch {
    // No running test to annotate -- a global setup driving a page object, say.
    return;
  }

  info.annotations.push({ type: selfHealAnnotationType, description });
  // Annotations are not carried into Allure; an attachment is, so the heal is visible there too.
  await info.attach('self-healed', { body: `${description}\n`, contentType: 'text/plain' });
}

/**
 * Asserts the page shows `expected` as a heading. When it does not, but the page rendered an H1 that
 * is not the 404 page, that H1 is accepted and the rename is recorded. Returns the heading the page
 * actually shows.
 */
export async function expectHeadingOrHeal(page: Page, expected: string, target: string): Promise<string> {
  const exact = page.getByRole('heading', { name: expected, exact: true }).first();

  if (!selfHealEnabled()) {
    await expect(exact).toBeVisible();
    return expected;
  }

  const mainHeading = page.getByRole('heading', { level: 1 }).first();
  await expect(exact.or(mainHeading).first()).toBeVisible();

  if (await appearsWithinGrace(exact)) {
    return expected;
  }

  const actual = normalizeText(await mainHeading.innerText());
  if (!actual || actual === ko.notFoundHeading) {
    // Not a rename: the page is missing.
    throw new Error(`${target}: expected heading "${expected}", and the page's H1 is "${actual}" -- not healable.`);
  }

  await recordHeal({ target, expected, actual });
  return actual;
}

/**
 * Resolves the preferred, text-based locator, falling back to `stable` (located by something that
 * does not change with copy) when the text is gone. `describeActual` reads what the stable element
 * now says, for the heal record.
 */
export async function locateOrHeal(options: {
  preferred: Locator;
  stable: Locator;
  target: string;
  expected: string;
  describeActual: (stable: Locator) => Promise<string>;
}): Promise<Locator> {
  const preferred = options.preferred.first();

  if (!selfHealEnabled()) {
    await expect(preferred).toBeVisible();
    return preferred;
  }

  const stable = options.stable.first();
  await expect(preferred.or(stable).first()).toBeVisible();

  if (await appearsWithinGrace(preferred)) {
    return preferred;
  }

  await recordHeal({
    target: options.target,
    expected: options.expected,
    actual: normalizeText(await options.describeActual(stable))
  });
  return stable;
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

async function appearsWithinGrace(locator: Locator): Promise<boolean> {
  if (await locator.isVisible().catch(() => false)) {
    return true;
  }

  return locator
    .waitFor({ state: 'visible', timeout: expectedTextGraceMs })
    .then(() => true)
    .catch(() => false);
}
