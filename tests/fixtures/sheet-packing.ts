// A5 sheet packing, per the storefront's own layout formula (adopted 2026-08-26):
//
//   Columns           = floor((148 - 5) / (Width  + 5))
//   Rows              = floor((210 - 5) / (Height + 5))
//   Stickers per sheet = Columns x Rows
//
// The 148x210mm A5 sheet loses 5mm to the sheet edge and each sticker reserves a further 5mm gap,
// so the divisor is the sticker's dimension plus the gap. This module is the single source of truth
// for every expected sticker count in the suite -- assert against these functions rather than
// hard-coding counts, so a change to the layout rule is a one-line change here.
//
// Verified to reproduce the live per-sheet readout on the dev storefront for all eight shipped presets
// and across the boundary region (2026-08-26).
export const a5Sheet = {
  widthMm: 148,
  heightMm: 210,
  edgeMarginMm: 5,
  stickerGapMm: 5
} as const;

// A sheet must fit at least two stickers; a size that packs one (or zero) cannot be ordered.
export const minimumStickersPerSheet = 2;

export function sheetColumns(widthMm: number): number {
  return Math.floor((a5Sheet.widthMm - a5Sheet.edgeMarginMm) / (widthMm + a5Sheet.stickerGapMm));
}

export function sheetRows(heightMm: number): number {
  return Math.floor((a5Sheet.heightMm - a5Sheet.edgeMarginMm) / (heightMm + a5Sheet.stickerGapMm));
}

export function stickersPerSheet(widthMm: number, heightMm: number): number {
  return sheetColumns(widthMm) * sheetRows(heightMm);
}

export function fitsMinimumPerSheet(widthMm: number, heightMm: number): boolean {
  return stickersPerSheet(widthMm, heightMm) >= minimumStickersPerSheet;
}

// The documented gate: 138x97 is the largest individual size that still fits two stickers per sheet
// at full width. 138mm is the widest a single column can be (139mm leaves zero columns) and, at that
// width, 97mm is the tallest two rows can be (98mm leaves one row, so one sticker per sheet).
export const largestAllowedSize = { widthMm: 138, heightMm: 97 } as const;

// Boundary cases either side of the gate, all derived from the formula above. `expected` is the
// per-sheet count the storefront should both report and price on.
export const sheetPackingBoundaryCases = [
  { widthMm: 138, heightMm: 97, expected: 2, note: 'the documented 138x97 gate -- widest column, two rows' },
  { widthMm: 97, heightMm: 97, expected: 2, note: 'square at the row limit' },
  { widthMm: 66, heightMm: 97, expected: 4, note: 'two columns, two rows' },
  { widthMm: 67, heightMm: 97, expected: 2, note: 'one column over, still two rows' },
  { widthMm: 66, heightMm: 200, expected: 2, note: 'two columns, one row -- allowed via the width axis' },
  { widthMm: 98, heightMm: 98, expected: 1, note: 'one row once height passes 97' },
  { widthMm: 138, heightMm: 98, expected: 1, note: 'the gate height exceeded by 1mm' },
  { widthMm: 67, heightMm: 200, expected: 1, note: 'one column, one row' },
  { widthMm: 123, heightMm: 123, expected: 1, note: 'comfortably one per sheet' },
  { widthMm: 139, heightMm: 97, expected: 0, note: 'the gate width exceeded by 1mm -- zero columns' },
  { widthMm: 200, heightMm: 300, expected: 0, note: 'larger than the sheet' }
] as const;
