# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/discovery/faq.spec.ts >> storefront v2 FAQ >> MS-DSC-004 FAQ topics and accordions are usable
- Location: tests/e2e/storefront/discovery/faq.spec.ts:8:3

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "[warning] [JavaScript Warning: \"downloadable font: name: name records are not sorted. (font-family: \"Pretendard\" style:normal weight:100..900 stretch:100 src index:0) source: https://dev-static-2.musticker.com/fonts/PretendardVariable.latin.woff2\"]",
+   "[warning] [JavaScript Warning: \"downloadable font: name: name records are not sorted. (font-family: \"Pretendard\" style:normal weight:100..900 stretch:100 src index:0) source: https://dev-static-2.musticker.com/fonts/PretendardVariable.kr.woff2\"]",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]:
        - paragraph [ref=e7]: 공지
        - button "Alignment - Test “Alignmen - Test”" [ref=e8] [cursor=pointer]:
          - paragraph [ref=e9]: Alignment - Test
          - paragraph [ref=e10]: “Alignmen - Test”
        - generic [ref=e11]:
          - button [ref=e12] [cursor=pointer]:
            - img [ref=e13]
          - button [ref=e15] [cursor=pointer]:
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
            - button "장바구니" [ref=e36] [cursor=pointer]:
              - img [ref=e37]
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
      - generic [ref=e48]:
        - generic [ref=e50]:
          - heading "FAQ" [level=1] [ref=e51]
          - paragraph [ref=e52]: 도움이 필요하신가요? Musticker 회원가입 및 혜택, 주문 방법, 시안 제작 가이드, 인쇄 옵션, 결제 및 환불 규정 등 다양한 궁금증에 대한 답변을 확인해 보세요. 고객님의 스티커 제작이 쉽고 간편하게 진행되도록 Musticker가 언제나 함께하겠습니다.
        - generic [ref=e54]:
          - navigation [ref=e55]:
            - paragraph [ref=e56]: 주제
            - generic [ref=e57]:
              - generic [ref=e58] [cursor=pointer]: 멤버십
              - generic [ref=e59] [cursor=pointer]: 주문
              - generic [ref=e60] [cursor=pointer]: 디자인 파일 업로드
              - generic [ref=e61] [cursor=pointer]: 인쇄
              - generic [ref=e62] [cursor=pointer]: 결제
              - generic [ref=e63] [cursor=pointer]: 반품/환불
          - generic [ref=e64]:
            - generic [ref=e65]:
              - heading "궁금한 점이 있으신가요? 저희가 도와드리겠습니다." [level=4] [ref=e66]
              - generic [ref=e68]:
                - textbox "궁금한 사항을 입력해주세요." [ref=e69]
                - img [ref=e71]
            - generic [ref=e74]:
              - button "회원가입 시 혜택이 궁금합니다." [active] [ref=e76] [cursor=pointer]:
                - paragraph [ref=e77]: 회원가입 시 혜택이 궁금합니다.
                - img [ref=e78]
              - button "여러개의 계정을 사용할 수 있나요?" [ref=e81] [cursor=pointer]:
                - paragraph [ref=e82]: 여러개의 계정을 사용할 수 있나요?
                - img [ref=e83]
              - button "회원정보를 변경하고 싶습니다." [ref=e86] [cursor=pointer]:
                - paragraph [ref=e87]: 회원정보를 변경하고 싶습니다.
                - img [ref=e88]
              - button "비밀번호를 변경하고 싶습니다." [ref=e91] [cursor=pointer]:
                - paragraph [ref=e92]: 비밀번호를 변경하고 싶습니다.
                - img [ref=e93]
              - button "이메일 주소를 변경하고 싶거나 잊어버렸을 때는 어떻게 하나요?" [ref=e96] [cursor=pointer]:
                - paragraph [ref=e97]: 이메일 주소를 변경하고 싶거나 잊어버렸을 때는 어떻게 하나요?
                - img [ref=e98]
              - button "비밀번호 재설정 메일이 오지 않습니다." [ref=e101] [cursor=pointer]:
                - paragraph [ref=e102]: 비밀번호 재설정 메일이 오지 않습니다.
                - img [ref=e103]
      - navigation "네이버 톡톡으로 문의하기" [ref=e105]:
        - link "카카오채널로 문의하기" [ref=e106] [cursor=pointer]:
          - /url: https://pf.kakao.com/_nJxnTX/chat
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 카카오채널로 문의하기
          - img [ref=e108]
        - link "네이버 톡톡 으로 문의하기" [ref=e109] [cursor=pointer]:
          - /url: https://talk.naver.com/ct/w2luxqo
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 네이버 톡톡 으로 문의하기
          - img [ref=e111]
        - button "이메일로 문의하기" [ref=e112] [cursor=pointer]:
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 이메일로 문의하기
          - img [ref=e114]
    - contentinfo [ref=e115]:
      - generic [ref=e116]:
        - generic [ref=e117]:
          - heading "MUSTICKER / 머스티커" [level=2] [ref=e118]
          - paragraph [ref=e119]: "상호명: (주)글로픽스"
          - paragraph [ref=e120]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
          - paragraph [ref=e121]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
          - paragraph [ref=e122]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
          - paragraph [ref=e123]:
            - generic [ref=e124]: ⓒ 2026. All rights reserved.
            - generic [ref=e125]: "판매: sales@musticker.com"
            - link "이용약관" [ref=e126] [cursor=pointer]:
              - /url: /kr/terms-of-use
            - link "개인정보처리방침" [ref=e127] [cursor=pointer]:
              - /url: /kr/privacy-policy
            - button "사업자정보확인" [ref=e128] [cursor=pointer]
            - link "오픈소스 라이선스" [ref=e129] [cursor=pointer]:
              - /url: /kr/open-source-licenses
            - link "회사소개" [ref=e130] [cursor=pointer]:
              - /url: /kr/about
        - generic [ref=e131]:
          - paragraph [ref=e132]: 1899-5529
          - paragraph [ref=e134]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
          - generic [ref=e135]:
            - button "1:1문의하기" [ref=e136] [cursor=pointer]
            - link "자주 묻는 질문" [ref=e137] [cursor=pointer]:
              - /url: /kr/faq
          - generic [ref=e138]:
            - generic [ref=e139]: "Follow us at:"
            - generic [ref=e140]:
              - link "instagram icon" [ref=e141] [cursor=pointer]:
                - /url: https://www.instagram.com/musticker_official/
                - img "instagram icon"
              - link "youtube icon" [ref=e142] [cursor=pointer]:
                - /url: https://www.youtube.com/@MustickerOfficial
                - img "youtube icon"
  - button "KR" [ref=e143] [cursor=pointer]
