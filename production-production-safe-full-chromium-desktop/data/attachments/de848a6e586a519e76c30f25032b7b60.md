# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression/error-pages.spec.ts >> storefront v2 error handling >> MS-V2-043 unknown route serves the 404 page with a working way back home
- Location: tests/e2e/regression/error-pages.spec.ts:18:3

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "[error] [NUXT_E1005]",
+   "[error] [NUXT_E1005]",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "Musticker" [ref=e7] [cursor=pointer]:
          - /url: /kr
          - img "musticker logo" [ref=e8]
        - generic [ref=e9]:
          - button "공지사항 열기" [ref=e11] [cursor=pointer]:
            - img [ref=e13]
          - button "layout.header.search" [ref=e15] [cursor=pointer]:
            - img [ref=e16]
          - button "장바구니" [ref=e19] [cursor=pointer]:
            - img [ref=e20]
          - button "계정" [ref=e23] [cursor=pointer]:
            - img [ref=e25]
      - navigation "Primary":
        - link "스티커" [ref=e27] [cursor=pointer]:
          - /url: /kr/stickers
        - link "롤스티커" [ref=e28] [cursor=pointer]:
          - /url: /kr/roll-stickers
        - link "시트 스티커" [ref=e29] [cursor=pointer]:
          - /url: /kr/sheet-stickers
  - main [ref=e30]:
    - main [ref=e31]:
      - generic [ref=e33]:
        - generic:
          - img "스티커ㅋㅋㅋ,"
        - generic [ref=e34]:
          - generic [ref=e35]:
            - heading "스티커ㅋㅋㅋ, 이유가 있구나" [level=1] [ref=e36]:
              - text: 스티커ㅋㅋㅋ,
              - generic [ref=e37]: 이유가 있구나
            - paragraph [ref=e38]: 빠른데, 퀄리티까지 미쳤다
          - button "빠른 주문" [ref=e39] [cursor=pointer]:
            - generic [ref=e40]: 빠른 주문
      - generic [ref=e41]:
        - generic [ref=e43]:
          - link "스티커" [ref=e44] [cursor=pointer]:
            - /url: /kr/stickers/die-cut-sticker
            - img [ref=e46]
            - paragraph [ref=e47]: 스티커
          - link "롤스티커" [ref=e48] [cursor=pointer]:
            - /url: /kr/roll-stickers/die-cut-roll
            - img [ref=e50]
            - paragraph [ref=e51]: 롤스티커
          - link "판스티커" [ref=e52] [cursor=pointer]:
            - /url: /kr/stickers/sticker-sheet
            - img [ref=e54]
            - paragraph [ref=e55]: 판스티커
          - link "홀로그램" [ref=e56] [cursor=pointer]:
            - /url: /kr/stickers/hologram-sticker
            - img [ref=e58]
            - paragraph [ref=e59]: 홀로그램
          - link "레터링" [ref=e60] [cursor=pointer]:
            - /url: /kr/stickers/vinyl-lettering
            - img [ref=e62]
            - paragraph [ref=e63]: 레터링
        - generic [ref=e65]:
          - generic [ref=e66]:
            - button "음소거 해제" [ref=e68] [cursor=pointer]:
              - img [ref=e69]
            - button "전체화면" [ref=e71] [cursor=pointer]:
              - img [ref=e72]
          - generic [ref=e74]:
            - heading "급해서 맡겼는데, 퀄리티 때문에 기억나는 스티커" [level=2] [ref=e75]:
              - text: 급해서 맡겼는데,
              - text: 퀄리티 때문에 기억나는 스티커
            - paragraph [ref=e76]: 파일만 첨부하면 시안이 전달되고, 승인 즉시 제작이 시작됩니다. 급한 작업이어도 색감·라인·마감까지 정교해 “여기 또 써야겠다”는 말이 나올 거예요. 우리는 빨리 만드는 게 아니라, 빠르게 ‘잘’ 만드는 것을 목표로 합니다.
        - region "고객 리뷰 캐러셀" [ref=e77]:
          - generic [ref=e78]:
            - generic [ref=e79]:
              - heading "사진 후기 225개, 만족도는 이미 증명됐어요" [level=2] [ref=e80]:
                - text: 사진 후기 225개,
                - text: 만족도는 이미 증명됐어요
              - generic [ref=e81]:
                - button "이전 리뷰로 이동" [disabled] [ref=e82]:
                  - img [ref=e83]
                  - generic [ref=e85]: 이전 리뷰로 이동
                - button "다음 리뷰로 이동" [ref=e86] [cursor=pointer]:
                  - img [ref=e87]
                  - generic [ref=e89]: 다음 리뷰로 이동
            - region "고객 리뷰 캐러셀" [ref=e90]:
              - generic [ref=e91]:
                - group "Review 1 of 16" [ref=e92]:
                  - img "tkop****" [ref=e93]
                  - generic [ref=e94]:
                    - generic [ref=e95]:
                      - heading "tkop****" [level=3] [ref=e97]
                      - paragraph [ref=e98]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
                    - generic [ref=e99]:
                      - img [ref=e100]
                      - img [ref=e102]
                      - img [ref=e104]
                      - img [ref=e106]
                      - img [ref=e108]
                      - generic [ref=e110]: 2026-03-25
                - group "Review 2 of 16" [ref=e111]:
                  - img "oozz******" [ref=e112]
                  - generic [ref=e113]:
                    - generic [ref=e114]:
                      - heading "oozz******" [level=3] [ref=e116]
                      - paragraph [ref=e117]: 잘나와서 만족합니다 잘쓰겠습니다
                    - generic [ref=e118]:
                      - img [ref=e119]
                      - img [ref=e121]
                      - img [ref=e123]
                      - img [ref=e125]
                      - img [ref=e127]
                      - generic [ref=e129]: 2026-03-22
                - group "Review 3 of 16" [ref=e130]:
                  - img "aktm********" [ref=e131]
                  - generic [ref=e132]:
                    - generic [ref=e133]:
                      - generic [ref=e134]:
                        - heading "aktm********" [level=3] [ref=e135]
                        - generic [ref=e136]: 한달사용
                      - paragraph [ref=e137]: 만족하면서 사용중입니다
                    - generic [ref=e138]:
                      - img [ref=e139]
                      - img [ref=e141]
                      - img [ref=e143]
                      - img [ref=e145]
                      - img [ref=e147]
                      - generic [ref=e149]: 2026-03-04
                - group "Review 4 of 16" [ref=e150]:
                  - img "aktm********" [ref=e151]
                  - generic [ref=e152]:
                    - generic [ref=e153]:
                      - heading "aktm********" [level=3] [ref=e155]
                      - paragraph [ref=e156]: 잘 받았어요 잘쓸게요.
                    - generic [ref=e157]:
                      - img [ref=e158]
                      - img [ref=e160]
                      - img [ref=e162]
                      - img [ref=e164]
                      - img [ref=e166]
                      - generic [ref=e168]: 2026-01-31
                - group "Review 5 of 16" [ref=e169]:
                  - img "aktm********" [ref=e170]
                  - generic [ref=e171]:
                    - generic [ref=e172]:
                      - generic [ref=e173]:
                        - heading "aktm********" [level=3] [ref=e174]
                        - generic [ref=e175]: 한달사용
                      - paragraph [ref=e176]: 아주 잘쓰고있습니다.
                    - generic [ref=e177]:
                      - img [ref=e178]
                      - img [ref=e180]
                      - img [ref=e182]
                      - img [ref=e184]
                      - img [ref=e186]
                      - generic [ref=e188]: 2026-01-06
                - group "Review 6 of 16" [ref=e189]:
                  - img "aktm********" [ref=e190]
                  - generic [ref=e191]:
                    - generic [ref=e192]:
                      - generic [ref=e193]:
                        - heading "aktm********" [level=3] [ref=e194]
                        - generic [ref=e195]: 한달사용
                      - paragraph [ref=e196]: 아주 잘쓰고있습니다.
                    - generic [ref=e197]:
                      - img [ref=e198]
                      - img [ref=e200]
                      - img [ref=e202]
                      - img [ref=e204]
                      - img [ref=e206]
                      - generic [ref=e208]: 2026-01-06
                - group "Review 7 of 16" [ref=e209]:
                  - img "jiwn****" [ref=e210]
                  - generic [ref=e211]:
                    - generic [ref=e212]:
                      - heading "jiwn****" [level=3] [ref=e214]
                      - paragraph [ref=e215]: 아 정말 너무 좋아연ㅎㅎ
                    - generic [ref=e216]:
                      - img [ref=e217]
                      - img [ref=e219]
                      - img [ref=e221]
                      - img [ref=e223]
                      - img [ref=e225]
                      - generic [ref=e227]: 2025-12-29
                - group "Review 8 of 16" [ref=e228]:
                  - img "koj3***" [ref=e229]
                  - generic [ref=e230]:
                    - generic [ref=e231]:
                      - heading "koj3***" [level=3] [ref=e233]
                      - paragraph [ref=e234]: 방수도 잘되고 오염에도 잘 버티고 좋아요. 적극 추천합니다.^^
                    - generic [ref=e235]:
                      - img [ref=e236]
                      - img [ref=e238]
                      - img [ref=e240]
                      - img [ref=e242]
                      - img [ref=e244]
                      - generic [ref=e246]: 2025-12-24
                - group "Review 9 of 16" [ref=e247]:
                  - img "aktm********" [ref=e248]
                  - generic [ref=e249]:
                    - generic [ref=e250]:
                      - heading "aktm********" [level=3] [ref=e252]
                      - paragraph [ref=e253]: 이쁘네요 잘쓸게요.!!
                    - generic [ref=e254]:
                      - img [ref=e255]
                      - img [ref=e257]
                      - img [ref=e259]
                      - img [ref=e261]
                      - img [ref=e263]
                      - generic [ref=e265]: 2025-12-03
                - group "Review 10 of 16" [ref=e266]:
                  - img "aktm********" [ref=e267]
                  - generic [ref=e268]:
                    - generic [ref=e269]:
                      - heading "aktm********" [level=3] [ref=e271]
                      - paragraph [ref=e272]: 이쁘게 잘뽑혔네요.
                    - generic [ref=e273]:
                      - img [ref=e274]
                      - img [ref=e276]
                      - img [ref=e278]
                      - img [ref=e280]
                      - img [ref=e282]
                      - generic [ref=e284]: 2025-11-30
                - group "Review 11 of 16" [ref=e285]:
                  - img "circ*****" [ref=e286]
                  - generic [ref=e287]:
                    - generic [ref=e288]:
                      - heading "circ*****" [level=3] [ref=e290]
                      - paragraph [ref=e291]: 품질도 좋고 응대도 잘해주셔서 이쁘게 나왔네요
                    - generic [ref=e292]:
                      - img [ref=e293]
                      - img [ref=e295]
                      - img [ref=e297]
                      - img [ref=e299]
                      - img [ref=e301]
                      - generic [ref=e303]: 2025-11-20
                - group "Review 12 of 16" [ref=e304]:
                  - img "pina******" [ref=e305]
                  - generic [ref=e306]:
                    - generic [ref=e307]:
                      - generic [ref=e308]:
                        - heading "pina******" [level=3] [ref=e309]
                        - generic [ref=e310]: 한달사용
                      - paragraph [ref=e311]: 부착 잘되고 제거할때 끈적임 없이 깔끔하게 떨어져서 좋아요
                    - generic [ref=e312]:
                      - img [ref=e313]
                      - img [ref=e315]
                      - img [ref=e317]
                      - img [ref=e319]
                      - img [ref=e321]
                      - generic [ref=e323]: 2025-08-22
                - group "Review 13 of 16" [ref=e324]:
                  - img "qcyc*****" [ref=e325]
                  - generic [ref=e326]:
                    - generic [ref=e327]:
                      - generic [ref=e328]:
                        - heading "qcyc*****" [level=3] [ref=e329]
                        - generic [ref=e330]: 한달사용
                      - paragraph [ref=e331]: 덕분에 넘넘 잘썼습니다
                    - generic [ref=e332]:
                      - img [ref=e333]
                      - img [ref=e335]
                      - img [ref=e337]
                      - img [ref=e339]
                      - img [ref=e341]
                      - generic [ref=e343]: 2025-08-15
                - group "Review 14 of 16" [ref=e344]:
                  - img "rlad*******" [ref=e345]
                  - generic [ref=e346]:
                    - generic [ref=e347]:
                      - heading "rlad*******" [level=3] [ref=e349]
                      - paragraph [ref=e350]: 꼼꼼하게 체크해주셔서 너무좋았습니다!
                    - generic [ref=e351]:
                      - img [ref=e352]
                      - img [ref=e354]
                      - img [ref=e356]
                      - img [ref=e358]
                      - img [ref=e360]
                      - generic [ref=e362]: 2025-07-17
                - group "Review 15 of 16" [ref=e363]:
                  - img "csbn*****" [ref=e364]
                  - generic [ref=e365]:
                    - generic [ref=e366]:
                      - heading "csbn*****" [level=3] [ref=e368]
                      - paragraph [ref=e369]: 배송도 빠르고 재질도 좋고 너무 좋아요 감사합니다!
                    - generic [ref=e370]:
                      - img [ref=e371]
                      - img [ref=e373]
                      - img [ref=e375]
                      - img [ref=e377]
                      - img [ref=e379]
                      - generic [ref=e381]: 2025-07-14
                - group "Review 16 of 16" [ref=e382]:
                  - img "pina******" [ref=e383]
                  - generic [ref=e384]:
                    - generic [ref=e385]:
                      - heading "pina******" [level=3] [ref=e387]
                      - paragraph [ref=e388]: 생각한대로 너무 깔끔하게 나왔어요! 다음에도 주문하겠습니다!!
                    - generic [ref=e389]:
                      - img [ref=e390]
                      - img [ref=e392]
                      - img [ref=e394]
                      - img [ref=e396]
                      - img [ref=e398]
                      - generic [ref=e400]: 2025-07-09
        - generic [ref=e402]:
          - article [ref=e403]:
            - img "100% 품질 보장" [ref=e405]
            - generic [ref=e406]:
              - heading "100% 품질 보장" [level=3] [ref=e407]
              - paragraph [ref=e408]: 문제가 생기면 변명하지 않습니다 재인쇄 또는 환불까지 끝까지 책임집니다
          - article [ref=e409]:
            - img "오늘 제작 · 내일 발송" [ref=e411]
            - generic [ref=e412]:
              - heading "오늘 제작 · 내일 발송" [level=3] [ref=e413]
              - paragraph [ref=e414]: 디자인 승인 후 바로 제작이 시작되며, 승인이 빠를수록 다음 날 바로 출고됩니다
          - article [ref=e415]:
            - img "5만원 이상 무료배송" [ref=e417]
            - generic [ref=e418]:
              - heading "5만원 이상 무료배송" [level=3] [ref=e419]
              - paragraph [ref=e420]: 기본 배송비는 3,000원이며, 5만원 이상 주문 시 무료배송입니다
        - generic [ref=e423]:
          - heading "처음 주문해도 걱정할 필요 없어요" [level=2] [ref=e424]:
            - text: 처음 주문해도
            - text: 걱정할 필요 없어요
          - generic [ref=e425]:
            - button "바로 주문하기" [ref=e426] [cursor=pointer]:
              - generic [ref=e427]: 바로 주문하기
            - button "제작 문의하기" [ref=e428] [cursor=pointer]:
              - generic [ref=e429]: 제작 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e430]:
      - link "카카오채널로 문의하기" [ref=e431] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e433]
      - link "네이버 톡톡 으로 문의하기" [ref=e434] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e436]
      - generic "이메일로 문의하기" [ref=e437] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e439]
  - contentinfo [ref=e440]:
    - generic [ref=e441]:
      - generic [ref=e442]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e443]
        - paragraph [ref=e444]: "상호명: (주)글로픽스"
        - paragraph [ref=e445]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e446]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e447]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e448]:
          - generic [ref=e449]: ⓒ 2026. All rights reserved.
          - generic [ref=e450]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e451] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e452] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - generic [ref=e453] [cursor=pointer]: 사업자정보확인
          - link "오픈소스 라이선스" [ref=e454] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e455] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e456]:
        - paragraph [ref=e457]: 1899-5529
        - paragraph [ref=e459]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e460]:
          - button "1:1문의하기" [ref=e461] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e462] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e463]:
          - generic [ref=e464]: "Follow us at:"
          - generic [ref=e465]:
            - link "instagram icon" [ref=e466] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e467] [cursor=pointer]:
              - /url: https://www.youtube.com/@MustickerOfficial
              - img "youtube icon"
