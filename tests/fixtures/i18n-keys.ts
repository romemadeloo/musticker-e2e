import type { Page } from '@playwright/test';

/**
 * Untranslated i18n keys a page is known to expose, as data rather than a looser check. Any other key
 * still fails MS-UX-005.
 *
 * - layout.header.search: DEFECT MUS-QA-012 (open since 2026-10-14). The header search button's
 *   accessible name is the key itself, on every page with the site header. axe does not flag it,
 *   because the button has a name, just the wrong one. Reconfirmed on production 2026-11-13.
 */
export const KNOWN_I18N_KEY_LEAKS: readonly string[] = ['layout.header.search'];

/** Pages scanned by MS-UX-005: one per layout family (home, product, content, B2B landing). */
export const i18nScanPages = [
  { name: 'home', path: '' },
  { name: 'die-cut sticker product', path: './stickers/die-cut-sticker' },
  { name: 'FAQ', path: './faq' },
  { name: 'business quote', path: './business' }
] as const;

/**
 * Collects strings that look like vue-i18n keys (three or more dot-separated identifiers, starting
 * lower-case, e.g. `layout.header.search`) from the places a shopper or a screen reader meets them:
 * visible text, aria-label, title, placeholder and alt. Hostnames and file names are excluded.
 */
export async function findRawTranslationKeys(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const keyPattern = /^[a-z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9_]+){2,}$/;
    const notAKey = /\.(?:com|kr|net|io|png|jpe?g|svg|webp|pdf)$/i;
    const looksLikeKey = (value: string | null | undefined): value is string => {
      const trimmed = value?.trim() ?? '';

      return keyPattern.test(trimmed) && !notAKey.test(trimmed);
    };
    const found = new Set<string>();

    for (const element of document.querySelectorAll('[aria-label], [title], [placeholder], img[alt]')) {
      for (const attribute of ['aria-label', 'title', 'placeholder', 'alt']) {
        const value = element.getAttribute(attribute);

        if (looksLikeKey(value)) {
          found.add(value.trim());
        }
      }
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (looksLikeKey(node.textContent)) {
        found.add(node.textContent.trim());
      }
    }

    return [...found].sort();
  });
}
