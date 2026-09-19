# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pricing/price-interpolation.spec.ts >> pricing interpolation transfer-sticker >> MS-PRC-INT-transfer-sticker area 432313 (409x1057) interpolates between 429025 and 435600
- Location: tests/e2e/pricing/price-interpolation.spec.ts:103:7

# Error details

```
Error: transfer-sticker area 432313 (409x1057) qty 50 quoted total: served pricing_id=11 "Transfer"

expect(received).toBe(expected) // Object.is equality

Expected: 2036100
Received: 2087300
```

# Test source

```ts
  41  | // 432313 qty 50 is quoted 2,087,300 where 2,036,100 is correct, a 51,200 KRW overcharge.
  42  | //
  43  | // These are the only two descending intervals across all 22 committed tables, so they are listed
  44  | // explicitly rather than derived from the CSV: a new one appearing should surface as a fresh failure
  45  | // to triage, not be swallowed by a rule. They are marked test.fail() rather than skipped so the
  46  | // assertion still runs -- if the backend starts interpolating signed, these turn red and this whole
  47  | // list should be deleted.
  48  | const KNOWN_FALLING_PRICE_INTERVALS: readonly { slug: string; lower: number; upper: number }[] = [
  49  |   { slug: 'transfer-sticker', lower: 429025, upper: 435600 },
  50  |   // Not currently reached by the sampleIndices walk below, listed so it is handled rather than
  51  |   // suddenly red if that sampling shifts.
  52  |   { slug: 'vinyl-lettering', lower: 60025, upper: 62500 }
  53  | ];
  54  | 
  55  | function interpolatesAcrossFallingPrice(slug: string, lower: number, upper: number): boolean {
  56  |   return KNOWN_FALLING_PRICE_INTERVALS.some(
  57  |     (known) => known.slug === slug && known.lower === lower && known.upper === upper
  58  |   );
  59  | }
  60  | 
  61  | for (const product of pricingProducts) {
  62  |   test.describe(`pricing interpolation ${product.slug}`, { tag: ['@api', '@pricing', '@regression'] }, () => {
  63  |     const table = loadPriceTable(product.csv);
  64  | 
  65  |     if (!table) {
  66  |       test(`MS-PRC-INT-${product.slug} interpolation follows ${product.csv}`, () => {
  67  |         test.skip(true, `${product.csv} is not committed yet -- export it into tests/fixtures/pricing/`);
  68  |         expect(loadPriceTable(product.csv)).not.toBeNull();
  69  |       });
  70  | 
  71  |       return;
  72  |     }
  73  | 
  74  |     // Interpolation is recomputed from the CSV's own rates, so it can only be checked against the
  75  |     // environment that CSV was exported from -- see the same guard in price-table.spec.ts.
  76  |     if (!product.ratesComparable) {
  77  |       test(`MS-PRC-INT-${product.slug} interpolation follows ${product.csv}`, () => {
  78  |         test.skip(
  79  |           true,
  80  |           `${product.csv} is a rate baseline for ${product.csvSources.join(', ')} only, and the generations differ in their rates -- interpolation is not checked on ${activeEnvironmentLabel}`
  81  |         );
  82  |         expect(product.ratesComparable).toBe(true);
  83  |       });
  84  | 
  85  |       return;
  86  |     }
  87  | 
  88  |     const step = product.normalizedNr;
  89  |     const midQuantity = table.quantities[Math.floor(table.quantities.length / 2)];
  90  | 
  91  |     // Area interpolation, sampled at the low, middle and high end of the grid.
  92  |     for (const index of sampleIndices(table.areas.length - 1, 3)) {
  93  |       const lower = table.areas[index];
  94  |       const upper = table.areas[index + 1];
  95  |       const area = offGridAreaBetween(lower, upper);
  96  | 
  97  |       if (area === null) {
  98  |         continue;
  99  |       }
  100 | 
  101 |       const { width, height } = dimensionsForArea(area);
  102 | 
  103 |       test(`MS-PRC-INT-${product.slug} area ${area} (${width}x${height}) interpolates between ${lower} and ${upper}`, async ({
  104 |         request
  105 |       }) => {
  106 |         test.fail(
  107 |           interpolatesAcrossFallingPrice(product.slug, lower, upper),
  108 |           `${product.slug} interpolates across a falling total between areas ${lower} and ${upper}, where the API overshoots both bounds -- known defect, see tests/fixtures/pricing/README.md`
  109 |         );
  110 | 
  111 |         const body = await fetchQuotation(request, product.slug, {
  112 |           width,
  113 |           height,
  114 |           quantity: midQuantity,
  115 |           debug: true
  116 |         });
  117 | 
  118 |         const context = `${product.slug} area ${area} (${width}x${height}) qty ${midQuantity}`;
  119 |         const identity = tableIdentity(body);
  120 |         const schema = requireSchema(body, context);
  121 | 
  122 |         expect(schema.exact_dimension, `${context} is not a grid row: ${identity}`).toBe(false);
  123 |         // Bracketing on area rather than on side length is the whole point: a non-square probe must
  124 |         // still land between the two areas its product falls between.
  125 |         expect(
  126 |           schema.bounds.map((bound) => bound.base_area),
  127 |           `${context} should bracket the two CSV grid rows: ${identity}`
  128 |         ).toEqual([lower, upper]);
  129 | 
  130 |         const trace = areaInterpolation(body, midQuantity, context);
  131 | 
  132 |         expect(
  133 |           trace.lower_bound_price,
  134 |           `${context} lower bound total should be the UNROUNDED ${lower} row product: ${identity}`
  135 |         ).toBeCloseTo(lineTotal(ratePerMm(table, lower, midQuantity), lower, midQuantity), 4);
  136 |         expect(
  137 |           trace.upper_bound_price,
  138 |           `${context} upper bound total should be the UNROUNDED ${upper} row product: ${identity}`
  139 |         ).toBeCloseTo(lineTotal(ratePerMm(table, upper, midQuantity), upper, midQuantity), 4);
  140 | 
> 141 |         expect(quotedPrice(body, midQuantity, context), `${context} quoted total: ${identity}`).toBe(
      |                                                                                                 ^ Error: transfer-sticker area 432313 (409x1057) qty 50 quoted total: served pricing_id=11 "Transfer"
  142 |           interpolateByArea(table, area, midQuantity, step)
  143 |         );
  144 |       });
  145 |     }
  146 | 
  147 |     // Quantity interpolation at a grid area, so only the quantity is being interpolated.
  148 |     const quantityProbeArea = table.areas[Math.floor(table.areas.length / 2)];
  149 |     const quantityProbe = dimensionsForArea(quantityProbeArea);
  150 | 
  151 |     for (const index of sampleIndices(table.quantities.length - 1, 2)) {
  152 |       const lower = table.quantities[index];
  153 |       const upper = table.quantities[index + 1];
  154 |       const quantity = offLadderQuantityBetween(lower, upper);
  155 | 
  156 |       if (quantity === null) {
  157 |         continue;
  158 |       }
  159 | 
  160 |       test(`MS-PRC-INT-${product.slug} quantity ${quantity} interpolates between rungs ${lower} and ${upper}`, async ({
  161 |         request
  162 |       }) => {
  163 |         const body = await fetchQuotation(request, product.slug, {
  164 |           ...quantityProbe,
  165 |           quantity,
  166 |           debug: true
  167 |         });
  168 | 
  169 |         const context = `${product.slug} area ${quantityProbeArea} qty ${quantity}`;
  170 |         const identity = tableIdentity(body);
  171 |         const schema = requireSchema(body, context);
  172 | 
  173 |         expect(schema.quantity_method, `${context}: ${identity}`).toBe('inbetween-quantity');
  174 |         expect(schema.allowed_quantities, `${context} should bracket the CSV ladder: ${identity}`).toEqual([
  175 |           lower,
  176 |           upper
  177 |         ]);
  178 |         expect(quotedPrice(body, quantity, context), `${context} quoted total: ${identity}`).toBe(
  179 |           interpolateByQuantity(table, quantityProbeArea, quantity, step)
  180 |         );
  181 |       });
  182 |     }
  183 | 
  184 |     // The grid is keyed on area alone, so two different shapes with the same area must cost the same.
  185 |     const shapeArea = table.areas.find((area) => alternateDimensionsForArea(area) !== null);
  186 | 
  187 |     if (shapeArea !== undefined) {
  188 |       const primary = dimensionsForArea(shapeArea);
  189 |       const alternate = alternateDimensionsForArea(shapeArea)!;
  190 | 
  191 |       test(`MS-PRC-INT-${product.slug} area ${shapeArea} prices the same as ${primary.width}x${primary.height} and ${alternate.width}x${alternate.height}`, async ({
  192 |         request
  193 |       }) => {
  194 |         const context = `${product.slug} area ${shapeArea} qty ${midQuantity}`;
  195 |         const quotes: number[] = [];
  196 | 
  197 |         for (const shape of [primary, alternate]) {
  198 |           const body = await fetchQuotation(request, product.slug, { ...shape, quantity: midQuantity });
  199 |           quotes.push(quotedPrice(body, midQuantity, `${context} as ${shape.width}x${shape.height}`));
  200 |         }
  201 | 
  202 |         // Deliberately compares the two shapes against each other rather than against the CSV: this
  203 |         // test owns the "area-keyed, not shape-keyed" property, and stays meaningful even while the
  204 |         // stored rates themselves disagree with the CSV. Rate correctness is price-table.spec.ts's job.
  205 |         expect(
  206 |           quotes[1],
  207 |           `${context}: ${alternate.width}x${alternate.height} should cost the same as ${primary.width}x${primary.height}`
  208 |         ).toBe(quotes[0]);
  209 |       });
  210 |     }
  211 | 
  212 |     // Range boundaries: the smallest and largest rows the table declares.
  213 |     for (const [name, area] of [
  214 |       ['lowest', table.areas[0]],
  215 |       ['highest', table.areas.at(-1)!]
  216 |     ] as const) {
  217 |       const { width, height } = dimensionsForArea(area);
  218 | 
  219 |       test(`MS-PRC-INT-${product.slug} ${name} grid row ${area} (${width}x${height}) prices from the CSV`, async ({
  220 |         request
  221 |       }) => {
  222 |         const context = `${product.slug} area ${area} (${width}x${height})`;
  223 | 
  224 |         for (const quantity of [table.quantities[0], table.quantities.at(-1)!]) {
  225 |           const body = await fetchQuotation(request, product.slug, { width, height, quantity });
  226 | 
  227 |           expect
  228 |             .soft(quotedPrice(body, quantity, context), `${context} qty ${quantity}: ${tableIdentity(body)}`)
  229 |             .toBe(exactTotal(table, area, quantity, step));
  230 |         }
  231 |       });
  232 |     }
  233 |   });
  234 | }
  235 | 
```