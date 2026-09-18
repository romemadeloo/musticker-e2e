# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchasing/sheet-sticker-size-rules.spec.ts >> storefront v2 sheet sticker size rules (minimum two stickers per sheet) >> MS-V2-076 circle sheet sticker: both cart edit dialogs reject a one-per-sheet custom size
- Location: tests/e2e/purchasing/sheet-sticker-size-rules.spec.ts:134:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 12

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] TypeError: Failed to fetch dynamically imported module: https://www.musticker.com/_nuxt/g5dYrfi1.js",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] [NUXT_E5002]",
+   "[warning] Unable to retrieve prices.",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 9

- Array []
+ Array [
+   "403 https://www.musticker.com/icons/sprite.svg?v=1788835890778",
+   "403 https://www.musticker.com/icons/custom/size-use-cases/small-helmet.svg",
+   "403 https://www.musticker.com/icons/custom/size-use-cases/large-case.svg",
+   "403 https://www.musticker.com/icons/custom/size-use-cases/medium-tumbler.svg",
+   "403 https://www.musticker.com/icons/custom/size-use-cases/extra-large-cooler.svg",
+   "403 https://www.musticker.com/_nuxt/CSkFquRN.js",
+   "403 https://www.musticker.com/_nuxt/builds/meta/50ac7e97-d470-4909-a946-19d57e81251d.json",
+ ]
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByTestId('product-category-options').or(getByRole('complementary').filter({ hasText: /\uc0ac\uc774\uc988|\uc218\ub7c9|Size|Quantity/i })).first().getByRole('button', { name: /^5\s*(?:\S+)?\s*[\d,]+\uc6d0/u }).first()

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
            - link "자유형 시트 스티커 자유형 시트 스티커":
              - /url: /kr/sheet-stickers/die-cut-sheet
              - generic:
                - img "자유형 시트 스티커"
              - generic:
                - heading "자유형 시트 스티커" [level=4]
            - link "원형 시트 스티커 원형 시트 스티커":
              - /url: /kr/sheet-stickers/circle-sheet
              - generic:
                - img "원형 시트 스티커"
              - generic:
                - heading "원형 시트 스티커" [level=4]
            - link "타원형 시트 스티커 타원형 시트 스티커":
              - /url: /kr/sheet-stickers/oval-sheet
              - generic:
                - img "타원형 시트 스티커"
              - generic:
                - heading "타원형 시트 스티커" [level=4]
            - link "정사각형 시트 스티커 정사각형 시트 스티커":
              - /url: /kr/sheet-stickers/square-sheet
              - generic:
                - img "정사각형 시트 스티커"
              - generic:
                - heading "정사각형 시트 스티커" [level=4]
            - link "직사각형 시트 스티커 직사각형 시트 스티커":
              - /url: /kr/sheet-stickers/rectangle-sheet
              - generic:
                - img "직사각형 시트 스티커"
              - generic:
                - heading "직사각형 시트 스티커" [level=4]
            - link "둥근 사각 시트 스티커 둥근 사각 시트 스티커":
              - /url: /kr/sheet-stickers/rounded-sheet
              - generic:
                - img "둥근 사각 시트 스티커"
              - generic:
                - heading "둥근 사각 시트 스티커" [level=4]
        - generic [ref=e53]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - heading "원형 시트 스티커" [level=1] [ref=e58]
              - paragraph [ref=e59]: 사용과 보관이 편리하도록 시트 한 장에 담긴 원형 시트 스티커
            - img "원형 시트 스티커 preview poster" [ref=e61]
            - generic [ref=e63]:
              - button "소형 30x30 A6 105x148 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!" [ref=e64] [cursor=pointer]:
                - heading "소형 30x30" [level=4] [ref=e65]
                - img "A6 105x148" [ref=e66]
                - paragraph [ref=e67]: 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!
              - button "중형 50x50 product.sizes.medium50x50.label 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요." [ref=e68] [cursor=pointer]:
                - heading "중형 50x50" [level=4] [ref=e69]
                - img "product.sizes.medium50x50.label" [ref=e70]
                - paragraph [ref=e71]: 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요.
              - button "대형 75x75 product.sizes.large75x75.label 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요." [ref=e72] [cursor=pointer]:
                - heading "대형 75x75" [level=4] [ref=e73]
                - img "product.sizes.large75x75.label" [ref=e74]
                - paragraph [ref=e75]: 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요.
              - button "초대형 90x90 product.sizes.extraLarge90x90.label 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요." [ref=e76] [cursor=pointer]:
                - heading "초대형 90x90" [level=4] [ref=e77]
                - img "product.sizes.extraLarge90x90.label" [ref=e78]
                - paragraph [ref=e79]: 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요.
          - complementary [ref=e82]:
            - generic [ref=e83]:
              - heading "원하시는 소재를 선택하세요" [level=3] [ref=e84]
              - generic [ref=e85]:
                - button "PVC 매트" [active] [ref=e86] [cursor=pointer]:
                  - paragraph [ref=e87]: PVC 매트
                - button "투명" [ref=e88] [cursor=pointer]:
                  - paragraph [ref=e89]: 투명
                - button "홀로그램" [ref=e90] [cursor=pointer]:
                  - paragraph [ref=e91]: 홀로그램
            - generic [ref=e92]:
              - generic [ref=e93]:
                - heading "개별 스티커 사이즈를 선택하세요" [level=3] [ref=e94]
                - generic [ref=e95]: (단위:mm)
              - generic [ref=e96]:
                - button "소형 30x30" [ref=e97] [cursor=pointer]:
                  - generic [ref=e98]: 소형
                  - generic [ref=e99]: 30x30
                - button "중형 50x50" [ref=e100] [cursor=pointer]:
                  - generic [ref=e101]: 중형
                  - generic [ref=e102]: 50x50
                - button "대형 75x75" [ref=e103] [cursor=pointer]:
                  - generic [ref=e104]: 대형
                  - generic [ref=e105]: 75x75
                - button "초대형 90x90" [ref=e106] [cursor=pointer]:
                  - generic [ref=e107]: 초대형
                  - generic [ref=e108]: 90x90
                - 'button "원하는 크기 입력 주문 가능 크기: 10-200mm" [ref=e109] [cursor=pointer]':
                  - generic [ref=e110]:
                    - img [ref=e111]
                    - paragraph [ref=e112]: 원하는 크기 입력
                  - generic [ref=e113]: "주문 가능 크기: 10-200mm"
            - generic [ref=e114]:
              - heading "수량을 선택하세요" [level=3] [ref=e115]
              - 'button "원하는 수량 입력 주문 가능 수량: 10-10,000개" [ref=e117] [cursor=pointer]':
                - generic [ref=e118]:
                  - img [ref=e119]
                  - paragraph [ref=e120]: 원하는 수량 입력
                - generic [ref=e121]: "주문 가능 수량: 10-10,000개"
            - generic [ref=e122]:
              - button "다음 단계" [disabled] [ref=e123]:
                - generic [ref=e124]: 다음 단계
              - generic [ref=e125]:
                - paragraph [ref=e126]: 스티커는 A5 시트(148×210mm)에 인쇄됩니다. 아래 가이드를 통해 사이즈별 배치 수량을 확인하고, 가장 적합한 옵션을 선택해 보세요.
                - generic [ref=e128] [cursor=pointer]:
                  - generic [ref=e129]: 배치 가이드 보기
                  - img [ref=e130]
            - list [ref=e132]:
              - listitem [ref=e133]: 5만원 이상 무료배송
              - listitem [ref=e134]: 12시 이전 시안 확정 시 당일배송
              - listitem [ref=e135]: "발송 예정일: 09.21 (월) · CJ 대한통운"
              - listitem [ref=e136]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
      - generic [ref=e138]:
        - article [ref=e139]:
          - img "오늘제작, 내일발송" [ref=e140]
          - heading "오늘제작, 내일발송" [level=4] [ref=e141]
          - paragraph [ref=e142]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
        - article [ref=e143]:
          - img "빠른 시안 피드백" [ref=e144]
          - heading "빠른 시안 피드백" [level=4] [ref=e145]
          - paragraph [ref=e146]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
        - article [ref=e147]:
          - img "빠르고 간편한 부착" [ref=e148]
          - heading "빠르고 간편한 부착" [level=4] [ref=e149]
          - paragraph [ref=e150]: 스티커가 시트에서 쉽게 떼어져 원하는 곳에 빠르고 간편하게 부착할 수 있습니다.
      - generic [ref=e152]:
        - article [ref=e153]:
          - generic [ref=e156]:
            - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e157]
            - paragraph [ref=e158]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
        - article [ref=e159]:
          - generic [ref=e162]:
            - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e163]
            - paragraph [ref=e164]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
        - article [ref=e165]:
          - generic [ref=e168]:
            - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e169]
            - paragraph [ref=e170]: 로고, 일러스트, 사진을 업로드하면 칼선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
      - generic [ref=e172]:
        - generic [ref=e173]:
          - generic [ref=e174]:
            - generic [ref=e175]: 좋아요 😀
            - img "5 out of 5" [ref=e176]:
              - img [ref=e177]
              - img [ref=e178]
              - img [ref=e179]
              - img [ref=e180]
              - img [ref=e181]
            - generic [ref=e182]: "5.0"
          - heading "226개 사진 후기가 보장해요" [level=2] [ref=e183]
          - paragraph [ref=e184]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
          - generic [ref=e185]:
            - button "이전 리뷰" [ref=e186] [cursor=pointer]:
              - img [ref=e187]
              - generic [ref=e189]: 이전 리뷰
            - button "다음 리뷰" [ref=e190] [cursor=pointer]:
              - img [ref=e191]
              - generic [ref=e193]: 다음 리뷰
        - generic [ref=e195]:
          - article [ref=e197]:
            - generic [ref=e198]:
              - img "권민정" [ref=e200]
              - paragraph [ref=e202]: 급하게 필요해서 주문했던 스티커인데 친절하게 잘 응대해주시고 스티커도 너무 이쁘게 나와서 맘에 쏙 들었어요. 다음에 또 이용할께요.
            - generic [ref=e203]:
              - generic [ref=e204]:
                - generic [ref=e205]: 권
                - generic [ref=e206]:
                  - strong [ref=e207]: 권민정
                  - generic [ref=e208]: 2026-09-11
              - generic [ref=e209]:
                - img [ref=e210]
                - img [ref=e211]
                - img [ref=e212]
                - img [ref=e213]
                - img [ref=e214]
          - article [ref=e216]:
            - generic [ref=e217]:
              - img "tkop****" [ref=e219]
              - paragraph [ref=e221]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
            - generic [ref=e222]:
              - generic [ref=e223]:
                - img "tkop**** avatar" [ref=e224]
                - generic [ref=e225]:
                  - strong [ref=e226]: tkop****
                  - generic [ref=e227]: 2026-03-25
              - generic [ref=e228]:
                - img [ref=e229]
                - img [ref=e230]
                - img [ref=e231]
                - img [ref=e232]
                - img [ref=e233]
          - article [ref=e235]:
            - generic [ref=e236]:
              - img "oozz******" [ref=e238]
              - paragraph [ref=e240]: 잘나와서 만족합니다 잘쓰겠습니다
            - generic [ref=e241]:
              - generic [ref=e242]:
                - img "oozz****** avatar" [ref=e243]
                - generic [ref=e244]:
                  - strong [ref=e245]: oozz******
                  - generic [ref=e246]: 2026-03-22
              - generic [ref=e247]:
                - img [ref=e248]
                - img [ref=e249]
                - img [ref=e250]
                - img [ref=e251]
                - img [ref=e252]
          - article [ref=e254]:
            - generic [ref=e255]:
              - img "aktm********" [ref=e257]
              - paragraph [ref=e259]: 만족하면서 사용중입니다
            - generic [ref=e260]:
              - generic [ref=e261]:
                - img "aktm******** avatar" [ref=e262]
                - generic [ref=e263]:
                  - strong [ref=e264]: aktm********
                  - generic [ref=e265]: 2026-03-04
              - generic [ref=e266]:
                - img [ref=e267]
                - img [ref=e268]
                - img [ref=e269]
                - img [ref=e270]
                - img [ref=e271]
          - article [ref=e273]:
            - generic [ref=e274]:
              - img "aktm********" [ref=e276]
              - paragraph [ref=e278]: 잘 받았어요 잘쓸게요.
            - generic [ref=e279]:
              - generic [ref=e280]:
                - img "aktm******** avatar" [ref=e281]
                - generic [ref=e282]:
                  - strong [ref=e283]: aktm********
                  - generic [ref=e284]: 2026-01-31
              - generic [ref=e285]:
                - img [ref=e286]
                - img [ref=e287]
                - img [ref=e288]
                - img [ref=e289]
                - img [ref=e290]
          - article [ref=e292]:
            - generic [ref=e293]:
              - img "aktm********" [ref=e295]
              - paragraph [ref=e297]: 아주 잘쓰고있습니다.
            - generic [ref=e298]:
              - generic [ref=e299]:
                - img "aktm******** avatar" [ref=e300]
                - generic [ref=e301]:
                  - strong [ref=e302]: aktm********
                  - generic [ref=e303]: 2026-01-06
              - generic [ref=e304]:
                - img [ref=e305]
                - img [ref=e306]
                - img [ref=e307]
                - img [ref=e308]
                - img [ref=e309]
          - article [ref=e311]:
            - generic [ref=e312]:
              - img "aktm********" [ref=e314]
              - paragraph [ref=e316]: 아주 잘쓰고있습니다.
            - generic [ref=e317]:
              - generic [ref=e318]:
                - img "aktm******** avatar" [ref=e319]
                - generic [ref=e320]:
                  - strong [ref=e321]: aktm********
                  - generic [ref=e322]: 2026-01-06
              - generic [ref=e323]:
                - img [ref=e324]
                - img [ref=e325]
                - img [ref=e326]
                - img [ref=e327]
                - img [ref=e328]
          - article [ref=e330]:
            - generic [ref=e331]:
              - img "jiwn****" [ref=e333]
              - paragraph [ref=e335]: 아 정말 너무 좋아연ㅎㅎ
            - generic [ref=e336]:
              - generic [ref=e337]:
                - img "jiwn**** avatar" [ref=e338]
                - generic [ref=e339]:
                  - strong [ref=e340]: jiwn****
                  - generic [ref=e341]: 2025-12-29
              - generic [ref=e342]:
                - img [ref=e343]
                - img [ref=e344]
                - img [ref=e345]
                - img [ref=e346]
                - img [ref=e347]
          - article [ref=e349]:
            - generic [ref=e350]:
              - img "koj3***" [ref=e352]
              - paragraph [ref=e354]: 방수도 잘되고 오염에도 잘 버티고 좋아요. 적극 추천합니다.^^
            - generic [ref=e355]:
              - generic [ref=e356]:
                - img "koj3*** avatar" [ref=e357]
                - generic [ref=e358]:
                  - strong [ref=e359]: koj3***
                  - generic [ref=e360]: 2025-12-24
              - generic [ref=e361]:
                - img [ref=e362]
                - img [ref=e363]
                - img [ref=e364]
                - img [ref=e365]
                - img [ref=e366]
          - article [ref=e368]:
            - generic [ref=e369]:
              - img "aktm********" [ref=e371]
              - paragraph [ref=e373]: 이쁘네요 잘쓸게요.!!
            - generic [ref=e374]:
              - generic [ref=e375]:
                - img "aktm******** avatar" [ref=e376]
                - generic [ref=e377]:
                  - strong [ref=e378]: aktm********
                  - generic [ref=e379]: 2025-12-03
              - generic [ref=e380]:
                - img [ref=e381]
                - img [ref=e382]
                - img [ref=e383]
                - img [ref=e384]
                - img [ref=e385]
          - article [ref=e387]:
            - generic [ref=e388]:
              - img "aktm********" [ref=e390]
              - paragraph [ref=e392]: 이쁘게 잘뽑혔네요.
            - generic [ref=e393]:
              - generic [ref=e394]:
                - img "aktm******** avatar" [ref=e395]
                - generic [ref=e396]:
                  - strong [ref=e397]: aktm********
                  - generic [ref=e398]: 2025-11-30
              - generic [ref=e399]:
                - img [ref=e400]
                - img [ref=e401]
                - img [ref=e402]
                - img [ref=e403]
                - img [ref=e404]
          - article [ref=e406]:
            - generic [ref=e407]:
              - img "circ*****" [ref=e409]
              - paragraph [ref=e411]: 품질도 좋고 응대도 잘해주셔서 이쁘게 나왔네요
            - generic [ref=e412]:
              - generic [ref=e413]:
                - img "circ***** avatar" [ref=e414]
                - generic [ref=e415]:
                  - strong [ref=e416]: circ*****
                  - generic [ref=e417]: 2025-11-20
              - generic [ref=e418]:
                - img [ref=e419]
                - img [ref=e420]
                - img [ref=e421]
                - img [ref=e422]
                - img [ref=e423]
          - article [ref=e425]:
            - generic [ref=e426]:
              - img "pina******" [ref=e428]
              - paragraph [ref=e430]: 부착 잘되고 제거할때 끈적임 없이 깔끔하게 떨어져서 좋아요
            - generic [ref=e431]:
              - generic [ref=e432]:
                - img "pina****** avatar" [ref=e433]
                - generic [ref=e434]:
                  - strong [ref=e435]: pina******
                  - generic [ref=e436]: 2025-08-22
              - generic [ref=e437]:
                - img [ref=e438]
                - img [ref=e439]
                - img [ref=e440]
                - img [ref=e441]
                - img [ref=e442]
          - article [ref=e444]:
            - generic [ref=e445]:
              - img "qcyc*****" [ref=e447]
              - paragraph [ref=e449]: 덕분에 넘넘 잘썼습니다
            - generic [ref=e450]:
              - generic [ref=e451]:
                - img "qcyc***** avatar" [ref=e452]
                - generic [ref=e453]:
                  - strong [ref=e454]: qcyc*****
                  - generic [ref=e455]: 2025-08-15
              - generic [ref=e456]:
                - img [ref=e457]
                - img [ref=e458]
                - img [ref=e459]
                - img [ref=e460]
                - img [ref=e461]
          - article [ref=e463]:
            - generic [ref=e464]:
              - img "rlad*******" [ref=e466]
              - paragraph [ref=e468]: 꼼꼼하게 체크해주셔서 너무좋았습니다!
            - generic [ref=e469]:
              - generic [ref=e470]:
                - img "rlad******* avatar" [ref=e471]
                - generic [ref=e472]:
                  - strong [ref=e473]: rlad*******
                  - generic [ref=e474]: 2025-07-17
              - generic [ref=e475]:
                - img [ref=e476]
                - img [ref=e477]
                - img [ref=e478]
                - img [ref=e479]
                - img [ref=e480]
          - article [ref=e482]:
            - generic [ref=e483]:
              - img "csbn*****" [ref=e485]
              - paragraph [ref=e487]: 배송도 빠르고 재질도 좋고 너무 좋아요 감사합니다!
            - generic [ref=e488]:
              - generic [ref=e489]:
                - img "csbn***** avatar" [ref=e490]
                - generic [ref=e491]:
                  - strong [ref=e492]: csbn*****
                  - generic [ref=e493]: 2025-07-14
              - generic [ref=e494]:
                - img [ref=e495]
                - img [ref=e496]
                - img [ref=e497]
                - img [ref=e498]
                - img [ref=e499]
      - generic [ref=e501]:
        - generic [ref=e502]:
          - img "text" [ref=e503]
          - generic [ref=e504]:
            - heading "원형 시트 스티커 FAQ" [level=2] [ref=e505]
            - paragraph [ref=e506]:
              - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
              - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e507] [cursor=pointer]:
                - /url: https://www.musticker.com/faq
              - text: .
        - generic [ref=e508]:
          - generic [ref=e509]:
            - generic [ref=e510] [cursor=pointer]:
              - heading "원형 시트 스티커란 무엇인가요?" [level=3] [ref=e511]
              - paragraph [ref=e514]: 원형 시트 스티커는 여러 개의 원형 스티커를 한 장의 시트에 배치해 제작하는 스티커입니다. 각 스티커는 키스컷 방식으로 제작되어 시트는 그대로 유지되며, 스티커를 한 장씩 쉽게 떼어 사용할 수 있습니다.
            - button [ref=e515] [cursor=pointer]:
              - img [ref=e516]
          - generic [ref=e518]:
            - generic [ref=e519] [cursor=pointer]:
              - heading "원형 시트 스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e520]
              - paragraph [ref=e521]: 네. 머스티커의 원형 시트 스티커는 방수 기능이 있는 PVC 소재로 제작됩니다. 둥근 형태로 가장자리가 깔끔하게 마감되어 다양한 용도로 편리하게 사용할 수 있습니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요.
            - button [ref=e522] [cursor=pointer]:
              - img [ref=e523]
          - generic [ref=e525]:
            - generic [ref=e526] [cursor=pointer]:
              - heading "한 장의 시트에 여러 가지 원형 디자인을 넣을 수 있나요?" [level=3] [ref=e527]
              - paragraph [ref=e528]: 아니요. 원형 시트 스티커는 하나의 디자인이 시트 전체에 반복 배치되어 제작됩니다. 모든 스티커가 동일한 크기와 간격으로 배치되어 깔끔하게 제작됩니다.
            - button [ref=e529] [cursor=pointer]:
              - img [ref=e530]
          - generic [ref=e532]:
            - generic [ref=e533] [cursor=pointer]:
              - heading "원형 스티커는 정확한 원형으로 제작되나요?" [level=3] [ref=e534]
              - paragraph [ref=e535]: 네. 모든 원형 스티커는 깔끔한 원형으로 제작됩니다. 디자인이 중앙에 맞게 배치되어 좌우 균형이 잘 잡힌 형태로 완성됩니다.
            - button [ref=e536] [cursor=pointer]:
              - img [ref=e537]
          - generic [ref=e539]:
            - generic [ref=e540] [cursor=pointer]:
              - heading "원형 시트 스티커는 어떤 소재를 선택할 수 있나요?" [level=3] [ref=e541]
              - paragraph [ref=e542]: 원형 시트 스티커는 PVC(백색), 투명, 홀로그램 소재로 제작할 수 있습니다. 선명한 색감을 원한다면 PVC(백색), 깔끔하고 자연스러운 느낌을 원한다면 투명, 반짝이는 효과를 원한다면 홀로그램을 추천합니다.
            - button [ref=e543] [cursor=pointer]:
              - img [ref=e544]
        - generic [ref=e546]:
          - generic [ref=e547]:
            - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e548]
            - paragraph [ref=e549]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
          - button "문의하기" [ref=e550] [cursor=pointer]:
            - generic [ref=e551]: 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e552]:
      - link "카카오채널로 문의하기" [ref=e553] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e555]
      - link "네이버 톡톡 으로 문의하기" [ref=e556] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e558]
      - button "이메일로 문의하기" [ref=e559] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e561]
  - contentinfo [ref=e562]:
    - generic [ref=e563]:
      - generic [ref=e564]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e565]
        - paragraph [ref=e566]: "상호명: (주)글로픽스"
        - paragraph [ref=e567]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e568]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e569]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e570]:
          - generic [ref=e571]: ⓒ 2026. All rights reserved.
          - generic [ref=e572]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e573] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e574] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - button "사업자정보확인" [ref=e575] [cursor=pointer]
          - link "오픈소스 라이선스" [ref=e576] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e577] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e578]:
        - paragraph [ref=e579]: 1899-5529
        - paragraph [ref=e581]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e582]:
          - button "1:1문의하기" [ref=e583] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e584] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e585]:
          - generic [ref=e586]: "Follow us at:"
          - generic [ref=e587]:
            - link "instagram icon" [ref=e588] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e589] [cursor=pointer]:
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
  54  |     await this.optionsPanel.getByRole('button', { name: new RegExp(escapeRegExp(sizeName)) }).first().click();
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
> 75  |     await this.optionsPanel.getByRole('button', { name: quantityLabel }).first().click();
      |                                                                                  ^ Error: locator.click: Test timeout of 60000ms exceeded.
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
  155 |     const price = this.quantityTier(quantity).locator('.qty-pill-price');
  156 | 
  157 |     await expect(price).toBeVisible({ timeout: 20_000 });
  158 |     await expect(price, 'quantity tier is still unpriced -- the pricing call has not landed').not.toHaveText('0원', {
  159 |       timeout: 20_000
  160 |     });
  161 | 
  162 |     return parseWon(await price.innerText());
  163 |   }
  164 | 
  165 |   private quantityTier(quantity: number): Locator {
  166 |     const quantityLabel = new RegExp(
  167 |       `^${quantity.toLocaleString('en-US')}\\s*(?:\\S+)?\\s*${wonAmountPattern.source}`,
  168 |       'u'
  169 |     );
  170 | 
  171 |     return this.optionsPanel.getByRole('button', { name: quantityLabel }).first();
  172 |   }
  173 | 
  174 |   async expectVisiblePrice(): Promise<void> {
  175 |     await expect(this.optionsPanel.getByText(wonAmountPattern).last()).toBeVisible();
```