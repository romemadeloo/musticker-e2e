import { test, expect } from '@playwright/test';

import {
  abortedAppChunkUrl,
  abortedAppImageUrl,
  abortedFetchConsoleKind,
  isBenignFirefoxAnalyticsWarning,
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

test('Firefox AbortError wording is a candidate for the same API-abort allowance', () => {
  expect(abortedFetchConsoleKind('Sheet previews request failed! AbortError: The operation was aborted.')).toBe('api');
  expect(abortedFetchConsoleKind('Featured request failed! AbortError: The operation was aborted.')).toBe('api');
  expect(abortedFetchConsoleKind('AbortError: The operation was aborted.')).toBe('api');
  expect(abortedFetchConsoleKind('Order failed! AbortError: The operation was aborted.')).toBeUndefined();
  expect(abortedFetchConsoleKind('Featured request failed! AbortError: something else')).toBeUndefined();
});

test('a Firefox chunk-load failure is a candidate only for a first-party Nuxt chunk', () => {
  const failure = (url: string) => `TypeError: error loading dynamically imported module: ${url}`;
  expect(abortedFetchConsoleKind(failure(`${storefront}/_nuxt/BLd0ibfu.js`))).toBe('appChunk');
  expect(abortedFetchConsoleKind(failure('https://www.musticker.com/_nuxt/Bh9r5cVs.js'))).toBe('appChunk');
  expect(abortedFetchConsoleKind(failure(`${storefront}/_nuxt/style.css`))).toBeUndefined();
  expect(abortedFetchConsoleKind(failure('https://external.example/_nuxt/BLd0ibfu.js'))).toBeUndefined();
  expect(abortedFetchConsoleKind(failure(`${storefront}/_nuxt/BLd0ibfu.js`.replace('musticker.com', 'musticker.com.evil.net')))).toBeUndefined();
  expect(abortedFetchConsoleKind(`TypeError: something else: ${storefront}/_nuxt/BLd0ibfu.js`)).toBeUndefined();
  expect(abortedAppChunkUrl(failure(`${storefront}/_nuxt/BLd0ibfu.js`))).toBe(`${storefront}/_nuxt/BLd0ibfu.js`);

  const reloadWarning = (url: string) =>
    `[JavaScript Warning: "Loading failed for the module with source “${url}”." {file: "https://www.musticker.com/_nuxt/CmHcF95e.js" line: 0}]`;
  expect(abortedFetchConsoleKind(reloadWarning('https://www.musticker.com/_nuxt/CyjtuxxQ.js'))).toBe('appChunk');
  expect(abortedAppChunkUrl(reloadWarning('https://www.musticker.com/_nuxt/CyjtuxxQ.js'))).toBe('https://www.musticker.com/_nuxt/CyjtuxxQ.js');
  expect(abortedFetchConsoleKind(reloadWarning('https://external.example/_nuxt/CyjtuxxQ.js'))).toBeUndefined();

  // Names no file, so it pairs with any aborted chunk rather than a specific one.
  const mediaPaused = (file: string) =>
    `[JavaScript Warning: "All candidate resources failed to load. Media load paused." {file: "${file}" line: 0}]`;
  expect(abortedFetchConsoleKind(mediaPaused('https://www.musticker.com/kr/stickers/die-cut-sticker'))).toBe('appChunk');
  expect(abortedAppChunkUrl(mediaPaused('https://www.musticker.com/kr/stickers/die-cut-sticker'))).toBeUndefined();
  expect(abortedFetchConsoleKind(mediaPaused('https://external.example/kr/stickers/die-cut-sticker'))).toBeUndefined();
});

test('a Firefox truncated-image error pairs only with that first-party image', () => {
  const truncated = (file: string) => `[JavaScript Error: "Image corrupt or truncated." {file: "${file}" line: 0}]`;
  const image = 'https://www.musticker.com/illustrations/upload-modal/studio-demo-baby-cut.png';
  expect(abortedFetchConsoleKind(truncated(image))).toBe('appImage');
  expect(abortedAppImageUrl(truncated(image))).toBe(image);
  expect(abortedFetchConsoleKind(truncated('https://external.example/illustrations/x.png'))).toBeUndefined();
  expect(abortedFetchConsoleKind(truncated(image).replace('corrupt or truncated', 'decode failed'))).toBeUndefined();
});

test('Firefox analytics warnings cover only the _ga cookie and the gtag script', () => {
  const cookie = (name: string, file: string) =>
    `[JavaScript Warning: "The value of the attribute “expires” for the cookie “${name}” has been overwritten." {file: "${file}" line: 0}]`;
  expect(isBenignFirefoxAnalyticsWarning(cookie('_ga_13EV953YXC', 'https://www.musticker.com/kr/faq'))).toBe(true);
  expect(isBenignFirefoxAnalyticsWarning(cookie('_ga', `${storefront}/kr`))).toBe(true);
  expect(isBenignFirefoxAnalyticsWarning(cookie('session', 'https://www.musticker.com/kr'))).toBe(false);
  expect(isBenignFirefoxAnalyticsWarning(cookie('_ga_13EV953YXC', 'https://external.example/kr'))).toBe(false);

  const layout = (file: string) =>
    `[JavaScript Warning: "Layout was forced before the page was fully loaded. If stylesheets are not yet loaded this may cause a flash of unstyled content." {file: "${file}" line: 1065}]`;
  expect(isBenignFirefoxAnalyticsWarning(layout('https://www.googletagmanager.com/gtag/js?id=G-13EV953YXC'))).toBe(true);
  expect(isBenignFirefoxAnalyticsWarning(layout('https://www.musticker.com/_nuxt/BLd0ibfu.js'))).toBe(false);
  expect(isBenignFirefoxAnalyticsWarning(layout('https://www.googletagmanager.com.evil.net/gtag/js?id=G-1'))).toBe(false);
});

test('worker model fallback warning does not cover other WebGPU failures', () => {
  expect(isBenignWorkerModelFallbackWarning('[Worker] WebGPU 어댑터 조회 실패 — 가벼운 모델을 씁니다 Error')).toBe(true);
  expect(isBenignWorkerModelFallbackWarning('[Worker] WebGPU model crashed Error')).toBe(false);
});
