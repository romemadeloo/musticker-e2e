# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/purchasing/cart-lifecycle.spec.ts >> storefront v2 cart lifecycle >> MS-V2-102 a guest cart survives a full page reload @smoke
- Location: tests/e2e/storefront/purchasing/cart-lifecycle.spec.ts:97:3

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "[error] Access to font at 'https://static.musticker.com/fonts/lettering/segoe-ui.ttf' from origin 'https://www.musticker.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
+   "[error] Failed to load resource: net::ERR_FAILED",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - paragraph [ref=e7]: 공지
      - button "추석 연휴 배송 안내 “추석 연휴 기간 동안 택배사 휴무로 인해 배송이 일시 중단되며, 연휴 이후 순차적으로 배송됩니다.”" [ref=e8] [cursor=pointer]:
        - paragraph [ref=e9]: 추석 연휴 배송 안내
        - paragraph [ref=e10]: “추석 연휴 기간 동안 택배사 휴무로 인해 배송이 일시 중단되며, 연휴 이후 순차적으로 배송됩니다.”
      - generic [ref=e11]:
        - button [disabled] [ref=e12]:
          - img [ref=e13]
        - button [disabled] [ref=e15]:
          - img [ref=e16]
    - button [ref=e18] [cursor=pointer]:
      - img [ref=e19]
  - banner [ref=e21]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - link "Musticker" [ref=e24] [cursor=pointer]:
          - /url: /kr
          - img "musticker logo" [ref=e25]
        - generic [ref=e26]:
          - button "공지사항 열기" [ref=e28] [cursor=pointer]:
            - img [ref=e30]
          - button "layout.header.search" [ref=e32] [cursor=pointer]:
            - img [ref=e33]
          - generic [ref=e35]:
            - button "장바구니" [ref=e36] [cursor=pointer]:
              - img [ref=e37]
            - generic: "1"
          - button "계정" [ref=e40] [cursor=pointer]:
            - img [ref=e42]
      - navigation "Primary":
        - link "스티커" [ref=e44] [cursor=pointer]:
          - /url: /kr/stickers
        - link "롤스티커" [ref=e45] [cursor=pointer]:
          - /url: /kr/roll-stickers
        - link "판스티커" [ref=e46] [cursor=pointer]:
          - /url: /kr/sheet-stickers
  - main [ref=e47]:
    - generic [ref=e49]:
      - generic [ref=e50]:
        - heading "내 장바구니" [level=1] [ref=e51]
        - link "쇼핑 계속하기" [ref=e52] [cursor=pointer]:
          - /url: /stickers
          - img [ref=e53]
          - text: 쇼핑 계속하기
      - generic [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58] [cursor=pointer]:
              - 'checkbox "전체 선택 : 1개 상품" [checked] [ref=e59]'
              - img [ref=e61]
              - generic [ref=e63]: "전체 선택 : 1개 상품"
            - button "삭제" [ref=e64] [cursor=pointer]:
              - generic [ref=e65]:
                - img [ref=e66]
                - text: 삭제
          - generic [ref=e68]:
            - generic [ref=e69]: 상품
            - generic [ref=e70]: 수량
            - generic [ref=e71]: 가격
          - article [ref=e73]:
            - generic [ref=e74] [cursor=pointer]:
              - checkbox [checked] [ref=e75]
              - img [ref=e77]
            - generic [ref=e79]:
              - generic [ref=e80]:
                - generic [ref=e81]:
                  - button "자유형 조각스티커" [ref=e83] [cursor=pointer]:
                    - img "자유형 조각스티커" [ref=e84]
                    - img [ref=e86]
                  - generic [ref=e88]:
                    - heading "자유형 조각스티커" [level=3] [ref=e89]
                    - paragraph [ref=e90]: 75x75mm
                    - button "이미지 추가" [ref=e91] [cursor=pointer]:
                      - generic [ref=e92]: 이미지 추가
                - button "사이즈 변경" [ref=e94] [cursor=pointer]:
                  - generic [ref=e95]: 사이즈 변경
              - generic [ref=e96]:
                - button "100개" [ref=e99] [cursor=pointer]:
                  - generic [ref=e100]: 100개
                  - img [ref=e101]
                - strong [ref=e103]: 36,100원
            - button "상품 삭제" [ref=e104] [cursor=pointer]:
              - img [ref=e105]
              - generic [ref=e107]: 상품 삭제
        - complementary [ref=e108]:
          - generic [ref=e109]:
            - heading "주문 요약" [level=2] [ref=e111]
            - generic [ref=e112]:
              - generic [ref=e113]:
                - generic [ref=e114]: 합계
                - strong [ref=e115]: 36,100원
              - generic [ref=e116]:
                - button "주문하기 (1)" [ref=e117] [cursor=pointer]:
                  - generic [ref=e118]: 주문하기 (1)
                - paragraph [ref=e119]: 배송비 및 할인은 결제 시 적용됩니다.
    - navigation "네이버 톡톡으로 문의하기" [ref=e120]:
      - link "카카오채널로 문의하기" [ref=e121] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e123]
      - link "네이버 톡톡 으로 문의하기" [ref=e124] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e126]
      - button "이메일로 문의하기" [ref=e127] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e129]
  - contentinfo [ref=e130]:
    - generic [ref=e131]:
      - generic [ref=e132]: ⓒ (주)글로픽스. 2026. All rights reserved.
      - generic [ref=e133]:
        - generic [ref=e134]: "판매: sales@musticker.com"
        - link "이용약관" [ref=e135] [cursor=pointer]:
          - /url: /kr/terms-of-use
        - link "개인정보처리방침" [ref=e136] [cursor=pointer]:
          - /url: /kr/privacy-policy
        - button "사업자정보확인" [ref=e137] [cursor=pointer]
        - link "오픈소스 라이선스" [ref=e138] [cursor=pointer]:
          - /url: /kr/open-source-licenses
        - link "회사소개" [ref=e139] [cursor=pointer]:
          - /url: /kr/about
      - generic [ref=e140]:
        - button "1:1문의하기" [ref=e141] [cursor=pointer]
        - link "자주 묻는 질문" [ref=e142] [cursor=pointer]:
          - /url: /kr/faq
