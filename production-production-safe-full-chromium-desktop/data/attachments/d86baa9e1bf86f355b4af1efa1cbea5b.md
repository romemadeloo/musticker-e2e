# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/discovery/about.spec.ts >> About page >> MS-DSC-006 about page loads hero, sub-nav, stats, and CTAs
- Location: tests/e2e/storefront/discovery/about.spec.ts:7:3

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 14

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[warning] Failed to load messages for locale \"kr\" FetchError: [GET] \"/_i18n/7a07a3d9/kr/messages.json\": 403 
+     at async l (https://www.musticker.com/_nuxt/UTjbfT_H.js:1:6198)
+     at async b (https://www.musticker.com/_nuxt/K_gswfE8.js:2:77369)
+     at async Object.loadMessages (https://www.musticker.com/_nuxt/K_gswfE8.js:2:78499)
+     at async ss (https://www.musticker.com/_nuxt/K_gswfE8.js:2:81648)
+     at async setup (https://www.musticker.com/_nuxt/K_gswfE8.js:2:82078)
+     at async R (https://www.musticker.com/_nuxt/BH9w__-s.js:1:7406)
+     at async s (https://www.musticker.com/_nuxt/BH9w__-s.js:1:7963)
+     at async https://www.musticker.com/_nuxt/BH9w__-s.js:1:7864
+     at async Promise.all (index 0)
+     at async https://www.musticker.com/_nuxt/BH9w__-s.js:1:7773",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "403 https://www.musticker.com/_i18n/7a07a3d9/kr/messages.json",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - link "Musticker" [ref=e8] [cursor=pointer]:
            - /url: /kr
            - img "musticker logo" [ref=e9]
          - button "바로 주문하기" [ref=e10] [cursor=pointer]
        - navigation "Primary" [ref=e11]:
          - button "왜 만들었나" [ref=e12] [cursor=pointer]
          - button "우리의 철학" [ref=e13] [cursor=pointer]
          - button "왜 빠른가" [ref=e14] [cursor=pointer]
          - button "우리가 가는 길" [ref=e15] [cursor=pointer]
      - generic [ref=e17]:
        - generic [ref=e18]: SINCE 2014
        - heading "우리가 만드는 것은 스티커만이 아닙니다." [level=1] [ref=e19]
        - paragraph [ref=e20]: 누구나 쉽게 시작할 수 있는 새로운 스티커 주문 경험을 만듭니다
        - generic [ref=e21] [cursor=pointer]:
          - button "우리의 이야기 보기" [ref=e22]
          - button "바로 주문하기" [ref=e23]
        - img "스티커와 소품에 둘러싸여 시트를 꾸미는 아이" [ref=e25]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - paragraph [ref=e29]: 10년+
          - paragraph [ref=e30]: 스티커 제작 경험
        - generic [ref=e31]:
          - paragraph [ref=e32]: 수십만 건
          - paragraph [ref=e33]: 누적 제작 경험
        - generic [ref=e34]:
          - paragraph [ref=e35]: 스티커 전문
          - paragraph [ref=e36]: 스티커에 집중합니다
      - generic [ref=e38]:
        - heading "10년 넘게 스티커를 만들면서, 우리는 한 가지 사실을 알게 되었습니다." [level=2] [ref=e39]:
          - generic [ref=e40]: 10년 넘게
          - generic [ref=e41]: 스티커를 만들면서,
          - generic [ref=e42]:
            - generic [ref=e43]: 우리는 한 가지
            - generic [ref=e44]: 사실을 알게
            - generic [ref=e45]: 되었습니다.
        - paragraph [ref=e46]:
          - text: 사람들이 어려워한 것은
          - generic [ref=e47]: 스티커가 아니라 주문의 시작이었습니다
        - generic [ref=e48]:
          - paragraph [ref=e49]: "\"어떻게 주문해야 하나요?\""
          - paragraph [ref=e50]: "\"사이즈를 모르겠어요.\""
          - paragraph [ref=e51]: "\"파일 맞나요?\""
          - paragraph [ref=e52]: "\"견적을 먼저 받을 수 있나요?\""
      - generic [ref=e53]:
        - generic [ref=e54]: “
        - heading "수많은 주문을 만들며 우리는 수많은 질문을 만났습니다." [level=4] [ref=e55]
        - heading "'어떻게 주문하나요?'" [level=4] [ref=e56]
        - heading "머스티커는 그 질문에서 시작되었습니다." [level=4] [ref=e57]:
          - text: 머스티커는 그 질문에서
          - generic [ref=e58]: 시작되었습니다.
      - generic [ref=e60]:
        - heading "그래서 우리는 주문을 뜯어고쳤습니다." [level=2] [ref=e61]:
          - text: 그래서 우리는
          - generic [ref=e62]: 주문을
          - generic [ref=e63]: 뜯어고쳤습니다.
        - generic [ref=e64]:
          - article [ref=e65]:
            - generic [ref=e66]: "1"
            - heading "파일만 올리세요" [level=3] [ref=e67]
            - paragraph [ref=e68]: 준비할 것은 그것뿐입니다
          - article [ref=e69]:
            - generic [ref=e70]: "2"
            - heading "무료 시안을 보내드립니다" [level=3] [ref=e71]
            - paragraph [ref=e72]: 결제 전에 결과를 먼저 확인합니다
          - article [ref=e73]:
            - generic [ref=e74]: "3"
            - heading "온라인에서 확인하세요" [level=3] [ref=e75]
            - paragraph [ref=e76]: 수정 요청과 승인도 간편하게 진행됩니다
          - article [ref=e77]:
            - generic [ref=e78]: "4"
            - heading "승인하면 바로 제작됩니다" [level=3] [ref=e79]
            - paragraph [ref=e80]: 이후는 저희가 진행합니다
        - generic [ref=e81]:
          - heading "복잡한 과정은 우리가 대신합니다." [level=2] [ref=e82]:
            - text: 복잡한 과정은
            - generic [ref=e83]: 우리가 대신합니다.
          - paragraph [ref=e84]: 쉽게 주문하고, 결과에 만족하세요
      - generic [ref=e86]:
        - heading "가격은 합리적으로. 퀄리티는 대충 말고." [level=2] [ref=e87]
        - generic [ref=e88]:
          - article [ref=e89]:
            - img [ref=e91]
            - heading "불필요한 비용을 줄였습니다" [level=3] [ref=e93]
            - paragraph [ref=e94]: 주문을 간소화해 합리적인 가격을 만들었습니다
          - article [ref=e95]:
            - img [ref=e97]
            - heading "시안을 확인한 뒤 결정합니다" [level=3] [ref=e99]
            - paragraph [ref=e100]: 제작 전에 결과를 확인해 주문 부담을 줄였습니다
          - article [ref=e101]:
            - img [ref=e103]
            - heading "가격 때문에 품질을 포기하지 않습니다" [level=3] [ref=e105]
            - paragraph [ref=e106]: 다시 주문하고 싶은 완성도까지 챙깁니다
        - paragraph [ref=e107]: 가격은 부담 없이. 품질은 다시 찾고 싶게.
      - generic [ref=e109]:
        - heading "빠른 데는 다 이유가 있습니다." [level=2] [ref=e110]
        - paragraph [ref=e111]: 주문부터 제작까지 반복되는 과정은 시스템으로 연결하고, 중요한 부분은 사람이 확인합니다
        - generic [ref=e112]:
          - paragraph [ref=e115]: 주문 자동화
          - paragraph [ref=e118]: AI 기반 주문 처리
          - paragraph [ref=e121]: 자체 생산 시스템
      - generic [ref=e124]:
        - heading "소량 주문도 같은 기준으로 만듭니다." [level=2] [ref=e125]:
          - text: 소량 주문도
          - generic [ref=e126]: 같은 기준으로
          - generic [ref=e127]: 만듭니다.
        - generic [ref=e128]:
          - paragraph [ref=e129]: 한 장의 스티커도 브랜드의 시작일 수 있습니다.
          - paragraph [ref=e130]: 한 장의 라벨이 누군가의 첫 창업일 수도 있습니다.
        - paragraph [ref=e131]: 그래서 주문 수량과 관계없이 같은 기준으로 확인하고 제작합니다
      - generic [ref=e133]:
        - heading "좋은 아이디어가 가장 쉽게 세상에 나올 수 있도록." [level=2] [ref=e134]:
          - text: 좋은 아이디어가
          - generic [ref=e135]: 가장 쉽게
          - generic [ref=e136]: 세상에 나올 수 있도록.
        - paragraph [ref=e137]: 누구나 부담 없이 자기만의 스티커를 만들 수 있도록 머스티커는 더 쉬운 기준을 만들어갑니다
        - img "헬멧을 쓰고 스쿠터를 타는 사람" [ref=e139]
      - generic [ref=e140]:
        - heading "지금, 당신의 이야기를 붙여보세요." [level=2] [ref=e141]:
          - text: 지금, 당신의
          - generic [ref=e142]: 이야기를 붙여보세요.
        - paragraph [ref=e143]: 무료 시안부터 빠른 제작, 안전한 배송까지 머스티커가 함께합니다
        - button "빠른 스티커 제작" [ref=e145] [cursor=pointer]
    - navigation "네이버 톡톡으로 문의하기" [ref=e146]:
      - link "카카오채널로 문의하기" [ref=e147] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e149]
      - link "네이버 톡톡 으로 문의하기" [ref=e150] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e152]
      - button "이메일로 문의하기" [ref=e153] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e155]
  - contentinfo [ref=e156]:
    - generic [ref=e159]:
      - generic [ref=e160]:
        - generic [ref=e161]:
          - generic [ref=e162]:
            - paragraph [ref=e163]: 제품
            - list [ref=e164]:
              - listitem [ref=e165]:
                - link "스티커" [ref=e166] [cursor=pointer]:
                  - /url: /kr/stickers
              - listitem [ref=e167]:
                - link "롤스티커" [ref=e168] [cursor=pointer]:
                  - /url: /kr/roll-stickers
              - listitem [ref=e169]:
                - link "판스티커" [ref=e170] [cursor=pointer]:
                  - /url: /kr/sheet-stickers
              - listitem [ref=e171]:
                - link "홀로그램 스티커" [ref=e172] [cursor=pointer]:
                  - /url: /kr/stickers/hologram-sticker
              - listitem [ref=e173]:
                - link "글자 커팅 스티커" [ref=e174] [cursor=pointer]:
                  - /url: /kr/stickers/vinyl-lettering
          - generic [ref=e175]:
            - paragraph [ref=e176]: 주문 안내
            - list [ref=e177]:
              - listitem [ref=e178]:
                - link "주문 방법" [ref=e179] [cursor=pointer]:
                  - /url: /kr/faq?topic=order
              - listitem [ref=e180]:
                - link "파일 가이드" [ref=e181] [cursor=pointer]:
                  - /url: /kr/faq?topic=artwork
              - listitem [ref=e182]:
                - link "배송 안내" [ref=e183] [cursor=pointer]:
                  - /url: /kr/faq?topic=order&question=shippingStart
              - listitem [ref=e184]:
                - link "재인쇄ㆍ환불안내" [ref=e185] [cursor=pointer]:
                  - /url: /kr/faq?topic=refund
              - listitem [ref=e186]:
                - link "자주 묻는 질문" [ref=e187] [cursor=pointer]:
                  - /url: /kr/faq
          - generic [ref=e188]:
            - paragraph [ref=e189]: 회사
            - list [ref=e190]:
              - listitem [ref=e191]:
                - link "브랜드 소개" [ref=e192] [cursor=pointer]:
                  - /url: /kr/about
              - listitem [ref=e193]:
                - link "공지사항" [ref=e194] [cursor=pointer]:
                  - /url: /kr/announcements
              - listitem [ref=e195]:
                - button "고객리뷰" [ref=e196] [cursor=pointer]
              - listitem [ref=e197]:
                - button "대량주문ㆍ제휴문의" [ref=e198] [cursor=pointer]
          - generic [ref=e199]:
            - paragraph [ref=e200]: 정책
            - list [ref=e201]:
              - listitem [ref=e202]:
                - link "이용약관" [ref=e203] [cursor=pointer]:
                  - /url: /kr/terms-of-use
              - listitem [ref=e204]:
                - link "개인정보처리방침" [ref=e205] [cursor=pointer]:
                  - /url: /kr/privacy-policy
              - listitem [ref=e206]:
                - button "사업자정보확인" [ref=e207] [cursor=pointer]
              - listitem [ref=e208]:
                - link "오픈소스 고지" [ref=e209] [cursor=pointer]:
                  - /url: /kr/open-source-licenses
        - generic [ref=e210]:
          - generic [ref=e211]:
            - img "musticker logo" [ref=e212]
            - generic [ref=e213]: / 머스티커
          - generic [ref=e214]:
            - paragraph [ref=e215]: 고객센터
            - link "1899-5529" [ref=e216] [cursor=pointer]:
              - /url: tel:1899-5529
            - generic [ref=e217]:
              - paragraph [ref=e218]: 평일 09:00 – 18:00 · 토·일·공휴일 휴무
              - paragraph [ref=e219]:
                - generic [ref=e220]: 구매 문의
                - link "sales@musticker.com" [ref=e221] [cursor=pointer]:
                  - /url: mailto:sales@musticker.com
          - generic [ref=e222]:
            - link "instagram icon" [ref=e223] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "KakaoTalk Channel" [ref=e224] [cursor=pointer]:
              - /url: https://pf.kakao.com/_nJxnTX/chat
      - generic [ref=e225]:
        - separator [ref=e226]
        - generic [ref=e227]:
          - generic [ref=e228]:
            - paragraph [ref=e229]: (주)글로픽스 · 대표 여일석 · 사업자번호 877-88-03313 · 통신판매업신고 2026-부산해운대-0792호
            - paragraph [ref=e230]: 부산광역시 해운대구 해운대해변로 203 오션타워 1014호 · 호스팅 Amazon Web Services
          - paragraph [ref=e231]: © 2026 GLOPHICS Corp. All rights reserved.
```

# Test source

```ts
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
  495 |       .toEqual([]);
  496 |     expect
  497 |       .soft(
  498 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  499 |         'Unexpected failed HTTP responses'
  500 |       )
> 501 |       .toEqual([]);
      |        ^ Error: Unexpected failed HTTP responses
  502 |   }
  503 | });
  504 | 
  505 | export { expect };
  506 | 
```