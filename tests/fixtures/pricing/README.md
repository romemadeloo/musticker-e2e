# Price table fixtures

Each CSV is the admin-entered price table for one product, committed so the suite can assert that
the pricing API serves exactly what was typed in. The git history of these files is the audit trail
for every price change.

One folder per storefront category, one CSV per product slug:

| folder | storefront category | CSVs |
|---|---|---|
| `stickers/` | `/kr/stickers` | 14 |
| `roll-stickers/` | `/kr/roll-stickers` | 8 |
| `sheet-stickers/` | `/kr/sheet-stickers` | 18 |

Where price depends on material -- the six sheet products and `sticker-sheet` -- the slug alone does
not identify a table, because the server resolves a different one per `material_id`. Those hold one
CSV per material, suffixed `-pvc` (1), `-transparent` (2) or `-hologram` (3).

## Adding a table

1. Export the table as an `area_factor` CSV: first column is the stored `base_area` in mm², one
   further column per quantity rung. Quoted thousands separators (`"1,000"`) are fine -- the export
   endpoint emits them unquoted, and [price-table.ts](./price-table.ts) accepts either.

   ```bash
   curl -s "https://api.musticker.com/index.php/sys/kr/pricing/43/exportation"
   ```

   The id is the `meta.pricing_id` the quotation endpoint reports for that product (see *Probing by
   hand* below), so resolve the id on the environment you are exporting from -- the ids collide
   across servers.
2. Save it under `<category>/<slug>.csv` and point the product's `csv` field at it in
   [pricing-products.ts](./pricing-products.ts), and list the environments it is a valid baseline for
   in `csvSources`. Nothing else needs editing; the specs generate one test per row automatically.
3. Run it: `npm run test:pricing:dev1` (or `test:pricing:static2`, `test:pricing:prod`).

Until a CSV is committed its product's tests report as skipped rather than failing, so products can
be rolled out one export at a time. Every storefront product now has a CSV, but only the nine
`/kr/stickers` products in `pricing-products.ts` are wired up; the `roll-stickers/` and
`sheet-stickers/` exports are committed as a baseline and nothing reads them until registry entries
are added for them.

## Table ids and rates are per environment

The servers do not all carry the same generation of these tables, and **the id numbers collide
across servers**. Probed live on 2026-08-24:

| | production | development-1 | development-static-2 |
|---|---|---|---|
| die-cut | 43 `Die Cut Sticker (8/24/2026)` | 45 `Die Cut Pricing (8/21/2026)` | 5 `Die Cut` |
| kiss-cut | 45 `Kiss Cut Sticker (8/24/2026)` | 47 `Kiss Cut Pricing (8/21/2026)` | 23 `Kiss Cut` |
| the five shapes | 44 `Die Cut / Kiss Cut Sticker (8/24/2026)` | 46 `Die Cut / Kiss Cut Pricing (8/21/2026)` | 25 `Die Cut / Kiss Cut` |
| clear | 46 `Clear Sticker (8/24/2026)` | 49 `Clear Die Cut / Kiss Cut Pricing (8/21/2026) v.2` | 30 `Clear - Die Cut / Kiss Cut (6/29/2026)` |
| hologram | 47 `Hologram Sticker (8/24/2026)` | 50 `Hologram Die Cut / Kiss Cut Pricing (8/21/2026)` | 31 `Hologram - Die Cut / Kiss Cut (6/29/2026)` |

Read that table across, not down: id `45` is kiss-cut on production but die-cut on development-1,
and `46`/`47` are clear/hologram on production but the shapes and kiss-cut tables on development-1. A
single shared id map would not be merely incomplete, it would assert the wrong table — which is why
`pricing-products.ts` keys `pricingIds` by environment.

Generations also differ in their **rates**, so a CSV is only a valid baseline for the environments it
was exported from or promoted to. `csvSources` records that list, and the suite splits by what each
check can actually prove:

- `product-table-mapping.spec.ts` asserts table identity and the rounding step, and runs on **every**
  environment with recorded ids.
- `price-table.spec.ts` and `price-interpolation.spec.ts` compare rates against the CSV, and run
  **only** on the environments in `csvSources`. Elsewhere they skip with the reason spelled out.

