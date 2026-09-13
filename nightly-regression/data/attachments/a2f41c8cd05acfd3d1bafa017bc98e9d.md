# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: discovery/catalog-crawl.spec.ts >> storefront v2 catalog crawl >> MS-V2-040 catalog page renders without error: ./stickers/clear-sticker
- Location: tests/e2e/discovery/catalog-crawl.spec.ts:13:5

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
              - heading "투명 스티커" [level=1] [ref=e41]
              - paragraph [ref=e42]: 투명한 소재로 자연스러운 연출이 가능한 스티커
            - img "투명 스티커 preview poster" [ref=e44]
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
                - 'button "원하는 크기 입력 주문 가능 크기: 10-1500mm" [ref=e83] [cursor=pointer]':
                  - generic [ref=e84]:
                    - img [ref=e85]
                    - paragraph [ref=e87]: 원하는 크기 입력
                  - generic [ref=e88]: "주문 가능 크기: 10-1500mm"
            - generic [ref=e89]:
              - heading "수량을 선택하세요" [level=3] [ref=e90]
              - 'button "원하는 수량 입력 주문 가능 수량: 10-100,000개" [ref=e92] [cursor=pointer]':
                - generic [ref=e93]:
                  - img [ref=e94]
                  - paragraph [ref=e96]: 원하는 수량 입력
                - generic [ref=e97]: "주문 가능 수량: 10-100,000개"
            - button "다음 단계" [disabled] [ref=e99]:
              - generic [ref=e100]: 다음 단계
            - list [ref=e102]:
              - listitem [ref=e103]: 5만원 이상 무료배송
              - listitem [ref=e104]: 3시 이전 시안 확정 시 당일배송
              - listitem [ref=e105]: "도착 예정일: 09.15 (화) · CJ 대한통운"
              - listitem [ref=e106]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
      - generic [ref=e108]:
        - article [ref=e109]:
          - img "오늘제작, 내일발송" [ref=e110]
          - heading "오늘제작, 내일발송" [level=4] [ref=e111]
          - paragraph [ref=e112]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
        - article [ref=e113]:
          - img "빠른 시안 피드백" [ref=e114]
          - heading "빠른 시안 피드백" [level=4] [ref=e115]
          - paragraph [ref=e116]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
        - article [ref=e117]:
          - img "뛰어난 내구성과 내수성" [ref=e118]
          - heading "뛰어난 내구성과 내수성" [level=4] [ref=e119]
          - paragraph [ref=e120]: 두꺼운 프리미엄 재질로 색상, 접착력 그대로 오래갑니다
      - generic [ref=e122]:
        - article [ref=e123]:
          - generic [ref=e126]:
            - heading "색감은 생생하게, 내구성은 완벽하게" [level=3] [ref=e127]
            - paragraph [ref=e128]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
        - article [ref=e129]:
          - generic [ref=e132]:
            - heading "쉽게 붙이고, 깔끔하게 제거" [level=3] [ref=e133]
            - paragraph [ref=e134]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
        - article [ref=e135]:
          - generic [ref=e138]:
            - heading "디자인에 맞게 정확하게 컷팅" [level=3] [ref=e139]
            - paragraph [ref=e140]: 로고, 일러스트, 사진을 업로드하면 칼선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
      - generic [ref=e142]:
        - generic [ref=e143]:
          - generic [ref=e144]:
            - generic [ref=e145]: 좋아요 😀
            - img "5 out of 5" [ref=e146]:
              - img [ref=e147]
              - img [ref=e149]
              - img [ref=e151]
              - img [ref=e153]
              - img [ref=e155]
            - generic [ref=e157]: "5.0"
          - heading "225개 사진 후기가 보장해요" [level=2] [ref=e158]
          - paragraph [ref=e159]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
          - generic [ref=e160]:
            - button "이전 리뷰" [disabled] [ref=e161] [cursor=pointer]:
              - img [ref=e162]
              - generic [ref=e164]: 이전 리뷰
            - button "다음 리뷰" [ref=e165] [cursor=pointer]:
              - img [ref=e166]
              - generic [ref=e168]: 다음 리뷰
        - generic [ref=e170]:
          - article [ref=e172]:
            - generic [ref=e173]:
              - img "tkop****" [ref=e175]
              - paragraph [ref=e177]: 빨리오고 너무 이쁘게 만들어주셔서 감사합니다 그리고 서비스도 20장 더 주셔서 감사합니다
            - generic [ref=e178]:
              - generic [ref=e179]:
                - img "tkop**** avatar" [ref=e180]
                - generic [ref=e181]:
                  - strong [ref=e182]: tkop****
                  - generic [ref=e183]: 2026-03-25
              - generic [ref=e184]:
                - img [ref=e185]
                - img [ref=e187]
                - img [ref=e189]
                - img [ref=e191]
                - img [ref=e193]
          - article [ref=e196]:
            - generic [ref=e197]:
              - img "oozz******" [ref=e199]
              - paragraph [ref=e201]: 잘나와서 만족합니다 잘쓰겠습니다
            - generic [ref=e202]:
              - generic [ref=e203]:
                - img "oozz****** avatar" [ref=e204]
                - generic [ref=e205]:
                  - strong [ref=e206]: oozz******
                  - generic [ref=e207]: 2026-03-22
              - generic [ref=e208]:
                - img [ref=e209]
                - img [ref=e211]
                - img [ref=e213]
                - img [ref=e215]
                - img [ref=e217]
          - article [ref=e220]:
            - generic [ref=e221]:
              - img "aktm********" [ref=e223]
              - paragraph [ref=e225]: 만족하면서 사용중입니다
            - generic [ref=e226]:
              - generic [ref=e227]:
                - img "aktm******** avatar" [ref=e228]
                - generic [ref=e229]:
                  - strong [ref=e230]: aktm********
                  - generic [ref=e231]: 2026-03-04
              - generic [ref=e232]:
                - img [ref=e233]
                - img [ref=e235]
                - img [ref=e237]
                - img [ref=e239]
                - img [ref=e241]
          - article [ref=e244]:
            - generic [ref=e245]:
              - img "aktm********" [ref=e247]
              - paragraph [ref=e249]: 잘 받았어요 잘쓸게요.
            - generic [ref=e250]:
              - generic [ref=e251]:
                - img "aktm******** avatar" [ref=e252]
                - generic [ref=e253]:
                  - strong [ref=e254]: aktm********
                  - generic [ref=e255]: 2026-01-31
              - generic [ref=e256]:
                - img [ref=e257]
                - img [ref=e259]
                - img [ref=e261]
                - img [ref=e263]
                - img [ref=e265]
          - article [ref=e268]:
            - generic [ref=e269]:
              - img "aktm********" [ref=e271]
              - paragraph [ref=e273]: 아주 잘쓰고있습니다.
            - generic [ref=e274]:
              - generic [ref=e275]:
                - img "aktm******** avatar" [ref=e276]
                - generic [ref=e277]:
                  - strong [ref=e278]: aktm********
                  - generic [ref=e279]: 2026-01-06
              - generic [ref=e280]:
                - img [ref=e281]
                - img [ref=e283]
                - img [ref=e285]
                - img [ref=e287]
                - img [ref=e289]
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
                - img [ref=e307]
                - img [ref=e309]
                - img [ref=e311]
                - img [ref=e313]
          - article [ref=e316]:
            - generic [ref=e317]:
              - img "jiwn****" [ref=e319]
              - paragraph [ref=e321]: 아 정말 너무 좋아연ㅎㅎ
            - generic [ref=e322]:
              - generic [ref=e323]:
                - img "jiwn**** avatar" [ref=e324]
                - generic [ref=e325]:
                  - strong [ref=e326]: jiwn****
                  - generic [ref=e327]: 2025-12-29
              - generic [ref=e328]:
                - img [ref=e329]
                - img [ref=e331]
                - img [ref=e333]
                - img [ref=e335]
                - img [ref=e337]
          - article [ref=e340]:
            - generic [ref=e341]:
              - img "koj3***" [ref=e343]
              - paragraph [ref=e345]: 방수도 잘되고 오염에도 잘 버티고 좋아요. 적극 추천합니다.^^
            - generic [ref=e346]:
              - generic [ref=e347]:
                - img "koj3*** avatar" [ref=e348]
                - generic [ref=e349]:
                  - strong [ref=e350]: koj3***
                  - generic [ref=e351]: 2025-12-24
              - generic [ref=e352]:
                - img [ref=e353]
                - img [ref=e355]
                - img [ref=e357]
                - img [ref=e359]
                - img [ref=e361]
          - article [ref=e364]:
            - generic [ref=e365]:
              - img "aktm********" [ref=e367]
              - paragraph [ref=e369]: 이쁘네요 잘쓸게요.!!
            - generic [ref=e370]:
              - generic [ref=e371]:
                - img "aktm******** avatar" [ref=e372]
                - generic [ref=e373]:
                  - strong [ref=e374]: aktm********
                  - generic [ref=e375]: 2025-12-03
              - generic [ref=e376]:
                - img [ref=e377]
                - img [ref=e379]
                - img [ref=e381]
                - img [ref=e383]
                - img [ref=e385]
          - article [ref=e388]:
            - generic [ref=e389]:
              - img "aktm********" [ref=e391]
              - paragraph [ref=e393]: 이쁘게 잘뽑혔네요.
            - generic [ref=e394]:
              - generic [ref=e395]:
                - img "aktm******** avatar" [ref=e396]
                - generic [ref=e397]:
                  - strong [ref=e398]: aktm********
                  - generic [ref=e399]: 2025-11-30
              - generic [ref=e400]:
                - img [ref=e401]
                - img [ref=e403]
                - img [ref=e405]
                - img [ref=e407]
                - img [ref=e409]
          - article [ref=e412]:
            - generic [ref=e413]:
              - img "circ*****" [ref=e415]
              - paragraph [ref=e417]: 품질도 좋고 응대도 잘해주셔서 이쁘게 나왔네요
            - generic [ref=e418]:
              - generic [ref=e419]:
                - img "circ***** avatar" [ref=e420]
                - generic [ref=e421]:
                  - strong [ref=e422]: circ*****
                  - generic [ref=e423]: 2025-11-20
              - generic [ref=e424]:
                - img [ref=e425]
                - img [ref=e427]
                - img [ref=e429]
                - img [ref=e431]
                - img [ref=e433]
          - article [ref=e436]:
            - generic [ref=e437]:
              - img "pina******" [ref=e439]
              - paragraph [ref=e441]: 부착 잘되고 제거할때 끈적임 없이 깔끔하게 떨어져서 좋아요
            - generic [ref=e442]:
              - generic [ref=e443]:
                - img "pina****** avatar" [ref=e444]
                - generic [ref=e445]:
                  - strong [ref=e446]: pina******
                  - generic [ref=e447]: 2025-08-22
              - generic [ref=e448]:
                - img [ref=e449]
                - img [ref=e451]
                - img [ref=e453]
                - img [ref=e455]
                - img [ref=e457]
          - article [ref=e460]:
            - generic [ref=e461]:
              - img "qcyc*****" [ref=e463]
              - paragraph [ref=e465]: 덕분에 넘넘 잘썼습니다
            - generic [ref=e466]:
              - generic [ref=e467]:
                - img "qcyc***** avatar" [ref=e468]
                - generic [ref=e469]:
                  - strong [ref=e470]: qcyc*****
                  - generic [ref=e471]: 2025-08-15
              - generic [ref=e472]:
                - img [ref=e473]
                - img [ref=e475]
                - img [ref=e477]
                - img [ref=e479]
                - img [ref=e481]
          - article [ref=e484]:
            - generic [ref=e485]:
              - img "rlad*******" [ref=e487]
              - paragraph [ref=e489]: 꼼꼼하게 체크해주셔서 너무좋았습니다!
            - generic [ref=e490]:
              - generic [ref=e491]:
                - img "rlad******* avatar" [ref=e492]
                - generic [ref=e493]:
                  - strong [ref=e494]: rlad*******
                  - generic [ref=e495]: 2025-07-17
              - generic [ref=e496]:
                - img [ref=e497]
                - img [ref=e499]
                - img [ref=e501]
                - img [ref=e503]
                - img [ref=e505]
          - article [ref=e508]:
            - generic [ref=e509]:
              - img "csbn*****" [ref=e511]
              - paragraph [ref=e513]: 배송도 빠르고 재질도 좋고 너무 좋아요 감사합니다!
            - generic [ref=e514]:
              - generic [ref=e515]:
                - img "csbn***** avatar" [ref=e516]
                - generic [ref=e517]:
                  - strong [ref=e518]: csbn*****
                  - generic [ref=e519]: 2025-07-14
              - generic [ref=e520]:
                - img [ref=e521]
                - img [ref=e523]
                - img [ref=e525]
                - img [ref=e527]
                - img [ref=e529]
          - article [ref=e532]:
            - generic [ref=e533]:
              - img "pina******" [ref=e535]
              - paragraph [ref=e537]: 생각한대로 너무 깔끔하게 나왔어요! 다음에도 주문하겠습니다!!
            - generic [ref=e538]:
              - generic [ref=e539]:
                - img "pina****** avatar" [ref=e540]
                - generic [ref=e541]:
                  - strong [ref=e542]: pina******
                  - generic [ref=e543]: 2025-07-09
              - generic [ref=e544]:
                - img [ref=e545]
                - img [ref=e547]
                - img [ref=e549]
                - img [ref=e551]
                - img [ref=e553]
      - generic [ref=e556]:
        - generic [ref=e557]:
          - img "text" [ref=e558]
          - generic [ref=e559]:
            - heading "투명 스티커 FAQ" [level=2] [ref=e560]
            - paragraph [ref=e561]:
              - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
              - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e562] [cursor=pointer]:
                - /url: https://www.musticker.com/faq
              - text: .
        - generic [ref=e563]:
          - generic [ref=e564]:
            - generic [ref=e565] [cursor=pointer]:
              - heading "투명 스티커란 무엇인가요?" [level=3] [ref=e566]
              - paragraph [ref=e569]: 투명 스티커는 투명 PVC 용지에 인쇄되어 부착한 표면이 자연스럽게 비치는 스티커입니다. 유리, 창문, 패키지 등 다양한 표면에 잘 어우러져 깔끔하고 세련된 느낌을 연출할 수 있습니다.
            - button [ref=e570] [cursor=pointer]:
              - img [ref=e571]
          - generic [ref=e573]:
            - generic [ref=e574] [cursor=pointer]:
              - heading "투명 스티커는 어떤 표면에 부착하기 좋나요?" [level=3] [ref=e575]
              - paragraph [ref=e576]: 투명 스티커는 유리, 플라스틱, 아크릴 등 매끄러운 표면에 부착하기 좋습니다. 병, 용기, 쇼윈도 등 다양한 곳에 많이 사용됩니다.
            - button [ref=e577] [cursor=pointer]:
              - img [ref=e578]
          - generic [ref=e580]:
            - generic [ref=e581] [cursor=pointer]:
              - heading "투명 스티커용 디자인은 어떻게 준비해야 하나요?" [level=3] [ref=e582]
              - paragraph [ref=e583]: 투명하게 표현할 부분은 디자인에서 비워 두어야 합니다. 백색 인쇄가 필요한 경우에는 해당 영역을 함께 표시해 주세요.
            - button [ref=e584] [cursor=pointer]:
              - img [ref=e585]
          - generic [ref=e587]:
            - generic [ref=e588] [cursor=pointer]:
              - heading "투명 스티커는 색상이 다르게 보일 수 있나요?" [level=3] [ref=e589]
              - paragraph [ref=e590]: 네. 백색 인쇄 없이 제작하는 경우에는 색상이 옅게 표현될 수 있으며, 특히 어두운 표면에 부착하면 색상이 더욱 연하게 보일 수 있습니다.
            - button [ref=e591] [cursor=pointer]:
              - img [ref=e592]
          - generic [ref=e594]:
            - generic [ref=e595] [cursor=pointer]:
              - heading "투명 스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e596]
              - paragraph [ref=e597]: 네. 머스티커의 투명 스티커는 내구성이 뛰어난 PVC 용지에 인쇄되어 방수와 습기에 강하며, 선명한 인쇄 상태를 오래 유지합니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요.
            - button [ref=e598] [cursor=pointer]:
              - img [ref=e599]
        - generic [ref=e601]:
          - generic [ref=e602]:
            - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e603]
            - paragraph [ref=e604]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
          - button "문의하기" [ref=e605] [cursor=pointer]:
            - generic [ref=e606]: 문의하기
    - navigation "네이버 톡톡으로 문의하기" [ref=e607]:
      - link "카카오채널로 문의하기" [ref=e608] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e610]
      - link "네이버 톡톡 으로 문의하기" [ref=e611] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e613]
      - generic "이메일로 문의하기" [ref=e614] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e616]
  - contentinfo [ref=e617]:
    - generic [ref=e618]:
      - generic [ref=e619]:
        - heading "MUSTICKER / 머스티커" [level=2] [ref=e620]
        - paragraph [ref=e621]: "상호명: (주)글로픽스"
        - paragraph [ref=e622]: "사업자등록번호 : 877-88-03313 통신판매업신고 : 2026-부산해운대-0792호"
        - paragraph [ref=e623]: "대표이사 : 여일석 주소 : 부산광역시 해운대구 해운대해변로 203 오션타워 1014호"
        - paragraph [ref=e624]: "호스팅사업자 : 아마존웹서비시즈(Amazon Web Services)"
        - paragraph [ref=e625]:
          - generic [ref=e626]: ⓒ 2026. All rights reserved.
          - generic [ref=e627]: "판매: sales@musticker.com"
          - link "이용약관" [ref=e628] [cursor=pointer]:
            - /url: /kr/terms-of-use
          - link "개인정보처리방침" [ref=e629] [cursor=pointer]:
            - /url: /kr/privacy-policy
          - generic [ref=e630] [cursor=pointer]: 사업자정보확인
          - link "오픈소스 라이선스" [ref=e631] [cursor=pointer]:
            - /url: /kr/open-source-licenses
          - link "회사소개" [ref=e632] [cursor=pointer]:
            - /url: /kr/about
      - generic [ref=e633]:
        - paragraph [ref=e634]: 1899-5529
        - paragraph [ref=e636]: 오전 9시 ~ 오후 6시(토요일, 공휴일 휴무)
        - generic [ref=e637]:
          - button "1:1문의하기" [ref=e638] [cursor=pointer]
          - link "자주 묻는 질문" [ref=e639] [cursor=pointer]:
            - /url: /kr/faq
        - generic [ref=e640]:
          - generic [ref=e641]: "Follow us at:"
          - generic [ref=e642]:
            - link "instagram icon" [ref=e643] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
              - img "instagram icon"
            - link "youtube icon" [ref=e644] [cursor=pointer]:
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