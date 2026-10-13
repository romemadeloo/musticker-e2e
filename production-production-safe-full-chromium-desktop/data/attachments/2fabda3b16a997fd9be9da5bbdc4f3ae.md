# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/purchasing/sheet-sticker-configurator.spec.ts >> storefront v2 sheet sticker configurator (circle/oval/square/rectangle/rounded) >> MS-V2-050 직사각형 판스티커 supports material, size, and quantity selection through to cart
- Location: tests/e2e/storefront/purchasing/sheet-sticker-configurator.spec.ts:41:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('dialog').getByTestId('product-category-upload-dropzone')
Expected substring: ".eps, .ai, .psd, .pdf, .tif, .png"
Received string:    "파일을 여기로 드래그하세요ai · psd · pdf · eps · tif · png · jpg+ 파일 선택하기"
Timeout: 10000ms

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for getByRole('dialog').getByTestId('product-category-upload-dropzone')
    14 × locator resolved to <div data-v-ab595f88="" class="upload-dropzone" data-testid="product-category-upload-dropzone">…</div>
       - unexpected value "파일을 여기로 드래그하세요ai · psd · pdf · eps · tif · png · jpg+ 파일 선택하기"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - dialog "어떻게 주문하시겠어요?" [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - img [ref=e6]
        - heading "어떻게 주문하시겠어요?" [level=3] [ref=e7]
      - button "모달 닫기" [active] [ref=e9] [cursor=pointer]:
        - img [ref=e11]
    - generic [ref=e14]:
      - region "파일 업로드하기" [ref=e15]:
        - generic [ref=e17]:
          - heading "파일 업로드하기" [level=3] [ref=e18]
          - paragraph [ref=e19]: 내가 가진 디자인 파일로 주문하기
        - generic [ref=e20]:
          - img [ref=e21]
          - generic [ref=e26]:
            - paragraph [ref=e27]: 파일을 여기로 드래그하세요
            - paragraph [ref=e28]: ai · psd · pdf · eps · tif · png · jpg
          - button "+ 파일 선택하기" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - generic [ref=e31]: 기타 요청 사항 (옵션)
          - textbox "기타 요청 사항 (옵션)" [ref=e33]:
            - /placeholder: 여기에 상세 주문 요청 사항을 입력해 주세요
        - button "파일로 주문하기" [ref=e34] [cursor=pointer]:
          - img [ref=e35]
          - text: 파일로 주문하기
      - generic [ref=e41]: 또는
      - region "간편하게 디자인하기" [ref=e43]:
        - generic:
          - generic: 이 방법으로 주문하면
          - generic: 5% 추가 할인
        - generic [ref=e45]:
          - heading "간편하게 디자인하기" [level=3] [ref=e46]
          - paragraph [ref=e47]: 별도 시안 제작 및 승인 없이 바로 제작을 시작해 더 빨리 받아보실 수 있어요.
          - paragraph [ref=e48]: PDF · AI · PNG · JPG · SVG도 웹에서 바로 편집
        - img "웹 스튜디오에서 자유형 조각스티커를 자유롭게 디자인해 보세요." [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e51]:
              - img [ref=e61]
              - generic [ref=e63]:
                - generic [ref=e64]:
                  - generic [ref=e65]:
                    - generic [ref=e66]:
                      - img
                      - img
                      - generic [ref=e68]:
                        - img [ref=e69]
                        - generic [ref=e71]: 배경 제거 중
                    - generic [ref=e72]:
                      - generic [ref=e73]: 55mm
                      - generic [ref=e74]: 90mm
                  - generic [ref=e79]:
                    - generic [ref=e80]:
                      - img
                      - img
                      - img
                      - img
                      - generic [ref=e82]: ❤️박서아❤️
                      - generic [ref=e86]:
                        - img [ref=e87]
                        - generic [ref=e89]: 배경 제거 중
                    - generic [ref=e90]:
                      - generic [ref=e91]: 90mm
                      - generic [ref=e92]: 88mm
                - generic [ref=e102]:
                  - img [ref=e103]
                  - img [ref=e105]
            - generic [ref=e117]: T
        - button "스튜디오 이동" [ref=e139] [cursor=pointer]:
          - img [ref=e140]
          - text: 스튜디오 이동
      - generic [ref=e142]:
        - button "이 단계를 건너뛰고 나중에 파일 보내기" [ref=e143] [cursor=pointer]:
          - img [ref=e144]
          - generic [ref=e147]: 이 단계를 건너뛰고 나중에 파일 보내기
        - generic [ref=e148]: 주문을 먼저 접수하고 이메일·카카오톡으로 보내셔도 됩니다.
  - generic [ref=e150]:
    - banner [ref=e151]:
      - generic [ref=e152]:
        - generic [ref=e153]:
          - link "Musticker" [ref=e154] [cursor=pointer]:
            - /url: /kr
            - img "musticker logo" [ref=e155]
          - generic [ref=e156]:
            - button "공지사항 열기" [ref=e158] [cursor=pointer]:
              - img [ref=e160]
            - button "layout.header.search" [ref=e162] [cursor=pointer]:
              - img [ref=e163]
            - button "장바구니" [ref=e166] [cursor=pointer]:
              - img [ref=e167]
            - button "계정" [ref=e170] [cursor=pointer]:
              - img [ref=e172]
        - navigation "Primary":
          - link "스티커" [ref=e174] [cursor=pointer]:
            - /url: /kr/stickers
          - link "롤스티커" [ref=e175] [cursor=pointer]:
            - /url: /kr/roll-stickers
          - link "판스티커" [ref=e176] [cursor=pointer]:
            - /url: /kr/sheet-stickers
    - main [ref=e177]:
      - generic [ref=e178]:
        - generic [ref=e180]:
          - generic:
            - button:
              - img
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
          - generic [ref=e183]:
            - generic [ref=e186]:
              - generic [ref=e187]:
                - heading "직사각형 판스티커" [level=1] [ref=e188]
                - paragraph [ref=e189]: 한 장의 시트에 정돈되어 라벨링 작업에 효율적인 직사각형 판스티커
              - img "직사각형 판스티커 preview poster" [ref=e191]
              - generic [ref=e193]:
                - button "소형 40x20 product.sizes.small40x20.label 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!" [ref=e194] [cursor=pointer]:
                  - heading "소형 40x20" [level=4] [ref=e195]
                  - img "product.sizes.small40x20.label" [ref=e196]
                  - paragraph [ref=e197]: 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!
                - button "중형 50x30 product.sizes.medium50x30.label 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요." [ref=e198] [cursor=pointer]:
                  - heading "중형 50x30" [level=4] [ref=e199]
                  - img "product.sizes.medium50x30.label" [ref=e200]
                  - paragraph [ref=e201]: 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요.
                - button "대형 75x50 product.sizes.large75x50.label 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요." [ref=e202] [cursor=pointer]:
                  - heading "대형 75x50" [level=4] [ref=e203]
                  - img "product.sizes.large75x50.label" [ref=e204]
                  - paragraph [ref=e205]: 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요.
                - button "초대형 90x60 product.sizes.extraLarge90x60.label 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요." [ref=e206] [cursor=pointer]:
                  - heading "초대형 90x60" [level=4] [ref=e207]
                  - img "product.sizes.extraLarge90x60.label" [ref=e208]
                  - paragraph [ref=e209]: 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요.
            - complementary [ref=e212]:
              - generic [ref=e213]:
                - generic [ref=e214]:
                  - heading "원하시는 소재를 선택하세요" [level=3] [ref=e215]
                  - button "판스티커 소재 안내 열기" [ref=e216] [cursor=pointer]:
                    - img [ref=e217]
                - generic [ref=e219]:
                  - button "무광 화이트" [ref=e220] [cursor=pointer]:
                    - paragraph [ref=e221]: 무광 화이트
                  - button "투명" [ref=e222] [cursor=pointer]:
                    - paragraph [ref=e223]: 투명
                  - button "홀로그램" [ref=e224] [cursor=pointer]:
                    - paragraph [ref=e225]: 홀로그램
              - generic [ref=e226]:
                - generic [ref=e227]:
                  - heading "개별 스티커 사이즈를 선택하세요" [level=3] [ref=e228]
                  - generic [ref=e229]: (단위:mm)
                - generic [ref=e230]:
                  - button "소형 40x20" [ref=e231] [cursor=pointer]:
                    - generic [ref=e232]: 소형
                    - generic [ref=e233]: 40x20
                  - button "중형 50x30" [ref=e234] [cursor=pointer]:
                    - generic [ref=e235]: 중형
                    - generic [ref=e236]: 50x30
                  - button "대형 75x50" [ref=e237] [cursor=pointer]:
                    - generic [ref=e238]: 대형
                    - generic [ref=e239]: 75x50
                  - button "초대형 90x60" [ref=e240] [cursor=pointer]:
                    - generic [ref=e241]: 초대형
                    - generic [ref=e242]: 90x60
                  - 'button "원하는 크기 입력 주문 가능 크기: 10-200mm" [ref=e243] [cursor=pointer]':
                    - generic [ref=e244]:
                      - img [ref=e245]
                      - paragraph [ref=e247]: 원하는 크기 입력
                    - generic [ref=e248]: "주문 가능 크기: 10-200mm"
              - generic [ref=e249]:
                - heading "수량을 선택하세요" [level=3] [ref=e250]
                - generic [ref=e251]:
                  - button "10시트 6,100원" [ref=e252] [cursor=pointer]:
                    - generic [ref=e253]: 10시트
                    - generic [ref=e254]: 6,100원
                  - button "20시트 11,730원" [ref=e255] [cursor=pointer]:
                    - generic [ref=e256]: 20시트
                    - generic [ref=e257]: 11,730원
                  - button "50시트 27,200원" [ref=e258] [cursor=pointer]:
                    - generic [ref=e259]: 50시트
                    - generic [ref=e260]: 27,200원
                  - button "100시트 53,110원" [ref=e261] [cursor=pointer]:
                    - generic [ref=e262]: 100시트
                    - generic [ref=e263]: 53,110원
                  - button "200시트 101,200원" [ref=e264] [cursor=pointer]:
                    - generic [ref=e265]: 200시트
                    - generic [ref=e266]: 101,200원
                  - button "500시트 193,970원" [ref=e267] [cursor=pointer]:
                    - generic [ref=e268]: 500시트
                    - generic [ref=e269]: 193,970원
                  - button "1,000시트 315,330원" [ref=e270] [cursor=pointer]:
                    - generic [ref=e271]: 1,000시트
                    - generic [ref=e272]: 315,330원
                  - 'button "원하는 수량 입력 주문 가능 수량: 5-1,000시트" [ref=e273] [cursor=pointer]':
                    - generic [ref=e274]:
                      - img [ref=e275]
                      - paragraph [ref=e277]: 원하는 수량 입력
                    - generic [ref=e278]: "주문 가능 수량: 5-1,000시트"
              - region "Sheet summary" [ref=e279]:
                - img "A5 sheet" [ref=e280]
                - generic [ref=e281]:
                  - paragraph [ref=e282]: 1시트 = 스티커 10개
                  - paragraph [ref=e283]: "총 스티커 수량 : 200개"
              - generic [ref=e286]:
                - generic [ref=e287]:
                  - paragraph [ref=e288]:
                    - generic [ref=e289]: "-6%"
                    - generic [ref=e290]: 12,520원
                  - paragraph [ref=e291]:
                    - strong [ref=e292]: 11,730원
                - paragraph [ref=e293]: (1시트당 586.5원)
              - generic [ref=e294]:
                - button "다음 단계" [ref=e295] [cursor=pointer]:
                  - generic [ref=e296]: 다음 단계
                - generic [ref=e297]:
                  - paragraph [ref=e298]: 스티커는 A5 시트(148×210mm)에 인쇄됩니다. 아래 가이드를 통해 사이즈별 배치 수량을 확인하고, 가장 적합한 옵션을 선택해 보세요.
                  - generic [ref=e300] [cursor=pointer]:
                    - generic [ref=e301]: 배치 가이드 보기
                    - img [ref=e302]
              - list [ref=e305]:
                - listitem [ref=e306]: 5만원 이상 무료배송
                - listitem [ref=e307]: 12시 이전 시안 확정 시 당일배송
                - listitem [ref=e308]: "발송 예정일: 10.13 (화) · CJ 대한통운"
                - listitem [ref=e309]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
        - generic [ref=e311]:
          - article [ref=e312]:
            - img "오늘제작, 내일발송" [ref=e313]
            - heading "오늘제작, 내일발송" [level=4] [ref=e314]
            - paragraph [ref=e315]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
          - article [ref=e316]:
            - img "빠른 시안 피드백" [ref=e317]
            - heading "빠른 시안 피드백" [level=4] [ref=e318]
            - paragraph [ref=e319]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
          - article [ref=e320]:
            - img "빠르고 간편한 부착" [ref=e321]
            - heading "빠르고 간편한 부착" [level=4] [ref=e322]
            - paragraph [ref=e323]: 스티커가 시트에서 쉽게 떼어져 원하는 곳에 빠르고 간편하게 부착할 수 있습니다.
        - generic [ref=e325]:
          - article [ref=e326]:
            - generic [ref=e329]:
              - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e330]
              - paragraph [ref=e331]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
          - article [ref=e332]:
            - generic [ref=e335]:
              - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e336]
              - paragraph [ref=e337]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
          - article [ref=e338]:
            - generic [ref=e341]:
              - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e342]
              - paragraph [ref=e343]: 로고, 일러스트, 사진을 업로드하면 컷팅선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
        - generic [ref=e345]:
          - generic [ref=e346]:
            - generic [ref=e347]:
              - generic [ref=e348]: 좋아요 😀
              - img "5 out of 5" [ref=e349]:
                - img [ref=e350]
                - img [ref=e352]
                - img [ref=e354]
                - img [ref=e356]
                - img [ref=e358]
              - generic [ref=e360]: "5.0"
            - heading "245개 사진 후기가 보장해요" [level=2] [ref=e361]
            - paragraph [ref=e362]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
            - generic [ref=e363]:
              - button "이전 리뷰" [disabled] [ref=e364] [cursor=pointer]:
                - img [ref=e365]
                - generic [ref=e367]: 이전 리뷰
              - button "다음 리뷰" [ref=e368] [cursor=pointer]:
                - img [ref=e369]
                - generic [ref=e371]: 다음 리뷰
          - generic [ref=e373]:
            - article [ref=e375]:
              - generic [ref=e376]:
                - img "박범****" [ref=e378]
                - paragraph [ref=e380]: 1. 제미나이로 초안 작업한 결과물을 업체에 보냄. 2. 파일에 전혀 이상이 없었음. 업체에서 후작업을 진행함. 3. 결과물에 오류가 있었음. (본인도 확인을 제대로 못함.) 4. 결과물을 받고 작업자(대표)와 통화함. 우리는 무조건 잘못없다고 쏘아 붙임. 5. 본인도 작업물 자체에 오류가 없었으나, 전달과정에서 파일이 손상되거나 이상이 있었던 거 같음. 이를 인정하고 재작업을 요청드리려 했으나 계속 공격적인 어투로 재작업원하면 온라인으로 신청해라만 반복. 소량 제작 물품이고, 소통 과정에서 실수는 발생할 수 있다고 생각함. 그러나 업체의 대응 과정에서 기분이 너무 상함. 돈을 안내겠다도 아니고, 수정해서 재작업하면 되는 부분인데, 응대과정이 너무 미흡하고 공격적이라 생각함. 물건 맡기실 분은 생각해보시길, 인스타나 관련 홍보글에 모두 댓글 달고 싶었으나, 여기도 자영업자라 생각하고 참으려 함.
              - generic [ref=e381]:
                - generic [ref=e382]:
                  - generic [ref=e383]: 박
                  - generic [ref=e384]:
                    - strong [ref=e385]: 박범****
                    - generic [ref=e386]: 2026-10-12
                - img [ref=e388]
            - article [ref=e391]:
              - generic [ref=e392]:
                - img "안수****" [ref=e394]
                - paragraph [ref=e396]: 주문한 스티커를 너무 만족스럽게 만들어주셨습니다. 감사해요!
              - generic [ref=e397]:
                - generic [ref=e398]:
                  - generic [ref=e399]: 안
                  - generic [ref=e400]:
                    - strong [ref=e401]: 안수****
                    - generic [ref=e402]: 2026-10-11
                - generic [ref=e403]:
                  - img [ref=e404]
                  - img [ref=e406]
                  - img [ref=e408]
                  - img [ref=e410]
                  - img [ref=e412]
            - article [ref=e415]:
              - generic [ref=e416]:
                - img "이상****" [ref=e418]
                - paragraph [ref=e420]: 원하는대로 작업해주셔서 감사합니다 작업 시스템이 훌륭합니다
              - generic [ref=e421]:
                - generic [ref=e422]:
                  - generic [ref=e423]: 이
                  - generic [ref=e424]:
                    - strong [ref=e425]: 이상****
                    - generic [ref=e426]: 2026-10-10
                - generic [ref=e427]:
                  - img [ref=e428]
                  - img [ref=e430]
                  - img [ref=e432]
                  - img [ref=e434]
                  - img [ref=e436]
            - article [ref=e439]:
              - generic [ref=e440]:
                - img "김영****" [ref=e442]
                - paragraph [ref=e444]: 너무 만족합니다 잘 받았고 다음에 또 주문하겠습니다. 번창하세요
              - generic [ref=e445]:
                - generic [ref=e446]:
                  - generic [ref=e447]: 김
                  - generic [ref=e448]:
                    - strong [ref=e449]: 김영****
                    - generic [ref=e450]: 2026-10-07
                - generic [ref=e451]:
                  - img [ref=e452]
                  - img [ref=e454]
                  - img [ref=e456]
                  - img [ref=e458]
                  - img [ref=e460]
            - article [ref=e463]:
              - generic [ref=e464]:
                - img "김영****" [ref=e466]
                - paragraph [ref=e468]: 너무 만족합니다 잘 받았고 다음에 또 주문하겠습니다. 번창하세요
              - generic [ref=e469]:
                - generic [ref=e470]:
                  - generic [ref=e471]: 김
                  - generic [ref=e472]:
                    - strong [ref=e473]: 김영****
                    - generic [ref=e474]: 2026-10-07
                - generic [ref=e475]:
                  - img [ref=e476]
                  - img [ref=e478]
                  - img [ref=e480]
                  - img [ref=e482]
                  - img [ref=e484]
            - article [ref=e487]:
              - generic [ref=e488]:
                - img "이승****" [ref=e490]
                - paragraph [ref=e492]: 다른회사 스티커 견적도 다 받아보았지만 가격도 합리적인데 가장 빠르기까지 한 업체를 드디어 만났습니다. 상담도 잘해주셔서 알맞은 인쇄물이 나왔습니다 감사합니다.
              - generic [ref=e493]:
                - generic [ref=e494]:
                  - generic [ref=e495]: 이
                  - generic [ref=e496]:
                    - strong [ref=e497]: 이승****
                    - generic [ref=e498]: 2026-10-06
                - generic [ref=e499]:
                  - img [ref=e500]
                  - img [ref=e502]
                  - img [ref=e504]
                  - img [ref=e506]
                  - img [ref=e508]
            - article [ref=e511]:
              - generic [ref=e512]:
                - img "김민****" [ref=e514]
                - paragraph [ref=e516]: 큐알 스티커가 급하게 필요해서 당일 배송하려고 오전 10시에 주문했어요. 다음날 오후 3시에 스티커 배송받았습니다. 빠르게 처리해 주셔서 정말 감사합니다! 주소 실수도 있었고 담당자분을 상당히 귀찮게 해드렸는데 내내 친절하게 답변해주셔서 정말 감사했어요.. 다음에 또 이용하고 싶어요.
              - generic [ref=e517]:
                - generic [ref=e518]:
                  - generic [ref=e519]: 김
                  - generic [ref=e520]:
                    - strong [ref=e521]: 김민****
                    - generic [ref=e522]: 2026-10-03
                - generic [ref=e523]:
                  - img [ref=e524]
                  - img [ref=e526]
                  - img [ref=e528]
                  - img [ref=e530]
                  - img [ref=e532]
            - article [ref=e535]:
              - generic [ref=e536]:
                - img "조진****" [ref=e538]
                - paragraph [ref=e540]: 배송도 빠르고 너무 예쁘게 나왔습니다! 자주 주문할께요!
              - generic [ref=e541]:
                - generic [ref=e542]:
                  - generic [ref=e543]: 조
                  - generic [ref=e544]:
                    - strong [ref=e545]: 조진****
                    - generic [ref=e546]: 2026-10-01
                - generic [ref=e547]:
                  - img [ref=e548]
                  - img [ref=e550]
                  - img [ref=e552]
                  - img [ref=e554]
                  - img [ref=e556]
            - article [ref=e559]:
              - generic [ref=e560]:
                - img "최치****" [ref=e562]
                - paragraph [ref=e564]: 회사 쇼핑백이 급히 필요해서 기성 제품에 스티커를 붙였어요. 제품 품질이 아주 좋았습니다.
              - generic [ref=e565]:
                - generic [ref=e566]:
                  - generic [ref=e567]: 최
                  - generic [ref=e568]:
                    - strong [ref=e569]: 최치****
                    - generic [ref=e570]: 2026-09-28
                - generic [ref=e571]:
                  - img [ref=e572]
                  - img [ref=e574]
                  - img [ref=e576]
                  - img [ref=e578]
                  - img [ref=e580]
            - article [ref=e583]:
              - generic [ref=e584]:
                - img "서민****" [ref=e586]
                - paragraph [ref=e588]: 오우~베리굿데스와
              - generic [ref=e589]:
                - generic [ref=e590]:
                  - img "서민**** avatar" [ref=e591]
                  - generic [ref=e592]:
                    - strong [ref=e593]: 서민****
                    - generic [ref=e594]: 2026-09-26
                - generic [ref=e595]:
                  - img [ref=e596]
                  - img [ref=e598]
                  - img [ref=e600]
                  - img [ref=e602]
                  - img [ref=e604]
            - article [ref=e607]:
              - generic [ref=e608]:
                - img "이수****" [ref=e610]
                - paragraph [ref=e612]: 정말 만족합니다. 요구사항을 정말 찰떡같이 들어주셔서 감사한 마음뿐입니다… 잘리는 부분을 최소화해달라고 말씀드렸는데 완벽히 들어주셨습니다. 인쇄도 선명하게 잘 나왔고, 무엇보다 모든 스티커를 다 확인했는데 밀림이나 불량이 하나도 없었습니다. 컬러감도 생각한 그대로 잘 나왔습니다. 붙이는 곳이 어디냐에 따라 조금씩 달라지겠지만 떼어질 때도 깔끔하게 떼어지는 것 같습니다. 스티커도 얇아서 세밀하게 착 붙는 느낌이 좋습니다. 다음에도 스티커 시킬 일 있으면 여기서 시키고 싶습니다!! 넘 귀엽고 깔끔하게 잘 나와서 만족합니다!!
              - generic [ref=e613]:
                - generic [ref=e614]:
                  - img "이수**** avatar" [ref=e615]
                  - generic [ref=e616]:
                    - strong [ref=e617]: 이수****
                    - generic [ref=e618]: 2026-09-26
                - generic [ref=e619]:
                  - img [ref=e620]
                  - img [ref=e622]
                  - img [ref=e624]
                  - img [ref=e626]
                  - img [ref=e628]
            - article [ref=e631]:
              - generic [ref=e632]:
                - img "홍승****" [ref=e634]
                - paragraph [ref=e636]: 제품 깔끔하게 잘 나왔고 바로 다음날 배송이 되어서 너무 만족스러웠습니다
              - generic [ref=e637]:
                - generic [ref=e638]:
                  - generic [ref=e639]: 홍
                  - generic [ref=e640]:
                    - strong [ref=e641]: 홍승****
                    - generic [ref=e642]: 2026-09-15
                - generic [ref=e643]:
                  - img [ref=e644]
                  - img [ref=e646]
                  - img [ref=e648]
                  - img [ref=e650]
                  - img [ref=e652]
            - article [ref=e655]:
              - generic [ref=e656]:
                - img "이지****" [ref=e658]
                - paragraph [ref=e660]: 첫 스티커 제작이었는데, 굉장히 만족합니다. 다음에 제작 의뢰할 때에는 더 잘할 수 있을 것 같아요!
              - generic [ref=e661]:
                - generic [ref=e662]:
                  - generic [ref=e663]: 이
                  - generic [ref=e664]:
                    - strong [ref=e665]: 이지****
                    - generic [ref=e666]: 2026-09-14
                - generic [ref=e667]:
                  - img [ref=e668]
                  - img [ref=e670]
                  - img [ref=e672]
                  - img [ref=e674]
                  - img [ref=e676]
            - article [ref=e679]:
              - generic [ref=e680]:
                - img "권민****" [ref=e682]
                - paragraph [ref=e684]: 급하게 필요해서 주문했던 스티커인데 친절하게 잘 응대해주시고 스티커도 너무 이쁘게 나와서 맘에 쏙 들었어요. 다음에 또 이용할께요.
              - generic [ref=e685]:
                - generic [ref=e686]:
                  - generic [ref=e687]: 권
                  - generic [ref=e688]:
                    - strong [ref=e689]: 권민****
                    - generic [ref=e690]: 2026-09-11
                - generic [ref=e691]:
                  - img [ref=e692]
                  - img [ref=e694]
                  - img [ref=e696]
                  - img [ref=e698]
                  - img [ref=e700]
            - article [ref=e703]:
              - generic [ref=e704]:
                - img "허준****" [ref=e706]
                - paragraph [ref=e708]: 대만족
              - generic [ref=e709]:
                - generic [ref=e710]:
                  - generic [ref=e711]: 허
                  - generic [ref=e712]:
                    - strong [ref=e713]: 허준****
                    - generic [ref=e714]: 2026-09-11
                - generic [ref=e715]:
                  - img [ref=e716]
                  - img [ref=e718]
                  - img [ref=e720]
                  - img [ref=e722]
                  - img [ref=e724]
            - article [ref=e727]:
              - generic [ref=e728]:
                - img "이승****" [ref=e730]
                - paragraph [ref=e732]: 예쁘게 튼튼하게 잘 만들어주셔써요 !!
              - generic [ref=e733]:
                - generic [ref=e734]:
                  - generic [ref=e735]: 이
                  - generic [ref=e736]:
                    - strong [ref=e737]: 이승****
                    - generic [ref=e738]: 2026-09-10
                - generic [ref=e739]:
                  - img [ref=e740]
                  - img [ref=e742]
                  - img [ref=e744]
                  - img [ref=e746]
                  - img [ref=e748]
        - generic [ref=e751]:
          - generic [ref=e752]:
            - img "text" [ref=e753]
            - generic [ref=e754]:
              - heading "직사각형 판스티커 FAQ" [level=2] [ref=e755]
              - paragraph [ref=e756]:
                - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
                - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e757] [cursor=pointer]:
                  - /url: https://www.musticker.com/faq
                - text: .
          - generic [ref=e758]:
            - generic [ref=e759]:
              - generic [ref=e760] [cursor=pointer]:
                - heading "직사각형 판스티커란 무엇인가요?" [level=3] [ref=e761]
                - paragraph [ref=e764]: 직사각형 판스티커는 여러 개의 직사각형 스티커를 한 장의 시트에 배치해 제작하는 스티커입니다. 각 스티커는 키스컷 방식으로 제작되어 시트는 그대로 유지되며, 스티커를 한 장씩 쉽게 떼어 사용할 수 있습니다
              - button [ref=e765] [cursor=pointer]:
                - img [ref=e766]
            - generic [ref=e768]:
              - generic [ref=e769] [cursor=pointer]:
                - heading "한 장의 시트에 여러 가지 직사각형 디자인을 넣을 수 있나요?" [level=3] [ref=e770]
                - paragraph [ref=e771]: 아니요. 직사각형 판스티커는 하나의 디자인이 시트 전체에 반복 배치되어 제작됩니다. 모든 스티커가 동일한 크기와 간격으로 배치되어 깔끔하게 제작됩니다.
              - button [ref=e772] [cursor=pointer]:
                - img [ref=e773]
            - generic [ref=e775]:
              - generic [ref=e776] [cursor=pointer]:
                - heading "직사각형 판스티커는 어떤 소재를 선택할 수 있나요?" [level=3] [ref=e777]
                - paragraph [ref=e778]: 직사각형 판스티커는 PVC(백색), 투명, 홀로그램 소재로 제작할 수 있습니다. 선명한 색감을 원한다면 PVC(백색), 깔끔하고 자연스러운 느낌을 원한다면 투명, 반짝이는 효과를 원한다면 홀로그램을 추천합니다.
              - button [ref=e779] [cursor=pointer]:
                - img [ref=e780]
            - generic [ref=e782]:
              - generic [ref=e783] [cursor=pointer]:
                - heading "직사각형 판스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e784]
                - paragraph [ref=e785]: 네. 머스티커의 직사각형 판스티커는 방수 기능이 있는 PVC 소재로 제작됩니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요.
              - button [ref=e786] [cursor=pointer]:
                - img [ref=e787]
            - generic [ref=e789]:
              - generic [ref=e790] [cursor=pointer]:
                - heading "디자인을 직사각형 전체에 인쇄할 수 있나요?" [level=3] [ref=e791]
                - paragraph [ref=e792]: 네. 재단선 밖까지 디자인을 여유 있게 넣어 작업하면 직사각형 전체를 가득 채워 인쇄할 수 있습니다. 이렇게 재단 여백을 포함해 디자인하면 흰 테두리 없이 깔끔하게 제작됩니다
              - button [ref=e793] [cursor=pointer]:
                - img [ref=e794]
          - generic [ref=e796]:
            - generic [ref=e797]:
              - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e798]
              - paragraph [ref=e799]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
            - button "문의하기" [ref=e800] [cursor=pointer]:
              - generic [ref=e801]: 문의하기
      - navigation "네이버 톡톡으로 문의하기" [ref=e802]:
        - link "카카오채널로 문의하기" [ref=e803] [cursor=pointer]:
          - /url: https://pf.kakao.com/_nJxnTX/chat
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 카카오채널로 문의하기
          - img [ref=e805]
        - link "네이버 톡톡 으로 문의하기" [ref=e806] [cursor=pointer]:
          - /url: https://talk.naver.com/ct/w2luxqo
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 네이버 톡톡 으로 문의하기
          - img [ref=e808]
        - button "이메일로 문의하기" [ref=e809] [cursor=pointer]:
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 이메일로 문의하기
          - img [ref=e811]
    - contentinfo [ref=e812]:
      - generic [ref=e813]:
        - generic [ref=e814]:
          - heading "MUSTICKER / 머스티커" [level=2] [ref=e815]
          - paragraph [ref=e816]: "상호명: (주)글로픽스"
          - paragraph [ref=e817]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
          - paragraph [ref=e818]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
          - paragraph [ref=e819]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
          - paragraph [ref=e820]:
            - generic [ref=e821]: ⓒ 2026. All rights reserved.
            - generic [ref=e822]: "판매: sales@musticker.com"
            - link "이용약관" [ref=e823] [cursor=pointer]:
              - /url: /kr/terms-of-use
            - link "개인정보처리방침" [ref=e824] [cursor=pointer]:
              - /url: /kr/privacy-policy
            - button "사업자정보확인" [ref=e825] [cursor=pointer]
            - link "오픈소스 라이선스" [ref=e826] [cursor=pointer]:
              - /url: /kr/open-source-licenses
            - link "회사소개" [ref=e827] [cursor=pointer]:
              - /url: /kr/about
        - generic [ref=e828]:
          - paragraph [ref=e829]: 1899-5529
          - paragraph [ref=e831]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
          - generic [ref=e832]:
            - button "1:1문의하기" [ref=e833] [cursor=pointer]
            - link "자주 묻는 질문" [ref=e834] [cursor=pointer]:
              - /url: /kr/faq
          - generic [ref=e835]:
            - generic [ref=e836]: "Follow us at:"
            - generic [ref=e837]:
              - link "instagram icon" [ref=e838] [cursor=pointer]:
                - /url: https://www.instagram.com/musticker_official/
                - img "instagram icon"
              - link "youtube icon" [ref=e839] [cursor=pointer]:
                - /url: https://www.youtube.com/@MustickerOfficial
                - img "youtube icon"
