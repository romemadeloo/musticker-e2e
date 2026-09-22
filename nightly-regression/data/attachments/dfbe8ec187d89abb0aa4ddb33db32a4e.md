# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchasing/money-path.spec.ts >> storefront v2 money path >> MS-V2-099 an order at or above the free-shipping threshold ships free
- Location: tests/e2e/purchasing/money-path.spec.ts:106:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 23

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] TypeError: Failed to fetch dynamically imported module: https://www.musticker.com/_nuxt/rgIpi23d.js",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] TypeError: Failed to fetch dynamically imported module: https://www.musticker.com/_nuxt/g5dYrfi1.js",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] [NUXT_E5002]",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 20

- Array []
+ Array [
+   "403 https://www.musticker.com/_nuxt/Card.BGe_udBI.css",
+   "403 https://www.musticker.com/_nuxt/AppHeaderLocaleModal.BixmadvG.css",
+   "403 https://www.musticker.com/_nuxt/BtG9ejTC.js",
+   "403 https://www.musticker.com/_nuxt/DFk4v7b7.js",
+   "403 https://www.musticker.com/_nuxt/BXRNUwAb.js",
+   "403 https://www.musticker.com/_nuxt/CartPreview.D9GYyl2o.css",
+   "403 https://www.musticker.com/_nuxt/DFFfWpZE.js",
+   "403 https://www.musticker.com/_nuxt/B3xsGg2c.js",
+   "403 https://www.musticker.com/kr/_payload.json?_b=f92dab84-65bb-4775-b851-5ab1a04edd69",
+   "403 https://www.musticker.com/_nuxt/DxM-3nbA.js",
+   "403 https://www.musticker.com/_nuxt/CmK2LHDY.js",
+   "403 https://www.musticker.com/kr/stickers/_payload.json?_b=f92dab84-65bb-4775-b851-5ab1a04edd69",
+   "403 https://www.musticker.com/kr/roll-stickers/_payload.json?_b=f92dab84-65bb-4775-b851-5ab1a04edd69",
+   "403 https://www.musticker.com/kr/sheet-stickers/_payload.json?_b=f92dab84-65bb-4775-b851-5ab1a04edd69",
+   "403 https://www.musticker.com/_nuxt/rgIpi23d.js",
+   "403 https://www.musticker.com/_nuxt/g5dYrfi1.js",
+   "403 https://www.musticker.com/icons/sprite.svg?v=1788835890778",
+   "403 https://www.musticker.com/_nuxt/builds/meta/f92dab84-65bb-4775-b851-5ab1a04edd69.json",
+ ]
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByTestId('product-category-options').or(getByRole('complementary').filter({ hasText: /\uc0ac\uc774\uc988|\uc218\ub7c9|Size|Quantity/i })).first().getByRole('button', { name: /중형 75x75/ }).first()

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
          - button "장바구니" [ref=e36] [cursor=pointer]:
            - img [ref=e37]
          - button "계정" [ref=e40] [cursor=pointer]:
            - img [ref=e42]
      - navigation "Primary":
        - link "스티커" [ref=e44] [cursor=pointer]:
          - /url: /kr/stickers
        - link "롤스티커" [ref=e45] [cursor=pointer]:
          - /url: /kr/roll-stickers
        - link "시트 스티커" [ref=e46] [cursor=pointer]:
          - /url: /kr/sheet-stickers
  - main [ref=e47]:
    - generic [ref=e48]:
      - generic [ref=e50]:
        - generic:
          - navigation:
            - link "자유형 스티커 자유형 스티커":
              - /url: /kr/stickers/die-cut-sticker
              - generic:
                - img "자유형 스티커"
              - generic:
                - heading "자유형 스티커" [level=4]
            - link "원형 스티커 원형 스티커":
              - /url: /kr/stickers/circle-sticker
              - generic:
                - img "원형 스티커"
              - generic:
                - heading "원형 스티커" [level=4]
            - link "직사각형 스티커 직사각형 스티커":
              - /url: /kr/stickers/rectangle-sticker
              - generic:
                - img "직사각형 스티커"
              - generic:
                - heading "직사각형 스티커" [level=4]
            - link "정사각형 스티커 정사각형 스티커":
              - /url: /kr/stickers/square-sticker
              - generic:
                - img "정사각형 스티커"
              - generic:
                - heading "정사각형 스티커" [level=4]
            - link "타원형 스티커 타원형 스티커":
              - /url: /kr/stickers/oval-sticker
              - generic:
                - img "타원형 스티커"
              - generic:
                - heading "타원형 스티커" [level=4]
            - link "둥근 사각 스티커 둥근 사각 스티커":
              - /url: /kr/stickers/rounded-sticker
              - generic:
                - img "둥근 사각 스티커"
              - generic:
                - heading "둥근 사각 스티커" [level=4]
            - link "키스컷 스티커 키스컷 스티커":
              - /url: /kr/stickers/kiss-cut-sticker
              - generic:
                - img "키스컷 스티커"
              - generic:
                - heading "키스컷 스티커" [level=4]
            - link "커스텀 시트 스티커 커스텀 시트 스티커":
              - /url: /kr/stickers/sticker-sheet
              - generic:
                - img "커스텀 시트 스티커"
              - generic:
                - heading "커스텀 시트 스티커" [level=4]
            - link "투명 스티커 투명 스티커":
              - /url: /kr/stickers/clear-sticker
              - generic:
                - img "투명 스티커"
              - generic:
                - heading "투명 스티커" [level=4]
            - link "홀로그램 스티커 홀로그램 스티커":
              - /url: /kr/stickers/hologram-sticker
              - generic:
                - img "홀로그램 스티커"
              - generic:
                - heading "홀로그램 스티커" [level=4]
            - link "풀 컬러 레터링 스티커 풀 컬러 레터링 스티커":
              - /url: /kr/stickers/transfer-sticker
              - generic:
                - img "풀 컬러 레터링 스티커"
              - generic:
                - heading "풀 컬러 레터링 스티커" [level=4]
            - link "레터링 스티커 레터링 스티커":
              - /url: /kr/stickers/vinyl-lettering
              - generic:
                - img "레터링 스티커"
              - generic:
                - heading "레터링 스티커" [level=4]
        - generic [ref=e53]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - heading "자유형 스티커" [level=1] [ref=e58]
              - paragraph [ref=e59]: 두텁고 강력한 내구성을 가진 소재를 자랑해요
            - img "자유형 스티커 preview poster" [ref=e61]
          - complementary [ref=e86]:
            - generic [ref=e87]:
              - generic [ref=e88]:
                - heading "사이즈를 선택하세요" [level=3] [ref=e89]
                - generic [ref=e90]: (단위:mm)
              - 'button "원하는 크기 입력 주문 가능 크기: 10-200mm" [ref=e92] [cursor=pointer]':
                - generic [ref=e93]:
                  - img [ref=e94]
                  - paragraph [ref=e95]: 원하는 크기 입력
                - generic [ref=e96]: "주문 가능 크기: 10-200mm"
            - generic [ref=e97]:
              - heading "수량을 선택하세요" [level=3] [ref=e98]
              - 'button "원하는 수량 입력 주문 가능 수량: 1-100,000개" [ref=e100] [cursor=pointer]':
                - generic [ref=e101]:
                  - img [ref=e102]
                  - paragraph [ref=e103]: 원하는 수량 입력
                - generic [ref=e104]: "주문 가능 수량: 1-100,000개"
            - button "다음 단계" [disabled] [ref=e106]:
              - generic [ref=e107]: 다음 단계
            - list [ref=e109]:
              - listitem [ref=e110]: 5만원 이상 무료배송
              - listitem [ref=e111]: 12시 이전 시안 확정 시 당일배송
              - listitem [ref=e112]: "발송 예정일: 09.23 (수) · CJ 대한통운"
              - listitem [ref=e113]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
      - generic [ref=e115]:
        - article [ref=e116]:
          - img "오늘제작, 내일발송" [ref=e117]
          - heading "오늘제작, 내일발송" [level=4] [ref=e118]
          - paragraph [ref=e119]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
        - article [ref=e120]:
          - img "빠른 시안 피드백" [ref=e121]
          - heading "빠른 시안 피드백" [level=4] [ref=e122]
          - paragraph [ref=e123]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
        - article [ref=e124]:
          - img "뛰어난 내구성과 내수성" [ref=e125]
          - heading "뛰어난 내구성과 내수성" [level=4] [ref=e126]
          - paragraph [ref=e127]: 두꺼운 프리미엄 재질로 색상, 접착력 그대로 오래갑니다
      - generic [ref=e129]:
        - article [ref=e130]:
          - generic [ref=e133]:
            - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e134]
            - paragraph [ref=e135]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
        - article [ref=e136]:
          - generic [ref=e139]:
            - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e140]
            - paragraph [ref=e141]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
        - article [ref=e142]:
          - generic [ref=e145]:
            - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e146]
            - paragraph [ref=e147]: 로고, 일러스트, 사진을 업로드하면 칼선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
      - generic [ref=e149]:
        - generic [ref=e150]:
          - generic [ref=e151]:
            - generic [ref=e152]: 좋아요 😀
            - img "5 out of 5" [ref=e153]:
              - img [ref=e154]
              - img [ref=e156]
              - img [ref=e158]
              - img [ref=e160]
              - img [ref=e162]
            - generic [ref=e164]: "5.0"
          - heading "234개 사진 후기가 보장해요" [level=2] [ref=e165]
          - paragraph [ref=e166]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
          - generic [ref=e167]:
            - button "이전 리뷰" [ref=e168] [cursor=pointer]:
              - img [ref=e169]
              - generic [ref=e171]: 이전 리뷰
            - button "다음 리뷰" [ref=e172] [cursor=pointer]:
              - img [ref=e173]
              - generic [ref=e175]: 다음 리뷰
        - generic [ref=e177]:
          - article [ref=e179]:
            - generic [ref=e180]:
              - img "홍승일" [ref=e182]
              - paragraph [ref=e184]: 제품 깔끔하게 잘 나왔고 바로 다음날 배송이 되어서 너무 만족스러웠습니다
            - generic [ref=e185]:
              - generic [ref=e186]:
                - generic [ref=e187]: 홍
                - generic [ref=e188]:
                  - strong [ref=e189]: 홍승일
                  - generic [ref=e190]: 2026-09-15
              - generic [ref=e191]:
                - img [ref=e192]
                - img [ref=e194]
                - img [ref=e196]
                - img [ref=e198]
                - img [ref=e200]
          - article [ref=e203]:
            - generic [ref=e204]:
              - img "이지영" [ref=e206]
              - paragraph [ref=e208]: 첫 스티커 제작이었는데, 굉장히 만족합니다. 다음에 제작 의뢰할 때에는 더 잘할 수 있을 것 같아요!
            - generic [ref=e209]:
              - generic [ref=e210]:
                - generic [ref=e211]: 이
                - generic [ref=e212]:
                  - strong [ref=e213]: 이지영
                  - generic [ref=e214]: 2026-09-14
              - generic [ref=e215]:
                - img [ref=e216]
                - img [ref=e218]
                - img [ref=e220]
                - img [ref=e222]
                - img [ref=e224]
          - article [ref=e227]:
            - generic [ref=e228]:
              - img "권민정" [ref=e230]
              - paragraph [ref=e232]: 급하게 필요해서 주문했던 스티커인데 친절하게 잘 응대해주시고 스티커도 너무 이쁘게 나와서 맘에 쏙 들었어요. 다음에 또 이용할께요.
            - generic [ref=e233]:
              - generic [ref=e234]:
                - generic [ref=e235]: 권
                - generic [ref=e236]:
                  - strong [ref=e237]: 권민정
                  - generic [ref=e238]: 2026-09-11
              - generic [ref=e239]:
                - img [ref=e240]
                - img [ref=e242]
                - img [ref=e244]
                - img [ref=e246]
                - img [ref=e248]
          - article [ref=e251]:
            - generic [ref=e252]:
              - img "허준회" [ref=e254]
              - paragraph [ref=e256]: 대만족
            - generic [ref=e257]:
              - generic [ref=e258]:
                - generic [ref=e259]: 허
                - generic [ref=e260]:
                  - strong [ref=e261]: 허준회
                  - generic [ref=e262]: 2026-09-11
              - generic [ref=e263]:
                - img [ref=e264]
                - img [ref=e266]
                - img [ref=e268]
                - img [ref=e270]
                - img [ref=e272]
          - article [ref=e275]:
            - generic [ref=e276]:
              - img "이승범" [ref=e278]
              - paragraph [ref=e280]: 예쁘게 튼튼하게 잘 만들어주셔써요 !!
            - generic [ref=e281]:
              - generic [ref=e282]:
                - generic [ref=e283]: 이
                - generic [ref=e284]:
                  - strong [ref=e285]: 이승범
                  - generic [ref=e286]: 2026-09-10
              - generic [ref=e287]:
                - img [ref=e288]
                - img [ref=e290]
                - img [ref=e292]
                - img [ref=e294]
                - img [ref=e296]
          - article [ref=e299]:
            - generic [ref=e300]:
              - img "이지유" [ref=e302]
              - paragraph [ref=e304]: 원하는 디자인으로 잘 제작해주고 제작 및 배송도 빨라서 좋았습니다.
            - generic [ref=e305]:
              - generic [ref=e306]:
                - generic [ref=e307]: 이
                - generic [ref=e308]:
                  - strong [ref=e309]: 이지유
                  - generic [ref=e310]: 2026-09-10
              - generic [ref=e311]:
                - img [ref=e312]
                - img [ref=e314]
                - img [ref=e316]
                - img [ref=e318]
                - img [ref=e320]
          - article [ref=e323]:
            - generic [ref=e324]:
              - img "김민수" [ref=e326]
              - paragraph [ref=e328]: 퀼리티 짱!
            - generic [ref=e329]:
              - generic [ref=e330]:
                - generic [ref=e331]: 김
                - generic [ref=e332]:
                  - strong [ref=e333]: 김민수
                  - generic [ref=e334]: 2026-09-09
              - generic [ref=e335]:
                - img [ref=e336]
                - img [ref=e338]
                - img [ref=e340]
                - img [ref=e342]
                - img [ref=e344]
          - article [ref=e347]:
            - generic [ref=e348]:
              - img "우상엽" [ref=e350]
              - paragraph [ref=e352]: 좋아요 퀄리티도 좋고.
            - generic [ref=e353]:
              - generic [ref=e354]:
                - generic [ref=e355]: 우
                - generic [ref=e356]:
                  - strong [ref=e357]: 우상엽
                  - generic [ref=e358]: 2026-09-09
              - generic [ref=e359]:
                - img [ref=e360]
                - img [ref=e362]
                - img [ref=e364]
                - img [ref=e366]
                - img [ref=e368]
          - article [ref=e371]:
            - generic [ref=e372]:
              - img "강동U1 센터" [ref=e374]
              - paragraph [ref=e376]: 작고 앙증맞아요. 감사합니다.
            - generic [ref=e377]:
              - generic [ref=e378]:
                - generic [ref=e379]: 강
                - generic [ref=e380]:
                  - strong [ref=e381]: 강동U1 센터
                  - generic [ref=e382]: 2026-09-09
              - generic [ref=e383]:
                - img [ref=e384]
                - img [ref=e386]
                - img [ref=e388]
                - img [ref=e390]
                - img [ref=e392]
          - article [ref=e395]:
            - generic [ref=e396]:
              - img "tkop****" [ref=e398]
              - paragraph [ref=e400]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
            - generic [ref=e401]:
              - generic [ref=e402]:
                - img "tkop**** avatar" [ref=e403]
                - generic [ref=e404]:
                  - strong [ref=e405]: tkop****
                  - generic [ref=e406]: 2026-03-25
              - generic [ref=e407]:
                - img [ref=e408]
                - img [ref=e410]
                - img [ref=e412]
                - img [ref=e414]
                - img [ref=e416]
          - article [ref=e419]:
            - generic [ref=e420]:
              - img "oozz******" [ref=e422]
              - paragraph [ref=e424]: 잘나와서 만족합니다 잘쓰겠습니다
            - generic [ref=e425]:
              - generic [ref=e426]:
                - img "oozz****** avatar" [ref=e427]
                - generic [ref=e428]:
                  - strong [ref=e429]: oozz******
                  - generic [ref=e430]: 2026-03-22
              - generic [ref=e431]:
                - img [ref=e432]
                - img [ref=e434]
                - img [ref=e436]
                - img [ref=e438]
                - img [ref=e440]
          - article [ref=e443]:
            - generic [ref=e444]:
              - img "aktm********" [ref=e446]
              - paragraph [ref=e448]: 만족하면서 사용중입니다
            - generic [ref=e449]:
              - generic [ref=e450]:
                - img "aktm******** avatar" [ref=e451]
                - generic [ref=e452]:
                  - strong [ref=e453]: aktm********
                  - generic [ref=e454]: 2026-03-04
              - generic [ref=e455]:
                - img [ref=e456]
                - img [ref=e458]
                - img [ref=e460]
                - img [ref=e462]
                - img [ref=e464]
          - article [ref=e467]:
            - generic [ref=e468]:
              - img "aktm********" [ref=e470]
              - paragraph [ref=e472]: 잘 받았어요 잘쓸게요.
            - generic [ref=e473]:
              - generic [ref=e474]:
                - img "aktm******** avatar" [ref=e475]
                - generic [ref=e476]:
                  - strong [ref=e477]: aktm********
                  - generic [ref=e478]: 2026-01-31
              - generic [ref=e479]:
                - img [ref=e480]
                - img [ref=e482]
                - img [ref=e484]
                - img [ref=e486]
                - img [ref=e488]
          - article [ref=e491]:
            - generic [ref=e492]:
              - img "aktm********" [ref=e494]
              - paragraph [ref=e496]: 아주 잘쓰고있습니다.
            - generic [ref=e497]:
              - generic [ref=e498]:
                - img "aktm******** avatar" [ref=e499]
                - generic [ref=e500]:
                  - strong [ref=e501]: aktm********
                  - generic [ref=e502]: 2026-01-06
              - generic [ref=e503]:
                - img [ref=e504]
                - img [ref=e506]
                - img [ref=e508]
                - img [ref=e510]
                - img [ref=e512]
          - article [ref=e515]:
            - generic [ref=e516]:
              - img "aktm********" [ref=e518]
              - paragraph [ref=e520]: 아주 잘쓰고있습니다.
            - generic [ref=e521]:
              - generic [ref=e522]:
                - img "aktm******** avatar" [ref=e523]
                - generic [ref=e524]:
                  - strong [ref=e525]: aktm********
                  - generic [ref=e526]: 2026-01-06
              - generic [ref=e527]:
                - img [ref=e528]
                - img [ref=e530]
                - img [ref=e532]
                - img [ref=e534]
                - img [ref=e536]
          - article [ref=e539]:
            - generic [ref=e540]:
              - img "jiwn****" [ref=e542]
              - paragraph [ref=e544]: 아 정말 너무 좋아연ㅎㅎ
            - generic [ref=e545]:
              - generic [ref=e546]:
                - img "jiwn**** avatar" [ref=e547]
                - generic [ref=e548]:
                  - strong [ref=e549]: jiwn****
                  - generic [ref=e550]: 2025-12-29
              - generic [ref=e551]:
                - img [ref=e552]
                - img [ref=e554]
                - img [ref=e556]
                - img [ref=e558]
                - img [ref=e560]
      - generic [ref=e563]:
        - generic [ref=e564]:
          - img "text" [ref=e565]
          - generic [ref=e566]:
            - heading "자유형 스티커 FAQ" [level=2] [ref=e567]
            - paragraph [ref=e568]:
              - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
              - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e569] [cursor=pointer]:
                - /url: https://www.musticker.com/faq
              - text: .
        - generic [ref=e570]:
          - generic [ref=e571]:
            - generic [ref=e572] [cursor=pointer]:
              - heading "자유형 스티커란 무엇인가요?" [level=3] [ref=e573]
              - paragraph [ref=e576]: 자유형 스티커는 원형이나 사각형 같은 규격 모양이 아닌, 디자인의 외곽선을 따라 제작되는 스티커입니다. 로고, 일러스트, 캐릭터, 텍스트 등 다양한 디자인을 원하는 모양으로 제작할 수 있습니다.
            - button [ref=e577] [cursor=pointer]:
              - img [ref=e578]
          - generic [ref=e580]:
            - generic [ref=e581] [cursor=pointer]:
              - heading "자유형 스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e582]
              - paragraph [ref=e583]: 머스티커의 자유형 스티커는 내구성이 뛰어난 PVC 용지에 인쇄되어 물, 햇빛, 일상적인 마모에 강합니다. 실내외 다양한 환경에서도 선명한 색감을 오래 유지합니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요
            - button [ref=e584] [cursor=pointer]:
              - img [ref=e585]
          - generic [ref=e587]:
            - generic [ref=e588] [cursor=pointer]:
              - heading "칼선은 직접 만들어야 하나요?" [level=3] [ref=e589]
              - paragraph [ref=e590]: 디자인 파일만 업로드해 주시면 머스티커에서 디자인에 맞게 칼선을 제작해 드립니다. 이미 칼선이 포함된 파일이 있다면 함께 업로드할 수 있으며, 보다 깔끔한 제작을 위해 디자인 외곽선을 따라 칼선을 작업하는 것을 권장합니다.
            - button [ref=e591] [cursor=pointer]:
              - img [ref=e592]
          - generic [ref=e594]:
            - generic [ref=e595] [cursor=pointer]:
              - heading "인쇄 색상은 화면과 동일하게 나오나요?" [level=3] [ref=e596]
              - paragraph [ref=e597]: 모니터와 인쇄물은 색상을 표현하는 방식이 달라 실제 색상이 다소 다르게 보일 수 있습니다. 또한 모니터의 밝기, 색상 설정, 사용 환경에 따라서도 차이가 발생할 수 있습니다. 머스티커는 고품질 인쇄를 통해 원본 디자인과 최대한 가까운 색상으로 제작해 드립니다.
            - button [ref=e598] [cursor=pointer]:
              - img [ref=e599]
          - generic [ref=e601]:
            - generic [ref=e602] [cursor=pointer]:
              - heading "자유형 스티커는 어떤 사이즈를 선택하는 것이 좋나요?" [level=3] [ref=e603]
              - paragraph [ref=e604]: 디자인에 따라 적합한 사이즈가 달라집니다. 간단한 로고나 아이콘은 소형 사이즈를, 디테일이 많은 일러스트나 텍스트가 포함된 디자인은 대형 사이즈를 추천합니다. 작은 글씨나 얇은 선이 있는 경우에는 큰 사이즈를 선택하면 더욱 선명하고 깔끔하게 제작할 수 있습니다.
            - button [ref=e605] [cursor=pointer]:
              - img [ref=e606]
        - generic [ref=e608]:
          - generic [ref=e609]:
            - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e610]
            - paragraph [ref=e611]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
          - button "문의하기" [ref=e612] [cursor=pointer]:
            - generic [ref=e613]: 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e614]:
      - link "카카오채널로 문의하기" [ref=e615] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e617]
      - link "네이버 톡톡 으로 문의하기" [ref=e618] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e620]
      - button "이메일로 문의하기" [ref=e621] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e623]
  - contentinfo [ref=e624]:
    - generic [ref=e625]:
      - generic [ref=e626]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e627]
        - paragraph [ref=e628]: "상호명: (주)글로픽스"
        - paragraph [ref=e629]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e630]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e631]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e632]:
          - generic [ref=e633]: ⓒ 2026. All rights reserved.
          - generic [ref=e634]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e635] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e636] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - button "사업자정보확인" [ref=e637] [cursor=pointer]
          - link "오픈소스 라이선스" [ref=e638] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e639] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e640]:
        - paragraph [ref=e641]: 1899-5529
        - paragraph [ref=e643]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e644]:
          - button "1:1문의하기" [ref=e645] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e646] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e647]:
          - generic [ref=e648]: "Follow us at:"
          - generic [ref=e649]:
            - link "instagram icon" [ref=e650] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e651] [cursor=pointer]:
              - /url: https://www.youtube.com/@MustickerOfficial
              - img "youtube icon"
