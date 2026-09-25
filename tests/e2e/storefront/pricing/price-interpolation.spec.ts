// Most real orders are for a size that is not on the stored grid, so the price the customer pays is
// interpolated rather than looked up. These tests recompute that interpolation from the committed
// CSV and assert the API agrees -- both on the final won total and on the intermediate values in its
// own debug trace, so the formula is pinned rather than just the answer.
//
// Two details, both confirmed against live traces and easy to get backwards:
//   - area interpolation works on UNROUNDED bound totals, rounding only at the end
//   - quantity interpolation works on the ALREADY ROUNDED rung totals
// Rounding always uses the response's own normalized_nr (100 for most products, 10 for
// sticker-sheet), never a hardcoded step.
import { test, expect } from '@playwright/test';

import {
  areaInterpolation,
  fetchQuotation,
  quotedPrice,
  requireSchema,
  tableIdentity
} from '../../fixtures/pricing/pricing-api.js';
import { activeEnvironmentLabel, pricingProducts } from '../../fixtures/pricing/pricing-products.js';
import {
  alternateDimensionsForArea,
  dimensionsForArea,
  exactTotal,
  interpolateByArea,
  interpolateByQuantity,
  lineTotal,
  loadPriceTable,
  offGridAreaBetween,
  offLadderQuantityBetween,
  ratePerMm,
  sampleIndices
} from '../../fixtures/pricing/price-table.js';

test.describe.configure({ mode: 'parallel' });

// The API interpolates area from the MAGNITUDE of the gap between the two bound totals instead of its
// sign, so wherever a table's line total falls as area grows it overshoots and answers with a price
// above BOTH bounds -- which no linear interpolation between them can produce. Confirmed live on
// production 2026-08-25 and written up in tests/fixtures/pricing/README.md: transfer-sticker at area
// 432313 qty 50 is quoted 2,087,300 where 2,036,100 is correct, a 51,200 KRW overcharge.
//
// These are the only two descending intervals across all 22 committed tables, so they are listed
// explicitly rather than derived from the CSV: a new one appearing should surface as a fresh failure
// to triage, not be swallowed by a rule. They are marked test.fail() rather than skipped so the
// assertion still runs -- if the backend starts interpolating signed, these turn red and this whole
// list should be deleted.
const KNOWN_FALLING_PRICE_INTERVALS: readonly { slug: string; lower: number; upper: number }[] = [
  { slug: 'transfer-sticker', lower: 429025, upper: 435600 },
  // Not currently reached by the sampleIndices walk below, listed so it is handled rather than
  // suddenly red if that sampling shifts.
  { slug: 'vinyl-lettering', lower: 60025, upper: 62500 }
];

function interpolatesAcrossFallingPrice(slug: string, lower: number, upper: number): boolean {
  return KNOWN_FALLING_PRICE_INTERVALS.some(
    (known) => known.slug === slug && known.lower === lower && known.upper === upper
  );
}

