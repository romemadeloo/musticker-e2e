// Storefront products mapped to their price table CSV: the twelve under /kr/stickers and the eight
// under /kr/roll-stickers. The six under /kr/sheet-stickers are deliberately absent -- see the note
// at the foot of the registry.
//
// CSVs live one folder per storefront category, named after the product slug. The server does NOT
// have a one-table-per-product layout: the 20 products below resolve to only 11 distinct pricing
// tables. circle / rectangle / square / oval / rounded share one, and six of the eight roll products
// share another. Products on a shared table must therefore hold matching CSVs, which
// product-table-mapping.spec.ts checks explicitly.
//
// TABLE IDS ARE PER ENVIRONMENT, AND THE ID NUMBERS COLLIDE ACROSS SERVERS. Probed live on
// 2026-08-24 (the sticker tables) and 2026-08-25 (everything else). Three groups vary independently:
//
//   the /kr/stickers sticker tables -- three generations in play
//     production            43/44/45/46/47   "... Sticker (8/24/2026)"       match the CSVs
//     development-1         45/46/47/49/50   "... Pricing (8/21/2026)"       match the CSVs
//     development-static-2  5/23/25/30/31    "Die Cut", "Clear - ..."        differ
//
//   the roll and lettering tables -- production's roll tables were regenerated on 2026-09-10
//     production            8/11/53/54/55    "... roll - 9/10/2026"          match the CSVs
//     development-1/static2 8/11/15/16/17    "Roll", "Vinyl Lettering"       match the CSVs
//
//   sticker-sheet -- same rates everywhere, but the id moved
//     production            33               "Sticker Sheet (7/13/2026)"     match the CSV
//     development-1         34               "Custom Sheet (7/10/2026) v3"   match the CSV
//     development-static-2  34               "Custom Sheet (7/10/2026) v3"   match the CSV
//
// The collision is the reason a single shared id map would be actively wrong rather than merely
// incomplete: id 45 is kiss-cut on production but die-cut on development-1, and 46/47 are
// clear/hologram on production but the shapes/kiss-cut tables on development-1. sticker-sheet is the
// same trap one category over -- id 34 is the no-material table on both development servers, but on
// production it is the PVC table.
//
// `csvSources` lists the environments a CSV is a valid baseline for. For the sticker tables that is
// production and development-1, promoted from the same price data -- verified cell by cell -- while
// development-static-2 still holds the older rates and is identity-checked only. The roll, lettering
// and sticker-sheet tables are identical on all three servers, so they list all three.
//
// The remaining development-* servers have no recorded ids yet; the pricing specs skip there with an
// explicit reason rather than guessing. Add an entry to `pricingIds` to switch a server on.
//
// `normalizedNr` is the rounding step in KRW that the API applies to the line total. It is 100
// everywhere except sticker-sheet, which uses 10, and is stable across all three generations.
//
// hologram-sticker serves both 다이컷 and 키스컷 from one table (supply_id does not change the
// quote), which is why its CSV is a merged die-cut/kiss-cut export.
import { activeEnvironment } from '../env.js';
import type { EnvironmentName } from '../environments.js';

type PricingProductRegistryEntry = {
  // The pricing endpoint is keyed on slug alone and does not care which storefront category the
  // product sits under, so this is all the specs need to quote it.
  slug: string;
  // A pattern, not a literal, so a legitimate re-dating or renaming of the table does not fail every
  // row test. It has to span all three generations' naming, which have drifted a long way apart --
  // the clear table has been "Clear - Die Cut / Kiss Cut", "Clear Die Cut / Kiss Cut Pricing" and
  // now "Clear Sticker" -- so for those two products this is only a coarse sanity check. pricingId
  // is the strict identity assertion and the reason this can afford to be loose.
  pricingName: RegExp;
  // Per-environment table id. A missing entry means "not recorded for that server".
  pricingIds: Partial<Record<EnvironmentName, number>>;
  normalizedNr: number;
  // Path relative to this directory, as <category>/<slug>.csv. sticker-sheet is the one product
  // whose file carries a further suffix, because its price depends on material and the slug alone
  // does not name a single table -- see its entry below.
  csv: string;
  // Environments this CSV is a valid rate baseline for. Cell-by-cell comparison runs only on these;
  // elsewhere the table is identity-checked and the cells are skipped with the reason given.
  csvSources: readonly EnvironmentName[];
};

export type PricingProduct = {
  // Also the product page path, under whichever category the product belongs to:
  // /kr/stickers/<slug> or /kr/roll-stickers/<slug>.
  slug: string;
  // Resolved for the active environment.
  pricingId: number;
  pricingName: RegExp;
  normalizedNr: number;
  csv: string;
  csvSources: readonly EnvironmentName[];
  // True when the environment under test is one the CSV is a baseline for.
  ratesComparable: boolean;
};

