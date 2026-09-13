# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchasing/product-config.spec.ts >> storefront v2 product configuration >> MS-V2-009 die-cut sticker supports size and quantity selection
- Location: tests/e2e/purchasing/product-config.spec.ts:19:3

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "[warning] [Worker] WebGPU 는 있으나 shader-f16 미지원 — 가벼운 모델을 씁니다",
+ ]
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
        - generic [ref=e16]:
          - generic [ref=e17]: "1"
          - generic [ref=e18]:
            - heading "파일 업로드하기" [level=3] [ref=e19]
            - paragraph [ref=e20]: 내가 가진 디자인 파일로 주문하기
        - generic [ref=e21]:
          - img [ref=e22]
          - generic [ref=e27]:
            - paragraph [ref=e28]: 파일을 여기로 드래그하세요
            - paragraph [ref=e29]: ai · psd · pdf · eps · tif · png · jpg
          - button "+ 파일 선택하기" [ref=e30] [cursor=pointer]
        - generic [ref=e31]:
          - generic [ref=e32]: 기타 요청 사항 (옵션)
          - textbox "기타 요청 사항 (옵션)" [ref=e34]:
            - /placeholder: 여기에 상세 주문 요청 사항을 입력해 주세요
        - button "파일로 주문하기" [ref=e35] [cursor=pointer]:
          - img [ref=e36]
          - text: 파일로 주문하기
      - generic [ref=e42]: 또는
      - region "직접 디자인하기 추천" [ref=e44]:
        - generic [ref=e45]:
          - generic [ref=e46]: "2"
          - generic [ref=e47]:
            - heading "직접 디자인하기" [level=3] [ref=e48]
            - paragraph [ref=e49]: PDF · AI · PNG · JPG · SVG도 웹에서 바로 편집
          - generic [ref=e50]: 추천
        - img "웹 스튜디오에서 자유형 스티커를 자유롭게 디자인해 보세요." [ref=e51]:
          - generic [ref=e52]:
            - generic [ref=e53]:
              - img [ref=e63]
              - generic [ref=e65]:
                - generic [ref=e66]:
                  - generic [ref=e67]:
                    - generic [ref=e68]:
                      - img
                      - img
                      - generic [ref=e70]:
                        - img [ref=e71]
                        - generic [ref=e73]: 배경 제거 중
                    - generic [ref=e74]:
                      - generic [ref=e75]: 55mm
                      - generic [ref=e76]: 90mm
                  - generic [ref=e81]:
                    - generic [ref=e82]:
                      - img
                      - img
                      - img
                      - img
                      - generic [ref=e87]:
                        - img [ref=e88]
                        - generic [ref=e90]: 배경 제거 중
                    - generic [ref=e91]:
                      - generic [ref=e92]: 90mm
                      - generic [ref=e93]: 88mm
                - generic [ref=e103]:
                  - img [ref=e104]
                  - img [ref=e106]
            - generic [ref=e118]: T
        - button "스튜디오 이동" [ref=e140] [cursor=pointer]:
          - img [ref=e141]
          - text: 스튜디오 이동
      - generic [ref=e143]:
        - button "이 단계를 건너뛰고 나중에 파일 보내기" [ref=e144] [cursor=pointer]:
          - img [ref=e145]
          - generic [ref=e148]: 이 단계를 건너뛰고 나중에 파일 보내기
        - generic [ref=e149]: 주문을 먼저 접수하고 이메일·카카오톡으로 보내셔도 됩니다.
  - generic [ref=e151]:
    - banner [ref=e152]:
      - generic [ref=e153]:
        - generic [ref=e154]:
          - link "Musticker" [ref=e155] [cursor=pointer]:
            - /url: /kr
            - img "musticker logo" [ref=e156]
          - generic [ref=e157]:
            - button "공지사항 열기" [ref=e159] [cursor=pointer]:
              - img [ref=e161]
            - button "layout.header.search" [ref=e163] [cursor=pointer]:
              - img [ref=e164]
            - button "장바구니" [ref=e167] [cursor=pointer]:
              - img [ref=e168]
            - button "계정" [ref=e171] [cursor=pointer]:
              - img [ref=e173]
        - navigation "Primary":
          - link "스티커" [ref=e175] [cursor=pointer]:
            - /url: /kr/stickers
          - link "롤스티커" [ref=e176] [cursor=pointer]:
            - /url: /kr/roll-stickers
          - link "시트 스티커" [ref=e177] [cursor=pointer]:
            - /url: /kr/sheet-stickers
    - main [ref=e178]:
      - generic [ref=e179]:
        - generic [ref=e181]:
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
          - generic [ref=e184]:
            - generic [ref=e187]:
              - generic [ref=e188]:
                - heading "자유형 스티커" [level=1] [ref=e189]
                - paragraph [ref=e190]: 두텁고 강력한 내구성을 가진 소재를 자랑해요
              - img "자유형 스티커 preview poster" [ref=e192]
              - generic [ref=e194]:
                - button "소형 30x30 A6 105x148 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!" [ref=e195] [cursor=pointer]:
                  - heading "소형 30x30" [level=4] [ref=e196]
                  - img "A6 105x148" [ref=e197]
                  - paragraph [ref=e198]: 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!
                - button "중형 75x75 A5 148x210 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요." [ref=e199] [cursor=pointer]:
                  - heading "중형 75x75" [level=4] [ref=e200]
                  - img "A5 148x210" [ref=e201]
                  - paragraph [ref=e202]: 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요.
                - button "대형 100x100 A4 210x297 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요." [ref=e203] [cursor=pointer]:
                  - heading "대형 100x100" [level=4] [ref=e204]
                  - img "A4 210x297" [ref=e205]
                  - paragraph [ref=e206]: 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요.
                - button "초대형 125x125 72x170 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요." [ref=e207] [cursor=pointer]:
                  - heading "초대형 125x125" [level=4] [ref=e208]
                  - img "72x170" [ref=e209]
                  - paragraph [ref=e210]: 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요.
            - complementary [ref=e213]:
              - generic [ref=e214]:
                - generic [ref=e215]:
                  - heading "사이즈를 선택하세요" [level=3] [ref=e216]
                  - generic [ref=e217]: (단위:mm)
                - generic [ref=e218]:
                  - button "소형 30x30" [ref=e219] [cursor=pointer]:
                    - generic [ref=e220]: 소형
                    - generic [ref=e221]: 30x30
                  - button "중형 75x75" [ref=e222] [cursor=pointer]:
                    - generic [ref=e223]: 중형
                    - generic [ref=e224]: 75x75
                  - button "대형 100x100" [ref=e225] [cursor=pointer]:
                    - generic [ref=e226]: 대형
                    - generic [ref=e227]: 100x100
                  - button "초대형 125x125" [ref=e228] [cursor=pointer]:
                    - generic [ref=e229]: 초대형
                    - generic [ref=e230]: 125x125
                  - 'button "원하는 크기 입력 주문 가능 크기: 25-1500mm" [ref=e231] [cursor=pointer]':
                    - generic [ref=e232]:
                      - img [ref=e233]
                      - paragraph [ref=e235]: 원하는 크기 입력
                    - generic [ref=e236]: "주문 가능 크기: 25-1500mm"
              - generic [ref=e237]:
                - heading "수량을 선택하세요" [level=3] [ref=e238]
                - generic [ref=e239]:
                  - button "10개 6,600원" [ref=e240] [cursor=pointer]:
                    - generic [ref=e241]: 10개
                    - generic [ref=e242]: 6,600원
                  - button "20개 12,500원" [ref=e243] [cursor=pointer]:
                    - generic [ref=e244]: 20개
                    - generic [ref=e245]: 12,500원
                  - button "30개 18,700원" [ref=e246] [cursor=pointer]:
                    - generic [ref=e247]: 30개
                    - generic [ref=e248]: 18,700원
                  - button "50개 29,600원" [ref=e249] [cursor=pointer]:
                    - generic [ref=e250]: 50개
                    - generic [ref=e251]: 29,600원
                  - button "100개 36,100원" [ref=e252] [cursor=pointer]:
                    - generic [ref=e253]: 100개
                    - generic [ref=e254]: 36,100원
                  - button "300개 72,200원" [ref=e255] [cursor=pointer]:
                    - generic [ref=e256]: 300개
                    - generic [ref=e257]: 72,200원
                  - button "500개 88,400원" [ref=e258] [cursor=pointer]:
                    - generic [ref=e259]: 500개
                    - generic [ref=e260]: 88,400원
                  - button "1,000개 106,000원" [ref=e261] [cursor=pointer]:
                    - generic [ref=e262]: 1,000개
                    - generic [ref=e263]: 106,000원
                  - 'button "원하는 수량 입력 주문 가능 수량: 10-100,000개" [ref=e264] [cursor=pointer]':
                    - generic [ref=e265]:
                      - img [ref=e266]
                      - paragraph [ref=e268]: 원하는 수량 입력
                    - generic [ref=e269]: "주문 가능 수량: 10-100,000개"
              - generic [ref=e272]:
                - generic [ref=e273]:
                  - paragraph [ref=e274]:
                    - generic [ref=e275]: "-45%"
                    - generic [ref=e276]: 66,000원
                  - paragraph [ref=e277]:
                    - strong [ref=e278]: 36,100원
                - paragraph [ref=e279]: (1매당 361원)
              - button "다음 단계" [ref=e281] [cursor=pointer]:
                - generic [ref=e282]: 다음 단계
              - list [ref=e284]:
                - listitem [ref=e285]: 5만원 이상 무료배송
                - listitem [ref=e286]: 3시 이전 시안 확정 시 당일배송
                - listitem [ref=e287]: "도착 예정일: 09.15 (화) · CJ 대한통운"
                - listitem [ref=e288]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
        - generic [ref=e290]:
          - article [ref=e291]:
            - img "오늘제작, 내일발송" [ref=e292]
            - heading "오늘제작, 내일발송" [level=4] [ref=e293]
            - paragraph [ref=e294]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
          - article [ref=e295]:
            - img "빠른 시안 피드백" [ref=e296]
            - heading "빠른 시안 피드백" [level=4] [ref=e297]
            - paragraph [ref=e298]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
          - article [ref=e299]:
            - img "뛰어난 내구성과 내수성" [ref=e300]
            - heading "뛰어난 내구성과 내수성" [level=4] [ref=e301]
            - paragraph [ref=e302]: 두꺼운 프리미엄 재질로 색상, 접착력 그대로 오래갑니다
        - generic [ref=e304]:
          - article [ref=e305]:
            - generic [ref=e308]:
              - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e309]
              - paragraph [ref=e310]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
          - article [ref=e311]:
            - generic [ref=e314]:
              - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e315]
              - paragraph [ref=e316]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
          - article [ref=e317]:
            - generic [ref=e320]:
              - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e321]
              - paragraph [ref=e322]: 로고, 일러스트, 사진을 업로드하면 칼선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
        - generic [ref=e324]:
          - generic [ref=e325]:
            - generic [ref=e326]:
              - generic [ref=e327]: 좋아요 😀
              - img "5 out of 5" [ref=e328]:
                - img [ref=e329]
                - img [ref=e331]
                - img [ref=e333]
                - img [ref=e335]
                - img [ref=e337]
              - generic [ref=e339]: "5.0"
            - heading "225개 사진 후기가 보장해요" [level=2] [ref=e340]
            - paragraph [ref=e341]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
            - generic [ref=e342]:
              - button "이전 리뷰" [disabled] [ref=e343] [cursor=pointer]:
                - img [ref=e344]
                - generic [ref=e346]: 이전 리뷰
              - button "다음 리뷰" [ref=e347] [cursor=pointer]:
                - img [ref=e348]
                - generic [ref=e350]: 다음 리뷰
          - generic [ref=e352]:
            - article [ref=e354]:
              - generic [ref=e355]:
                - img "tkop****" [ref=e357]
                - paragraph [ref=e359]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
              - generic [ref=e360]:
                - generic [ref=e361]:
                  - img "tkop**** avatar" [ref=e362]
                  - generic [ref=e363]:
                    - strong [ref=e364]: tkop****
                    - generic [ref=e365]: 2026-03-25
                - generic [ref=e366]:
                  - img [ref=e367]
                  - img [ref=e369]
                  - img [ref=e371]
                  - img [ref=e373]
                  - img [ref=e375]
            - article [ref=e378]:
              - generic [ref=e379]:
                - img "oozz******" [ref=e381]
                - paragraph [ref=e383]: 잘나와서 만족합니다 잘쓰겠습니다
              - generic [ref=e384]:
                - generic [ref=e385]:
                  - img "oozz****** avatar" [ref=e386]
                  - generic [ref=e387]:
                    - strong [ref=e388]: oozz******
                    - generic [ref=e389]: 2026-03-22
                - generic [ref=e390]:
                  - img [ref=e391]
                  - img [ref=e393]
                  - img [ref=e395]
                  - img [ref=e397]
                  - img [ref=e399]
            - article [ref=e402]:
              - generic [ref=e403]:
                - img "aktm********" [ref=e405]
                - paragraph [ref=e407]: 만족하면서 사용중입니다
              - generic [ref=e408]:
                - generic [ref=e409]:
                  - img "aktm******** avatar" [ref=e410]
                  - generic [ref=e411]:
                    - strong [ref=e412]: aktm********
                    - generic [ref=e413]: 2026-03-04
                - generic [ref=e414]:
                  - img [ref=e415]
                  - img [ref=e417]
                  - img [ref=e419]
                  - img [ref=e421]
                  - img [ref=e423]
            - article [ref=e426]:
              - generic [ref=e427]:
                - img "aktm********" [ref=e429]
                - paragraph [ref=e431]: 잘 받았어요 잘쓸게요.
              - generic [ref=e432]:
                - generic [ref=e433]:
                  - img "aktm******** avatar" [ref=e434]
                  - generic [ref=e435]:
                    - strong [ref=e436]: aktm********
                    - generic [ref=e437]: 2026-01-31
                - generic [ref=e438]:
                  - img [ref=e439]
                  - img [ref=e441]
                  - img [ref=e443]
                  - img [ref=e445]
                  - img [ref=e447]
            - article [ref=e450]:
              - generic [ref=e451]:
                - img "aktm********" [ref=e453]
                - paragraph [ref=e455]: 아주 잘쓰고있습니다.
              - generic [ref=e456]:
                - generic [ref=e457]:
                  - img "aktm******** avatar" [ref=e458]
                  - generic [ref=e459]:
                    - strong [ref=e460]: aktm********
                    - generic [ref=e461]: 2026-01-06
                - generic [ref=e462]:
                  - img [ref=e463]
                  - img [ref=e465]
                  - img [ref=e467]
                  - img [ref=e469]
                  - img [ref=e471]
            - article [ref=e474]:
              - generic [ref=e475]:
                - img "aktm********" [ref=e477]
                - paragraph [ref=e479]: 아주 잘쓰고있습니다.
              - generic [ref=e480]:
                - generic [ref=e481]:
                  - img "aktm******** avatar" [ref=e482]
                  - generic [ref=e483]:
                    - strong [ref=e484]: aktm********
                    - generic [ref=e485]: 2026-01-06
                - generic [ref=e486]:
                  - img [ref=e487]
                  - img [ref=e489]
                  - img [ref=e491]
                  - img [ref=e493]
                  - img [ref=e495]
            - article [ref=e498]:
              - generic [ref=e499]:
                - img "jiwn****" [ref=e501]
                - paragraph [ref=e503]: 아 정말 너무 좋아연ㅎㅎ
              - generic [ref=e504]:
                - generic [ref=e505]:
                  - img "jiwn**** avatar" [ref=e506]
                  - generic [ref=e507]:
                    - strong [ref=e508]: jiwn****
                    - generic [ref=e509]: 2025-12-29
                - generic [ref=e510]:
                  - img [ref=e511]
                  - img [ref=e513]
                  - img [ref=e515]
                  - img [ref=e517]
                  - img [ref=e519]
            - article [ref=e522]:
              - generic [ref=e523]:
                - img "koj3***" [ref=e525]
                - paragraph [ref=e527]: 방수도 잘되고 오염에도 잘 버티고 좋아요. 적극 추천합니다.^^
              - generic [ref=e528]:
                - generic [ref=e529]:
                  - img "koj3*** avatar" [ref=e530]
                  - generic [ref=e531]:
                    - strong [ref=e532]: koj3***
                    - generic [ref=e533]: 2025-12-24
                - generic [ref=e534]:
                  - img [ref=e535]
                  - img [ref=e537]
                  - img [ref=e539]
                  - img [ref=e541]
                  - img [ref=e543]
            - article [ref=e546]:
              - generic [ref=e547]:
                - img "aktm********" [ref=e549]
                - paragraph [ref=e551]: 이쁘네요 잘쓸게요.!!
              - generic [ref=e552]:
                - generic [ref=e553]:
                  - img "aktm******** avatar" [ref=e554]
                  - generic [ref=e555]:
                    - strong [ref=e556]: aktm********
                    - generic [ref=e557]: 2025-12-03
                - generic [ref=e558]:
                  - img [ref=e559]
                  - img [ref=e561]
                  - img [ref=e563]
                  - img [ref=e565]
                  - img [ref=e567]
            - article [ref=e570]:
              - generic [ref=e571]:
                - img "aktm********" [ref=e573]
                - paragraph [ref=e575]: 이쁘게 잘뽑혔네요.
              - generic [ref=e576]:
                - generic [ref=e577]:
                  - img "aktm******** avatar" [ref=e578]
                  - generic [ref=e579]:
                    - strong [ref=e580]: aktm********
                    - generic [ref=e581]: 2025-11-30
                - generic [ref=e582]:
                  - img [ref=e583]
                  - img [ref=e585]
                  - img [ref=e587]
                  - img [ref=e589]
                  - img [ref=e591]
            - article [ref=e594]:
              - generic [ref=e595]:
                - img "circ*****" [ref=e597]
                - paragraph [ref=e599]: 품질도 좋고 응대도 잘해주셔서 이쁘게 나왔네요
              - generic [ref=e600]:
                - generic [ref=e601]:
                  - img "circ***** avatar" [ref=e602]
                  - generic [ref=e603]:
                    - strong [ref=e604]: circ*****
                    - generic [ref=e605]: 2025-11-20
                - generic [ref=e606]:
                  - img [ref=e607]
                  - img [ref=e609]
                  - img [ref=e611]
                  - img [ref=e613]
                  - img [ref=e615]
            - article [ref=e618]:
              - generic [ref=e619]:
                - img "pina******" [ref=e621]
                - paragraph [ref=e623]: 부착 잘되고 제거할때 끈적임 없이 깔끔하게 떨어져서 좋아요
              - generic [ref=e624]:
                - generic [ref=e625]:
                  - img "pina****** avatar" [ref=e626]
                  - generic [ref=e627]:
                    - strong [ref=e628]: pina******
                    - generic [ref=e629]: 2025-08-22
                - generic [ref=e630]:
                  - img [ref=e631]
                  - img [ref=e633]
                  - img [ref=e635]
                  - img [ref=e637]
                  - img [ref=e639]
            - article [ref=e642]:
              - generic [ref=e643]:
                - img "qcyc*****" [ref=e645]
                - paragraph [ref=e647]: 덕분에 넘넘 잘썼습니다
              - generic [ref=e648]:
                - generic [ref=e649]:
                  - img "qcyc***** avatar" [ref=e650]
                  - generic [ref=e651]:
                    - strong [ref=e652]: qcyc*****
                    - generic [ref=e653]: 2025-08-15
                - generic [ref=e654]:
                  - img [ref=e655]
                  - img [ref=e657]
                  - img [ref=e659]
                  - img [ref=e661]
                  - img [ref=e663]
            - article [ref=e666]:
              - generic [ref=e667]:
                - img "rlad*******" [ref=e669]
                - paragraph [ref=e671]: 꼼꼼하게 체크해주셔서 너무좋았습니다!
              - generic [ref=e672]:
                - generic [ref=e673]:
                  - img "rlad******* avatar" [ref=e674]
                  - generic [ref=e675]:
                    - strong [ref=e676]: rlad*******
                    - generic [ref=e677]: 2025-07-17
                - generic [ref=e678]:
                  - img [ref=e679]
                  - img [ref=e681]
                  - img [ref=e683]
                  - img [ref=e685]
                  - img [ref=e687]
            - article [ref=e690]:
              - generic [ref=e691]:
                - img "csbn*****" [ref=e693]
                - paragraph [ref=e695]: 배송도 빠르고 재질도 좋고 너무 좋아요 감사합니다!
              - generic [ref=e696]:
                - generic [ref=e697]:
                  - img "csbn***** avatar" [ref=e698]
                  - generic [ref=e699]:
                    - strong [ref=e700]: csbn*****
                    - generic [ref=e701]: 2025-07-14
                - generic [ref=e702]:
                  - img [ref=e703]
                  - img [ref=e705]
                  - img [ref=e707]
                  - img [ref=e709]
                  - img [ref=e711]
            - article [ref=e714]:
              - generic [ref=e715]:
                - img "pina******" [ref=e717]
                - paragraph [ref=e719]: 생각한대로 너무 깔끔하게 나왔어요! 다음에도 주문하겠습니다!!
              - generic [ref=e720]:
                - generic [ref=e721]:
                  - img "pina****** avatar" [ref=e722]
                  - generic [ref=e723]:
                    - strong [ref=e724]: pina******
                    - generic [ref=e725]: 2025-07-09
                - generic [ref=e726]:
                  - img [ref=e727]
                  - img [ref=e729]
                  - img [ref=e731]
                  - img [ref=e733]
                  - img [ref=e735]
        - generic [ref=e738]:
          - generic [ref=e739]:
            - img "text" [ref=e740]
            - generic [ref=e741]:
              - heading "자유형 스티커 FAQ" [level=2] [ref=e742]
              - paragraph [ref=e743]:
                - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
                - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e744] [cursor=pointer]:
                  - /url: https://www.musticker.com/faq
                - text: .
          - generic [ref=e745]:
            - generic [ref=e746]:
              - generic [ref=e747] [cursor=pointer]:
                - heading "자유형 스티커란 무엇인가요?" [level=3] [ref=e748]
                - paragraph [ref=e751]: 자유형 스티커는 원형이나 사각형 같은 규격 모양이 아닌, 디자인의 외곽선을 따라 제작되는 스티커입니다. 로고, 일러스트, 캐릭터, 텍스트 등 다양한 디자인을 원하는 모양으로 제작할 수 있습니다.
              - button [ref=e752] [cursor=pointer]:
                - img [ref=e753]
            - generic [ref=e755]:
              - generic [ref=e756] [cursor=pointer]:
                - heading "자유형 스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e757]
                - paragraph [ref=e758]: 머스티커의 자유형 스티커는 내구성이 뛰어난 PVC 용지에 인쇄되어 물, 햇빛, 일상적인 마모에 강합니다. 실내외 다양한 환경에서도 선명한 색감을 오래 유지합니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요
              - button [ref=e759] [cursor=pointer]:
                - img [ref=e760]
            - generic [ref=e762]:
              - generic [ref=e763] [cursor=pointer]:
                - heading "칼선은 직접 만들어야 하나요?" [level=3] [ref=e764]
                - paragraph [ref=e765]: 디자인 파일만 업로드해 주시면 머스티커에서 디자인에 맞게 칼선을 제작해 드립니다. 이미 칼선이 포함된 파일이 있다면 함께 업로드할 수 있으며, 보다 깔끔한 제작을 위해 디자인 외곽선을 따라 칼선을 작업하는 것을 권장합니다.
              - button [ref=e766] [cursor=pointer]:
                - img [ref=e767]
            - generic [ref=e769]:
              - generic [ref=e770] [cursor=pointer]:
                - heading "인쇄 색상은 화면과 동일하게 나오나요?" [level=3] [ref=e771]
                - paragraph [ref=e772]: 모니터와 인쇄물은 색상을 표현하는 방식이 달라 실제 색상이 다소 다르게 보일 수 있습니다. 또한 모니터의 밝기, 색상 설정, 사용 환경에 따라서도 차이가 발생할 수 있습니다. 머스티커는 고품질 인쇄를 통해 원본 디자인과 최대한 가까운 색상으로 제작해 드립니다.
              - button [ref=e773] [cursor=pointer]:
                - img [ref=e774]
            - generic [ref=e776]:
              - generic [ref=e777] [cursor=pointer]:
                - heading "자유형 스티커는 어떤 사이즈를 선택하는 것이 좋나요?" [level=3] [ref=e778]
                - paragraph [ref=e779]: 디자인에 따라 적합한 사이즈가 달라집니다. 간단한 로고나 아이콘은 소형 사이즈를, 디테일이 많은 일러스트나 텍스트가 포함된 디자인은 대형 사이즈를 추천합니다. 작은 글씨나 얇은 선이 있는 경우에는 큰 사이즈를 선택하면 더욱 선명하고 깔끔하게 제작할 수 있습니다.
              - button [ref=e780] [cursor=pointer]:
                - img [ref=e781]
          - generic [ref=e783]:
            - generic [ref=e784]:
              - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e785]
              - paragraph [ref=e786]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
            - button "문의하기" [ref=e787] [cursor=pointer]:
              - generic [ref=e788]: 문의하기
      - navigation "네이버 톡톡으로 문의하기" [ref=e789]:
        - link "카카오채널로 문의하기" [ref=e790] [cursor=pointer]:
          - /url: https://pf.kakao.com/_nJxnTX/chat
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 카카오채널로 문의하기
          - img [ref=e792]
        - link "네이버 톡톡 으로 문의하기" [ref=e793] [cursor=pointer]:
          - /url: https://talk.naver.com/ct/w2luxqo
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 네이버 톡톡 으로 문의하기
          - img [ref=e795]
        - generic "이메일로 문의하기" [ref=e796] [cursor=pointer]:
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 이메일로 문의하기
          - img [ref=e798]
    - contentinfo [ref=e799]:
      - generic [ref=e800]:
        - generic [ref=e801]:
          - heading "MUSTICKER / 머스티커" [level=2] [ref=e802]
          - paragraph [ref=e803]: "상호명: (주)글로픽스"
          - paragraph [ref=e804]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
          - paragraph [ref=e805]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
          - paragraph [ref=e806]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
          - paragraph [ref=e807]:
            - generic [ref=e808]: ⓒ 2026. All rights reserved.
            - generic [ref=e809]: "판매: sales@musticker.com"
            - link "이용약관" [ref=e810] [cursor=pointer]:
              - /url: /kr/terms-of-use
            - link "개인정보처리방침" [ref=e811] [cursor=pointer]:
              - /url: /kr/privacy-policy
            - generic [ref=e812] [cursor=pointer]: 사업자정보확인
            - link "오픈소스 라이선스" [ref=e813] [cursor=pointer]:
              - /url: /kr/open-source-licenses
            - link "회사소개" [ref=e814] [cursor=pointer]:
              - /url: /kr/about
        - generic [ref=e815]:
          - paragraph [ref=e816]: 1899-5529
          - paragraph [ref=e818]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
          - generic [ref=e819]:
            - button "1:1문의하기" [ref=e820] [cursor=pointer]
            - link "자주 묻는 질문" [ref=e821] [cursor=pointer]:
              - /url: /kr/faq
          - generic [ref=e822]:
            - generic [ref=e823]: "Follow us at:"
            - generic [ref=e824]:
              - link "instagram icon" [ref=e825] [cursor=pointer]:
                - /url: https://www.instagram.com/musticker_official/
                - img "instagram icon"
              - link "youtube icon" [ref=e826] [cursor=pointer]:
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