```

# Test source

```ts
  356 |         allowTransientApiCorsFailures &&
  357 |         pendingTransientApiNetworkFailures > 0 &&
  358 |         text === 'Failed to load resource: net::ERR_FAILED'
  359 |       ) {
  360 |         return;
  361 |       }
  362 | 
  363 |       if (allowTransientApiCorsFailures && isTransientApiFetchFailure(text)) {
  364 |         pendingTransientApiNetworkFailures = Math.max(0, pendingTransientApiNetworkFailures - 1);
  365 |         return;
  366 |       }
  367 | 
  368 |       if (allowTransientCartCreateFailures && isCartCreateCorsFailure(text)) {
  369 |         pendingCartCreateNetworkFailures += 1;
  370 |         return;
  371 |       }
  372 | 
  373 |       if (
  374 |         allowTransientCartCreateFailures &&
  375 |         pendingCartCreateNetworkFailures > 0 &&
  376 |         text === 'Failed to load resource: net::ERR_FAILED'
  377 |       ) {
  378 |         return;
  379 |       }
  380 | 
  381 |       if (allowTransientCartCreateFailures && isCartCreateFetchFailure(text)) {
  382 |         pendingCartCreateNetworkFailures = Math.max(0, pendingCartCreateNetworkFailures - 1);
  383 |         return;
  384 |       }
  385 | 
  386 |       if (allowKnownPriceWarnings && isSupersededPricingRequest(text)) {
  387 |         hadSupersededPricingRequest = true;
  388 |         return;
  389 |       }
  390 | 
  391 |       if (allowKnownPriceWarnings && hadSupersededPricingRequest && text === 'Unable to retrieve prices.') {
  392 |         hadSupersededPricingRequest = false;
  393 |         return;
  394 |       }
  395 | 
  396 |       if (isKnownConsoleMessage(text, guardOptions)) {
  397 |         return;
  398 |       }
  399 | 
  400 |       consoleFailures.push(`[${message.type()}] ${text}`);
  401 |     });
  402 | 
  403 |     page.on('response', (response) => {
  404 |       const status = response.status();
  405 |       if (status < 400) {
  406 |         return;
  407 |       }
  408 | 
  409 |       const url = response.url();
  410 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  411 |         return;
  412 |       }
  413 | 
  414 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  415 |         return;
  416 |       }
  417 | 
  418 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  419 |         return;
  420 |       }
  421 | 
  422 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  423 |         pendingTransientProductPageFailures += 1;
  424 |         return;
  425 |       }
  426 | 
  427 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  428 |         pendingExpectedNotFoundResponses += 1;
  429 |         return;
  430 |       }
  431 | 
  432 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  433 |         return;
  434 |       }
  435 | 
  436 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  437 |         return;
  438 |       }
  439 | 
  440 |       responseFailures.push(`${status} ${url}`);
  441 |     });
  442 | 
  443 |     await applyInternalOriginHeader(page);
  444 |     await use(page);
  445 | 
  446 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  447 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  448 |     // that nothing retried still fails the run.
  449 |     const throttleBlocks = retriedThrottleBlockCount(page);
  450 | 
  451 |     expect
  452 |       .soft(
  453 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  454 |         'Unexpected browser console errors or warnings'
  455 |       )
> 456 |       .toEqual([]);
      |        ^ Error: Unexpected browser console errors or warnings
  457 |     expect
  458 |       .soft(
  459 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  460 |         'Unexpected failed HTTP responses'
  461 |       )
  462 |       .toEqual([]);
  463 |   }
  464 | });
  465 | 
  466 | export { expect };
  467 | 
```