# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pricing/product-table-mapping.spec.ts >> pricing product mapping >> MS-PRC-MAP rounded-roll is served by pricing table 15
- Location: tests/e2e/pricing/product-table-mapping.spec.ts:40:5

# Error details

```
Error: rounded-roll 75x75: served pricing_id=53 "diecut/kisscut roll - 9/10/2026"

expect(received).toBe(expected) // Object.is equality

Expected: 15
Received: 53
```

# Test source

```ts
  1   | // Guards the slug -> pricing table wiring for every product under /kr/stickers.
  2   | //
  3   | // One cheap request per product asserting the table identity and rounding step, plus a check that
  4   | // products the server prices from one shared table really do return byte-identical stored rows. That
  5   | // second check matters for the CSVs too: five shape products share one table, so their exports have
  6   | // to agree with each other or at most one of them can be correct.
  7   | //
  8   | // Unlike price-table.spec.ts this runs on every environment: the table ids differ per server but the
  9   | // registry records them per server, so identity is assertable everywhere even where the committed
  10  | // CSVs belong to a different table generation and the cell comparisons are skipped.
  11  | import { test, expect } from '@playwright/test';
  12  | 
  13  | import { fetchQuotation, storedRow, tableIdentity } from '../../fixtures/pricing/pricing-api.js';
  14  | import {
  15  |   activeEnvironmentLabel,
  16  |   pricingProducts,
  17  |   productsSharingPricingId,
  18  |   unmappedPricingProducts
  19  | } from '../../fixtures/pricing/pricing-products.js';
  20  | import { canonicalNumber, dimensionsForArea, loadPriceTable } from '../../fixtures/pricing/price-table.js';
  21  | 
  22  | test.describe.configure({ mode: 'parallel' });
  23  | 
  24  | // A mid-range size every table is expected to price. Only a probe; tables are walked in full by
  25  | // price-table.spec.ts.
  26  | const PROBE_SIZE = { width: 75, height: 75 } as const;
  27  | 
  28  | test.describe('pricing product mapping', { tag: ['@api', '@pricing', '@regression'] }, () => {
  29  |   for (const slug of unmappedPricingProducts) {
  30  |     test(`MS-PRC-MAP ${slug} is served by a known pricing table`, () => {
  31  |       test.skip(
  32  |         true,
  33  |         `no pricing table id recorded for ${slug} on ${activeEnvironmentLabel} -- add one to pricingIds in tests/fixtures/pricing/pricing-products.ts`
  34  |       );
  35  |       expect(unmappedPricingProducts).not.toContain(slug);
  36  |     });
  37  |   }
  38  | 
  39  |   for (const product of pricingProducts) {
  40  |     test(`MS-PRC-MAP ${product.slug} is served by pricing table ${product.pricingId}`, async ({ request }) => {
  41  |       const body = await fetchQuotation(request, product.slug, PROBE_SIZE);
  42  | 
  43  |       const context = `${product.slug} ${PROBE_SIZE.width}x${PROBE_SIZE.height}`;
  44  |       const identity = tableIdentity(body);
  45  | 
> 46  |       expect(body.meta.pricing_id, `${context}: ${identity}`).toBe(product.pricingId);
      |                                                               ^ Error: rounded-roll 75x75: served pricing_id=53 "diecut/kisscut roll - 9/10/2026"
  47  |       expect(body.meta.pricing, `${context}: ${identity}`).toMatch(product.pricingName);
  48  |       expect(body.data.normalized_nr, `${context} rounding step: ${identity}`).toBe(product.normalizedNr);
  49  |       expect(body.data.prices.length, `${context} should return a quantity ladder: ${identity}`).toBeGreaterThan(0);
  50  | 
  51  |       // Every returned total must be a whole multiple of the rounding step the same response
  52  |       // declares -- the cheapest possible check that normalized_nr is actually being honoured.
  53  |       for (const price of body.data.prices) {
  54  |         expect
  55  |           .soft(price.price! % product.normalizedNr, `${context} qty ${price.nr} total ${price.price}: ${identity}`)
  56  |           .toBe(0);
  57  |       }
  58  |     });
  59  |   }
  60  | 
  61  |   for (const shared of productsSharingPricingId()) {
  62  |     const slugs = shared.map((product) => product.slug);
  63  | 
  64  |     test(`MS-PRC-MAP pricing table ${shared[0].pricingId} is identical across ${slugs.length} products`, async ({
  65  |       request
  66  |     }) => {
  67  |       const probeArea = PROBE_SIZE.width * PROBE_SIZE.height;
  68  |       const { width, height } = dimensionsForArea(probeArea);
  69  |       const rows = new Map<string, string>();
  70  | 
  71  |       for (const product of shared) {
  72  |         const context = `${product.slug} area ${probeArea} (${width}x${height})`;
  73  |         const body = await fetchQuotation(request, product.slug, { width, height, quantity: 10, debug: true });
  74  | 
  75  |         expect(body.meta.pricing_id, `${context}: ${tableIdentity(body)}`).toBe(shared[0].pricingId);
  76  |         rows.set(
  77  |           product.slug,
  78  |           [...storedRow(body, context).entries()]
  79  |             .map(([quantity, rate]) => `${quantity}=${canonicalNumber(rate)}`)
  80  |             .join(' ')
  81  |         );
  82  |       }
  83  | 
  84  |       const referenceSlug = slugs[0];
  85  | 
  86  |       for (const slug of slugs) {
  87  |         expect
  88  |           .soft(rows.get(slug), `${slug} should share ${referenceSlug}'s stored row at area ${probeArea}`)
  89  |           .toBe(rows.get(referenceSlug));
  90  |       }
  91  |     });
  92  | 
  93  |     // The server prices these products from one table, so their CSV exports have to agree. Without
  94  |     // this, a divergence shows up as a confusing partial failure spread across several products.
  95  |     test(`MS-PRC-MAP CSVs for pricing table ${shared[0].pricingId} agree with each other`, () => {
  96  |       const tables = shared.map((product) => ({ product, table: loadPriceTable(product.csv) }));
  97  |       const present = tables.filter((entry) => entry.table !== null);
  98  | 
  99  |       test.skip(present.length < 2, `fewer than two of the ${slugs.length} CSVs are committed yet`);
  100 | 
  101 |       const reference = present[0];
  102 |       const fingerprint = (entry: (typeof present)[number]): string =>
  103 |         entry
  104 |           .table!.areas.map(
  105 |             (area) =>
  106 |               `${area}:${entry.table!.quantities.map((quantity) => canonicalNumber(entry.table!.rows.get(area)!.get(quantity)!)).join(',')}`
  107 |           )
  108 |           .join('\n');
  109 | 
  110 |       const expected = fingerprint(reference);
  111 | 
  112 |       for (const entry of present) {
  113 |         expect
  114 |           .soft(
  115 |             fingerprint(entry) === expected,
  116 |             `${entry.product.csv} should hold the same rates as ${reference.product.csv} -- both products are priced from table ${shared[0].pricingId}`
  117 |           )
  118 |           .toBe(true);
  119 |       }
  120 |     });
  121 |   }
  122 | });
  123 | 
```