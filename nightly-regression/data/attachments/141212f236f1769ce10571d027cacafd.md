# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchasing/sheet-sticker-size-rules.spec.ts >> storefront v2 sheet sticker size rules (minimum two stickers per sheet) >> MS-V2-078 circle sheet sticker: 200x300 packs 0 per sheet and is refused
- Location: tests/e2e/purchasing/sheet-sticker-size-rules.spec.ts:89:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: '원형 시트 스티커', exact: true }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: '원형 시트 스티커', exact: true }).first()

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
        - link "판스티커" [ref=e46] [cursor=pointer]:
          - /url: /kr/sheet-stickers
  - main [ref=e47]:
    - generic [ref=e48]:
      - generic [ref=e50]:
        - generic:
          - navigation:
            - link "자유형 판스티커 자유형 판스티커":
              - /url: /kr/sheet-stickers/die-cut-sheet
              - generic:
                - img "자유형 판스티커"
              - generic:
                - heading "자유형 판스티커" [level=4]
            - link "원형 판스티커 원형 판스티커":
              - /url: /kr/sheet-stickers/circle-sheet
              - generic:
                - img "원형 판스티커"
              - generic:
                - heading "원형 판스티커" [level=4]
            - link "타원형 판스티커 타원형 판스티커":
              - /url: /kr/sheet-stickers/oval-sheet
              - generic:
                - img "타원형 판스티커"
              - generic:
                - heading "타원형 판스티커" [level=4]
            - link "정사각형 판스티커 정사각형 판스티커":
              - /url: /kr/sheet-stickers/square-sheet
              - generic:
                - img "정사각형 판스티커"
              - generic:
                - heading "정사각형 판스티커" [level=4]
            - link "직사각형 판스티커 직사각형 판스티커":
              - /url: /kr/sheet-stickers/rectangle-sheet
              - generic:
                - img "직사각형 판스티커"
              - generic:
                - heading "직사각형 판스티커" [level=4]
            - link "둥근 사각 판스티커 둥근 사각 판스티커":
              - /url: /kr/sheet-stickers/rounded-sheet
              - generic:
                - img "둥근 사각 판스티커"
              - generic:
                - heading "둥근 사각 판스티커" [level=4]
        - generic [ref=e53]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - heading "원형 판스티커" [level=1] [ref=e58]
              - paragraph [ref=e59]: 사용과 보관이 편리하도록 시트 한 장에 담긴 원형 판스티커
            - img "원형 판스티커 preview poster" [ref=e61]
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
                - button "PVC 매트" [ref=e86] [cursor=pointer]:
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
                    - paragraph [ref=e113]: 원하는 크기 입력
                  - generic [ref=e114]: "주문 가능 크기: 10-200mm"
            - generic [ref=e115]:
              - heading "수량을 선택하세요" [level=3] [ref=e116]
              - generic [ref=e117]:
                - button "5시트 3,450원" [ref=e118] [cursor=pointer]:
                  - generic [ref=e119]: 5시트
                  - generic [ref=e120]: 3,450원
                - button "10시트 6,600원" [ref=e121] [cursor=pointer]:
                  - generic [ref=e122]: 10시트
                  - generic [ref=e123]: 6,600원
                - button "20시트 12,800원" [ref=e124] [cursor=pointer]:
                  - generic [ref=e125]: 20시트
                  - generic [ref=e126]: 12,800원
                - button "50시트 31,000원" [ref=e127] [cursor=pointer]:
                  - generic [ref=e128]: 50시트
                  - generic [ref=e129]: 31,000원
                - button "100시트 60,600원" [ref=e130] [cursor=pointer]:
                  - generic [ref=e131]: 100시트
                  - generic [ref=e132]: 60,600원
                - button "200시트 105,300원" [ref=e133] [cursor=pointer]:
                  - generic [ref=e134]: 200시트
                  - generic [ref=e135]: 105,300원
                - button "500시트 185,000원" [ref=e136] [cursor=pointer]:
                  - generic [ref=e137]: 500시트
                  - generic [ref=e138]: 185,000원
                - button "1,000시트 250,000원" [ref=e139] [cursor=pointer]:
                  - generic [ref=e140]: 1,000시트
                  - generic [ref=e141]: 250,000원
                - 'button "원하는 수량 입력 주문 가능 수량: 5-1,000시트" [ref=e142] [cursor=pointer]':
                  - generic [ref=e143]:
                    - img [ref=e144]
                    - paragraph [ref=e146]: 원하는 수량 입력
                  - generic [ref=e147]: "주문 가능 수량: 5-1,000시트"
            - region "Sheet summary" [ref=e148]:
              - img "A5 sheet" [ref=e149]
              - generic [ref=e150]:
                - paragraph [ref=e151]: 1시트 = 스티커 20개
                - paragraph [ref=e152]: "총 스티커 수량 : 100개"
            - generic [ref=e155]:
              - paragraph [ref=e157]:
                - strong [ref=e158]: 3,450원
              - paragraph [ref=e159]: (1시트당 690원)
            - generic [ref=e160]:
              - button "다음 단계" [ref=e161] [cursor=pointer]:
                - generic [ref=e162]: 다음 단계
              - generic [ref=e163]:
                - paragraph [ref=e164]: 스티커는 A5 시트(148×210mm)에 인쇄됩니다. 아래 가이드를 통해 사이즈별 배치 수량을 확인하고, 가장 적합한 옵션을 선택해 보세요.
                - generic [ref=e166] [cursor=pointer]:
                  - generic [ref=e167]: 배치 가이드 보기
                  - img [ref=e168]
            - list [ref=e171]:
              - listitem [ref=e172]: 5만원 이상 무료배송
              - listitem [ref=e173]: 12시 이전 시안 확정 시 당일배송
              - listitem [ref=e174]: "발송 예정일: 09.28 (월) · CJ 대한통운"
              - listitem [ref=e175]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
      - generic [ref=e177]:
        - article [ref=e178]:
          - img "오늘제작, 내일발송" [ref=e179]
          - heading "오늘제작, 내일발송" [level=4] [ref=e180]
          - paragraph [ref=e181]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
        - article [ref=e182]:
          - img "빠른 시안 피드백" [ref=e183]
          - heading "빠른 시안 피드백" [level=4] [ref=e184]
          - paragraph [ref=e185]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
        - article [ref=e186]:
          - img "빠르고 간편한 부착" [ref=e187]
          - heading "빠르고 간편한 부착" [level=4] [ref=e188]
          - paragraph [ref=e189]: 스티커가 시트에서 쉽게 떼어져 원하는 곳에 빠르고 간편하게 부착할 수 있습니다.
      - generic [ref=e191]:
        - article [ref=e192]:
          - generic [ref=e195]:
            - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e196]
            - paragraph [ref=e197]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
        - article [ref=e198]:
          - generic [ref=e201]:
            - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e202]
            - paragraph [ref=e203]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
        - article [ref=e204]:
          - generic [ref=e207]:
            - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e208]
            - paragraph [ref=e209]: 로고, 일러스트, 사진을 업로드하면 칼선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
      - generic [ref=e211]:
        - generic [ref=e212]:
          - generic [ref=e213]:
            - generic [ref=e214]: 좋아요 😀
            - img "5 out of 5" [ref=e215]:
              - img [ref=e216]
              - img [ref=e218]
              - img [ref=e220]
              - img [ref=e222]
              - img [ref=e224]
            - generic [ref=e226]: "5.0"
          - heading "234개 사진 후기가 보장해요" [level=2] [ref=e227]
          - paragraph [ref=e228]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
          - generic [ref=e229]:
            - button "이전 리뷰" [ref=e230] [cursor=pointer]:
              - img [ref=e231]
              - generic [ref=e233]: 이전 리뷰
            - button "다음 리뷰" [ref=e234] [cursor=pointer]:
              - img [ref=e235]
              - generic [ref=e237]: 다음 리뷰
        - generic [ref=e239]:
          - article [ref=e241]:
            - generic [ref=e242]:
              - img "홍승일" [ref=e244]
              - paragraph [ref=e246]: 제품 깔끔하게 잘 나왔고 바로 다음날 배송이 되어서 너무 만족스러웠습니다
            - generic [ref=e247]:
              - generic [ref=e248]:
                - generic [ref=e249]: 홍
                - generic [ref=e250]:
                  - strong [ref=e251]: 홍승일
                  - generic [ref=e252]: 2026-09-15
              - generic [ref=e253]:
                - img [ref=e254]
                - img [ref=e256]
                - img [ref=e258]
                - img [ref=e260]
                - img [ref=e262]
          - article [ref=e265]:
            - generic [ref=e266]:
              - img "이지영" [ref=e268]
              - paragraph [ref=e270]: 첫 스티커 제작이었는데, 굉장히 만족합니다. 다음에 제작 의뢰할 때에는 더 잘할 수 있을 것 같아요!
            - generic [ref=e271]:
              - generic [ref=e272]:
                - generic [ref=e273]: 이
                - generic [ref=e274]:
                  - strong [ref=e275]: 이지영
                  - generic [ref=e276]: 2026-09-14
              - generic [ref=e277]:
                - img [ref=e278]
                - img [ref=e280]
                - img [ref=e282]
                - img [ref=e284]
                - img [ref=e286]
          - article [ref=e289]:
            - generic [ref=e290]:
              - img "권민정" [ref=e292]
              - paragraph [ref=e294]: 급하게 필요해서 주문했던 스티커인데 친절하게 잘 응대해주시고 스티커도 너무 이쁘게 나와서 맘에 쏙 들었어요. 다음에 또 이용할께요.
            - generic [ref=e295]:
              - generic [ref=e296]:
                - generic [ref=e297]: 권
                - generic [ref=e298]:
                  - strong [ref=e299]: 권민정
                  - generic [ref=e300]: 2026-09-11
              - generic [ref=e301]:
                - img [ref=e302]
                - img [ref=e304]
                - img [ref=e306]
                - img [ref=e308]
                - img [ref=e310]
          - article [ref=e313]:
            - generic [ref=e314]:
              - img "허준회" [ref=e316]
              - paragraph [ref=e318]: 대만족
            - generic [ref=e319]:
              - generic [ref=e320]:
                - generic [ref=e321]: 허
                - generic [ref=e322]:
                  - strong [ref=e323]: 허준회
                  - generic [ref=e324]: 2026-09-11
              - generic [ref=e325]:
                - img [ref=e326]
                - img [ref=e328]
                - img [ref=e330]
                - img [ref=e332]
                - img [ref=e334]
          - article [ref=e337]:
            - generic [ref=e338]:
              - img "이승범" [ref=e340]
              - paragraph [ref=e342]: 예쁘게 튼튼하게 잘 만들어주셔써요 !!
            - generic [ref=e343]:
              - generic [ref=e344]:
                - generic [ref=e345]: 이
                - generic [ref=e346]:
                  - strong [ref=e347]: 이승범
                  - generic [ref=e348]: 2026-09-10
              - generic [ref=e349]:
                - img [ref=e350]
                - img [ref=e352]
                - img [ref=e354]
                - img [ref=e356]
                - img [ref=e358]
          - article [ref=e361]:
            - generic [ref=e362]:
              - img "이지유" [ref=e364]
              - paragraph [ref=e366]: 원하는 디자인으로 잘 제작해주고 제작 및 배송도 빨라서 좋았습니다.
            - generic [ref=e367]:
              - generic [ref=e368]:
                - generic [ref=e369]: 이
                - generic [ref=e370]:
                  - strong [ref=e371]: 이지유
                  - generic [ref=e372]: 2026-09-10
              - generic [ref=e373]:
                - img [ref=e374]
                - img [ref=e376]
                - img [ref=e378]
                - img [ref=e380]
                - img [ref=e382]
          - article [ref=e385]:
            - generic [ref=e386]:
              - img "김민수" [ref=e388]
              - paragraph [ref=e390]: 퀼리티 짱!
            - generic [ref=e391]:
              - generic [ref=e392]:
                - generic [ref=e393]: 김
                - generic [ref=e394]:
                  - strong [ref=e395]: 김민수
                  - generic [ref=e396]: 2026-09-09
              - generic [ref=e397]:
                - img [ref=e398]
                - img [ref=e400]
                - img [ref=e402]
                - img [ref=e404]
                - img [ref=e406]
          - article [ref=e409]:
            - generic [ref=e410]:
              - img "우상엽" [ref=e412]
              - paragraph [ref=e414]: 좋아요 퀄리티도 좋고.
            - generic [ref=e415]:
              - generic [ref=e416]:
                - generic [ref=e417]: 우
                - generic [ref=e418]:
                  - strong [ref=e419]: 우상엽
                  - generic [ref=e420]: 2026-09-09
              - generic [ref=e421]:
                - img [ref=e422]
                - img [ref=e424]
                - img [ref=e426]
                - img [ref=e428]
                - img [ref=e430]
          - article [ref=e433]:
            - generic [ref=e434]:
              - img "강동U1 센터" [ref=e436]
              - paragraph [ref=e438]: 작고 앙증맞아요. 감사합니다.
            - generic [ref=e439]:
              - generic [ref=e440]:
                - generic [ref=e441]: 강
                - generic [ref=e442]:
                  - strong [ref=e443]: 강동U1 센터
                  - generic [ref=e444]: 2026-09-09
              - generic [ref=e445]:
                - img [ref=e446]
                - img [ref=e448]
                - img [ref=e450]
                - img [ref=e452]
                - img [ref=e454]
          - article [ref=e457]:
            - generic [ref=e458]:
              - img "tkop****" [ref=e460]
              - paragraph [ref=e462]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
            - generic [ref=e463]:
              - generic [ref=e464]:
                - img "tkop**** avatar" [ref=e465]
                - generic [ref=e466]:
                  - strong [ref=e467]: tkop****
                  - generic [ref=e468]: 2026-03-25
              - generic [ref=e469]:
                - img [ref=e470]
                - img [ref=e472]
                - img [ref=e474]
                - img [ref=e476]
                - img [ref=e478]
          - article [ref=e481]:
            - generic [ref=e482]:
              - img "oozz******" [ref=e484]
              - paragraph [ref=e486]: 잘나와서 만족합니다 잘쓰겠습니다
            - generic [ref=e487]:
              - generic [ref=e488]:
                - img "oozz****** avatar" [ref=e489]
                - generic [ref=e490]:
                  - strong [ref=e491]: oozz******
                  - generic [ref=e492]: 2026-03-22
              - generic [ref=e493]:
                - img [ref=e494]
                - img [ref=e496]
                - img [ref=e498]
                - img [ref=e500]
                - img [ref=e502]
          - article [ref=e505]:
            - generic [ref=e506]:
              - img "aktm********" [ref=e508]
              - paragraph [ref=e510]: 만족하면서 사용중입니다
            - generic [ref=e511]:
              - generic [ref=e512]:
                - img "aktm******** avatar" [ref=e513]
                - generic [ref=e514]:
                  - strong [ref=e515]: aktm********
                  - generic [ref=e516]: 2026-03-04
              - generic [ref=e517]:
                - img [ref=e518]
                - img [ref=e520]
                - img [ref=e522]
                - img [ref=e524]
                - img [ref=e526]
          - article [ref=e529]:
            - generic [ref=e530]:
              - img "aktm********" [ref=e532]
              - paragraph [ref=e534]: 잘 받았어요 잘쓸게요.
            - generic [ref=e535]:
              - generic [ref=e536]:
                - img "aktm******** avatar" [ref=e537]
                - generic [ref=e538]:
                  - strong [ref=e539]: aktm********
                  - generic [ref=e540]: 2026-01-31
              - generic [ref=e541]:
                - img [ref=e542]
                - img [ref=e544]
                - img [ref=e546]
                - img [ref=e548]
                - img [ref=e550]
          - article [ref=e553]:
            - generic [ref=e554]:
              - img "aktm********" [ref=e556]
              - paragraph [ref=e558]: 아주 잘쓰고있습니다.
            - generic [ref=e559]:
              - generic [ref=e560]:
                - img "aktm******** avatar" [ref=e561]
                - generic [ref=e562]:
                  - strong [ref=e563]: aktm********
                  - generic [ref=e564]: 2026-01-06
              - generic [ref=e565]:
                - img [ref=e566]
                - img [ref=e568]
                - img [ref=e570]
                - img [ref=e572]
                - img [ref=e574]
          - article [ref=e577]:
            - generic [ref=e578]:
              - img "aktm********" [ref=e580]
              - paragraph [ref=e582]: 아주 잘쓰고있습니다.
            - generic [ref=e583]:
              - generic [ref=e584]:
                - img "aktm******** avatar" [ref=e585]
                - generic [ref=e586]:
                  - strong [ref=e587]: aktm********
                  - generic [ref=e588]: 2026-01-06
              - generic [ref=e589]:
                - img [ref=e590]
                - img [ref=e592]
                - img [ref=e594]
                - img [ref=e596]
                - img [ref=e598]
          - article [ref=e601]:
            - generic [ref=e602]:
              - img "jiwn****" [ref=e604]
              - paragraph [ref=e606]: 아 정말 너무 좋아연ㅎㅎ
            - generic [ref=e607]:
              - generic [ref=e608]:
                - img "jiwn**** avatar" [ref=e609]
                - generic [ref=e610]:
                  - strong [ref=e611]: jiwn****
                  - generic [ref=e612]: 2025-12-29
              - generic [ref=e613]:
                - img [ref=e614]
                - img [ref=e616]
                - img [ref=e618]
                - img [ref=e620]
                - img [ref=e622]
      - generic [ref=e625]:
        - generic [ref=e626]:
          - img "text" [ref=e627]
          - generic [ref=e628]:
            - heading "원형 판스티커 FAQ" [level=2] [ref=e629]
            - paragraph [ref=e630]:
              - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
              - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e631] [cursor=pointer]:
                - /url: https://www.musticker.com/faq
              - text: .
        - generic [ref=e632]:
          - generic [ref=e633]:
            - generic [ref=e634] [cursor=pointer]:
              - heading "원형 시트 스티커란 무엇인가요?" [level=3] [ref=e635]
              - paragraph [ref=e638]: 원형 시트 스티커는 여러 개의 원형 스티커를 한 장의 시트에 배치해 제작하는 스티커입니다. 각 스티커는 키스컷 방식으로 제작되어 시트는 그대로 유지되며, 스티커를 한 장씩 쉽게 떼어 사용할 수 있습니다.
            - button [ref=e639] [cursor=pointer]:
              - img [ref=e640]
          - generic [ref=e642]:
            - generic [ref=e643] [cursor=pointer]:
              - heading "원형 시트 스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e644]
              - paragraph [ref=e645]: 네. 머스티커의 원형 시트 스티커는 방수 기능이 있는 PVC 소재로 제작됩니다. 둥근 형태로 가장자리가 깔끔하게 마감되어 다양한 용도로 편리하게 사용할 수 있습니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요.
            - button [ref=e646] [cursor=pointer]:
              - img [ref=e647]
          - generic [ref=e649]:
            - generic [ref=e650] [cursor=pointer]:
              - heading "한 장의 시트에 여러 가지 원형 디자인을 넣을 수 있나요?" [level=3] [ref=e651]
              - paragraph [ref=e652]: 아니요. 원형 시트 스티커는 하나의 디자인이 시트 전체에 반복 배치되어 제작됩니다. 모든 스티커가 동일한 크기와 간격으로 배치되어 깔끔하게 제작됩니다.
            - button [ref=e653] [cursor=pointer]:
              - img [ref=e654]
          - generic [ref=e656]:
            - generic [ref=e657] [cursor=pointer]:
              - heading "원형 스티커는 정확한 원형으로 제작되나요?" [level=3] [ref=e658]
              - paragraph [ref=e659]: 네. 모든 원형 스티커는 깔끔한 원형으로 제작됩니다. 디자인이 중앙에 맞게 배치되어 좌우 균형이 잘 잡힌 형태로 완성됩니다.
            - button [ref=e660] [cursor=pointer]:
              - img [ref=e661]
          - generic [ref=e663]:
            - generic [ref=e664] [cursor=pointer]:
              - heading "원형 시트 스티커는 어떤 소재를 선택할 수 있나요?" [level=3] [ref=e665]
              - paragraph [ref=e666]: 원형 시트 스티커는 PVC(백색), 투명, 홀로그램 소재로 제작할 수 있습니다. 선명한 색감을 원한다면 PVC(백색), 깔끔하고 자연스러운 느낌을 원한다면 투명, 반짝이는 효과를 원한다면 홀로그램을 추천합니다.
            - button [ref=e667] [cursor=pointer]:
              - img [ref=e668]
        - generic [ref=e670]:
          - generic [ref=e671]:
            - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e672]
            - paragraph [ref=e673]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
          - button "문의하기" [ref=e674] [cursor=pointer]:
            - generic [ref=e675]: 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e676]:
      - link "카카오채널로 문의하기" [ref=e677] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e679]
      - link "네이버 톡톡 으로 문의하기" [ref=e680] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e682]
      - button "이메일로 문의하기" [ref=e683] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e685]
  - contentinfo [ref=e686]:
    - generic [ref=e687]:
      - generic [ref=e688]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e689]
        - paragraph [ref=e690]: "상호명: (주)글로픽스"
        - paragraph [ref=e691]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e692]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e693]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e694]:
          - generic [ref=e695]: ⓒ 2026. All rights reserved.
          - generic [ref=e696]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e697] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e698] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - button "사업자정보확인" [ref=e699] [cursor=pointer]
          - link "오픈소스 라이선스" [ref=e700] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e701] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e702]:
        - paragraph [ref=e703]: 1899-5529
        - paragraph [ref=e705]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e706]:
          - button "1:1문의하기" [ref=e707] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e708] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e709]:
          - generic [ref=e710]: "Follow us at:"
          - generic [ref=e711]:
            - link "instagram icon" [ref=e712] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e713] [cursor=pointer]:
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
> 25  |     await expect(this.page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
      |                                                                                          ^ Error: expect(locator).toBeVisible() failed
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
```