// Guards the slug -> pricing table wiring for every product under /kr/stickers.
//
// One cheap request per product asserting the table identity and rounding step, plus a check that
// products the server prices from one shared table really do return byte-identical stored rows. That
// second check matters for the CSVs too: five shape products share one table, so their exports have
// to agree with each other or at most one of them can be correct.
//
// Unlike price-table.spec.ts this runs on every environment: the table ids differ per server but the
// registry records them per server, so identity is assertable everywhere even where the committed
// CSVs belong to a different table generation and the cell comparisons are skipped.
import { test, expect } from '@playwright/test';

import { fetchQuotation, storedRow, tableIdentity } from '../../fixtures/pricing/pricing-api.js';
import {
  activeEnvironmentLabel,
  pricingProducts,
  productsSharingPricingId,
  unmappedPricingProducts
} from '../../fixtures/pricing/pricing-products.js';
import { canonicalNumber, dimensionsForArea, loadPriceTable } from '../../fixtures/pricing/price-table.js';

test.describe.configure({ mode: 'parallel' });

// A mid-range size every table is expected to price. Only a probe; tables are walked in full by
// price-table.spec.ts.
const PROBE_SIZE = { width: 75, height: 75 } as const;

test.describe('pricing product mapping', { tag: ['@api', '@pricing', '@regression'] }, () => {
  for (const slug of unmappedPricingProducts) {
    test(`MS-PRC-MAP ${slug} is served by a known pricing table`, () => {
      test.skip(
        true,
        `no pricing table id recorded for ${slug} on ${activeEnvironmentLabel} -- add one to pricingIds in tests/fixtures/pricing/pricing-products.ts`
      );
      expect(unmappedPricingProducts).not.toContain(slug);
    });
  }

  for (const product of pricingProducts) {
    test(`MS-PRC-MAP ${product.slug} is served by pricing table ${product.pricingId}`, async ({ request }) => {
      const body = await fetchQuotation(request, product.slug, PROBE_SIZE);

      const context = `${product.slug} ${PROBE_SIZE.width}x${PROBE_SIZE.height}`;
      const identity = tableIdentity(body);

      expect(body.meta.pricing_id, `${context}: ${identity}`).toBe(product.pricingId);
      expect(body.meta.pricing, `${context}: ${identity}`).toMatch(product.pricingName);
      expect(body.data.normalized_nr, `${context} rounding step: ${identity}`).toBe(product.normalizedNr);
      expect(body.data.prices.length, `${context} should return a quantity ladder: ${identity}`).toBeGreaterThan(0);

      // Every returned total must be a whole multiple of the rounding step the same response
      // declares -- the cheapest possible check that normalized_nr is actually being honoured.
      for (const price of body.data.prices) {
        expect
          .soft(price.price! % product.normalizedNr, `${context} qty ${price.nr} total ${price.price}: ${identity}`)
          .toBe(0);
      }
    });
  }

  for (const shared of productsSharingPricingId()) {
    const slugs = shared.map((product) => product.slug);

    test(`MS-PRC-MAP pricing table ${shared[0].pricingId} is identical across ${slugs.length} products`, async ({
      request
    }) => {
      const probeArea = PROBE_SIZE.width * PROBE_SIZE.height;
      const { width, height } = dimensionsForArea(probeArea);
      const rows = new Map<string, string>();

      for (const product of shared) {
        const context = `${product.slug} area ${probeArea} (${width}x${height})`;
        const body = await fetchQuotation(request, product.slug, { width, height, quantity: 10, debug: true });

        expect(body.meta.pricing_id, `${context}: ${tableIdentity(body)}`).toBe(shared[0].pricingId);
        rows.set(
          product.slug,
          [...storedRow(body, context).entries()]
            .map(([quantity, rate]) => `${quantity}=${canonicalNumber(rate)}`)
            .join(' ')
        );
      }

      const referenceSlug = slugs[0];

      for (const slug of slugs) {
        expect
          .soft(rows.get(slug), `${slug} should share ${referenceSlug}'s stored row at area ${probeArea}`)
          .toBe(rows.get(referenceSlug));
      }
    });

    // The server prices these products from one table, so their CSV exports have to agree. Without
    // this, a divergence shows up as a confusing partial failure spread across several products.
    test(`MS-PRC-MAP CSVs for pricing table ${shared[0].pricingId} agree with each other`, () => {
      const tables = shared.map((product) => ({ product, table: loadPriceTable(product.csv) }));
      const present = tables.filter((entry) => entry.table !== null);

      test.skip(present.length < 2, `fewer than two of the ${slugs.length} CSVs are committed yet`);

      const reference = present[0];
      const fingerprint = (entry: (typeof present)[number]): string =>
        entry
          .table!.areas.map(
            (area) =>
              `${area}:${entry.table!.quantities.map((quantity) => canonicalNumber(entry.table!.rows.get(area)!.get(quantity)!)).join(',')}`
          )
          .join('\n');

      const expected = fingerprint(reference);

      for (const entry of present) {
        expect
          .soft(
            fingerprint(entry) === expected,
            `${entry.product.csv} should hold the same rates as ${reference.product.csv} -- both products are priced from table ${shared[0].pricingId}`
          )
          .toBe(true);
      }
    });
  }
});
