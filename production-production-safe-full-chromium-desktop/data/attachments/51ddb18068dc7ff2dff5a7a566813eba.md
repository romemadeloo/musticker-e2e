# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/pricing/price-interpolation.spec.ts >> Price interpolation >> rounded-sticker >> MS-PRC-INT-rounded-sticker area 154062 (317x486) interpolates between 152100 and 156025
- Location: tests/e2e/storefront/pricing/price-interpolation.spec.ts:108:9

# Error details

```
Error: rounded-sticker area 154062 (317x486) qty 1000 lower bound total should be the UNROUNDED 152100 row product: served pricing_id=81 "diecut/kisscut - 10/14/2026"

expect(received).toBeCloseTo(expected, precision)

Expected: 2701143.9
Received: 2701100

Expected precision:    4
Expected difference: < 0.00005
Received difference:   43.89999999990687
```

# Test source

```ts
  40  | // production 2026-08-25 and written up in tests/fixtures/pricing/README.md: transfer-sticker at area
  41  | // 432313 qty 50 is quoted 2,087,300 where 2,036,100 is correct, a 51,200 KRW overcharge.
  42  | //
  43  | // These are the only two descending intervals across all 22 committed tables, so they are listed
  44  | // explicitly rather than derived from the CSV: a new one appearing should surface as a fresh failure
  45  | // to triage, not be swallowed by a rule. Each is pinned to the quantity it was confirmed at and has
  46  | // its own test.fail() check below, so the assertion still runs -- if the backend starts
  47  | // interpolating signed, those turn red and this whole list should be deleted.
  48  | //
  49  | // Pinned because the sampled walk moves whenever a table's ladder changes: production's 2026-09-29
  50  | // lettering tables grew from 8 rungs to 13, which moved the walk's quantity from 50 to 200, where
  51  | // these intervals do not fall -- the walk's test.fail() "passed unexpectedly" while transfer-sticker
  52  | // at 409x1057 / 50 was still quoted 2,087,300 (re-checked 2026-10-14).
  53  | const KNOWN_FALLING_PRICE_INTERVALS: readonly { slug: string; lower: number; upper: number; quantity: number }[] = [
  54  |   { slug: 'transfer-sticker', lower: 429025, upper: 435600, quantity: 50 },
  55  |   // vinyl-lettering 200x305 / 100 is quoted 614,900 where 613,700 is correct (re-checked 2026-10-14).
  56  |   { slug: 'vinyl-lettering', lower: 60025, upper: 62500, quantity: 100 }
  57  | ];
  58  | 
  59  | function interpolatesAcrossFallingPrice(slug: string, lower: number, upper: number, quantity: number): boolean {
  60  |   return KNOWN_FALLING_PRICE_INTERVALS.some(
  61  |     (known) => known.slug === slug && known.lower === lower && known.upper === upper && known.quantity === quantity
  62  |   );
  63  | }
  64  | 
  65  | test.describe('Price interpolation', () => {
  66  |   for (const product of pricingProducts) {
  67  |     test.describe(product.slug, { tag: ['@api', '@pricing', '@regression'] }, () => {
  68  |       const table = loadPriceTable(product.csv);
  69  | 
  70  |       if (!table) {
  71  |         test(`MS-PRC-INT-${product.slug} interpolation follows ${product.csv}`, () => {
  72  |           test.skip(true, `${product.csv} is not committed yet -- export it into tests/fixtures/pricing/`);
  73  |           expect(loadPriceTable(product.csv)).not.toBeNull();
  74  |         });
  75  | 
  76  |         return;
  77  |       }
  78  | 
  79  |       // Interpolation is recomputed from the CSV's own rates, so it can only be checked against the
  80  |       // environment that CSV was exported from -- see the same guard in price-table.spec.ts.
  81  |       if (!product.ratesComparable) {
  82  |         test(`MS-PRC-INT-${product.slug} interpolation follows ${product.csv}`, () => {
  83  |           test.skip(
  84  |             true,
  85  |             `${product.csv} is a rate baseline for ${product.csvSources.join(', ')} only, and the generations differ in their rates -- interpolation is not checked on ${activeEnvironmentLabel}`
  86  |           );
  87  |           expect(product.ratesComparable).toBe(true);
  88  |         });
  89  | 
  90  |         return;
  91  |       }
  92  | 
  93  |       const step = product.normalizedNr;
  94  |       const midQuantity = table.quantities[Math.floor(table.quantities.length / 2)];
  95  | 
  96  |       // Area interpolation, sampled at the low, middle and high end of the grid.
  97  |       for (const index of sampleIndices(table.areas.length - 1, 3)) {
  98  |         const lower = table.areas[index];
  99  |         const upper = table.areas[index + 1];
  100 |         const area = offGridAreaBetween(lower, upper);
  101 | 
  102 |         if (area === null) {
  103 |           continue;
  104 |         }
  105 | 
  106 |         const { width, height } = dimensionsForArea(area);
  107 | 
  108 |         test(`MS-PRC-INT-${product.slug} area ${area} (${width}x${height}) interpolates between ${lower} and ${upper}`, async ({
  109 |           request
  110 |         }) => {
  111 |           test.fail(
  112 |             interpolatesAcrossFallingPrice(product.slug, lower, upper, midQuantity),
  113 |             `${product.slug} interpolates across a falling total between areas ${lower} and ${upper}, where the API overshoots both bounds -- known defect, see tests/fixtures/pricing/README.md`
  114 |           );
  115 | 
  116 |           const body = await fetchQuotation(request, product.slug, {
  117 |             width,
  118 |             height,
  119 |             quantity: midQuantity,
  120 |             debug: true
  121 |           });
  122 | 
  123 |           const context = `${product.slug} area ${area} (${width}x${height}) qty ${midQuantity}`;
  124 |           const identity = tableIdentity(body);
  125 |           const schema = requireSchema(body, context);
  126 | 
  127 |           expect(schema.exact_dimension, `${context} is not a grid row: ${identity}`).toBe(false);
  128 |           // Bracketing on area rather than on side length is the whole point: a non-square probe must
  129 |           // still land between the two areas its product falls between.
  130 |           expect(
  131 |             schema.bounds.map((bound) => bound.base_area),
  132 |             `${context} should bracket the two CSV grid rows: ${identity}`
  133 |           ).toEqual([lower, upper]);
  134 | 
  135 |           const trace = areaInterpolation(body, midQuantity, context);
  136 | 
  137 |           expect(
  138 |             trace.lower_bound_price,
  139 |             `${context} lower bound total should be the UNROUNDED ${lower} row product: ${identity}`
> 140 |           ).toBeCloseTo(lineTotal(ratePerMm(table, lower, midQuantity), lower, midQuantity), 4);
      |             ^ Error: rounded-sticker area 154062 (317x486) qty 1000 lower bound total should be the UNROUNDED 152100 row product: served pricing_id=81 "diecut/kisscut - 10/14/2026"
  141 |           expect(
  142 |             trace.upper_bound_price,
  143 |             `${context} upper bound total should be the UNROUNDED ${upper} row product: ${identity}`
  144 |           ).toBeCloseTo(lineTotal(ratePerMm(table, upper, midQuantity), upper, midQuantity), 4);
  145 | 
  146 |           expect(quotedPrice(body, midQuantity, context), `${context} quoted total: ${identity}`).toBe(
  147 |             interpolateByArea(table, area, midQuantity, step)
  148 |           );
  149 |         });
  150 |       }
  151 | 
  152 |       // Each known falling interval at the quantity it was confirmed at, whatever the walk above samples.
  153 |       for (const known of KNOWN_FALLING_PRICE_INTERVALS.filter((entry) => entry.slug === product.slug)) {
  154 |         const area = offGridAreaBetween(known.lower, known.upper);
  155 | 
  156 |         if (area === null) {
  157 |           continue;
  158 |         }
  159 | 
  160 |         const { width, height } = dimensionsForArea(area);
  161 | 
  162 |         test(`MS-PRC-INT-${product.slug} known overcharge at area ${area} (${width}x${height}) qty ${known.quantity}`, async ({
  163 |           request
  164 |         }) => {
  165 |           test.fail(
  166 |             true,
  167 |             `${product.slug} interpolates across a falling total between areas ${known.lower} and ${known.upper} at qty ${known.quantity}, where the API overshoots both bounds -- known defect, see tests/fixtures/pricing/README.md`
  168 |           );
  169 | 
  170 |           const body = await fetchQuotation(request, product.slug, { width, height, quantity: known.quantity, debug: true });
  171 |           const context = `${product.slug} area ${area} (${width}x${height}) qty ${known.quantity}`;
  172 | 
  173 |           expect(quotedPrice(body, known.quantity, context), `${context} quoted total: ${tableIdentity(body)}`).toBe(
  174 |             interpolateByArea(table, area, known.quantity, step)
  175 |           );
  176 |         });
  177 |       }
  178 | 
  179 |       // Quantity interpolation at a grid area, so only the quantity is being interpolated.
  180 |       const quantityProbeArea = table.areas[Math.floor(table.areas.length / 2)];
  181 |       const quantityProbe = dimensionsForArea(quantityProbeArea);
  182 | 
  183 |       for (const index of sampleIndices(table.quantities.length - 1, 2)) {
  184 |         const lower = table.quantities[index];
  185 |         const upper = table.quantities[index + 1];
  186 |         const quantity = offLadderQuantityBetween(lower, upper);
  187 | 
  188 |         if (quantity === null) {
  189 |           continue;
  190 |         }
  191 | 
  192 |         test(`MS-PRC-INT-${product.slug} quantity ${quantity} interpolates between rungs ${lower} and ${upper}`, async ({
  193 |           request
  194 |         }) => {
  195 |           const body = await fetchQuotation(request, product.slug, {
  196 |             ...quantityProbe,
  197 |             quantity,
  198 |             debug: true
  199 |           });
  200 | 
  201 |           const context = `${product.slug} area ${quantityProbeArea} qty ${quantity}`;
  202 |           const identity = tableIdentity(body);
  203 |           const schema = requireSchema(body, context);
  204 | 
  205 |           expect(schema.quantity_method, `${context}: ${identity}`).toBe('inbetween-quantity');
  206 |           expect(schema.allowed_quantities, `${context} should bracket the CSV ladder: ${identity}`).toEqual([
  207 |             lower,
  208 |             upper
  209 |           ]);
  210 |           expect(quotedPrice(body, quantity, context), `${context} quoted total: ${identity}`).toBe(
  211 |             interpolateByQuantity(table, quantityProbeArea, quantity, step)
  212 |           );
  213 |         });
  214 |       }
  215 | 
  216 |       // The grid is keyed on area alone, so two different shapes with the same area must cost the same.
  217 |       const shapeArea = table.areas.find((area) => alternateDimensionsForArea(area) !== null);
  218 | 
  219 |       if (shapeArea !== undefined) {
  220 |         const primary = dimensionsForArea(shapeArea);
  221 |         const alternate = alternateDimensionsForArea(shapeArea)!;
  222 | 
  223 |         test(`MS-PRC-INT-${product.slug} area ${shapeArea} prices the same as ${primary.width}x${primary.height} and ${alternate.width}x${alternate.height}`, async ({
  224 |           request
  225 |         }) => {
  226 |           const context = `${product.slug} area ${shapeArea} qty ${midQuantity}`;
  227 |           const quotes: number[] = [];
  228 | 
  229 |           for (const shape of [primary, alternate]) {
  230 |             const body = await fetchQuotation(request, product.slug, { ...shape, quantity: midQuantity });
  231 |             quotes.push(quotedPrice(body, midQuantity, `${context} as ${shape.width}x${shape.height}`));
  232 |           }
  233 | 
  234 |           // Deliberately compares the two shapes against each other rather than against the CSV: this
  235 |           // test owns the "area-keyed, not shape-keyed" property, and stays meaningful even while the
  236 |           // stored rates themselves disagree with the CSV. Rate correctness is price-table.spec.ts's job.
  237 |           expect(
  238 |             quotes[1],
  239 |             `${context}: ${alternate.width}x${alternate.height} should cost the same as ${primary.width}x${primary.height}`
  240 |           ).toBe(quotes[0]);
```