// The /kr/stickers sticker tables: production and development-1 were promoted from the same price
// data, so those two share one export. development-static-2 lags on the older rates.
const CSV_SOURCES = ['production', 'development-1'] as const satisfies readonly EnvironmentName[];

// The lettering and sticker-sheet tables were left out of the sticker regeneration and are identical
// on all three servers. Production's roll tables were regenerated on 2026-09-10, adding high-volume
// quantity rungs while keeping the old row values comparable for the original rungs; the refreshed
// roll CSVs are therefore a production-only baseline until the development servers carry the same
// generation. development-static-2 has no /exportation endpoint (404), which is why it was checked
// by quotation.
const CSV_SOURCES_ALL = [
  'production',
  'development-1',
  'development-static-2'
] as const satisfies readonly EnvironmentName[];

const CSV_SOURCES_PRODUCTION = ['production'] as const satisfies readonly EnvironmentName[];

const registry: readonly PricingProductRegistryEntry[] = [
  {
    slug: 'die-cut-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 45, 'development-static':51, 'development-static-2': 5 },
    normalizedNr: 100,
    csv: 'stickers/die-cut-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'kiss-cut-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 47, 'development-static':51, 'development-static-2': 23 },
    normalizedNr: 100,
    csv: 'stickers/kiss-cut-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'circle-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 46, 'development-static':51, 'development-static-2': 25 },
    normalizedNr: 100,
    csv: 'stickers/circle-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'rectangle-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 46, 'development-static':51, 'development-static-2': 25 },
    normalizedNr: 100,
    csv: 'stickers/rectangle-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'square-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 46, 'development-static':51, 'development-static-2': 25 },
    normalizedNr: 100,
    csv: 'stickers/square-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'oval-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 46, 'development-static':51, 'development-static-2': 25 },
    normalizedNr: 100,
    csv: 'stickers/oval-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'rounded-sticker',
    pricingName: /^diecut\/kisscut\b/,
    pricingIds: { production: 48, 'development-1': 46, 'development-static':51, 'development-static-2': 25 },
    normalizedNr: 100,
    csv: 'stickers/rounded-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    // "Clear Sticker" on production, "Clear Die Cut / Kiss Cut Pricing ... v.2" on development-1.
    slug: 'clear-sticker',
    pricingName: /^clear\b/,
    pricingIds: { production: 49, 'development-1': 49, 'development-static':54, 'development-static-2': 30 },
    normalizedNr: 100,
    csv: 'stickers/clear-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'hologram-sticker',
    pricingName: /^hologram\b/,
    pricingIds: { production: 50, 'development-1': 50, 'development-static':54, 'development-static-2': 31 },
    normalizedNr: 100,
    csv: 'stickers/hologram-sticker.csv',
    csvSources: CSV_SOURCES
  },
  {
    slug: 'vinyl-lettering',
    pricingName: /^Vinyl Lettering\b/,
    pricingIds: { production: 8, 'development-1': 8, 'development-static-2': 8 },
    normalizedNr: 100,
    csv: 'stickers/vinyl-lettering.csv',
    csvSources: CSV_SOURCES_ALL
  },
  {
    slug: 'transfer-sticker',
    pricingName: /^Transfer\b/,
    pricingIds: { production: 11, 'development-1': 11, 'development-static-2': 11 },
    normalizedNr: 100,
    csv: 'stickers/transfer-sticker.csv',
    csvSources: CSV_SOURCES_ALL
  },
  {
    // Priced per material: the endpoint resolves a different table for each material_id, and a
    // fourth -- the one recorded here -- when no material_id is sent at all, which is what the specs
    // do. On production that default is table 33 and it is byte-identical to the PVC table (34), so
    // sticker-sheet-pvc.csv is a valid baseline for it and no separate CSV is committed. The other
    // two materials (transparent, hologram) have their CSVs committed but no entry here, because
    // one registry row cannot express "same slug, different material".
    //
    // "Sticker Sheet (7/13/2026)" on production, "Custom Sheet (7/10/2026) v3" on both development
    // servers, hence the two-branch name pattern.
    slug: 'sticker-sheet',
    pricingName: /^(?:Sticker|Custom) Sheet\b/,
    pricingIds: { production: 33, 'development-1': 34, 'development-static-2': 34 },
    normalizedNr: 10,
    csv: 'stickers/sticker-sheet-pvc.csv',
    csvSources: CSV_SOURCES_ALL
  },
  // /kr/roll-stickers. Six of the eight share one table; only clear-roll and paper-roll have their
  // own. Production carries the 2026-09-10 generation, while development still carries the earlier
  // ids recorded below.
  {
    slug: 'die-cut-roll',
    pricingName: /^(?:diecut\/kisscut roll|Roll)\b/i,
    pricingIds: { production: 53, 'development-1': 15, 'development-static-2': 15 },
    normalizedNr: 100,
    csv: 'roll-stickers/die-cut-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'circle-roll',
    pricingName: /^(?:diecut\/kisscut roll|Roll)\b/i,
    pricingIds: { production: 53, 'development-1': 15, 'development-static-2': 15 },
    normalizedNr: 100,
    csv: 'roll-stickers/circle-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'square-roll',
    pricingName: /^(?:diecut\/kisscut roll|Roll)\b/i,
    pricingIds: { production: 53, 'development-1': 15, 'development-static-2': 15 },
    normalizedNr: 100,
    csv: 'roll-stickers/square-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'rectangle-roll',
    pricingName: /^(?:diecut\/kisscut roll|Roll)\b/i,
    pricingIds: { production: 53, 'development-1': 15, 'development-static-2': 15 },
    normalizedNr: 100,
    csv: 'roll-stickers/rectangle-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'rounded-roll',
    pricingName: /^(?:diecut\/kisscut roll|Roll)\b/i,
    pricingIds: { production: 53, 'development-1': 15, 'development-static-2': 15 },
    normalizedNr: 100,
    csv: 'roll-stickers/rounded-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'oval-roll',
    pricingName: /^(?:diecut\/kisscut roll|Roll)\b/i,
    pricingIds: { production: 53, 'development-1': 15, 'development-static-2': 15 },
    normalizedNr: 100,
    csv: 'roll-stickers/oval-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'clear-roll',
    pricingName: /^Clear Roll\b/i,
    pricingIds: { production: 54, 'development-1': 16, 'development-static-2': 16 },
    normalizedNr: 100,
    csv: 'roll-stickers/clear-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  },
  {
    slug: 'paper-roll',
    pricingName: /^Paper Roll\b/i,
    pricingIds: { production: 55, 'development-1': 17, 'development-static-2': 17 },
    normalizedNr: 100,
    csv: 'roll-stickers/paper-roll.csv',
    csvSources: CSV_SOURCES_PRODUCTION
  }
  // The six /kr/sheet-stickers products are NOT registered, even though their CSVs are committed in
  // sheet-stickers/. They are priced by a different mechanism that these three specs cannot express,
  // so adding them would produce failures that are not pricing regressions. Probed 2026-08-25:
  //
  //   - circle/oval/square/rectangle/rounded-sheet (tables 40/41/42 by material) answer with a
  //     SHEET-keyed ladder: data.prices carries one entry per sheet count (5, 10, 20, 50, ...) whose
  //     `nr` is stickers-per-sheet x sheets, so a request for quantity=100 comes back with entries
  //     at nr 120, 240, 480 ... and never at 100. quotedPrice() looks up prices by the requested
  //     quantity and would throw on every row.
  //   - Their tables are also banded rather than full grids: the export pads unavailable
  //     (area, quantity) combinations with 0, and the API omits those rungs from the stored row
  //     entirely, so a straight CSV-to-row comparison sees the zero cells as missing.
  //   - die-cut-sheet (tables 37/38/39) answers `success: false "Unable show of pricing."` to a
  //     plain width/height/quantity probe at all -- it is the A5-template flow and needs the
  //     sheet-template parameters the configurator sends.
  //
  // Wiring these up needs sheet-aware helpers in pricing-api.ts and a quantity model that
  // understands the sheet ladder; the CSVs are committed now so that work has a baseline to
  // start from.
];

