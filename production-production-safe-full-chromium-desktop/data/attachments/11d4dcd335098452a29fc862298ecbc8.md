# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/pricing/price-interpolation.spec.ts >> Price interpolation >> clear-sticker >> MS-PRC-INT-clear-sticker highest grid row 546000 (728x750) prices from the CSV
- Location: tests/e2e/storefront/pricing/price-interpolation.spec.ts:251:9

# Error details

```
Error: clear-sticker area 546000 (728x750) qty 100000: served pricing_id=82 "clear - 10/14/2026"

expect(received).toBe(expected) // Object.is equality

Expected: 814959600
Received: 814950200
```

# Test source

```ts
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
> 261 |               .toBe(exactTotal(table, area, quantity, step));
      |                ^ Error: clear-sticker area 546000 (728x750) qty 100000: served pricing_id=82 "clear - 10/14/2026"
  262 |           }
  263 |         });
  264 |       }
  265 |     });
  266 |   }
  267 | });
  268 | 
```