# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/login.spec.ts >> storefront authentication >> session lifecycle >> MS-V2-035 session persists across reload and navigation, and logout clears it @credentialed
- Location: tests/e2e/auth/login.spec.ts:119:5

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 7

- Array []
+ Array [
+   "[error] [NUXT_E7002]",
+   "[error] [NUXT_E7002]",
+   "[error] [NUXT_E7002]",
+   "[error] [NUXT_E7002]",
+   "[error] [NUXT_E7002]",
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
          - generic [ref=e22]:
            - button "계정" [expanded] [active] [ref=e23] [cursor=pointer]:
              - img [ref=e25]
            - menu "계정 메뉴" [ref=e27]:
              - menuitem "로그인" [ref=e28] [cursor=pointer]
              - menuitem "회원가입" [ref=e29] [cursor=pointer]
      - navigation "Primary":
        - link "스티커" [ref=e30] [cursor=pointer]:
          - /url: /kr/stickers
        - link "롤스티커" [ref=e31] [cursor=pointer]:
          - /url: /kr/roll-stickers
        - link "시트 스티커" [ref=e32] [cursor=pointer]:
          - /url: /kr/sheet-stickers
  - main [ref=e33]:
    - main [ref=e34]:
      - generic [ref=e36]:
        - generic:
          - img "스티커ㅋㅋㅋ,"
        - generic [ref=e37]:
          - generic [ref=e38]:
            - heading "스티커ㅋㅋㅋ, 이유가 있구나" [level=1] [ref=e39]:
              - text: 스티커ㅋㅋㅋ,
              - generic [ref=e40]: 이유가 있구나
            - paragraph [ref=e41]: 빠른데, 퀄리티까지 미쳤다
          - button "빠른 주문" [ref=e42] [cursor=pointer]:
            - generic [ref=e43]: 빠른 주문
      - generic [ref=e44]:
        - generic [ref=e46]:
          - link "스티커" [ref=e47] [cursor=pointer]:
            - /url: /kr/stickers/die-cut-sticker
            - img [ref=e49]
            - paragraph [ref=e50]: 스티커
          - link "롤스티커" [ref=e51] [cursor=pointer]:
            - /url: /kr/roll-stickers/die-cut-roll
            - img [ref=e53]
            - paragraph [ref=e54]: 롤스티커
          - link "판스티커" [ref=e55] [cursor=pointer]:
            - /url: /kr/stickers/sticker-sheet
            - img [ref=e57]
            - paragraph [ref=e58]: 판스티커
          - link "홀로그램" [ref=e59] [cursor=pointer]:
            - /url: /kr/stickers/hologram-sticker
            - img [ref=e61]
            - paragraph [ref=e62]: 홀로그램
          - link "레터링" [ref=e63] [cursor=pointer]:
            - /url: /kr/stickers/vinyl-lettering
            - img [ref=e65]
            - paragraph [ref=e66]: 레터링
        - generic [ref=e68]:
          - generic [ref=e69]:
            - button "음소거 해제" [ref=e71] [cursor=pointer]:
              - img [ref=e72]
            - button "전체화면" [ref=e74] [cursor=pointer]:
              - img [ref=e75]
          - generic [ref=e77]:
            - heading "급해서 맡겼는데, 퀄리티 때문에 기억나는 스티커" [level=2] [ref=e78]:
              - text: 급해서 맡겼는데,
              - text: 퀄리티 때문에 기억나는 스티커
            - paragraph [ref=e79]: 파일만 첨부하면 시안이 전달되고, 승인 즉시 제작이 시작됩니다. 급한 작업이어도 색감·라인·마감까지 정교해 “여기 또 써야겠다”는 말이 나올 거예요. 우리는 빨리 만드는 게 아니라, 빠르게 ‘잘’ 만드는 것을 목표로 합니다.
        - region "고객 리뷰 캐러셀" [ref=e80]:
          - generic [ref=e81]:
            - generic [ref=e82]:
              - heading "사진 후기 225개, 만족도는 이미 증명됐어요" [level=2] [ref=e83]:
                - text: 사진 후기 225개,
                - text: 만족도는 이미 증명됐어요
              - generic [ref=e84]:
                - button "이전 리뷰로 이동" [disabled] [ref=e85]:
                  - img [ref=e86]
                  - generic [ref=e88]: 이전 리뷰로 이동
                - button "다음 리뷰로 이동" [ref=e89] [cursor=pointer]:
                  - img [ref=e90]
                  - generic [ref=e92]: 다음 리뷰로 이동
            - region "고객 리뷰 캐러셀" [ref=e93]:
              - generic [ref=e94]:
                - group "Review 1 of 16" [ref=e95]:
                  - img "tkop****" [ref=e96]
                  - generic [ref=e97]:
                    - generic [ref=e98]:
                      - heading "tkop****" [level=3] [ref=e100]
                      - paragraph [ref=e101]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
                    - generic [ref=e102]:
                      - img [ref=e103]
                      - img [ref=e105]
                      - img [ref=e107]
                      - img [ref=e109]
                      - img [ref=e111]
                      - generic [ref=e113]: 2026-03-25
                - group "Review 2 of 16" [ref=e114]:
                  - img "oozz******" [ref=e115]
                  - generic [ref=e116]:
                    - generic [ref=e117]:
                      - heading "oozz******" [level=3] [ref=e119]
                      - paragraph [ref=e120]: 잘나와서 만족합니다 잘쓰겠습니다
                    - generic [ref=e121]:
                      - img [ref=e122]
                      - img [ref=e124]
                      - img [ref=e126]
                      - img [ref=e128]
                      - img [ref=e130]
                      - generic [ref=e132]: 2026-03-22
                - group "Review 3 of 16" [ref=e133]:
                  - img "aktm********" [ref=e134]
                  - generic [ref=e135]:
                    - generic [ref=e136]:
                      - generic [ref=e137]:
                        - heading "aktm********" [level=3] [ref=e138]
                        - generic [ref=e139]: 한달사용
                      - paragraph [ref=e140]: 만족하면서 사용중입니다
                    - generic [ref=e141]:
                      - img [ref=e142]
                      - img [ref=e144]
                      - img [ref=e146]
                      - img [ref=e148]
                      - img [ref=e150]
                      - generic [ref=e152]: 2026-03-04
                - group "Review 4 of 16" [ref=e153]:
                  - img "aktm********" [ref=e154]
                  - generic [ref=e155]:
                    - generic [ref=e156]:
                      - heading "aktm********" [level=3] [ref=e158]
                      - paragraph [ref=e159]: 잘 받았어요 잘쓸게요.
                    - generic [ref=e160]:
                      - img [ref=e161]
                      - img [ref=e163]
                      - img [ref=e165]
                      - img [ref=e167]
                      - img [ref=e169]
                      - generic [ref=e171]: 2026-01-31
                - group "Review 5 of 16" [ref=e172]:
                  - img "aktm********" [ref=e173]
                  - generic [ref=e174]:
                    - generic [ref=e175]:
                      - generic [ref=e176]:
                        - heading "aktm********" [level=3] [ref=e177]
                        - generic [ref=e178]: 한달사용
                      - paragraph [ref=e179]: 아주 잘쓰고있습니다.
                    - generic [ref=e180]:
                      - img [ref=e181]
                      - img [ref=e183]
                      - img [ref=e185]
                      - img [ref=e187]
                      - img [ref=e189]
                      - generic [ref=e191]: 2026-01-06
                - group "Review 6 of 16" [ref=e192]:
                  - img "aktm********" [ref=e193]
                  - generic [ref=e194]:
                    - generic [ref=e195]:
                      - generic [ref=e196]:
                        - heading "aktm********" [level=3] [ref=e197]
                        - generic [ref=e198]: 한달사용
                      - paragraph [ref=e199]: 아주 잘쓰고있습니다.
                    - generic [ref=e200]:
                      - img [ref=e201]
                      - img [ref=e203]
                      - img [ref=e205]
                      - img [ref=e207]
                      - img [ref=e209]
                      - generic [ref=e211]: 2026-01-06
                - group "Review 7 of 16" [ref=e212]:
                  - img "jiwn****" [ref=e213]
                  - generic [ref=e214]:
                    - generic [ref=e215]:
                      - heading "jiwn****" [level=3] [ref=e217]
                      - paragraph [ref=e218]: 아 정말 너무 좋아연ㅎㅎ
                    - generic [ref=e219]:
                      - img [ref=e220]
                      - img [ref=e222]
                      - img [ref=e224]
                      - img [ref=e226]
                      - img [ref=e228]
                      - generic [ref=e230]: 2025-12-29
                - group "Review 8 of 16" [ref=e231]:
                  - img "koj3***" [ref=e232]
                  - generic [ref=e233]:
                    - generic [ref=e234]:
                      - heading "koj3***" [level=3] [ref=e236]
                      - paragraph [ref=e237]: 방수도 잘되고 오염에도 잘 버티고 좋아요. 적극 추천합니다.^^
                    - generic [ref=e238]:
                      - img [ref=e239]
                      - img [ref=e241]
                      - img [ref=e243]
                      - img [ref=e245]
                      - img [ref=e247]
                      - generic [ref=e249]: 2025-12-24
                - group "Review 9 of 16" [ref=e250]:
                  - img "aktm********" [ref=e251]
                  - generic [ref=e252]:
                    - generic [ref=e253]:
                      - heading "aktm********" [level=3] [ref=e255]
                      - paragraph [ref=e256]: 이쁘네요 잘쓸게요.!!
                    - generic [ref=e257]:
                      - img [ref=e258]
                      - img [ref=e260]
                      - img [ref=e262]
                      - img [ref=e264]
                      - img [ref=e266]
                      - generic [ref=e268]: 2025-12-03
                - group "Review 10 of 16" [ref=e269]:
                  - img "aktm********" [ref=e270]
                  - generic [ref=e271]:
                    - generic [ref=e272]:
                      - heading "aktm********" [level=3] [ref=e274]
                      - paragraph [ref=e275]: 이쁘게 잘뽑혔네요.
                    - generic [ref=e276]:
                      - img [ref=e277]
                      - img [ref=e279]
                      - img [ref=e281]
                      - img [ref=e283]
                      - img [ref=e285]
                      - generic [ref=e287]: 2025-11-30
                - group "Review 11 of 16" [ref=e288]:
                  - img "circ*****" [ref=e289]
                  - generic [ref=e290]:
                    - generic [ref=e291]:
                      - heading "circ*****" [level=3] [ref=e293]
                      - paragraph [ref=e294]: 품질도 좋고 응대도 잘해주셔서 이쁘게 나왔네요
                    - generic [ref=e295]:
                      - img [ref=e296]
                      - img [ref=e298]
                      - img [ref=e300]
                      - img [ref=e302]
                      - img [ref=e304]
                      - generic [ref=e306]: 2025-11-20
                - group "Review 12 of 16" [ref=e307]:
                  - img "pina******" [ref=e308]
                  - generic [ref=e309]:
                    - generic [ref=e310]:
                      - generic [ref=e311]:
                        - heading "pina******" [level=3] [ref=e312]
                        - generic [ref=e313]: 한달사용
                      - paragraph [ref=e314]: 부착 잘되고 제거할때 끈적임 없이 깔끔하게 떨어져서 좋아요
                    - generic [ref=e315]:
                      - img [ref=e316]
                      - img [ref=e318]
                      - img [ref=e320]
                      - img [ref=e322]
                      - img [ref=e324]
                      - generic [ref=e326]: 2025-08-22
                - group "Review 13 of 16" [ref=e327]:
                  - img "qcyc*****" [ref=e328]
                  - generic [ref=e329]:
                    - generic [ref=e330]:
                      - generic [ref=e331]:
                        - heading "qcyc*****" [level=3] [ref=e332]
                        - generic [ref=e333]: 한달사용
                      - paragraph [ref=e334]: 덕분에 넘넘 잘썼습니다
                    - generic [ref=e335]:
                      - img [ref=e336]
                      - img [ref=e338]
                      - img [ref=e340]
                      - img [ref=e342]
                      - img [ref=e344]
                      - generic [ref=e346]: 2025-08-15
                - group "Review 14 of 16" [ref=e347]:
                  - img "rlad*******" [ref=e348]
                  - generic [ref=e349]:
                    - generic [ref=e350]:
                      - heading "rlad*******" [level=3] [ref=e352]
                      - paragraph [ref=e353]: 꼼꼼하게 체크해주셔서 너무좋았습니다!
                    - generic [ref=e354]:
                      - img [ref=e355]
                      - img [ref=e357]
                      - img [ref=e359]
                      - img [ref=e361]
                      - img [ref=e363]
                      - generic [ref=e365]: 2025-07-17
                - group "Review 15 of 16" [ref=e366]:
                  - img "csbn*****" [ref=e367]
                  - generic [ref=e368]:
                    - generic [ref=e369]:
                      - heading "csbn*****" [level=3] [ref=e371]
                      - paragraph [ref=e372]: 배송도 빠르고 재질도 좋고 너무 좋아요 감사합니다!
                    - generic [ref=e373]:
                      - img [ref=e374]
                      - img [ref=e376]
                      - img [ref=e378]
                      - img [ref=e380]
                      - img [ref=e382]
                      - generic [ref=e384]: 2025-07-14
                - group "Review 16 of 16" [ref=e385]:
                  - img "pina******" [ref=e386]
                  - generic [ref=e387]:
                    - generic [ref=e388]:
                      - heading "pina******" [level=3] [ref=e390]
                      - paragraph [ref=e391]: 생각한대로 너무 깔끔하게 나왔어요! 다음에도 주문하겠습니다!!
                    - generic [ref=e392]:
                      - img [ref=e393]
                      - img [ref=e395]
                      - img [ref=e397]
                      - img [ref=e399]
                      - img [ref=e401]
                      - generic [ref=e403]: 2025-07-09
        - generic [ref=e405]:
          - article [ref=e406]:
            - img "100% 품질 보장" [ref=e408]
            - generic [ref=e409]:
              - heading "100% 품질 보장" [level=3] [ref=e410]
              - paragraph [ref=e411]: 문제가 생기면 변명하지 않습니다 재인쇄 또는 환불까지 끝까지 책임집니다
          - article [ref=e412]:
            - img "오늘 제작 · 내일 발송" [ref=e414]
            - generic [ref=e415]:
              - heading "오늘 제작 · 내일 발송" [level=3] [ref=e416]
              - paragraph [ref=e417]: 디자인 승인 후 바로 제작이 시작되며, 승인이 빠를수록 다음 날 바로 출고됩니다
          - article [ref=e418]:
            - img "5만원 이상 무료배송" [ref=e420]
            - generic [ref=e421]:
              - heading "5만원 이상 무료배송" [level=3] [ref=e422]
              - paragraph [ref=e423]: 기본 배송비는 3,000원이며, 5만원 이상 주문 시 무료배송입니다
        - generic [ref=e426]:
          - heading "처음 주문해도 걱정할 필요 없어요" [level=2] [ref=e427]:
            - text: 처음 주문해도
            - text: 걱정할 필요 없어요
          - generic [ref=e428]:
            - button "바로 주문하기" [ref=e429] [cursor=pointer]:
              - generic [ref=e430]: 바로 주문하기
            - button "제작 문의하기" [ref=e431] [cursor=pointer]:
              - generic [ref=e432]: 제작 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e433]:
      - link "카카오채널로 문의하기" [ref=e434] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e436]
      - link "네이버 톡톡 으로 문의하기" [ref=e437] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e439]
      - generic "이메일로 문의하기" [ref=e440] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e442]
  - contentinfo [ref=e443]:
    - generic [ref=e444]:
      - generic [ref=e445]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e446]
        - paragraph [ref=e447]: "상호명: (주)글로픽스"
        - paragraph [ref=e448]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e449]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e450]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e451]:
          - generic [ref=e452]: ⓒ 2026. All rights reserved.
          - generic [ref=e453]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e454] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e455] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - generic [ref=e456] [cursor=pointer]: 사업자정보확인
          - link "오픈소스 라이선스" [ref=e457] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e458] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e459]:
        - paragraph [ref=e460]: 1899-5529
        - paragraph [ref=e462]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e463]:
          - button "1:1문의하기" [ref=e464] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e465] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e466]:
          - generic [ref=e467]: "Follow us at:"
          - generic [ref=e468]:
            - link "instagram icon" [ref=e469] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e470] [cursor=pointer]:
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