function resolve(entry: PricingProductRegistryEntry): PricingProduct | undefined {
  const pricingId = activeEnvironment ? entry.pricingIds[activeEnvironment] : undefined;

  if (pricingId === undefined) {
    return undefined;
  }

  return {
    slug: entry.slug,
    pricingId,
    pricingName: entry.pricingName,
    normalizedNr: entry.normalizedNr,
    csv: entry.csv,
    csvSources: entry.csvSources,
    ratesComparable: activeEnvironment !== undefined && entry.csvSources.includes(activeEnvironment)
  };
}

// Products whose table id is known for the environment under test.
export const pricingProducts: readonly PricingProduct[] = registry
  .map(resolve)
  .filter((product): product is PricingProduct => product !== undefined);

// Products with no recorded table id for the environment under test. The specs turn these into
// explicit skips, so an unmapped server reads as "no data yet" rather than silently testing nothing.
export const unmappedPricingProducts: readonly string[] = registry
  .filter((entry) => resolve(entry) === undefined)
  .map((entry) => entry.slug);

// Names the environment under test in skip messages and assertion context.
export const activeEnvironmentLabel = activeEnvironment ?? 'an environment outside the registry';

// Products the server prices from one shared table. Used to assert they return byte-identical
// stored rows -- and, by extension, that their CSVs agree with each other.
export function productsSharingPricingId(): PricingProduct[][] {
  const byPricingId = new Map<number, PricingProduct[]>();

  for (const product of pricingProducts) {
    const existing = byPricingId.get(product.pricingId);
    if (existing) {
      existing.push(product);
    } else {
      byPricingId.set(product.pricingId, [product]);
    }
  }

  return [...byPricingId.values()].filter((products) => products.length > 1);
}
