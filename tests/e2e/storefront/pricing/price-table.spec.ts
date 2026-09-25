// Verifies that every cell of every committed price CSV is what the pricing API actually serves.
//
// One request per CSV row: `debug=1` returns the whole stored row, so a single call covers all of
// that row's quantity columns. One CSV per product slug, so each product is checked against its own
// export even where the server prices several products from one shared table.
//
// Imports @playwright/test directly rather than the e2e-test fixture: that fixture's console guard
// is browser-oriented and defaults allowKnownPriceWarnings to true, neither of which suits an API
// test. No browser is launched here at all, since no test touches `page`.
import { test, expect } from '@playwright/test';

import {
  fetchQuotation,
  storedRow,
  tableIdentity,
  requireSchema
} from '../../fixtures/pricing/pricing-api.js';
import {
  activeEnvironmentLabel,
  pricingProducts,
  unmappedPricingProducts
} from '../../fixtures/pricing/pricing-products.js';
import { canonicalNumber, dimensionsForArea, loadPriceTable } from '../../fixtures/pricing/price-table.js';

test.describe.configure({ mode: 'parallel' });

for (const product of pricingProducts) {
  test.describe(`pricing table ${product.slug}`, { tag: ['@api', '@pricing', '@regression'] }, () => {
    const table = loadPriceTable(product.csv);

    if (!table) {
      test(`MS-PRC-${product.slug} price table matches ${product.csv}`, () => {
        test.skip(true, `${product.csv} is not committed yet -- export it into tests/fixtures/pricing/`);
        expect(loadPriceTable(product.csv)).not.toBeNull();
      });

      return;
    }

    // The servers carry different generations of these tables, and the generations differ in their
    // rates, not just their ids. Comparing cells outside the CSV's own environment would fail on
    // every row for a reason that has nothing to do with a pricing regression, so identity is left
    // to product-table-mapping.spec.ts (which runs everywhere) and the cells are skipped here.
    if (!product.ratesComparable) {
      test(`MS-PRC-${product.slug} price table matches ${product.csv}`, () => {
        test.skip(
          true,
          `${product.csv} is a rate baseline for ${product.csvSources.join(', ')} only, and the generations differ in their rates -- cells are not compared on ${activeEnvironmentLabel}`
        );
        expect(product.ratesComparable).toBe(true);
      });

      return;
    }

    for (const area of table.areas) {
      const { width, height } = dimensionsForArea(area);

      test(`MS-PRC-${product.slug} area ${area} (${width}x${height}) matches ${product.csv}`, async ({ request }, testInfo) => {
        const body = await fetchQuotation(request, product.slug, {
          width,
          height,
          quantity: table.quantities[0],
          debug: true
        });

        const context = `${product.slug} area ${area} (${width}x${height})`;
        const identity = tableIdentity(body);

        expect(body.meta.pricing_id, `${context}: ${identity}`).toBe(product.pricingId);
        expect(body.meta.pricing, `${context}: ${identity}`).toMatch(product.pricingName);
        // normalized_nr is the rounding step applied to line totals, so a silent change to it
        // repriced every order on this product.
        expect(body.data.normalized_nr, `${context}: ${identity}`).toBe(product.normalizedNr);

        const schema = requireSchema(body, context);

        // A false here means the CSV row is missing from the stored table entirely -- a worse
        // problem than a wrong rate, and the reason this is asserted before any cell comparison.
        expect(schema.exact_dimension, `${context} should be a stored grid row: ${identity}`).toBe(true);
        expect(
          schema.bounds.map((bound) => bound.base_area),
          `${context} should resolve to exactly its own grid row: ${identity}`
        ).toEqual([area]);

        const stored = storedRow(body, context);

        expect([...stored.keys()], `${context} quantity ladder: ${identity}`).toEqual(table.quantities);

        const mismatches: string[] = [];

        for (const quantity of table.quantities) {
          const expectedCell = table.rows.get(area)!.get(quantity)!;
          const actual = stored.get(quantity)!;
          const expectedCanonical = canonicalNumber(expectedCell);
          const actualCanonical = canonicalNumber(actual);

          if (actualCanonical !== expectedCanonical) {
            const delta = actual - Number(expectedCell);
            mismatches.push(
              `${String(quantity).padStart(6)} | ${expectedCanonical.padStart(14)} | ${actualCanonical.padStart(14)} | ${delta > 0 ? '+' : ''}${delta.toPrecision(4)}`
            );
          }

          // Soft so one run reports every wrong cell in the row instead of stopping at the first.
          expect
            .soft(actualCanonical, `${context} qty ${quantity} price_per_mm: ${identity}`)
            .toBe(expectedCanonical);
        }

        if (mismatches.length > 0) {
          await testInfo.attach(`price-diff-${product.slug}-area-${area}.txt`, {
            contentType: 'text/plain',
            body: [
              `${product.csv} area ${area} probed as ${width}x${height} on ${product.slug}`,
              identity,
              `${mismatches.length} of ${table.quantities.length} rates differ`,
              '',
              '   qty |       expected |         actual | delta',
              ...mismatches
            ].join('\n')
          });
        }
      });
    }
  });
}

// An environment with no recorded table ids tests nothing here, which should be visible in the
// report rather than showing up as an empty file.
for (const slug of unmappedPricingProducts) {
  test(`MS-PRC-${slug} price table matches its CSV`, { tag: ['@api', '@pricing', '@regression'] }, () => {
    test.skip(
      true,
      `no pricing table id recorded for ${slug} on ${activeEnvironmentLabel} -- add one to pricingIds in tests/fixtures/pricing/pricing-products.ts`
    );
    expect(unmappedPricingProducts).not.toContain(slug);
  });
}
