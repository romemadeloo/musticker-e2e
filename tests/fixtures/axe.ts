// Named rather than default: the package ships one CJS-flavoured `.d.ts` for both export
// conditions, so under NodeNext a default import resolves to the module namespace object and is not
// constructable. The named export is unambiguous.
import { AxeBuilder } from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

/**
 * WCAG 2.0/2.1 levels A and AA -- the conformance target Korean public-facing commerce is held to.
 * Deliberately excludes axe's `best-practice` tag, which is advisory rather than a standard and would
 * bury real failures in style opinions.
 */
export const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

/** Impacts that block. `moderate` and `minor` are reported in the attachment but do not fail. */
const BLOCKING_IMPACTS = new Set(['critical', 'serious']);

export type KnownViolation = {
  impact: 'critical' | 'serious';
  /** Regression tripwire: the scan fails if the rule starts matching more elements than this. */
  maxNodes: number;
  /** What is actually wrong, and where. Kept specific so the entry is actionable, not just tolerated. */
  note: string;
};

/**
 * Accessibility rules the storefront currently fails, measured live on the dev storefront on 2026-08-27
 * across home, the sticker category, a product page, FAQ, login, and the empty cart.
 *
 * These are real defects, not false positives, and they are recorded here rather than suppressed so
 * that the scan can be switched on today without a red build while still failing the moment a *new*
 * rule starts failing. Both should be fixed and removed from this map; `maxNodes` carries headroom
 * over the observed counts so ordinary content churn does not flap, but a site-wide regression (an
 * aria-label stripped from a shared component, say) still trips it.
 *
 * When a fix lands, tighten or delete the entry -- an obsolete allowance silently gives back the
 * coverage it was meant to protect.
 */
export const KNOWN_STOREFRONT_VIOLATIONS: Readonly<Record<string, KnownViolation>> = {
  'button-name': {
    impact: 'critical',
    maxNodes: 12,
    note:
      'Icon-only buttons whose only child is an aria-hidden SVG and which carry no aria-label: the ' +
      'global notice bar\'s prev/next/close controls (3, on every page) and the product page\'s ' +
      '.faq-section-card-button expanders (5). A screen reader announces these as bare "button".'
  },
  'color-contrast': {
    impact: 'serious',
    maxNodes: 8,
    note:
      'The .locale-toggle (KR) button on every page, the white notice-bar title/message over its ' +
      'background, and the data-tone="success" review badge. Observed 1-4 nodes per page.'
  }
};

type AxeViolationSummary = {
  id: string;
  impact: string;
  nodes: number;
  help: string;
};

export type AxeScanOptions = {
  /** Baseline to measure against. Defaults to the storefront-wide one above. */
  known?: Readonly<Record<string, KnownViolation>>;
  /**
   * CSS selectors to leave out of the scan. Use sparingly and say why -- excluding a region hides
   * everything in it, including violations nobody has seen yet.
   */
  exclude?: readonly string[];
};

/**
 * Scans the current page against WCAG AA and fails on any critical or serious violation that is not
 * in the baseline, or any baselined rule that has spread to more elements than recorded.
 *
 * The full axe output is always attached to the test result, so a failure can be diagnosed from CI
 * artifacts without re-running anything, and so the moderate/minor findings stay visible even though
 * they do not fail.
 */
export async function expectNoNewAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
  options: AxeScanOptions = {}
): Promise<void> {
  const known = options.known ?? KNOWN_STOREFRONT_VIOLATIONS;

  let builder = new AxeBuilder({ page }).withTags([...WCAG_AA_TAGS]);

  for (const selector of options.exclude ?? []) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();

  await testInfo.attach('axe-results.json', {
    body: JSON.stringify(
      {
        url: results.url,
        violations: results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.map((node) => ({ target: node.target, html: node.html }))
        })),
        incompleteRuleIds: results.incomplete.map((entry) => entry.id)
      },
      null,
      2
    ),
    contentType: 'application/json'
  });

  const blocking: AxeViolationSummary[] = results.violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ''))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact ?? 'unknown',
      nodes: violation.nodes.length,
      help: violation.help
    }));

  const unexpected = blocking.filter((violation) => !(violation.id in known));

  expect(
    unexpected.map((violation) => `${violation.impact} ${violation.id} (${violation.nodes} node(s)): ${violation.help}`),
    `New WCAG AA violations on ${results.url}. If one is a genuine, tracked defect, add it to ` +
      'KNOWN_STOREFRONT_VIOLATIONS in tests/fixtures/axe.ts with a note saying what is wrong.'
  ).toEqual([]);

  for (const violation of blocking) {
    const allowance = known[violation.id];

    expect(
      violation.nodes,
      `"${violation.id}" now matches ${violation.nodes} elements on ${results.url}, above the ${allowance.maxNodes} ` +
        `recorded in KNOWN_STOREFRONT_VIOLATIONS. Known cause: ${allowance.note}`
    ).toBeLessThanOrEqual(allowance.maxNodes);
  }
}