for (const product of pricingProducts) {
  test.describe(`pricing interpolation ${product.slug}`, { tag: ['@api', '@pricing', '@regression'] }, () => {
    const table = loadPriceTable(product.csv);

    if (!table) {
      test(`MS-PRC-INT-${product.slug} interpolation follows ${product.csv}`, () => {
        test.skip(true, `${product.csv} is not committed yet -- export it into tests/fixtures/pricing/`);
        expect(loadPriceTable(product.csv)).not.toBeNull();
      });

      return;
    }

    // Interpolation is recomputed from the CSV's own rates, so it can only be checked against the
    // environment that CSV was exported from -- see the same guard in price-table.spec.ts.
    if (!product.ratesComparable) {
      test(`MS-PRC-INT-${product.slug} interpolation follows ${product.csv}`, () => {
        test.skip(
          true,
          `${product.csv} is a rate baseline for ${product.csvSources.join(', ')} only, and the generations differ in their rates -- interpolation is not checked on ${activeEnvironmentLabel}`
        );
        expect(product.ratesComparable).toBe(true);
      });

      return;
    }

    const step = product.normalizedNr;
    const midQuantity = table.quantities[Math.floor(table.quantities.length / 2)];

    // Area interpolation, sampled at the low, middle and high end of the grid.
    for (const index of sampleIndices(table.areas.length - 1, 3)) {
      const lower = table.areas[index];
      const upper = table.areas[index + 1];
      const area = offGridAreaBetween(lower, upper);

      if (area === null) {
        continue;
      }

      const { width, height } = dimensionsForArea(area);

      test(`MS-PRC-INT-${product.slug} area ${area} (${width}x${height}) interpolates between ${lower} and ${upper}`, async ({
        request
      }) => {
        test.fail(
          interpolatesAcrossFallingPrice(product.slug, lower, upper),
          `${product.slug} interpolates across a falling total between areas ${lower} and ${upper}, where the API overshoots both bounds -- known defect, see tests/fixtures/pricing/README.md`
        );

        const body = await fetchQuotation(request, product.slug, {
          width,
          height,
          quantity: midQuantity,
          debug: true
        });

        const context = `${product.slug} area ${area} (${width}x${height}) qty ${midQuantity}`;
        const identity = tableIdentity(body);
        const schema = requireSchema(body, context);

        expect(schema.exact_dimension, `${context} is not a grid row: ${identity}`).toBe(false);
        // Bracketing on area rather than on side length is the whole point: a non-square probe must
        // still land between the two areas its product falls between.
        expect(
          schema.bounds.map((bound) => bound.base_area),
          `${context} should bracket the two CSV grid rows: ${identity}`
        ).toEqual([lower, upper]);

        const trace = areaInterpolation(body, midQuantity, context);

        expect(
          trace.lower_bound_price,
          `${context} lower bound total should be the UNROUNDED ${lower} row product: ${identity}`
        ).toBeCloseTo(lineTotal(ratePerMm(table, lower, midQuantity), lower, midQuantity), 4);
        expect(
          trace.upper_bound_price,
          `${context} upper bound total should be the UNROUNDED ${upper} row product: ${identity}`
        ).toBeCloseTo(lineTotal(ratePerMm(table, upper, midQuantity), upper, midQuantity), 4);

        expect(quotedPrice(body, midQuantity, context), `${context} quoted total: ${identity}`).toBe(
          interpolateByArea(table, area, midQuantity, step)
        );
      });
    }

    // Quantity interpolation at a grid area, so only the quantity is being interpolated.
    const quantityProbeArea = table.areas[Math.floor(table.areas.length / 2)];
    const quantityProbe = dimensionsForArea(quantityProbeArea);

    for (const index of sampleIndices(table.quantities.length - 1, 2)) {
      const lower = table.quantities[index];
      const upper = table.quantities[index + 1];
      const quantity = offLadderQuantityBetween(lower, upper);

      if (quantity === null) {
        continue;
      }

      test(`MS-PRC-INT-${product.slug} quantity ${quantity} interpolates between rungs ${lower} and ${upper}`, async ({
        request
      }) => {
        const body = await fetchQuotation(request, product.slug, {
          ...quantityProbe,
          quantity,
          debug: true
        });

        const context = `${product.slug} area ${quantityProbeArea} qty ${quantity}`;
        const identity = tableIdentity(body);
        const schema = requireSchema(body, context);

        expect(schema.quantity_method, `${context}: ${identity}`).toBe('inbetween-quantity');
        expect(schema.allowed_quantities, `${context} should bracket the CSV ladder: ${identity}`).toEqual([
          lower,
          upper
        ]);
        expect(quotedPrice(body, quantity, context), `${context} quoted total: ${identity}`).toBe(
          interpolateByQuantity(table, quantityProbeArea, quantity, step)
        );
      });
    }

    // The grid is keyed on area alone, so two different shapes with the same area must cost the same.
    const shapeArea = table.areas.find((area) => alternateDimensionsForArea(area) !== null);

    if (shapeArea !== undefined) {
      const primary = dimensionsForArea(shapeArea);
      const alternate = alternateDimensionsForArea(shapeArea)!;

      test(`MS-PRC-INT-${product.slug} area ${shapeArea} prices the same as ${primary.width}x${primary.height} and ${alternate.width}x${alternate.height}`, async ({
        request
      }) => {
        const context = `${product.slug} area ${shapeArea} qty ${midQuantity}`;
        const quotes: number[] = [];

        for (const shape of [primary, alternate]) {
          const body = await fetchQuotation(request, product.slug, { ...shape, quantity: midQuantity });
          quotes.push(quotedPrice(body, midQuantity, `${context} as ${shape.width}x${shape.height}`));
        }

        // Deliberately compares the two shapes against each other rather than against the CSV: this
        // test owns the "area-keyed, not shape-keyed" property, and stays meaningful even while the
        // stored rates themselves disagree with the CSV. Rate correctness is price-table.spec.ts's job.
        expect(
          quotes[1],
          `${context}: ${alternate.width}x${alternate.height} should cost the same as ${primary.width}x${primary.height}`
        ).toBe(quotes[0]);
      });
    }

    // Range boundaries: the smallest and largest rows the table declares.
    for (const [name, area] of [
      ['lowest', table.areas[0]],
      ['highest', table.areas.at(-1)!]
    ] as const) {
      const { width, height } = dimensionsForArea(area);

      test(`MS-PRC-INT-${product.slug} ${name} grid row ${area} (${width}x${height}) prices from the CSV`, async ({
        request
      }) => {
        const context = `${product.slug} area ${area} (${width}x${height})`;

        for (const quantity of [table.quantities[0], table.quantities.at(-1)!]) {
          const body = await fetchQuotation(request, product.slug, { width, height, quantity });

          expect
            .soft(quotedPrice(body, quantity, context), `${context} qty ${quantity}: ${tableIdentity(body)}`)
            .toBe(exactTotal(table, area, quantity, step));
        }
      });
    }
  });
}
