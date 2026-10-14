// Thin client for the public pricing quotation endpoint:
//
//   GET {apiBaseUrl}/sys/kr/pricing/quotation/{slug}?width=&height=&quantity=&debug=1
//
// No auth, cookies or headers are involved. Note the endpoint answers validation errors with HTTP
// 200 and success:false, so the status alone never proves a request worked -- fetchQuotation()
// checks both and throws with the server's own message.
//
// `debug=1` adds meta.schema, which carries the stored table row and the interpolation trace. The
// storefront only forwards debug when its own ?debug=1 is set, but the API honours it either way.
import type { APIRequestContext, APIResponse } from '@playwright/test';

import { apiPath } from '../env.js';

export type QuotationParams = {
  width: number;
  height: number;
  quantity?: number;
  // Sheet products select a different table per material (1=무광 화이트, formerly PVC 매트; 2=투명; 3=홀로그램). Unused
  // by the /kr/stickers products, wired here for the sheet-sticker category.
  materialId?: number;
  colorId?: number;
  fontId?: number;
  debug?: boolean;
};

export type QuotationPrice = {
  nr: number;
  // null when the value was interpolated rather than read straight from the table.
  price_per_mm: number | null;
  featured: number | boolean;
  price?: number;
};

export type QuotationBound = {
  id?: number;
  base_area: number;
  quantities: QuotationPrice[];
};

export type InbetweenAreaSource = {
  lower_dimension: number;
  lower_bound_price: number;
  upper_dimension: number;
  upper_bound_price: number;
  area_diff: number;
  bound_area_diff: number;
  bound_price_diff: number;
  bound_diff: number;
  diff: number;
  price: number;
};

export type InbetweenQuantitySource = {
  quantities: QuotationPrice[];
  src: {
    bound_qty_diff: number;
    qty_diff: number;
    lower_price: number;
    upper_price: number;
    bound_price_diff: number;
    bound_diff: number;
    diff: number;
    price: number;
  };
};

export type QuotationSchema = {
  exact_dimension: boolean;
  override_dimension: boolean;
  quantity_method: string;
  allowed_quantities: number[];
  bounds: QuotationBound[];
  // An empty array when the area hit a grid row exactly, otherwise keyed by quantity.
  inbetween_src: Record<string, InbetweenAreaSource> | unknown[];
  inbetween_qty_src: InbetweenQuantitySource | null;
};

export type QuotationBody = {
  success: boolean;
  message: string;
  data: {
    product_variant_id?: number;
    // The rounding step the API applies to the line total.
    normalized_nr: number;
    sheet: unknown;
    prices: QuotationPrice[];
    sticker_quantities: unknown[];
  };
  meta: {
    pricing_id: number;
    pricing: string;
    schema?: QuotationSchema;
  };
};

export function describeQuotation(slug: string, params: QuotationParams): string {
  const quantity = params.quantity === undefined ? '' : ` qty=${params.quantity}`;
  return `${slug} ${params.width}x${params.height}${quantity}`;
}

// The pricing API sits behind the same WAF as the storefront (see navigation.ts): under full-suite
// load it rate-limits our single CI egress IP and answers with a bare 403 for contiguous windows
// lasting ~35s or more, while the identical query returns 200 on a manual re-check moments later.
// One 46s window cost a production run 26 pricing tests, either side of which the same endpoint
// served thousands of passing calls.
//
// Playwright's own `retries: 2` cannot ride that out. Its three attempts run back-to-back, 1-3s
// apart, so all of them land inside the same block window. Re-requesting with a growing delay does.
//
// This endpoint takes no auth and answers validation errors with HTTP 200 + success:false (see the
// note at the top of this file), so a 403 here is always the blocker rather than a real refusal.
//
// The same ladder carries gateway 5xx, which comes from a different owner in the same shape: an
// idempotent GET that answers 200 on a re-check moments later. Observed on production 2026-08-31,
// where a single 502 on rectangle-roll 130x130 qty=15 failed a test whose assertion never ran --
// the identical query answered 200 in under half a second, three times, immediately afterwards.
const retryDelaysMs = [2_000, 4_000, 8_000, 15_000];

// The ladder above spends ~29s over five attempts, which fits inside the 60s per-test timeout.
// Budgeting that per test rather than per call keeps it fitting: a test that quotes several
// products in a loop (product-table-mapping.spec.ts walks a whole shared-table group) would
// otherwise stack one full ladder per call and time out instead of reporting the throttling.
// Keyed on the `request` fixture, which Playwright builds fresh for each test.
const retryWaitBudgetMs = retryDelaysMs.reduce((sum, delay) => sum + delay, 0);
const spentRetryWaitMs = new WeakMap<APIRequestContext, number>();

function isThrottleBlocked(response: APIResponse): boolean {
  return response.status() === 403;
}

// The gateway in front of the pricing app reporting that it could not get an answer out of it.
//
// 500 is deliberately absent: a gateway reports its own failures with 502/503/504, so a 500 arrives
// from the pricing app itself and is a finding rather than a blip.
function isTransientUpstreamFailure(response: APIResponse): boolean {
  return [502, 503, 504].includes(response.status());
}

function isRetryable(response: APIResponse): boolean {
  return isThrottleBlocked(response) || isTransientUpstreamFailure(response);
}

