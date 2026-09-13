# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchasing/product-config.spec.ts >> storefront v2 product configuration >> MS-V2-013 product trust and delivery promises are visible
- Location: tests/e2e/purchasing/product-config.spec.ts:65:3

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
    - generic [ref=e31]:
      - generic [ref=e33]:
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
        - generic [ref=e36]:
          - generic [ref=e39]:
            - generic [ref=e40]:
              - heading "자유형 스티커" [level=1] [ref=e41]
              - paragraph [ref=e42]: 두텁고 강력한 내구성을 가진 소재를 자랑해요
            - img "자유형 스티커 preview poster" [ref=e44]
            - generic [ref=e46]:
              - button "소형 30x30 A6 105x148 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!" [ref=e47] [cursor=pointer]:
                - heading "소형 30x30" [level=4] [ref=e48]
                - img "A6 105x148" [ref=e49]
                - paragraph [ref=e50]: 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!
              - button "중형 75x75 A5 148x210 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요." [ref=e51] [cursor=pointer]:
                - heading "중형 75x75" [level=4] [ref=e52]
                - img "A5 148x210" [ref=e53]
                - paragraph [ref=e54]: 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요.
              - button "대형 100x100 A4 210x297 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요." [ref=e55] [cursor=pointer]:
                - heading "대형 100x100" [level=4] [ref=e56]
                - img "A4 210x297" [ref=e57]
                - paragraph [ref=e58]: 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요.
              - button "초대형 125x125 72x170 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요." [ref=e59] [cursor=pointer]:
                - heading "초대형 125x125" [level=4] [ref=e60]
                - img "72x170" [ref=e61]
                - paragraph [ref=e62]: 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요.
          - complementary [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e67]:
                - heading "사이즈를 선택하세요" [level=3] [ref=e68]
                - generic [ref=e69]: (단위:mm)
              - generic [ref=e70]:
                - button "소형 30x30" [ref=e71] [cursor=pointer]:
                  - generic [ref=e72]: 소형
                  - generic [ref=e73]: 30x30
                - button "중형 75x75" [ref=e74] [cursor=pointer]:
                  - generic [ref=e75]: 중형
                  - generic [ref=e76]: 75x75
                - button "대형 100x100" [ref=e77] [cursor=pointer]:
                  - generic [ref=e78]: 대형
                  - generic [ref=e79]: 100x100
                - button "초대형 125x125" [ref=e80] [cursor=pointer]:
                  - generic [ref=e81]: 초대형
                  - generic [ref=e82]: 125x125
                - 'button "원하는 크기 입력 주문 가능 크기: 25-1500mm" [ref=e83] [cursor=pointer]':
                  - generic [ref=e84]:
                    - img [ref=e85]
                    - paragraph [ref=e87]: 원하는 크기 입력
                  - generic [ref=e88]: "주문 가능 크기: 25-1500mm"
            - generic [ref=e89]:
              - heading "수량을 선택하세요" [level=3] [ref=e90]
              - generic [ref=e91]:
                - button "10개 2,700원" [ref=e92] [cursor=pointer]:
                  - generic [ref=e93]: 10개
                  - generic [ref=e94]: 2,700원
                - button "20개 5,100원" [ref=e95] [cursor=pointer]:
                  - generic [ref=e96]: 20개
                  - generic [ref=e97]: 5,100원
                - button "30개 7,600원" [ref=e98] [cursor=pointer]:
                  - generic [ref=e99]: 30개
                  - generic [ref=e100]: 7,600원
                - button "50개 11,800원" [ref=e101] [cursor=pointer]:
                  - generic [ref=e102]: 50개
                  - generic [ref=e103]: 11,800원
                - button "100개 17,700원" [ref=e104] [cursor=pointer]:
                  - generic [ref=e105]: 100개
                  - generic [ref=e106]: 17,700원
                - button "300개 35,400원" [ref=e107] [cursor=pointer]:
                  - generic [ref=e108]: 300개
                  - generic [ref=e109]: 35,400원
                - button "500개 42,500원" [ref=e110] [cursor=pointer]:
                  - generic [ref=e111]: 500개
                  - generic [ref=e112]: 42,500원
                - button "1,000개 58,000원" [ref=e113] [cursor=pointer]:
                  - generic [ref=e114]: 1,000개
                  - generic [ref=e115]: 58,000원
                - 'button "원하는 수량 입력 주문 가능 수량: 10-100,000개" [ref=e116] [cursor=pointer]':
                  - generic [ref=e117]:
                    - img [ref=e118]
                    - paragraph [ref=e120]: 원하는 수량 입력
                  - generic [ref=e121]: "주문 가능 수량: 10-100,000개"
            - generic [ref=e124]:
              - paragraph [ref=e126]:
                - strong [ref=e127]: 2,700원
              - paragraph [ref=e128]: (1매당 270원)
            - button "다음 단계" [ref=e130] [cursor=pointer]:
              - generic [ref=e131]: 다음 단계
            - list [ref=e133]:
              - listitem [ref=e134]: 5만원 이상 무료배송
              - listitem [ref=e135]: 3시 이전 시안 확정 시 당일배송
              - listitem [ref=e136]: "도착 예정일: 09.15 (화) · CJ 대한통운"
              - listitem [ref=e137]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
      - generic [ref=e139]:
        - article [ref=e140]:
          - img "오늘제작, 내일발송" [ref=e141]
          - heading "오늘제작, 내일발송" [level=4] [ref=e142]
          - paragraph [ref=e143]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
        - article [ref=e144]:
          - img "빠른 시안 피드백" [ref=e145]
          - heading "빠른 시안 피드백" [level=4] [ref=e146]
          - paragraph [ref=e147]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
        - article [ref=e148]:
          - img "뛰어난 내구성과 내수성" [ref=e149]
          - heading "뛰어난 내구성과 내수성" [level=4] [ref=e150]
          - paragraph [ref=e151]: 두꺼운 프리미엄 재질로 색상, 접착력 그대로 오래갑니다
      - generic [ref=e153]:
        - article [ref=e154]:
          - generic [ref=e157]:
            - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e158]
            - paragraph [ref=e159]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
        - article [ref=e160]:
          - generic [ref=e163]:
            - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e164]
            - paragraph [ref=e165]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
        - article [ref=e166]:
          - generic [ref=e169]:
            - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e170]
            - paragraph [ref=e171]: 로고, 일러스트, 사진을 업로드하면 칼선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
      - generic [ref=e173]:
        - generic [ref=e174]:
          - generic [ref=e175]:
            - generic [ref=e176]: 좋아요 😀
            - img "5 out of 5" [ref=e177]:
              - img [ref=e178]
              - img [ref=e180]
              - img [ref=e182]
              - img [ref=e184]
              - img [ref=e186]
            - generic [ref=e188]: "5.0"
          - heading "225개 사진 후기가 보장해요" [level=2] [ref=e189]
          - paragraph [ref=e190]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
          - generic [ref=e191]:
            - button "이전 리뷰" [disabled] [ref=e192] [cursor=pointer]:
              - img [ref=e193]
              - generic [ref=e195]: 이전 리뷰
            - button "다음 리뷰" [ref=e196] [cursor=pointer]:
              - img [ref=e197]
              - generic [ref=e199]: 다음 리뷰
        - generic [ref=e201]:
          - article [ref=e203]:
            - generic [ref=e204]:
              - img "tkop****" [ref=e206]
              - paragraph [ref=e208]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
            - generic [ref=e209]:
              - generic [ref=e210]:
                - img "tkop**** avatar" [ref=e211]
                - generic [ref=e212]:
                  - strong [ref=e213]: tkop****
                  - generic [ref=e214]: 2026-03-25
              - generic [ref=e215]:
                - img [ref=e216]
                - img [ref=e218]
                - img [ref=e220]
                - img [ref=e222]
                - img [ref=e224]
          - article [ref=e227]:
            - generic [ref=e228]:
              - img "oozz******" [ref=e230]
              - paragraph [ref=e232]: 잘나와서 만족합니다 잘쓰겠습니다
            - generic [ref=e233]:
              - generic [ref=e234]:
                - img "oozz****** avatar" [ref=e235]
                - generic [ref=e236]:
                  - strong [ref=e237]: oozz******
                  - generic [ref=e238]: 2026-03-22
              - generic [ref=e239]:
                - img [ref=e240]
                - img [ref=e242]
                - img [ref=e244]
                - img [ref=e246]
                - img [ref=e248]
          - article [ref=e251]:
            - generic [ref=e252]:
              - img "aktm********" [ref=e254]
              - paragraph [ref=e256]: 만족하면서 사용중입니다
            - generic [ref=e257]:
              - generic [ref=e258]:
                - img "aktm******** avatar" [ref=e259]
                - generic [ref=e260]:
                  - strong [ref=e261]: aktm********
                  - generic [ref=e262]: 2026-03-04
              - generic [ref=e263]:
                - img [ref=e264]
                - img [ref=e266]
                - img [ref=e268]
                - img [ref=e270]
                - img [ref=e272]
          - article [ref=e275]:
            - generic [ref=e276]:
              - img "aktm********" [ref=e278]
              - paragraph [ref=e280]: 잘 받았어요 잘쓸게요.
            - generic [ref=e281]:
              - generic [ref=e282]:
                - img "aktm******** avatar" [ref=e283]
                - generic [ref=e284]:
                  - strong [ref=e285]: aktm********
                  - generic [ref=e286]: 2026-01-31
              - generic [ref=e287]:
                - img [ref=e288]
                - img [ref=e290]
                - img [ref=e292]
                - img [ref=e294]
                - img [ref=e296]
          - article [ref=e299]:
            - generic [ref=e300]:
              - img "aktm********" [ref=e302]
              - paragraph [ref=e304]: 아주 잘쓰고있습니다.
            - generic [ref=e305]:
              - generic [ref=e306]:
                - img "aktm******** avatar" [ref=e307]
                - generic [ref=e308]:
                  - strong [ref=e309]: aktm********
                  - generic [ref=e310]: 2026-01-06
              - generic [ref=e311]:
                - img [ref=e312]
                - img [ref=e314]
                - img [ref=e316]
                - img [ref=e318]
                - img [ref=e320]
          - article [ref=e323]:
            - generic [ref=e324]:
              - img "aktm********" [ref=e326]
              - paragraph [ref=e328]: 아주 잘쓰고있습니다.
            - generic [ref=e329]:
              - generic [ref=e330]:
                - img "aktm******** avatar" [ref=e331]
                - generic [ref=e332]:
                  - strong [ref=e333]: aktm********
                  - generic [ref=e334]: 2026-01-06
              - generic [ref=e335]:
                - img [ref=e336]
                - img [ref=e338]
                - img [ref=e340]
                - img [ref=e342]
                - img [ref=e344]
          - article [ref=e347]:
            - generic [ref=e348]:
              - img "jiwn****" [ref=e350]
              - paragraph [ref=e352]: 아 정말 너무 좋아연ㅎㅎ
            - generic [ref=e353]:
              - generic [ref=e354]:
                - img "jiwn**** avatar" [ref=e355]
                - generic [ref=e356]:
                  - strong [ref=e357]: jiwn****
                  - generic [ref=e358]: 2025-12-29
              - generic [ref=e359]:
                - img [ref=e360]
                - img [ref=e362]
                - img [ref=e364]
                - img [ref=e366]
                - img [ref=e368]
          - article [ref=e371]:
            - generic [ref=e372]:
              - img "koj3***" [ref=e374]
              - paragraph [ref=e376]: 방수도 잘되고 오염에도 잘 버티고 좋아요. 적극 추천합니다.^^
            - generic [ref=e377]:
              - generic [ref=e378]:
                - img "koj3*** avatar" [ref=e379]
                - generic [ref=e380]:
                  - strong [ref=e381]: koj3***
                  - generic [ref=e382]: 2025-12-24
              - generic [ref=e383]:
                - img [ref=e384]
                - img [ref=e386]
                - img [ref=e388]
                - img [ref=e390]
                - img [ref=e392]
          - article [ref=e395]:
            - generic [ref=e396]:
              - img "aktm********" [ref=e398]
              - paragraph [ref=e400]: 이쁘네요 잘쓸게요.!!
            - generic [ref=e401]:
              - generic [ref=e402]:
                - img "aktm******** avatar" [ref=e403]
                - generic [ref=e404]:
                  - strong [ref=e405]: aktm********
                  - generic [ref=e406]: 2025-12-03
              - generic [ref=e407]:
                - img [ref=e408]
                - img [ref=e410]
                - img [ref=e412]
                - img [ref=e414]
                - img [ref=e416]
          - article [ref=e419]:
            - generic [ref=e420]:
              - img "aktm********" [ref=e422]
              - paragraph [ref=e424]: 이쁘게 잘뽑혔네요.
            - generic [ref=e425]:
              - generic [ref=e426]:
                - img "aktm******** avatar" [ref=e427]
                - generic [ref=e428]:
                  - strong [ref=e429]: aktm********
                  - generic [ref=e430]: 2025-11-30
              - generic [ref=e431]:
                - img [ref=e432]
                - img [ref=e434]
                - img [ref=e436]
                - img [ref=e438]
                - img [ref=e440]
          - article [ref=e443]:
            - generic [ref=e444]:
              - img "circ*****" [ref=e446]
              - paragraph [ref=e448]: 품질도 좋고 응대도 잘해주셔서 이쁘게 나왔네요
            - generic [ref=e449]:
              - generic [ref=e450]:
                - img "circ***** avatar" [ref=e451]
                - generic [ref=e452]:
                  - strong [ref=e453]: circ*****
                  - generic [ref=e454]: 2025-11-20
              - generic [ref=e455]:
                - img [ref=e456]
                - img [ref=e458]
                - img [ref=e460]
                - img [ref=e462]
                - img [ref=e464]
          - article [ref=e467]:
            - generic [ref=e468]:
              - img "pina******" [ref=e470]
              - paragraph [ref=e472]: 부착 잘되고 제거할때 끈적임 없이 깔끔하게 떨어져서 좋아요
            - generic [ref=e473]:
              - generic [ref=e474]:
                - img "pina****** avatar" [ref=e475]
                - generic [ref=e476]:
                  - strong [ref=e477]: pina******
                  - generic [ref=e478]: 2025-08-22
              - generic [ref=e479]:
                - img [ref=e480]
                - img [ref=e482]
                - img [ref=e484]
                - img [ref=e486]
                - img [ref=e488]
          - article [ref=e491]:
            - generic [ref=e492]:
              - img "qcyc*****" [ref=e494]
              - paragraph [ref=e496]: 덕분에 넘넘 잘썼습니다
            - generic [ref=e497]:
              - generic [ref=e498]:
                - img "qcyc***** avatar" [ref=e499]
                - generic [ref=e500]:
                  - strong [ref=e501]: qcyc*****
                  - generic [ref=e502]: 2025-08-15
              - generic [ref=e503]:
                - img [ref=e504]
                - img [ref=e506]
                - img [ref=e508]
                - img [ref=e510]
                - img [ref=e512]
          - article [ref=e515]:
            - generic [ref=e516]:
              - img "rlad*******" [ref=e518]
              - paragraph [ref=e520]: 꼼꼼하게 체크해주셔서 너무좋았습니다!
            - generic [ref=e521]:
              - generic [ref=e522]:
                - img "rlad******* avatar" [ref=e523]
                - generic [ref=e524]:
                  - strong [ref=e525]: rlad*******
                  - generic [ref=e526]: 2025-07-17
              - generic [ref=e527]:
                - img [ref=e528]
                - img [ref=e530]
                - img [ref=e532]
                - img [ref=e534]
                - img [ref=e536]
          - article [ref=e539]:
            - generic [ref=e540]:
              - img "csbn*****" [ref=e542]
              - paragraph [ref=e544]: 배송도 빠르고 재질도 좋고 너무 좋아요 감사합니다!
            - generic [ref=e545]:
              - generic [ref=e546]:
                - img "csbn***** avatar" [ref=e547]
                - generic [ref=e548]:
                  - strong [ref=e549]: csbn*****
                  - generic [ref=e550]: 2025-07-14
              - generic [ref=e551]:
                - img [ref=e552]
                - img [ref=e554]
                - img [ref=e556]
                - img [ref=e558]
                - img [ref=e560]
          - article [ref=e563]:
            - generic [ref=e564]:
              - img "pina******" [ref=e566]
              - paragraph [ref=e568]: 생각한대로 너무 깔끔하게 나왔어요! 다음에도 주문하겠습니다!!
            - generic [ref=e569]:
              - generic [ref=e570]:
                - img "pina****** avatar" [ref=e571]
                - generic [ref=e572]:
                  - strong [ref=e573]: pina******
                  - generic [ref=e574]: 2025-07-09
              - generic [ref=e575]:
                - img [ref=e576]
                - img [ref=e578]
                - img [ref=e580]
                - img [ref=e582]
                - img [ref=e584]
      - generic [ref=e587]:
        - generic [ref=e588]:
          - img "text" [ref=e589]
          - generic [ref=e590]:
            - heading "자유형 스티커 FAQ" [level=2] [ref=e591]
            - paragraph [ref=e592]:
              - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
              - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e593] [cursor=pointer]:
                - /url: https://www.musticker.com/faq
              - text: .
        - generic [ref=e594]:
          - generic [ref=e595]:
            - generic [ref=e596] [cursor=pointer]:
              - heading "자유형 스티커란 무엇인가요?" [level=3] [ref=e597]
              - paragraph [ref=e600]: 자유형 스티커는 원형이나 사각형 같은 규격 모양이 아닌, 디자인의 외곽선을 따라 제작되는 스티커입니다. 로고, 일러스트, 캐릭터, 텍스트 등 다양한 디자인을 원하는 모양으로 제작할 수 있습니다.
            - button [ref=e601] [cursor=pointer]:
              - img [ref=e602]
          - generic [ref=e604]:
            - generic [ref=e605] [cursor=pointer]:
              - heading "자유형 스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e606]
              - paragraph [ref=e607]: 머스티커의 자유형 스티커는 내구성이 뛰어난 PVC 용지에 인쇄되어 물, 햇빛, 일상적인 마모에 강합니다. 실내외 다양한 환경에서도 선명한 색감을 오래 유지합니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요
            - button [ref=e608] [cursor=pointer]:
              - img [ref=e609]
          - generic [ref=e611]:
            - generic [ref=e612] [cursor=pointer]:
              - heading "칼선은 직접 만들어야 하나요?" [level=3] [ref=e613]
              - paragraph [ref=e614]: 디자인 파일만 업로드해 주시면 머스티커에서 디자인에 맞게 칼선을 제작해 드립니다. 이미 칼선이 포함된 파일이 있다면 함께 업로드할 수 있으며, 보다 깔끔한 제작을 위해 디자인 외곽선을 따라 칼선을 작업하는 것을 권장합니다.
            - button [ref=e615] [cursor=pointer]:
              - img [ref=e616]
          - generic [ref=e618]:
            - generic [ref=e619] [cursor=pointer]:
              - heading "인쇄 색상은 화면과 동일하게 나오나요?" [level=3] [ref=e620]
              - paragraph [ref=e621]: 모니터와 인쇄물은 색상을 표현하는 방식이 달라 실제 색상이 다소 다르게 보일 수 있습니다. 또한 모니터의 밝기, 색상 설정, 사용 환경에 따라서도 차이가 발생할 수 있습니다. 머스티커는 고품질 인쇄를 통해 원본 디자인과 최대한 가까운 색상으로 제작해 드립니다.
            - button [ref=e622] [cursor=pointer]:
              - img [ref=e623]
          - generic [ref=e625]:
            - generic [ref=e626] [cursor=pointer]:
              - heading "자유형 스티커는 어떤 사이즈를 선택하는 것이 좋나요?" [level=3] [ref=e627]
              - paragraph [ref=e628]: 디자인에 따라 적합한 사이즈가 달라집니다. 간단한 로고나 아이콘은 소형 사이즈를, 디테일이 많은 일러스트나 텍스트가 포함된 디자인은 대형 사이즈를 추천합니다. 작은 글씨나 얇은 선이 있는 경우에는 큰 사이즈를 선택하면 더욱 선명하고 깔끔하게 제작할 수 있습니다.
            - button [ref=e629] [cursor=pointer]:
              - img [ref=e630]
        - generic [ref=e632]:
          - generic [ref=e633]:
            - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e634]
            - paragraph [ref=e635]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
          - button "문의하기" [ref=e636] [cursor=pointer]:
            - generic [ref=e637]: 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e638]:
      - link "카카오채널로 문의하기" [ref=e639] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e641]
      - link "네이버 톡톡 으로 문의하기" [ref=e642] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e644]
      - generic "이메일로 문의하기" [ref=e645] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e647]
  - contentinfo [ref=e648]:
    - generic [ref=e649]:
      - generic [ref=e650]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e651]
        - paragraph [ref=e652]: "상호명: (주)글로픽스"
        - paragraph [ref=e653]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e654]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e655]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e656]:
          - generic [ref=e657]: ⓒ 2026. All rights reserved.
          - generic [ref=e658]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e659] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e660] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - generic [ref=e661] [cursor=pointer]: 사업자정보확인
          - link "오픈소스 라이선스" [ref=e662] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e663] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e664]:
        - paragraph [ref=e665]: 1899-5529
        - paragraph [ref=e667]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e668]:
          - button "1:1문의하기" [ref=e669] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e670] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e671]:
          - generic [ref=e672]: "Follow us at:"
          - generic [ref=e673]:
            - link "instagram icon" [ref=e674] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e675] [cursor=pointer]:
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