```

# Test source

```ts
  1   | import type { Locator, Page } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | 
  4   | import { appPath } from '../fixtures/env.js';
  5   | import { parseWon } from '../fixtures/money.js';
  6   | import { gotoStorefront } from '../fixtures/navigation.js';
  7   | import { ko } from '../fixtures/storefront-data.js';
  8   | 
  9   | const wonAmountPattern = /[\d,]+\uc6d0/u;
  10  | 
  11  | export class ProductV2Page {
  12  |   readonly page: Page;
  13  |   readonly optionsPanel: Locator;
  14  | 
  15  |   constructor(page: Page) {
  16  |     this.page = page;
  17  |     this.optionsPanel = page
  18  |       .getByTestId('product-category-options')
  19  |       .or(page.getByRole('complementary').filter({ hasText: /\uc0ac\uc774\uc988|\uc218\ub7c9|Size|Quantity/i }))
  20  |       .first();
  21  |   }
  22  | 
  23  |   async goto(path: string, heading: string): Promise<void> {
  24  |     await gotoStorefront(this.page, appPath(path));
  25  |     await expect(this.page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
  26  |     await expect(this.optionsPanel).toBeVisible();
  27  |   }
  28  | 
  29  |   async expectCatalogEntryRenders(path: string): Promise<void> {
  30  |     await gotoStorefront(this.page, appPath(path));
  31  |     await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(path.replace(/^\.\//, ''))}/?$`));
  32  |     await expect(this.page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  33  |     await expect(this.optionsPanel).toBeVisible();
  34  |   }
  35  | 
  36  |   async addToCart(): Promise<void> {
  37  |     await this.nextStepButton().click();
  38  | 
  39  |     const dialog = this.page.getByRole('dialog').first();
  40  |     await expect(dialog).toBeVisible();
  41  | 
  42  |     const addToCartButton = dialog.getByRole('button', { name: ko.addToCart });
  43  |     if (await addToCartButton.isVisible().catch(() => false)) {
  44  |       await addToCartButton.click();
  45  |       return;
  46  |     }
  47  | 
  48  |     const sendFileLaterButton = dialog.getByRole('button', { name: ko.sendFileLater });
  49  |     await expect(sendFileLaterButton).toBeVisible();
  50  |     await sendFileLaterButton.click();
  51  |   }
  52  | 
  53  |   async selectSize(sizeName: string): Promise<void> {
> 54  |     await this.optionsPanel.getByRole('button', { name: new RegExp(escapeRegExp(sizeName)) }).first().click();
      |                                                                                                       ^ Error: locator.click: Test timeout of 60000ms exceeded.
  55  |   }
  56  | 
  57  |   async selectMaterial(materialName: string): Promise<void> {
  58  |     await this.optionsPanel.getByRole('button', { name: materialName }).click();
  59  |   }
  60  | 
  61  |   // vinyl-lettering and transfer-sticker expose color choices as `.color-swatch` buttons whose
  62  |   // accessible name (aria-label) is the English color name (e.g. "Black"); the Korean label used
  63  |   // elsewhere in this suite only exists in a child `.color-swatch-tooltip` span, so this can't use
  64  |   // the getByRole name-matching that selectMaterial relies on.
  65  |   async selectSwatchColor(koreanColorLabel: string): Promise<void> {
  66  |     await this.optionsPanel.locator('.color-swatch').filter({ hasText: koreanColorLabel }).first().click();
  67  |   }
  68  | 
  69  |   async selectSheetSize(sizeName: string): Promise<void> {
  70  |     await this.optionsPanel.getByRole('button', { name: new RegExp(`^${escapeRegExp(sizeName)}`) }).first().click();
  71  |   }
  72  | 
  73  |   async selectQuantity(quantity: number): Promise<void> {
  74  |     const quantityLabel = new RegExp(`^${quantity.toLocaleString('en-US')}\\s*(?:\\S+)?\\s*${wonAmountPattern.source}`, 'u');
  75  |     await this.optionsPanel.getByRole('button', { name: quantityLabel }).first().click();
  76  |   }
  77  | 
  78  |   // The two custom-size fields, addressed by class and reading order rather than by placeholder.
  79  |   //
  80  |   // Production and development-1 label them differently: development-1 puts the axis in the
  81  |   // placeholder (가로 / 세로) with no visible caption, while production moved the axis out to a
  82  |   // visible 너비 / 높이 caption beside the field and gives *both* inputs the same "예: 30"
  83  |   // placeholder. So getByPlaceholder('가로') matches nothing on production, and matching the
  84  |   // production placeholder would be ambiguous. `.custom-size-input` carries across both, and both
  85  |   // render width before height, so order is what actually distinguishes them. The placeholder
  86  |   // union is kept first so the locator still reads as width/height on development-1.
  87  |   private customSizeInput(axis: 'width' | 'height'): Locator {
  88  |     const inputs = this.optionsPanel.locator('.custom-size-input');
  89  | 
  90  |     return axis === 'width'
  91  |       ? this.optionsPanel.getByPlaceholder('가로').or(inputs.first()).first()
  92  |       : this.optionsPanel.getByPlaceholder('세로').or(inputs.nth(1)).first();
  93  |   }
  94  | 
  95  |   async selectCustomIndividualSize(widthMm: number, heightMm: number): Promise<void> {
  96  |     const widthInput = this.customSizeInput('width');
  97  |     const heightInput = this.customSizeInput('height');
  98  | 
  99  |     // Clicking the custom-size pill before Vue has hydrated silently does nothing (and a blind
  100 |     // retry can toggle a row that mounted late straight back off). A priced quantity tier is the
  101 |     // signal that the page's own bootstrap pricing round-trip has rendered -- it lands seconds
  102 |     // after the options panel first becomes visible -- so gate on that, then re-check visibility
  103 |     // before every click rather than clicking blind.
  104 |     await this.optionsPanel
  105 |       .locator('.qty-pill-price')
  106 |       .filter({ hasNotText: /^0원$/ })
  107 |       .first()
  108 |       .waitFor({ state: 'visible', timeout: 20_000 })
  109 |       .catch(() => undefined);
  110 | 
  111 |     for (let attempt = 0; attempt < 5; attempt += 1) {
  112 |       if (await widthInput.isVisible().catch(() => false)) {
  113 |         break;
  114 |       }
  115 | 
  116 |       // The pill replaces itself with the size row, so once it is gone the row is already on its
  117 |       // way in and there is nothing left to click. Re-clicking here is what turned a missed input
  118 |       // into a hang: `click()` inherits the *test* timeout, so waiting for a control that will
  119 |       // never come back burned the whole remaining budget instead of failing this step.
  120 |       const pill = this.optionsPanel.getByRole('button', { name: ko.customSize }).first();
  121 | 
  122 |       if (await pill.isVisible().catch(() => false)) {
  123 |         await pill.click({ timeout: 5_000 }).catch(() => undefined);
  124 |       }
  125 | 
  126 |       await widthInput.waitFor({ state: 'visible', timeout: 4_000 }).catch(() => undefined);
  127 |     }
  128 | 
  129 |     await expect(widthInput, 'custom individual size inputs never mounted').toBeVisible();
  130 | 
  131 |     await widthInput.fill(String(widthMm));
  132 |     await heightInput.fill(String(heightMm));
  133 |     await heightInput.blur();
  134 |   }
  135 | 
  136 |   // vinyl-lettering's design surface is a contenteditable canvas, not an input/textarea, and
  137 |   // pricing stays at 0원 with the next-step button disabled until text is entered.
  138 |   async fillVinylLetteringText(text: string): Promise<void> {
  139 |     const canvas = this.page.getByTestId('product-category-vinyl-designer-textarea');
  140 |     await canvas.click();
  141 |     await this.page.keyboard.type(text);
  142 |   }
  143 | 
  144 |   /**
  145 |    * The price the chosen quantity tier advertises, as a number.
  146 |    *
  147 |    * This is the figure the shopper is quoted and the one that must survive into the cart and the
  148 |    * checkout summary unchanged -- it is already the discounted price, not the struck-through one
  149 |    * (verified on development-1: the 30개 tier reads 18,700원 against a 19,800원 list price, and
  150 |    * 18,700원 is what the cart line and the checkout 소계 then show).
  151 |    *
  152 |    * Waits out the bootstrap pricing round-trip, during which every tier reads 0원.
  153 |    */
  154 |   async captureQuantityTierPrice(quantity: number): Promise<number> {
```