// Reserves the next delay in the ladder against the test's budget, or returns undefined once this
// call has run out of rungs or the test has run out of budget.
function claimRetryDelay(request: APIRequestContext, rung: number): number | undefined {
  const delayMs = retryDelaysMs[rung];

  if (delayMs === undefined) {
    return undefined;
  }

  const spentMs = spentRetryWaitMs.get(request) ?? 0;

  if (spentMs + delayMs > retryWaitBudgetMs) {
    return undefined;
  }

  spentRetryWaitMs.set(request, spentMs + delayMs);

  return delayMs;
}

export async function fetchQuotation(
  request: APIRequestContext,
  slug: string,
  params: QuotationParams
): Promise<QuotationBody> {
  const query: Record<string, string> = {
    width: String(params.width),
    height: String(params.height)
  };

  if (params.quantity !== undefined) {
    query.quantity = String(params.quantity);
  }
  if (params.materialId !== undefined) {
    query.material_id = String(params.materialId);
  }
  if (params.colorId !== undefined) {
    query.color_id = String(params.colorId);
  }
  if (params.fontId !== undefined) {
    query.font_id = String(params.fontId);
  }
  if (params.debug) {
    query.debug = '1';
  }

  const described = describeQuotation(slug, params);
  const path = apiPath(`/sys/kr/pricing/quotation/${slug}`);

  let response = await request.get(path, { params: query });
  let attempts = 1;
  let waitedMs = 0;

  while (isRetryable(response)) {
    const delayMs = claimRetryDelay(request, attempts - 1);

    if (delayMs === undefined) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));

    waitedMs += delayMs;
    response = await request.get(path, { params: query });
    attempts += 1;
  }

  // Reported as the throttling it is rather than as a bare "HTTP 403", so an exhausted retry budget
  // does not read like a pricing regression.
  if (isThrottleBlocked(response)) {
    throw new Error(
      [
        `${described}: pricing API returned 403 Forbidden for ${response.url()} on all ${attempts} ` +
          `attempt${attempts === 1 ? '' : 's'} over ~${Math.round(waitedMs / 1_000)}s.`,
        'This is WAF/rate-limit throttling of the CI egress IP, not a broken endpoint: the same',
        'query normally answers 200 on a manual re-check. Re-run, or widen retryDelaysMs in',
        'tests/fixtures/pricing/pricing-api.ts if the block windows have grown.'
      ].join('\n')
    );
  }

  // Likewise separated from a bare "HTTP 502": nothing here was asserted, so this is an availability
  // problem to raise with whoever owns the API rather than a pricing regression to investigate.
  if (isTransientUpstreamFailure(response)) {
    throw new Error(
      [
        `${described}: pricing API returned HTTP ${response.status()} from ${response.url()} on all ` +
          `${attempts} attempt${attempts === 1 ? '' : 's'} over ~${Math.round(waitedMs / 1_000)}s.`,
        'That is the gateway in front of the pricing app, not the app rejecting the query. A single',
        'one of these is a blip the ladder above absorbs; sustained across the whole ladder it is an',
        'API availability problem worth raising rather than re-running.'
      ].join('\n')
    );
  }

  if (!response.ok()) {
    throw new Error(`${described}: HTTP ${response.status()} from ${response.url()}`);
  }

  const body = (await response.json()) as QuotationBody;

  if (body.success !== true) {
    throw new Error(
      `${described}: pricing API returned success=false "${body.message}" data=${JSON.stringify(body.data)}`
    );
  }

  return body;
}

// Included in every pricing assertion message: when a table is swapped or re-dated, this turns what
// would look like hundreds of wrong cells into one obvious "you are comparing against a different
// table" signal.
export function tableIdentity(body: QuotationBody): string {
  return `served pricing_id=${body.meta.pricing_id} "${body.meta.pricing}"`;
}

export function requireSchema(body: QuotationBody, context: string): QuotationSchema {
  const schema = body.meta.schema;
  if (!schema) {
    throw new Error(`${context}: response carries no meta.schema (was debug=1 sent?)`);
  }
  return schema;
}

// The stored table row behind an exact-area hit: quantity -> price_per_mm, straight out of the
// admin-entered table with no interpolation applied.
export function storedRow(body: QuotationBody, context: string): Map<number, number> {
  const schema = requireSchema(body, context);

  if (schema.bounds.length !== 1) {
    throw new Error(
      `${context}: expected exactly one stored bound, got [${schema.bounds.map((bound) => bound.base_area).join(', ')}]`
    );
  }

  const row = new Map<number, number>();
  for (const quantity of schema.bounds[0].quantities) {
    if (quantity.price_per_mm === null) {
      throw new Error(`${context}: stored row has a null price_per_mm at nr=${quantity.nr}`);
    }
    row.set(quantity.nr, quantity.price_per_mm);
  }

  return row;
}

export function areaInterpolation(body: QuotationBody, quantity: number, context: string): InbetweenAreaSource {
  const source = requireSchema(body, context).inbetween_src;

  if (Array.isArray(source)) {
    throw new Error(`${context}: inbetween_src is empty, so the area was an exact grid row`);
  }

  const trace = source[String(quantity)];
  if (!trace) {
    throw new Error(`${context}: inbetween_src has no entry for quantity ${quantity}`);
  }

  return trace;
}

export function quotedPrice(body: QuotationBody, quantity: number, context: string): number {
  const price = body.data.prices.find((entry) => entry.nr === quantity)?.price;

  if (price === undefined) {
    throw new Error(
      `${context}: no price returned for quantity ${quantity} (got [${body.data.prices.map((entry) => entry.nr).join(', ')}])`
    );
  }

  return price;
}