production and development-1 were promoted from the same sticker price data — verified cell by
cell, 1339 passed on each — so both are listed in `csvSources` for the sticker tables and both get
full coverage there. Production's roll tables were promoted again on 2026-09-10, adding high-volume
quantity rungs; the roll CSVs are now production-only baselines until development carries the same
generation. development-static-2 still holds older sticker rates, so there the tables are
identity-checked and the cells skipped. An environment with no recorded ids skips everything rather
than guessing; to switch one on, probe it and add its ids.

Because the naming has drifted a long way between generations (the clear table has been
`Clear - Die Cut / Kiss Cut`, then `Clear Die Cut / Kiss Cut Pricing ... v.2`, now `Clear Sticker`),
`pricingName` is only a coarse sanity check for some products. `pricingId` is the strict identity
assertion.

`normalizedNr` was checked on all three generations and is stable, so it is not per environment.

The development servers return **HTTP 502** under sustained concurrency, which surfaces as a failed
row rather than a pricing mismatch — `test:pricing:dev1` uses 4 workers and 2 retries for that
reason. If a run shows failures, check whether they are all `HTTP 502` before suspecting the tables.

Row counts, quantity ladders and rate precision all differ per table and are read from the CSV — the
lettering products use an eight-rung ladder starting at 1, the rest use fourteen rungs starting at
10, and `sticker-sheet` stores ten decimal places where the others store eight. Nothing is
hardcoded.

A CSV only needs the rows its table actually has. `die-cut-sticker` starts at area 625, because
25x25 mm is the die-cut minimum and the API answers anything smaller with `No base dimension data
found!`. Conversely a CSV that stops short of its table's top row leaves those rows unverified —
`kiss-cut-sticker.csv` ends at 90,000 while the kiss-cut table continues past 545,382.

### Production ids for the categories not yet in the registry

The `roll-stickers/` and `sheet-stickers/` CSVs, and the four `/kr/stickers` products still commented
out of `pricing-products.ts`, were exported from **production** on 2026-08-25. Their ids are recorded
here until registry entries exist:

| products | pricing_id | table name |
|---|---|---|
| `vinyl-lettering` | 8 | `Vinyl Lettering` |
| `transfer-sticker` | 11 | `Transfer` |
| `sticker-sheet` | 33 / 34 / 35 / 36 | `Sticker Sheet (7/13/2026)`, then `... PVC(Matte) / Transparent / Hologram 07/22/2026` |
| `die-cut-roll`, `circle-roll`, `square-roll`, `rectangle-roll`, `rounded-roll`, `oval-roll` | 53 | `diecut/kisscut roll - 9/10/2026` |
| `clear-roll` | 54 | `clear roll - 9/10/2026` |
| `paper-roll` | 55 | `paper roll - 9/10/2026` |
| `die-cut-sheet` | 39 / 38 / 37 | `Die Cut Sheet PVC(Matte) / Transparent / Hologram 07/22/2026` |
| `circle-sheet`, `oval-sheet`, `square-sheet`, `rectangle-sheet`, `rounded-sheet` | 40 / 41 / 42 | `Simple Sheet - PVC / Transparent / Hologram (08/17/2026)` |

Material-keyed rows list ids in `pvc / transparent / hologram` order (`material_id` 1 / 2 / 3). Note
that die-cut-sheet's run **backwards** against that order, so they cannot be assigned by arithmetic.

`sticker-sheet` carries a fourth table, id 33, which is what the endpoint serves when no
`material_id` is sent at all. It is byte-identical to the PVC table (34), so
`sticker-sheet-pvc.csv` is a valid baseline for both and no separate CSV is committed for it. This
also corrects the note in [pricing-products.ts](./pricing-products.ts), which records `sticker-sheet`
as a single id 33: the product resolves four tables, and enabling it needs the material split.

Two more things to know before wiring these up. The six roll products share one table and the five
simple-sheet shapes share one per material, so those CSVs are duplicates by design, the same way the
five shape stickers already are. Production's roll tables now use a 19-rung ladder from 10 through
100,000; development roll tables still use the earlier 14-rung ladder from 10 through 10,000. The
simple-sheet tables use a 21-rung quantity ladder that starts at 1 and tops out at 117,000, and the
lettering ladder uses 8 rungs.

