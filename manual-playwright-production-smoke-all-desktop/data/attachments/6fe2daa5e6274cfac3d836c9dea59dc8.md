# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/account/account-menu.spec.ts >> Account menu >> MS-ACC-006 the account menu lists its six sections and each one opens its own page @smoke
- Location: tests/e2e/storefront/account/account-menu.spec.ts:21:3

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "[warning] [JavaScript Warning: \"The value of the attribute “expires” for the cookie “_ga_13EV953YXC” has been overwritten.\" {file: \"https://www.musticker.com/kr/account/profile\" line: 0}]",
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
          - generic [ref=e19]:
            - button "알림 열기" [ref=e20] [cursor=pointer]:
              - img [ref=e22]
            - generic: "4"
          - generic [ref=e24]:
            - button "장바구니" [ref=e25] [cursor=pointer]:
              - img [ref=e26]
            - generic: "1"
          - button "계정" [ref=e29] [cursor=pointer]:
            - img "Rome Tester" [ref=e32]
      - navigation "Primary":
        - link "스티커" [ref=e33] [cursor=pointer]:
          - /url: javascript:;
        - link "롤스티커" [ref=e34] [cursor=pointer]:
          - /url: javascript:;
        - link "판스티커" [ref=e35] [cursor=pointer]:
          - /url: javascript:;
  - main [ref=e36]:
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - generic [ref=e40]:
            - img "Rome Tester" [ref=e41]
            - img "Bumper Boss (Level 3)" [ref=e42]
          - generic [ref=e43]:
            - heading "Rome Tester" [level=5] [ref=e44]
            - paragraph [ref=e45]: MuScout (등급 1)
        - generic [ref=e46]:
          - generic [ref=e47]:
            - img "Orders" [ref=e48]
            - generic [ref=e49]:
              - paragraph [ref=e50]: 주문
              - paragraph [ref=e51]: "24"
          - generic [ref=e52]:
            - img "Points" [ref=e53]
            - generic [ref=e54]:
              - paragraph [ref=e55]: 포인트
              - paragraph [ref=e56]: 10,001,167
          - generic [ref=e57]:
            - img "Coupons" [ref=e58]
            - generic [ref=e59]:
              - paragraph [ref=e60]: 쿠폰
              - paragraph [ref=e61]: "0"
          - generic [ref=e62]:
            - img "Total spent" [ref=e63]
            - generic [ref=e64]:
              - paragraph [ref=e65]: 총 결제 금액
              - paragraph [ref=e66]: 16,700원
      - navigation [ref=e67]:
        - link "프로필" [active] [ref=e68] [cursor=pointer]:
          - /url: /kr/account/profile
          - img [ref=e69]
          - generic [ref=e71]: 프로필
        - link "주소록" [ref=e72] [cursor=pointer]:
          - /url: /kr/account/address-book
          - img [ref=e73]
          - generic [ref=e75]: 주소록
        - link "주문 내역" [ref=e76] [cursor=pointer]:
          - /url: /kr/account/orders
          - img [ref=e77]
          - generic [ref=e79]: 주문 내역
        - link "포인트" [ref=e80] [cursor=pointer]:
          - /url: /kr/account/points
          - img [ref=e81]
          - generic [ref=e83]: 포인트
        - link "쿠폰" [ref=e84] [cursor=pointer]:
          - /url: /kr/account/coupons
          - img [ref=e85]
          - generic [ref=e87]: 쿠폰
        - link "내 리뷰" [ref=e88] [cursor=pointer]:
          - /url: /kr/account/reviews
          - img [ref=e89]
          - generic [ref=e91]: 내 리뷰
      - generic [ref=e92]:
        - heading "프로필" [level=4] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - heading "개인 정보" [level=2] [ref=e97]
              - paragraph [ref=e98]: 개인 정보 및 연락처 관리
            - generic [ref=e99]:
              - generic [ref=e100]:
                - generic [ref=e102]: 프로필 사진
                - generic [ref=e103]:
                  - img "프로필 사진" [ref=e105]
                  - generic [ref=e106]:
                    - paragraph [ref=e107]: "권장 파일 크기: 최소 800x800px"
                    - paragraph [ref=e108]: "지원되는 파일 형식: .jpg, .png"
                    - generic [ref=e109]:
                      - button "새 사진 업로드" [ref=e110] [cursor=pointer]:
                        - generic [ref=e111]: 새 사진 업로드
                      - button "삭제" [ref=e112] [cursor=pointer]:
                        - generic [ref=e113]: 삭제
              - generic [ref=e114]:
                - generic [ref=e116]:
                  - generic [ref=e119]: 성함
                  - textbox "성함" [ref=e121]:
                    - /placeholder: ""
                    - text: Rome Tester
                - generic [ref=e122]:
                  - generic [ref=e125]: 이메일 주소
                  - generic [ref=e126]:
                    - textbox "이메일 주소" [disabled] [ref=e128]:
                      - /placeholder: ""
                      - text: trainee81.glophics@gmail.com
                    - button "변경" [ref=e129] [cursor=pointer]:
                      - generic [ref=e130]: 변경
              - button "변경사항 저장" [disabled] [ref=e132]:
                - generic [ref=e133]: 변경사항 저장
          - generic [ref=e134]:
            - generic [ref=e135]:
              - heading "비밀번호" [level=2] [ref=e136]
              - paragraph [ref=e137]: 강력한 비밀번호를 설정하여 소중한 계정 정보를 안전하게 보호하세요.
            - generic [ref=e138]:
              - generic [ref=e139]:
                - generic [ref=e142]: 현재 비밀번호
                - generic [ref=e143]:
                  - textbox "현재 비밀번호" [ref=e144]:
                    - /placeholder: 현재 비밀번호를 입력하세요
                  - button "비밀번호 표시 전환" [ref=e146] [cursor=pointer]:
                    - img [ref=e147]
                    - generic [ref=e149]: 비밀번호 표시 전환
              - generic [ref=e150]:
                - generic [ref=e153]: 새 비밀번호
                - generic [ref=e154]:
                  - textbox "새 비밀번호" [ref=e155]:
                    - /placeholder: 새 비밀번호를 입력하세요
                  - button "비밀번호 표시 전환" [ref=e157] [cursor=pointer]:
                    - img [ref=e158]
                    - generic [ref=e160]: 비밀번호 표시 전환
                - paragraph [ref=e161]: 비밀번호는 최소 6자 이상이어야 하며 대문자, 숫자, 특수문자 중 하나 이상을 포함해야 합니다.
              - generic [ref=e162]:
                - generic [ref=e165]: 새 비밀번호 확인
                - generic [ref=e166]:
                  - textbox "새 비밀번호 확인" [ref=e167]
                  - button "비밀번호 확인 표시 전환" [ref=e169] [cursor=pointer]:
                    - img [ref=e170]
                    - generic [ref=e172]: 비밀번호 확인 표시 전환
              - generic [ref=e173]:
                - button "비밀번호 변경" [disabled] [ref=e174]:
                  - generic [ref=e175]: 비밀번호 변경
                - button "비밀번호를 잊으셨나요?" [ref=e176] [cursor=pointer]:
                  - generic [ref=e177]: 비밀번호를 잊으셨나요?
          - generic [ref=e178]:
            - generic [ref=e179]:
              - heading "설정" [level=2] [ref=e180]
              - paragraph [ref=e181]: 프로모션 알림·할인 혜택·리뷰 등 주요 알림 설정을 관리하세요.
            - generic [ref=e182]:
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - heading "프로모션 및 할인" [level=3] [ref=e185]
                  - paragraph [ref=e186]: 할인, 신제품, 프로모션 및 특별 헤택에 대한 소식을 받아보세요
                - generic [ref=e187] [cursor=pointer]:
                  - checkbox [checked]
              - generic [ref=e189]:
                - generic [ref=e190]:
                  - heading "리뷰 요청 알림" [level=3] [ref=e191]
                  - paragraph [ref=e192]: 상품 수령 후 리뷰 작성 안내를 이메일로 받아보세요
                - generic [ref=e193] [cursor=pointer]:
                  - checkbox [checked]
          - generic [ref=e195]:
            - generic [ref=e196]:
              - heading "머스티커 회원 탈퇴" [level=2] [ref=e197]
              - paragraph [ref=e198]: 회원 탈퇴 시 회원 정보 및 관련 데이터가 영구적으로 삭제되며, 삭제된 정보는 복구할 수 없습니다.
            - button "회원 탈퇴" [ref=e200] [cursor=pointer]:
              - generic [ref=e201]: 회원 탈퇴
    - navigation "네이버 톡톡으로 문의하기" [ref=e202]:
      - link "카카오채널로 문의하기" [ref=e203] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e205]
      - link "네이버 톡톡 으로 문의하기" [ref=e206] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e208]
      - button "이메일로 문의하기" [ref=e209] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e211]
  - contentinfo [ref=e212]:
    - generic [ref=e214]: © 2026 GLOPHICS Corp. All rights reserved.
