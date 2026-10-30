import { test, expect } from '@playwright/test';

import {
  abortedFetchConsoleKind,
  isBenignNuxtPreloadWarning,
  isBenignFirefoxIllustrationPreloadWarning,
  isBenignPretendardMetadataWarning,
  isBenignPretendardPreloadWarning,
  isBenignWorkerModelFallbackWarning
} from '../fixtures/e2e-test.js';

const storefront = 'https://shared-dev-static-sf-2.musticker.com';

test('known Pretendard metadata warnings are limited to the storefront font subsets', () => {
  const warning = (file: string) =>
    `[JavaScript Warning: "downloadable font: name: name records are not sorted. (font-family: "Pretendard" style:normal weight:100..900 stretch:100 src index:0) source: ${storefront}/fonts/${file}"]`;

  expect(isBenignPretendardMetadataWarning(warning('PretendardVariable.latin.woff2'))).toBe(true);
  expect(isBenignPretendardMetadataWarning(warning('PretendardVariable.kr.woff2'))).toBe(true);
  expect(isBenignPretendardMetadataWarning(warning('OtherFont.latin.woff2'))).toBe(false);
  expect(isBenignPretendardMetadataWarning(warning('PretendardVariable.latin.woff2').replace('name records are not sorted', 'download failed'))).toBe(false);
  expect(isBenignPretendardMetadataWarning(warning('PretendardVariable.latin.woff2').replace('musticker.com', 'musticker.com.evil.net'))).toBe(false);
});

test('known Pretendard preload warnings cover only the first-party font', () => {
  const warning = (url: string) =>
    `[JavaScript Warning: "The resource at “${url}” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly." {file: "${storefront}/kr" line: 0}]`;

  expect(isBenignPretendardPreloadWarning(warning(`${storefront}/fonts/PretendardVariable.kr.woff2`))).toBe(true);
  expect(isBenignPretendardPreloadWarning(warning(`${storefront}/fonts/PretendardVariable.latin.woff2`).replace(`{file: "${storefront}/kr"`, `{file: "${storefront}/kr/sheet-stickers/circle-sheet"`))).toBe(true);
  expect(isBenignPretendardPreloadWarning(warning(`${storefront}/fonts/OtherFont.woff2`))).toBe(false);
  expect(isBenignPretendardPreloadWarning(warning(`${storefront}/fonts/PretendardVariable.kr.woff2`).replace('not used', 'failed to load'))).toBe(false);
});

test('known Nuxt preload warnings are limited to first-party JavaScript chunks', () => {
  const warning = (url: string) =>
    `The resource ${url} was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it wasn't preloaded for nothing.`;

  expect(isBenignNuxtPreloadWarning(warning(`${storefront}/_nuxt/_C30UbKY.js`))).toBe(true);
  expect(isBenignNuxtPreloadWarning(warning(`${storefront}/_nuxt/style.css`))).toBe(false);
  expect(isBenignNuxtPreloadWarning(warning('https://external.example/_nuxt/_C30UbKY.js'))).toBe(false);
  expect(isBenignNuxtPreloadWarning(warning(`${storefront}/_nuxt/_C30UbKY.js`).replace('not used', 'failed to load'))).toBe(false);

  const payload = `${storefront}/kr/stickers/die-cut-sticker/_payload.json?_b=d9f1f628-0b91-4501-9590-145cdc31d906`;
  expect(isBenignNuxtPreloadWarning(warning(payload))).toBe(true);
  expect(isBenignNuxtPreloadWarning(warning(`${storefront}/kr/_payload.json?_b=d9f1f628-0b91-4501-9590-145cdc31d906`))).toBe(true);
  expect(isBenignNuxtPreloadWarning(
    `[JavaScript Warning: "The resource at “${payload}” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly." {file: "${storefront}/kr/stickers/die-cut-sticker?studio=1" line: 0}]`
  )).toBe(true);
  expect(isBenignNuxtPreloadWarning(
    `[JavaScript Warning: "The resource at “${payload}” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly." {file: "${storefront}/kr/stickers/die-cut-sticker" line: 0}]`
  )).toBe(true);
  expect(isBenignNuxtPreloadWarning(warning(payload.replace('musticker.com', 'musticker.com.evil.net')))).toBe(false);
});

test('Firefox illustration preload warning is limited to first-party SVG assets', () => {
  const warning = (url: string) =>
    `[JavaScript Warning: "The resource at “${url}” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly." {file: "${storefront}/kr/stickers" line: 0}]`;
  expect(isBenignFirefoxIllustrationPreloadWarning(warning(`${storefront}/illustrations/products/stickers/die-cut.svg`))).toBe(true);
  expect(isBenignFirefoxIllustrationPreloadWarning(warning(`${storefront}/illustrations/products/stickers/die-cut.png`))).toBe(false);
  expect(isBenignFirefoxIllustrationPreloadWarning(warning('https://external.example/illustrations/products/stickers/die-cut.svg'))).toBe(false);
});

test('only a bare "Failed to fetch" or NUXT_E5002 is a candidate for the navigation-abort allowance', () => {
  expect(abortedFetchConsoleKind('TypeError: Failed to fetch')).toBe('api');
  expect(abortedFetchConsoleKind('Pricing request failed! TypeError: Failed to fetch')).toBe('api');
  expect(abortedFetchConsoleKind('[NUXT_E5002]')).toBe('appManifest');
  expect(abortedFetchConsoleKind('Pricing request failed! TypeError: Failed to fetch dynamically imported module')).toBeUndefined();
  expect(abortedFetchConsoleKind('Order failed! TypeError: Failed to fetch')).toBeUndefined();
  expect(abortedFetchConsoleKind('TypeError: NetworkError when attempting to fetch resource.')).toBeUndefined();
  expect(abortedFetchConsoleKind('[NUXT_E5002] something else')).toBeUndefined();
});

test('worker model fallback warning does not cover other WebGPU failures', () => {
  expect(isBenignWorkerModelFallbackWarning('[Worker] WebGPU 어댑터 조회 실패 — 가벼운 모델을 씁니다 Error')).toBe(true);
  expect(isBenignWorkerModelFallbackWarning('[Worker] WebGPU model crashed Error')).toBe(false);
});
