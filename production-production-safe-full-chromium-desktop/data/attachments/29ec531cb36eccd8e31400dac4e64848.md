# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/pricing/price-interpolation.spec.ts >> Price interpolation >> vinyl-lettering >> MS-PRC-INT-vinyl-lettering known overcharge at area 61258 (218x281) qty 100
- Location: tests/e2e/storefront/pricing/price-interpolation.spec.ts:162:9

# Error details

```
Error: vinyl-lettering area 61258 (218x281) qty 100 quoted total: served pricing_id=69 "Vinyl Lettering Solid Color 2 - 09/29/2026"

expect(received).toBe(expected) // Object.is equality

Expected: 613500
Received: 615100
```

# Test source

```ts
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
  140 |           ).toBeCloseTo(lineTotal(ratePerMm(table, lower, midQuantity), lower, midQuantity), 4);
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
> 173 |           expect(quotedPrice(body, known.quantity, context), `${context} quoted total: ${tableIdentity(body)}`).toBe(
      |                                                                                                                 ^ Error: vinyl-lettering area 61258 (218x281) qty 100 quoted total: served pricing_id=69 "Vinyl Lettering Solid Color 2 - 09/29/2026"
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
  241 |         });
  242 |       }
  243 | 
  244 |       // Range boundaries: the smallest and largest rows the table declares.
  245 |       for (const [name, area] of [
  246 |         ['lowest', table.areas[0]],
  247 |         ['highest', table.areas.at(-1)!]
  248 |       ] as const) {
  249 |         const { width, height } = dimensionsForArea(area);
  250 | 
  251 |         test(`MS-PRC-INT-${product.slug} ${name} grid row ${area} (${width}x${height}) prices from the CSV`, async ({
  252 |           request
  253 |         }) => {
  254 |           const context = `${product.slug} area ${area} (${width}x${height})`;
  255 | 
  256 |           for (const quantity of [table.quantities[0], table.quantities.at(-1)!]) {
  257 |             const body = await fetchQuotation(request, product.slug, { width, height, quantity });
  258 | 
  259 |             expect
  260 |               .soft(quotedPrice(body, quantity, context), `${context} qty ${quantity}: ${tableIdentity(body)}`)
  261 |               .toBe(exactTotal(table, area, quantity, step));
  262 |           }
  263 |         });
  264 |       }
  265 |     });
  266 |   }
  267 | });
  268 | 
```