```

# Test source

```ts
  568 |       }
  569 | 
  570 |       if (
  571 |         message.type() === 'warning' &&
  572 |         (isBenignPretendardMetadataWarning(text) ||
  573 |           isBenignPretendardPreloadWarning(text) ||
  574 |           isBenignNuxtPreloadWarning(text) ||
  575 |           isBenignFirefoxIllustrationPreloadWarning(text) ||
  576 |           isBenignWorkerModelFallbackWarning(text))
  577 |       ) {
  578 |         return;
  579 |       }
  580 | 
  581 |       if (isKnownConsoleMessage(text, guardOptions)) {
  582 |         return;
  583 |       }
  584 | 
  585 |       const abortedKind = allowNavigationAbortedFetches ? abortedFetchConsoleKind(text) : undefined;
  586 |       if (abortedKind) {
  587 |         abortedFetchConsoleErrors.push({ kind: abortedKind, entry: `[${message.type()}] ${text}`, at: Date.now() });
  588 |         return;
  589 |       }
  590 | 
  591 |       consoleFailures.push(`[${message.type()}] ${text}`);
  592 |     });
  593 | 
  594 |     page.on('response', (response) => {
  595 |       const status = response.status();
  596 |       if (status < 400) {
  597 |         return;
  598 |       }
  599 | 
  600 |       const url = response.url();
  601 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  602 |         return;
  603 |       }
  604 | 
  605 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  606 |         return;
  607 |       }
  608 | 
  609 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  610 |         return;
  611 |       }
  612 | 
  613 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  614 |         pendingTransientProductPageFailures += 1;
  615 |         return;
  616 |       }
  617 | 
  618 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  619 |         pendingExpectedNotFoundResponses += 1;
  620 |         return;
  621 |       }
  622 | 
  623 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  624 |         return;
  625 |       }
  626 | 
  627 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  628 |         return;
  629 |       }
  630 | 
  631 |       if (allowStudioModelLoadNoise && isStudioModelMissingTokenizerConfig(status, url)) {
  632 |         return;
  633 |       }
  634 | 
  635 |       if (allowKnownArtworkReminderFailure && isArtworkReminderServerFailure(status, url)) {
  636 |         seenArtworkReminderFailure = true;
  637 |         return;
  638 |       }
  639 | 
  640 |       responseFailures.push(`${status} ${url}`);
  641 |     });
  642 | 
  643 |     await applyInternalOriginHeader(page);
  644 |     await use(page);
  645 | 
  646 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  647 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  648 |     // that nothing retried still fails the run.
  649 |     const throttleBlocks = retriedThrottleBlockCount(page);
  650 | 
  651 |     for (const { kind, entry, at } of abortedFetchConsoleErrors) {
  652 |       if (!abortedFetches.some((aborted) => aborted.kind === kind && Math.abs(aborted.at - at) <= ABORTED_FETCH_MATCH_WINDOW_MS)) {
  653 |         consoleFailures.push(entry);
  654 |       }
  655 |     }
  656 | 
  657 |     if (consoleFailures.length || responseFailures.length || testInfo.status !== testInfo.expectedStatus) {
  658 |       await testInfo.attach('browser-diagnostics.json', {
  659 |         body: JSON.stringify({ networkFailures, consoleSources }), contentType: 'application/json'
  660 |       });
  661 |     }
  662 | 
  663 |     expect
  664 |       .soft(
  665 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  666 |         'Unexpected browser console errors or warnings'
  667 |       )
> 668 |       .toEqual([]);
      |        ^ Error: Unexpected browser console errors or warnings
  669 |     expect
  670 |       .soft(
  671 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  672 |         'Unexpected failed HTTP responses'
  673 |       )
  674 |       .toEqual([]);
  675 |   }
  676 | });
  677 | 
  678 | export { expect };
  679 | 
```