## One table, several products

The server does not price one table per product: five shape products (`circle`, `rectangle`,
`square`, `oval`, `rounded`) all share one table — `pricing_id 44` on production, `46` on
development-1 — and the die-cut and shared shape tables hold identical rates. Products on a shared
table must therefore hold matching CSVs; `product-table-mapping.spec.ts` asserts both that they
return identical stored rows and that their CSVs agree with each other. It groups by the id resolved
for the environment under test, so the grouping follows whichever generation that server carries.

## How the arithmetic works

The API computes, and this suite reproduces:

```
price = roundToNearest(price_per_mm * area * quantity, normalized_nr)
```

`normalized_nr` comes back in the response (`data.normalized_nr`) and is the rounding step in KRW —
100 for every `/kr/stickers` product, **10** for `sticker-sheet`. It is never defaulted in code:
[price-table.ts](./price-table.ts) takes the step as an argument, and the specs
assert the served value matches the registry so a silent backend change fails loudly.

Lookup is keyed on **area alone**, never shape — `10x40` and `20x20` both resolve to `base_area:
400`. Off-grid sizes and off-ladder quantities are interpolated linearly, with one asymmetry that is
easy to get backwards and is verified against live `debug=1` traces:

| interpolating | operates on |
|---|---|
| area, between two grid rows | the **unrounded** bound totals, rounding once at the end |
| quantity, between two rungs | the **already rounded** rung totals |

## A known API defect: interpolating across a falling price

The API interpolates area from the *magnitude* of the gap between the two bound totals rather than
its sign, so wherever a table's line total falls as area grows, the quote runs the wrong way and
lands outside the bracket it was interpolating within. Confirmed live on production, 2026-08-25:

| product | area | qty | lower bound | upper bound | API quoted | correct |
|---|---|---|---|---|---|---|
| `transfer-sticker` | 432313 (409x1057) | 50 | 2,061,700 | 2,010,500 | **2,087,300** | 2,036,100 |
| `vinyl-lettering` | 61000 (200x305) | 100 | 614,300 | 612,700 | **614,900** | 613,700 |

In both cases the quote exceeds *both* bounds, which no linear interpolation between them can
produce. The `debug=1` trace shows the mechanism directly -- `bound_price_diff` comes back positive
(51199.977 for the transfer case, i.e. lower minus upper), and `diff` is then added to the lower
bound instead of subtracted.

It is rare because it needs a table whose total price is non-monotonic in area, which takes a rate
cliff steep enough to outrun the area increase. Across the 22 tables wired into
[pricing-products.ts](./pricing-products.ts) there are exactly two such intervals, each a single
cell:

- `transfer-sticker` at qty 50, where the rate drops 0.09611095 -> 0.09230946 (-4.0%) between areas
  429025 and 435600 while the area rises only 1.5%
- `vinyl-lettering` at qty 100, the equivalent cliff between areas 60025 and 62500

`price-interpolation.spec.ts` computes the interpolation correctly and so disagrees with the API on
the transfer-sticker interval. Rather than skip that test, it is marked `test.fail()` through
`KNOWN_FALLING_PRICE_INTERVALS` at the top of that spec: the assertion still runs, CI stays green
while the defect is open, and if the backend ever starts interpolating signed the test turns **red**
to say the annotation should now be deleted. Both intervals are listed there, though only the
transfer-sticker one is currently reached by the spec's `sampleIndices` walk.

Emptying that list without a backend fix would hide a live overcharge, so treat it as a tracked bug
rather than as test debt.

## Probing by hand

The endpoint is public — no auth, cookies or headers. `debug=1` returns the stored row plus the
interpolation trace. Note it answers validation errors with HTTP 200 and `success: false`, so never
trust the status alone.

```bash
curl -s "https://dev-api.musticker.com/index.php/sys/kr/pricing/quotation/hologram-sticker?width=75&height=75&quantity=100&debug=1"
```

Swap the host per [environments.ts](../environments.ts). `meta.pricing_id` in the reply is how you
find the ids for an environment that is not in the table above.