```

# Test source

```ts
  109 |       .locator('.qty-pill-price')
  110 |       .filter({ hasNotText: /^0원$/ })
  111 |       .first()
  112 |       .waitFor({ state: 'visible', timeout: 20_000 })
  113 |       .catch(() => undefined);
  114 | 
  115 |     for (let attempt = 0; attempt < 5; attempt += 1) {
  116 |       if (await widthInput.isVisible().catch(() => false)) {
  117 |         break;
  118 |       }
  119 | 
  120 |       // The pill replaces itself with the size row, so once it is gone the row is already on its
  121 |       // way in and there is nothing left to click. Re-clicking here is what turned a missed input
  122 |       // into a hang: `click()` inherits the *test* timeout, so waiting for a control that will
  123 |       // never come back burned the whole remaining budget instead of failing this step.
  124 |       const pill = this.optionsPanel.getByRole('button', { name: ko.customSize }).first();
  125 | 
  126 |       if (await pill.isVisible().catch(() => false)) {
  127 |         await pill.click({ timeout: 5_000 }).catch(() => undefined);
  128 |       }
  129 | 
  130 |       await widthInput.waitFor({ state: 'visible', timeout: 4_000 }).catch(() => undefined);
  131 |     }
  132 | 
  133 |     await expect(widthInput, 'custom individual size inputs never mounted').toBeVisible();
  134 | 
  135 |     await widthInput.fill(String(widthMm));
  136 |     await heightInput.fill(String(heightMm));
  137 |     await heightInput.blur();
  138 |   }
  139 | 
  140 |   // vinyl-lettering's design surface is a contenteditable canvas, not an input/textarea, and
  141 |   // pricing stays at 0원 with the next-step button disabled until text is entered.
  142 |   async fillVinylLetteringText(text: string): Promise<void> {
  143 |     const canvas = this.page.getByTestId('product-category-vinyl-designer-textarea');
  144 |     await canvas.click();
  145 |     await this.page.keyboard.type(text);
  146 |   }
  147 | 
  148 |   /**
  149 |    * The price the chosen quantity tier advertises, as a number.
  150 |    *
  151 |    * This is the figure the shopper is quoted and the one that must survive into the cart and the
  152 |    * checkout summary unchanged -- it is already the discounted price, not the struck-through one
  153 |    * (verified on development-1: the 30개 tier reads 18,700원 against a 19,800원 list price, and
  154 |    * 18,700원 is what the cart line and the checkout 소계 then show).
  155 |    *
  156 |    * Waits out the bootstrap pricing round-trip, during which every tier reads 0원.
  157 |    */
  158 |   async captureQuantityTierPrice(quantity: number): Promise<number> {
  159 |     const price = this.quantityTier(quantity).locator('.qty-pill-price');
  160 | 
  161 |     await expect(price).toBeVisible({ timeout: 20_000 });
  162 |     await expect(price, 'quantity tier is still unpriced -- the pricing call has not landed').not.toHaveText('0원', {
  163 |       timeout: 20_000
  164 |     });
  165 | 
  166 |     return parseWon(await price.innerText());
  167 |   }
  168 | 
  169 |   private quantityTier(quantity: number): Locator {
  170 |     const quantityLabel = new RegExp(
  171 |       `^${quantity.toLocaleString('en-US')}\\s*(?:\\S+)?\\s*${wonAmountPattern.source}`,
  172 |       'u'
  173 |     );
  174 | 
  175 |     return this.optionsPanel.getByRole('button', { name: quantityLabel }).first();
  176 |   }
  177 | 
  178 |   async expectVisiblePrice(): Promise<void> {
  179 |     await expect(this.optionsPanel.getByText(wonAmountPattern).last()).toBeVisible();
  180 |   }
  181 | 
  182 |   async expectBulkDiscountVisible(): Promise<void> {
  183 |     await expect(this.optionsPanel.getByText(/^-\d+%$/).first()).toBeVisible();
  184 |   }
  185 | 
  186 |   async expectNoBulkDiscountVisible(): Promise<void> {
  187 |     await expect(this.optionsPanel.getByText(/^-\d+%$/)).toHaveCount(0);
  188 |   }
  189 | 
  190 |   async expectSizeGuideImagesLocalized(): Promise<void> {
  191 |     const images = this.page.locator('.mini-feature-image');
  192 |     const count = await images.count();
  193 |     expect(count, 'Expected size-guide illustration images to be present').toBeGreaterThan(0);
  194 | 
  195 |     for (let index = 0; index < count; index += 1) {
  196 |       const alt = (await images.nth(index).getAttribute('alt')) ?? '';
  197 |       expect(alt, `Size guide image ${index} alt text is a raw, untranslated i18n key: "${alt}"`).not.toMatch(
  198 |         /^product\.sizes\./
  199 |       );
  200 |       expect(
  201 |         alt,
  202 |         `Size guide image ${index} alt text looks like an unrelated sheet/paper size label: "${alt}"`
  203 |       ).not.toMatch(/^A\d+\s|^\d+\s*x\s*\d+$/i);
  204 |     }
  205 |   }
  206 | 
  207 |   async expectDesignUploadModal(): Promise<void> {
  208 |     const dialog = this.page.getByRole('dialog');
> 209 |     await expect(dialog.getByTestId('product-category-upload-dropzone')).toContainText(
      |                                                                          ^ Error: expect(locator).toContainText(expected) failed
  210 |       '.eps, .ai, .psd, .pdf, .tif, .png'
  211 |     );
  212 |     await expect(dialog.getByTestId('product-category-upload-select-files-button')).toBeVisible();
  213 |   }
  214 | 
  215 |   async fillDesignOrderNote(note: string): Promise<void> {
  216 |     await this.page.getByTestId('product-category-upload-special-instructions').locator('textarea').fill(note);
  217 |   }
  218 | 
  219 |   async uploadDesignFile(filePath: string): Promise<void> {
  220 |     await this.page.getByRole('dialog').locator('input[type="file"]').setInputFiles(filePath);
  221 |   }
  222 | 
  223 |   async expectDesignFileAccepted(fileName: string): Promise<void> {
  224 |     await expect(this.page.getByRole('dialog').getByTestId('product-category-upload-dropzone')).toContainText(
  225 |       fileName
  226 |     );
  227 |   }
  228 | 
  229 |   // --- individual-sticker sheet size rules (see sheet-sticker-size-rules.spec.ts) ---
  230 | 
  231 |   // `1시트 = 스티커 N개`. Polled rather than read once: both count readouts repaint asynchronously
  232 |   // when the pricing round-trip lands, so an immediate read catches the previous size's numbers or
  233 |   // an empty node mid-render. Asserts the rendered readout rather than recomputing the packing --
  234 |   // the point is that what the shopper is shown matches what the pricing engine actually packs.
  235 |   async expectStickersPerSheet(expected: number): Promise<void> {
  236 |     await expect
  237 |       .poll(() => this.readCount(/1시트 = 스티커 ([\d,]+)개/), {
  238 |         timeout: 15_000,
  239 |         message: `Expected the sheet to report ${expected} stickers per sheet`
  240 |       })
  241 |       .toBe(expected);
  242 |   }
  243 | 
  244 |   // `총 스티커 수량 : N개`
  245 |   async expectTotalStickers(expected: number): Promise<void> {
  246 |     await expect
  247 |       .poll(() => this.readCount(/총 스티커 수량\s*:\s*([\d,]+)개/), {
  248 |         timeout: 15_000,
  249 |         message: `Expected a total of ${expected} stickers`
  250 |       })
  251 |       .toBe(expected);
  252 |   }
  253 | 
  254 |   async expectSizePresets(presets: ReadonlyArray<{ label: string; dimensions: string }>): Promise<void> {
  255 |     const grid = this.sizeGrid();
  256 |     await expect(grid).toBeVisible();
  257 | 
  258 |     for (const [index, preset] of presets.entries()) {
  259 |       const pill = grid.locator('.option-pill').nth(index);
  260 |       await expect(pill.locator('.size-pill-name'), `size preset ${index} label`).toHaveText(preset.label);
  261 |       await expect(pill.locator('.size-pill-dim'), `size preset ${index} dimensions`).toHaveText(preset.dimensions);
  262 |     }
  263 | 
  264 |     // The custom-size pill trails the presets, so the count is presets + 1.
  265 |     await expect(grid.locator('.option-pill')).toHaveCount(presets.length + 1);
  266 |   }
  267 | 
  268 |   async selectSizePreset(label: string): Promise<void> {
  269 |     await this.sizeGrid().locator('.option-pill').filter({ hasText: label }).first().click();
  270 |   }
  271 | 
  272 |   async expectMinimumTwoPerSheetError(): Promise<void> {
  273 |     await expect(this.optionsPanel.getByText(ko.minimumTwoPerSheetError)).toBeVisible();
  274 |   }
  275 | 
  276 |   async expectNoMinimumTwoPerSheetError(): Promise<void> {
  277 |     await expect(this.optionsPanel.getByText(ko.minimumTwoPerSheetError)).toHaveCount(0);
  278 |   }
  279 | 
  280 |   // A rejected size shows only the minimum-two-per-sheet message -- an oversized entry does not get
  281 |   // a separate "가로 138mm × 세로 200mm 이내로 작업해 주세요." line. Confirmed intended on
  282 |   // development-1 (2026-08-26), so this asserts the absence rather than treating it as a gap.
  283 |   async expectNoMaxWorkAreaMessage(): Promise<void> {
  284 |     await expect(this.optionsPanel.getByText(/가로 \d+mm × 세로 \d+mm 이내로 작업해 주세요\./)).toHaveCount(0);
  285 |   }
  286 | 
  287 |   // Every sheet-quantity tier zeroes out while the chosen size is rejected, not just the selected
  288 |   // one, so a shopper cannot switch tiers to find a priced combination.
  289 |   async expectAllQuantityTiersZeroPriced(): Promise<void> {
  290 |     const prices = this.quantityGrid().locator('.qty-pill-price');
  291 |     const count = await prices.count();
  292 |     expect(count, 'Expected sheet-quantity tiers to be present').toBeGreaterThan(0);
  293 | 
  294 |     for (let index = 0; index < count; index += 1) {
  295 |       await expect(prices.nth(index), `quantity tier ${index} price`).toHaveText('0원');
  296 |     }
  297 |   }
  298 | 
  299 |   async expectNextStepDisabled(): Promise<void> {
  300 |     await expect(this.nextStepButton()).toBeDisabled();
  301 |   }
  302 | 
  303 |   async openSizeGuide(): Promise<Locator> {
  304 |     await this.optionsPanel.getByText(ko.sizeGuideOpen).first().click();
  305 |     const dialog = this.page.getByRole('dialog').first();
  306 |     await expect(dialog).toBeVisible();
  307 | 
  308 |     return dialog;
  309 |   }
```