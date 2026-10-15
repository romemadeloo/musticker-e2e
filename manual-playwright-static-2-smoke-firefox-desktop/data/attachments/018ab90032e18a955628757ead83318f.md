# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/smoke/storefront-smoke.spec.ts >> storefront v2 smoke >> MS-NAV-001 homepage loads with critical public content
- Location: tests/e2e/storefront/smoke/storefront-smoke.spec.ts:11:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('contentinfo').first().or(locator('footer').first()).first().getByRole('img', { name: 'musticker logo' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('contentinfo').first().or(locator('footer').first()).first().getByRole('img', { name: 'musticker logo' })

```

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
      - main [ref=e48]:
        - generic [ref=e50]:
          - generic:
            - img "스티커ㅋㅋㅋ,"
          - generic [ref=e51]:
            - generic [ref=e52]:
              - heading "스티커ㅋㅋㅋ, 이유가 있구나" [level=1] [ref=e53]:
                - text: 스티커ㅋㅋㅋ,
                - generic [ref=e54]: 이유가 있구나
              - paragraph [ref=e55]: 빠른데, 퀄리티까지 미쳤다
            - button "빠른 주문" [ref=e56] [cursor=pointer]:
              - generic [ref=e57]: 빠른 주문
        - generic [ref=e58]:
          - generic [ref=e60]:
            - link "스티커" [ref=e61] [cursor=pointer]:
              - /url: /kr/stickers/die-cut-sticker
              - img [ref=e63]
              - paragraph [ref=e64]: 스티커
            - link "롤스티커" [ref=e65] [cursor=pointer]:
              - /url: /kr/roll-stickers/die-cut-roll
              - img [ref=e67]
              - paragraph [ref=e68]: 롤스티커
            - link "판스티커" [ref=e69] [cursor=pointer]:
              - /url: /kr/stickers/sticker-sheet
              - img [ref=e71]
              - paragraph [ref=e72]: 판스티커
            - link "홀로그램" [ref=e73] [cursor=pointer]:
              - /url: /kr/stickers/hologram-sticker
              - img [ref=e75]
              - paragraph [ref=e76]: 홀로그램
            - link "글자 커팅 스티커" [ref=e77] [cursor=pointer]:
              - /url: /kr/stickers/vinyl-lettering
              - img [ref=e79]
              - paragraph [ref=e80]: 글자 커팅 스티커
          - generic [ref=e82]:
            - generic [ref=e83]:
              - button "음소거 해제" [ref=e85] [cursor=pointer]:
                - img [ref=e86]
              - button "전체화면" [ref=e88] [cursor=pointer]:
                - img [ref=e89]
            - generic [ref=e91]:
              - heading "급해서 맡겼는데, 퀄리티 때문에 기억나는 스티커" [level=2] [ref=e92]:
                - text: 급해서 맡겼는데,
                - text: 퀄리티 때문에 기억나는 스티커
              - paragraph [ref=e93]: 파일만 첨부하면 시안이 전달되고, 승인 즉시 제작이 시작됩니다. 급한 작업이어도 색감·라인·마감까지 정교해 “여기 또 써야겠다”는 말이 나올 거예요. 우리는 빨리 만드는 게 아니라, 빠르게 ‘잘’ 만드는 것을 목표로 합니다.
          - region "고객 리뷰 캐러셀" [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]:
                - heading "사진 후기 265개, 만족도는 이미 증명됐어요" [level=2] [ref=e97]:
                  - text: 사진 후기 265개,
                  - text: 만족도는 이미 증명됐어요
                - generic [ref=e98]:
                  - button "이전 리뷰로 이동" [disabled] [ref=e99]:
                    - img [ref=e100]
                    - generic [ref=e102]: 이전 리뷰로 이동
                  - button "다음 리뷰로 이동" [ref=e103] [cursor=pointer]:
                    - img [ref=e104]
                    - generic [ref=e106]: 다음 리뷰로 이동
              - region "고객 리뷰 캐러셀" [ref=e107]:
                - generic [ref=e108]:
                  - group "Review 1 of 16" [ref=e109]:
                    - img "Jh****" [ref=e110]
                    - generic [ref=e111]:
                      - generic [ref=e112]:
                        - heading "Jh****" [level=3] [ref=e114]
                        - paragraph [ref=e115]: 323212d1
                      - generic [ref=e116]:
                        - img [ref=e117]
                        - img [ref=e119]
                        - img [ref=e121]
                        - img [ref=e123]
                        - img [ref=e125]
                        - generic [ref=e127]: 2026-10-09
                  - group "Review 2 of 16" [ref=e128]:
                    - img "Jh****" [ref=e129]
                    - generic [ref=e130]:
                      - generic [ref=e131]:
                        - heading "Jh****" [level=3] [ref=e133]
                        - paragraph [ref=e134]: 1231d12e1
                      - generic [ref=e135]:
                        - img [ref=e136]
                        - generic [ref=e138]: 2026-10-09
                  - group "Review 3 of 16" [ref=e139]:
                    - img "Jh****" [ref=e140]
                    - generic [ref=e141]:
                      - generic [ref=e142]:
                        - heading "Jh****" [level=3] [ref=e144]
                        - paragraph [ref=e145]: TEST123123123123
                      - generic [ref=e146]:
                        - img [ref=e147]
                        - img [ref=e149]
                        - img [ref=e151]
                        - img [ref=e153]
                        - generic [ref=e155]: 2026-10-09
                  - group "Review 4 of 16" [ref=e156]:
                    - img "Jh****" [ref=e157]
                    - generic [ref=e158]:
                      - generic [ref=e159]:
                        - heading "Jh****" [level=3] [ref=e161]
                        - paragraph [ref=e162]: I am testing Alimtalk testing - I am testing Alimtalk testing
                      - generic [ref=e163]:
                        - img [ref=e164]
                        - img [ref=e166]
                        - img [ref=e168]
                        - img [ref=e170]
                        - img [ref=e172]
                        - generic [ref=e174]: 2026-10-06
                  - group "Review 5 of 16" [ref=e175]:
                    - img "Mi****" [ref=e176]
                    - generic [ref=e177]:
                      - generic [ref=e178]:
                        - heading "Mi****" [level=3] [ref=e180]
                        - paragraph [ref=e181]: TEST
                      - generic [ref=e182]:
                        - img [ref=e183]
                        - img [ref=e185]
                        - img [ref=e187]
                        - generic [ref=e189]: 2026-09-29
                  - group "Review 6 of 16" [ref=e190]:
                    - img "Mi****" [ref=e191]
                    - generic [ref=e192]:
                      - generic [ref=e193]:
                        - heading "Mi****" [level=3] [ref=e195]
                        - paragraph [ref=e196]: TEST
                      - generic [ref=e197]:
                        - img [ref=e198]
                        - img [ref=e200]
                        - img [ref=e202]
                        - img [ref=e204]
                        - generic [ref=e206]: 2026-09-29
                  - group "Review 7 of 16" [ref=e207]:
                    - img "TE****" [ref=e208]
                    - generic [ref=e209]:
                      - generic [ref=e210]:
                        - heading "TE****" [level=3] [ref=e212]
                        - paragraph [ref=e213]: test
                      - generic [ref=e214]:
                        - img [ref=e215]
                        - img [ref=e217]
                        - img [ref=e219]
                        - generic [ref=e221]: 2026-09-21
                  - group "Review 8 of 16" [ref=e222]:
                    - img "TE****" [ref=e223]
                    - generic [ref=e224]:
                      - generic [ref=e225]:
                        - heading "TE****" [level=3] [ref=e227]
                        - paragraph [ref=e228]: dawdawd
                      - generic [ref=e229]:
                        - img [ref=e230]
                        - img [ref=e232]
                        - img [ref=e234]
                        - generic [ref=e236]: 2026-09-21
                  - group "Review 9 of 16" [ref=e237]:
                    - img "TE****" [ref=e238]
                    - generic [ref=e239]:
                      - generic [ref=e240]:
                        - heading "TE****" [level=3] [ref=e242]
                        - paragraph [ref=e243]: TEST
                      - generic [ref=e244]:
                        - img [ref=e245]
                        - img [ref=e247]
                        - img [ref=e249]
                        - img [ref=e251]
                        - generic [ref=e253]: 2026-09-21
                  - group "Review 10 of 16" [ref=e254]:
                    - img "TE****" [ref=e255]
                    - generic [ref=e256]:
                      - generic [ref=e257]:
                        - heading "TE****" [level=3] [ref=e259]
                        - paragraph [ref=e260]: test
                      - generic [ref=e261]:
                        - img [ref=e262]
                        - img [ref=e264]
                        - img [ref=e266]
                        - img [ref=e268]
                        - generic [ref=e270]: 2026-09-21
                  - group "Review 11 of 16" [ref=e271]:
                    - img "TE****" [ref=e272]
                    - generic [ref=e273]:
                      - generic [ref=e274]:
                        - heading "TE****" [level=3] [ref=e276]
                        - paragraph [ref=e277]: testokay
                      - generic [ref=e278]:
                        - img [ref=e279]
                        - img [ref=e281]
                        - img [ref=e283]
                        - img [ref=e285]
                        - img [ref=e287]
                        - generic [ref=e289]: 2026-09-21
                  - group "Review 12 of 16" [ref=e290]:
                    - img "TE****" [ref=e291]
                    - generic [ref=e292]:
                      - generic [ref=e293]:
                        - heading "TE****" [level=3] [ref=e295]
                        - paragraph [ref=e296]: TESTTTTTs
                      - generic [ref=e297]:
                        - img [ref=e298]
                        - img [ref=e300]
                        - img [ref=e302]
                        - img [ref=e304]
                        - generic [ref=e306]: 2026-09-21
                  - group "Review 13 of 16" [ref=e307]:
                    - img "TE****" [ref=e308]
                    - generic [ref=e309]:
                      - generic [ref=e310]:
                        - heading "TE****" [level=3] [ref=e312]
                        - paragraph [ref=e313]: TEST
                      - generic [ref=e314]:
                        - img [ref=e315]
                        - img [ref=e317]
                        - img [ref=e319]
                        - generic [ref=e321]: 2026-09-18
                  - group "Review 14 of 16" [ref=e322]:
                    - img "TE****" [ref=e323]
                    - generic [ref=e324]:
                      - generic [ref=e325]:
                        - heading "TE****" [level=3] [ref=e327]
                        - paragraph [ref=e328]: TEST
                      - generic [ref=e329]:
                        - img [ref=e330]
                        - img [ref=e332]
                        - img [ref=e334]
                        - generic [ref=e336]: 2026-09-18
                  - group "Review 15 of 16" [ref=e337]:
                    - img "TE****" [ref=e338]
                    - generic [ref=e339]:
                      - generic [ref=e340]:
                        - heading "TE****" [level=3] [ref=e342]
                        - paragraph [ref=e343]: TEST
                      - generic [ref=e344]:
                        - img [ref=e345]
                        - img [ref=e347]
                        - img [ref=e349]
                        - generic [ref=e351]: 2026-09-18
                  - group "Review 16 of 16" [ref=e352]:
                    - img "TE****" [ref=e353]
                    - generic [ref=e354]:
                      - generic [ref=e355]:
                        - heading "TE****" [level=3] [ref=e357]
                        - paragraph [ref=e358]: TEST
                      - generic [ref=e359]:
                        - img [ref=e360]
                        - img [ref=e362]
                        - img [ref=e364]
                        - generic [ref=e366]: 2026-09-18
          - generic [ref=e368]:
            - article [ref=e369]:
              - img "100% 품질 보장" [ref=e371]
              - generic [ref=e372]:
                - heading "100% 품질 보장" [level=3] [ref=e373]
                - paragraph [ref=e374]: 문제가 생기면 변명하지 않습니다 재인쇄 또는 환불까지 끝까지 책임집니다
            - article [ref=e375]:
              - img "오늘 제작 · 내일 발송" [ref=e377]
              - generic [ref=e378]:
                - heading "오늘 제작 · 내일 발송" [level=3] [ref=e379]
                - paragraph [ref=e380]: 디자인 승인 후 바로 제작이 시작되며, 승인이 빠를수록 다음 날 바로 출고됩니다
            - article [ref=e381]:
              - img "5만원 이상 무료배송" [ref=e383]
              - generic [ref=e384]:
                - heading "5만원 이상 무료배송" [level=3] [ref=e385]
                - paragraph [ref=e386]: 기본 배송비는 3,000원이며, 5만원 이상 주문 시 무료배송입니다
          - generic [ref=e389]:
            - heading "처음 주문해도 걱정할 필요 없어요" [level=2] [ref=e390]:
              - text: 처음 주문해도
              - text: 걱정할 필요 없어요
            - generic [ref=e391]:
              - button "바로 주문하기" [ref=e392] [cursor=pointer]:
                - generic [ref=e393]: 바로 주문하기
              - button "제작 문의하기" [ref=e394] [cursor=pointer]:
                - generic [ref=e395]: 제작 문의하기
      - navigation "네이버 톡톡으로 문의하기" [ref=e396]:
        - link "카카오채널로 문의하기" [ref=e397] [cursor=pointer]:
          - /url: https://pf.kakao.com/_nJxnTX/chat
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 카카오채널로 문의하기
          - img [ref=e399]
        - link "네이버 톡톡 으로 문의하기" [ref=e400] [cursor=pointer]:
          - /url: https://talk.naver.com/ct/w2luxqo
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 네이버 톡톡 으로 문의하기
          - img [ref=e402]
        - button "이메일로 문의하기" [ref=e403] [cursor=pointer]:
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 이메일로 문의하기
          - img [ref=e405]
    - contentinfo [ref=e406]:
      - generic [ref=e407]:
        - generic [ref=e408]:
          - heading "MUSTICKER / 머스티커" [level=2] [ref=e409]
          - paragraph [ref=e410]: "상호명: (주)글로픽스"
          - paragraph [ref=e411]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
          - paragraph [ref=e412]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
          - paragraph [ref=e413]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
          - paragraph [ref=e414]:
            - generic [ref=e415]: ⓒ 2026. All rights reserved.
            - generic [ref=e416]: "판매: sales@musticker.com"
            - link "이용약관" [ref=e417] [cursor=pointer]:
              - /url: /kr/terms-of-use
            - link "개인정보처리방침" [ref=e418] [cursor=pointer]:
              - /url: /kr/privacy-policy
            - button "사업자정보확인" [ref=e419] [cursor=pointer]
            - link "오픈소스 라이선스" [ref=e420] [cursor=pointer]:
              - /url: /kr/open-source-licenses
            - link "회사소개" [ref=e421] [cursor=pointer]:
              - /url: /kr/about
        - generic [ref=e422]:
          - paragraph [ref=e423]: 1899-5529
          - paragraph [ref=e425]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
          - generic [ref=e426]:
            - button "1:1문의하기" [ref=e427] [cursor=pointer]
            - link "자주 묻는 질문" [ref=e428] [cursor=pointer]:
              - /url: /kr/faq
          - generic [ref=e429]:
            - generic [ref=e430]: "Follow us at:"
            - generic [ref=e431]:
              - link "instagram icon" [ref=e432] [cursor=pointer]:
                - /url: https://www.instagram.com/musticker_official/
                - img "instagram icon"
              - link "youtube icon" [ref=e433] [cursor=pointer]:
                - /url: https://www.youtube.com/@MustickerOfficial
                - img "youtube icon"
  - button "KR" [ref=e434] [cursor=pointer]
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