```

# Test source

```ts
  395 |         return;
  396 |       }
  397 | 
  398 |       if (allowTransientApiCorsFailures && isTransientApiFetchFailure(text)) {
  399 |         pendingTransientApiNetworkFailures = Math.max(0, pendingTransientApiNetworkFailures - 1);
  400 |         return;
  401 |       }
  402 | 
  403 |       if (allowTransientCartCreateFailures && isCartCreateCorsFailure(text)) {
  404 |         pendingCartCreateNetworkFailures += 1;
  405 |         return;
  406 |       }
  407 | 
  408 |       if (
  409 |         allowTransientCartCreateFailures &&
  410 |         pendingCartCreateNetworkFailures > 0 &&
  411 |         text === 'Failed to load resource: net::ERR_FAILED'
  412 |       ) {
  413 |         return;
  414 |       }
  415 | 
  416 |       if (allowTransientCartCreateFailures && isCartCreateFetchFailure(text)) {
  417 |         pendingCartCreateNetworkFailures = Math.max(0, pendingCartCreateNetworkFailures - 1);
  418 |         return;
  419 |       }
  420 | 
  421 |       if (allowKnownPriceWarnings && isSupersededPricingRequest(text)) {
  422 |         hadSupersededPricingRequest = true;
  423 |         return;
  424 |       }
  425 | 
  426 |       if (allowKnownPriceWarnings && hadSupersededPricingRequest && text === 'Unable to retrieve prices.') {
  427 |         hadSupersededPricingRequest = false;
  428 |         return;
  429 |       }
  430 | 
  431 |       if (isKnownConsoleMessage(text, guardOptions)) {
  432 |         return;
  433 |       }
  434 | 
  435 |       consoleFailures.push(`[${message.type()}] ${text}`);
  436 |     });
  437 | 
  438 |     page.on('response', (response) => {
  439 |       const status = response.status();
  440 |       if (status < 400) {
  441 |         return;
  442 |       }
  443 | 
  444 |       const url = response.url();
  445 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  446 |         return;
  447 |       }
  448 | 
  449 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  450 |         return;
  451 |       }
  452 | 
  453 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  454 |         return;
  455 |       }
  456 | 
  457 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  458 |         pendingTransientProductPageFailures += 1;
  459 |         return;
  460 |       }
  461 | 
  462 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  463 |         pendingExpectedNotFoundResponses += 1;
  464 |         return;
  465 |       }
  466 | 
  467 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  468 |         return;
  469 |       }
  470 | 
  471 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  472 |         return;
  473 |       }
  474 | 
  475 |       if (allowStudioModelLoadNoise && isStudioModelMissingTokenizerConfig(status, url)) {
  476 |         return;
  477 |       }
  478 | 
  479 |       responseFailures.push(`${status} ${url}`);
  480 |     });
  481 | 
  482 |     await applyInternalOriginHeader(page);
  483 |     await use(page);
  484 | 
  485 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  486 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  487 |     // that nothing retried still fails the run.
  488 |     const throttleBlocks = retriedThrottleBlockCount(page);
  489 | 
  490 |     expect
  491 |       .soft(
  492 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  493 |         'Unexpected browser console errors or warnings'
  494 |       )
> 495 |       .toEqual([]);
      |        ^ Error: Unexpected browser console errors or warnings
  496 |     expect
  497 |       .soft(
  498 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  499 |         'Unexpected failed HTTP responses'
  500 |       )
  501 |       .toEqual([]);
  502 |   }
  503 | });
  504 | 
  505 | export { expect };
  506 | 
```