```

# Test source

```ts
  366 |         allowTransientApiCorsFailures &&
  367 |         pendingTransientApiNetworkFailures > 0 &&
  368 |         text === 'Failed to load resource: net::ERR_FAILED'
  369 |       ) {
  370 |         return;
  371 |       }
  372 | 
  373 |       if (allowTransientApiCorsFailures && isTransientApiFetchFailure(text)) {
  374 |         pendingTransientApiNetworkFailures = Math.max(0, pendingTransientApiNetworkFailures - 1);
  375 |         return;
  376 |       }
  377 | 
  378 |       if (allowTransientCartCreateFailures && isCartCreateCorsFailure(text)) {
  379 |         pendingCartCreateNetworkFailures += 1;
  380 |         return;
  381 |       }
  382 | 
  383 |       if (
  384 |         allowTransientCartCreateFailures &&
  385 |         pendingCartCreateNetworkFailures > 0 &&
  386 |         text === 'Failed to load resource: net::ERR_FAILED'
  387 |       ) {
  388 |         return;
  389 |       }
  390 | 
  391 |       if (allowTransientCartCreateFailures && isCartCreateFetchFailure(text)) {
  392 |         pendingCartCreateNetworkFailures = Math.max(0, pendingCartCreateNetworkFailures - 1);
  393 |         return;
  394 |       }
  395 | 
  396 |       if (allowKnownPriceWarnings && isSupersededPricingRequest(text)) {
  397 |         hadSupersededPricingRequest = true;
  398 |         return;
  399 |       }
  400 | 
  401 |       if (allowKnownPriceWarnings && hadSupersededPricingRequest && text === 'Unable to retrieve prices.') {
  402 |         hadSupersededPricingRequest = false;
  403 |         return;
  404 |       }
  405 | 
  406 |       if (isKnownConsoleMessage(text, guardOptions)) {
  407 |         return;
  408 |       }
  409 | 
  410 |       consoleFailures.push(`[${message.type()}] ${text}`);
  411 |     });
  412 | 
  413 |     page.on('response', (response) => {
  414 |       const status = response.status();
  415 |       if (status < 400) {
  416 |         return;
  417 |       }
  418 | 
  419 |       const url = response.url();
  420 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  421 |         return;
  422 |       }
  423 | 
  424 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  425 |         return;
  426 |       }
  427 | 
  428 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  429 |         return;
  430 |       }
  431 | 
  432 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  433 |         pendingTransientProductPageFailures += 1;
  434 |         return;
  435 |       }
  436 | 
  437 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  438 |         pendingExpectedNotFoundResponses += 1;
  439 |         return;
  440 |       }
  441 | 
  442 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  443 |         return;
  444 |       }
  445 | 
  446 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  447 |         return;
  448 |       }
  449 | 
  450 |       responseFailures.push(`${status} ${url}`);
  451 |     });
  452 | 
  453 |     await applyInternalOriginHeader(page);
  454 |     await use(page);
  455 | 
  456 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  457 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  458 |     // that nothing retried still fails the run.
  459 |     const throttleBlocks = retriedThrottleBlockCount(page);
  460 | 
  461 |     expect
  462 |       .soft(
  463 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  464 |         'Unexpected browser console errors or warnings'
  465 |       )
> 466 |       .toEqual([]);
      |        ^ Error: Unexpected browser console errors or warnings
  467 |     expect
  468 |       .soft(
  469 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  470 |         'Unexpected failed HTTP responses'
  471 |       )
  472 |       .toEqual([]);
  473 |   }
  474 | });
  475 | 
  476 | export { expect };
  477 | 
```