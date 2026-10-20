# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/configuration/sheet-sticker-configurator.spec.ts >> Sheet sticker configurator >> MS-CFG-007 타원형 판스티커 supports material, size, and quantity selection through to cart
- Location: tests/e2e/storefront/configuration/sheet-sticker-configurator.spec.ts:41:5

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 46

- Array []
+ Array [
+   "[warning] Failed to load messages for locale \"kr\" FetchError: [GET] \"/_i18n/7a07a3d9/kr/messages.json\": 403 
+     at async l (https://www.musticker.com/_nuxt/UTjbfT_H.js:1:6198)
+     at async b (https://www.musticker.com/_nuxt/K_gswfE8.js:2:77369)
+     at async Object.loadMessages (https://www.musticker.com/_nuxt/K_gswfE8.js:2:78499)
+     at async ss (https://www.musticker.com/_nuxt/K_gswfE8.js:2:81648)
+     at async setup (https://www.musticker.com/_nuxt/K_gswfE8.js:2:82078)
+     at async R (https://www.musticker.com/_nuxt/BH9w__-s.js:1:7406)
+     at async s (https://www.musticker.com/_nuxt/BH9w__-s.js:1:7963)
+     at async https://www.musticker.com/_nuxt/BH9w__-s.js:1:7864
+     at async Promise.all (index 0)
+     at async https://www.musticker.com/_nuxt/BH9w__-s.js:1:7773",
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
+   "[error] TypeError: Failed to fetch dynamically imported module: https://www.musticker.com/_nuxt/Ny9rJUm-.js",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] TypeError: Failed to fetch dynamically imported module: https://www.musticker.com/_nuxt/Dat5P4cV.js",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 33

- Array []
+ Array [
+   "403 https://www.musticker.com/_nuxt/InquiryModal.BNgxatOq.css",
+   "403 https://www.musticker.com/_nuxt/ProductHeroSlice.BzeXtR-2.css",
+   "403 https://www.musticker.com/_nuxt/ProductOptionsSlice.iDaatl6x.css",
+   "403 https://www.musticker.com/_nuxt/ProductCategoryDetails.CtuP1T_A.css",
+   "403 https://www.musticker.com/_nuxt/Index.D-ACRMRc.css",
+   "403 https://www.musticker.com/_nuxt/CartUploadModalStudio.DLnrUfho.css",
+   "403 https://www.musticker.com/_nuxt/ProductReviewsSection.DuJ3Otra.css",
+   "403 https://www.musticker.com/_nuxt/productFaqSection.DZ7suq7q.css",
+   "403 https://www.musticker.com/_nuxt/GiftAnimation.DtWNas0o.css",
+   "403 https://www.musticker.com/_nuxt/Card.BGe_udBI.css",
+   "403 https://www.musticker.com/_nuxt/ChallengeCompletedModal.DlemBqHg.css",
+   "403 https://www.musticker.com/_nuxt/AppHeaderLocaleModal.BixmadvG.css",
+   "403 https://www.musticker.com/_nuxt/MuStudioIndicator.D-rmAJLs.css",
+   "403 https://www.musticker.com/_nuxt/CartPreview.D1Slfp-t.css",
+   "403 https://www.musticker.com/_nuxt/DqNEmTaX.js",
+   "403 https://www.musticker.com/_nuxt/DR-59Jw5.js",
+   "403 https://www.musticker.com/_nuxt/tIo9lPyP.js",
+   "403 https://www.musticker.com/_nuxt/B9wsjZIk.js",
+   "403 https://www.musticker.com/_nuxt/D_I0tckz.js",
+   "403 https://www.musticker.com/_nuxt/CRYGHoNA.js",
+   "403 https://www.musticker.com/_nuxt/Dhmj8T-p.js",
+   "403 https://www.musticker.com/_nuxt/D_ce-l6S.js",
+   "403 https://www.musticker.com/_nuxt/Cdc4R-x_.js",
+   "403 https://www.musticker.com/_nuxt/CXIez-SP.js",
+   "403 https://www.musticker.com/kr/_payload.json?_b=24ec9757-4827-4069-985a-e84733cac906",
+   "403 https://www.musticker.com/_nuxt/Ny9rJUm-.js",
+   "403 https://www.musticker.com/_nuxt/Dat5P4cV.js",
+   "403 https://www.musticker.com/icons/sprite.svg?v=1788835890778",
+   "403 https://www.musticker.com/kr/sheet-stickers/oval-sheet",
+   "403 https://www.musticker.com/kr/sheet-stickers/oval-sheet",
+   "403 https://www.musticker.com/kr/sheet-stickers/oval-sheet",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
            - generic [ref=e18]:
              - button "장바구니" [ref=e19] [cursor=pointer]:
                - img [ref=e20]
              - generic: "1"
            - button "계정" [ref=e23] [cursor=pointer]:
              - img [ref=e25]
        - navigation "Primary":
          - link "스티커" [ref=e27] [cursor=pointer]:
            - /url: javascript:;
          - link "롤스티커" [ref=e28] [cursor=pointer]:
            - /url: javascript:;
          - link "판스티커" [ref=e29] [cursor=pointer]:
            - /url: javascript:;
    - main [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e36]:
          - generic [ref=e39]:
            - generic [ref=e40]:
              - heading "타원형 판스티커" [level=1] [ref=e41]
              - paragraph [ref=e42]: 한 장의 시트에 정돈되어 깔끔하게 부착하기 좋은 타원형 판스티커
            - img "타원형 판스티커 preview poster" [ref=e44]
            - generic [ref=e46]:
              - button "소형 40x20 product.sizes.small40x20.label 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!" [ref=e47] [cursor=pointer]:
                - heading "소형 40x20" [level=4] [ref=e48]
                - img "product.sizes.small40x20.label" [ref=e49]
                - paragraph [ref=e50]: 작고 귀여운 크기로 휴대폰 케이스나 헬멧에 딱!
              - button "중형 50x30 product.sizes.medium50x30.label 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요." [ref=e51] [cursor=pointer]:
                - heading "중형 50x30" [level=4] [ref=e52]
                - img "product.sizes.medium50x30.label" [ref=e53]
                - paragraph [ref=e54]: 텀블러·노트북에 잘 어울려요. 가장 인기 있는 사이즈예요.
              - button "대형 75x50 product.sizes.large75x50.label 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요." [ref=e55] [cursor=pointer]:
                - heading "대형 75x50" [level=4] [ref=e56]
                - img "product.sizes.large75x50.label" [ref=e57]
                - paragraph [ref=e58]: 보드나 캐리어에 붙이면 눈에 잘 띄는 크기예요.
              - button "초대형 90x60 product.sizes.extraLarge90x60.label 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요." [ref=e59] [cursor=pointer]:
                - heading "초대형 90x60" [level=4] [ref=e60]
                - img "product.sizes.extraLarge90x60.label" [ref=e61]
                - paragraph [ref=e62]: 차·아이스박스·공구함에도 딱 맞는 넉넉한 크기예요.
          - complementary [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e67]:
                - heading "원하시는 소재를 선택하세요" [level=3] [ref=e68]
                - button "판스티커 소재 안내 열기" [ref=e69] [cursor=pointer]:
                  - img [ref=e70]
              - generic [ref=e72]:
                - button "무광 화이트" [ref=e73] [cursor=pointer]:
                  - paragraph [ref=e74]: 무광 화이트
                - button "투명" [ref=e75] [cursor=pointer]:
                  - paragraph [ref=e76]: 투명
                - button "홀로그램" [ref=e77] [cursor=pointer]:
                  - paragraph [ref=e78]: 홀로그램
            - generic [ref=e79]:
              - generic [ref=e80]:
                - heading "개별 스티커 사이즈를 선택하세요" [level=3] [ref=e81]
                - generic [ref=e82]: (단위:mm)
              - generic [ref=e83]:
                - button "소형 40x20" [ref=e84] [cursor=pointer]:
                  - generic [ref=e85]: 소형
                  - generic [ref=e86]: 40x20
                - button "중형 50x30" [ref=e87] [cursor=pointer]:
                  - generic [ref=e88]: 중형
                  - generic [ref=e89]: 50x30
                - button "대형 75x50" [ref=e90] [cursor=pointer]:
                  - generic [ref=e91]: 대형
                  - generic [ref=e92]: 75x50
                - button "초대형 90x60" [ref=e93] [cursor=pointer]:
                  - generic [ref=e94]: 초대형
                  - generic [ref=e95]: 90x60
                - 'button "원하는 크기 입력 주문 가능 크기: 10-200mm" [ref=e96] [cursor=pointer]':
                  - generic [ref=e97]:
                    - img [ref=e98]
                    - paragraph [ref=e100]: 원하는 크기 입력
                  - generic [ref=e101]: "주문 가능 크기: 10-200mm"
            - generic [ref=e102]:
              - heading "수량을 선택하세요" [level=3] [ref=e103]
              - generic [ref=e104]:
                - button "10시트 6,100원" [ref=e105] [cursor=pointer]:
                  - generic [ref=e106]: 10시트
                  - generic [ref=e107]: 6,100원
                - button "20시트 11,730원" [ref=e108] [cursor=pointer]:
                  - generic [ref=e109]: 20시트
                  - generic [ref=e110]: 11,730원
                - button "50시트 27,200원" [ref=e111] [cursor=pointer]:
                  - generic [ref=e112]: 50시트
                  - generic [ref=e113]: 27,200원
                - button "100시트 53,110원" [ref=e114] [cursor=pointer]:
                  - generic [ref=e115]: 100시트
                  - generic [ref=e116]: 53,110원
                - button "200시트 101,200원" [ref=e117] [cursor=pointer]:
                  - generic [ref=e118]: 200시트
                  - generic [ref=e119]: 101,200원
                - button "500시트 193,970원" [ref=e120] [cursor=pointer]:
                  - generic [ref=e121]: 500시트
                  - generic [ref=e122]: 193,970원
                - button "1,000시트 315,330원" [ref=e123] [cursor=pointer]:
                  - generic [ref=e124]: 1,000시트
                  - generic [ref=e125]: 315,330원
                - 'button "원하는 수량 입력 주문 가능 수량: 5-1,000시트" [ref=e126] [cursor=pointer]':
                  - generic [ref=e127]:
                    - img [ref=e128]
                    - paragraph [ref=e130]: 원하는 수량 입력
                  - generic [ref=e131]: "주문 가능 수량: 5-1,000시트"
            - region "Sheet summary" [ref=e132]:
              - img "A5 sheet" [ref=e133]
              - generic [ref=e134]:
                - paragraph [ref=e135]: 1시트 = 스티커 10개
                - paragraph [ref=e136]: "총 스티커 수량 : 200개"
            - generic [ref=e139]:
              - generic [ref=e140]:
                - paragraph [ref=e141]:
                  - generic [ref=e142]: "-6%"
                  - generic [ref=e143]: 12,520원
                - paragraph [ref=e144]:
                  - strong [ref=e145]: 11,730원
              - paragraph [ref=e146]: (1시트당 586.5원)
            - generic [ref=e147]:
              - button "다음 단계" [active] [ref=e148] [cursor=pointer]:
                - generic [ref=e149]: 다음 단계
              - generic [ref=e150]:
                - paragraph [ref=e151]: 스티커는 A5 시트(148×210mm)에 인쇄됩니다. 아래 가이드를 통해 사이즈별 배치 수량을 확인하고, 가장 적합한 옵션을 선택해 보세요.
                - generic [ref=e153] [cursor=pointer]:
                  - generic [ref=e154]: 배치 가이드 보기
                  - img [ref=e155]
            - list [ref=e158]:
              - listitem [ref=e159]: 5만원 이상 무료배송
              - listitem [ref=e160]: 12시 이전 시안 확정 시 당일배송
              - listitem [ref=e161]: "발송 예정일: 10.21 (수) · CJ 대한통운"
              - listitem [ref=e162]: 시안 승인 후 평균 1~3일 내 배송됩니다. (주말·공휴일 제외)
        - generic [ref=e164]:
          - article [ref=e165]:
            - img "오늘제작, 내일발송" [ref=e166]
            - heading "오늘제작, 내일발송" [level=4] [ref=e167]
            - paragraph [ref=e168]: 디자인 승인 즉시 제작이 시작됩니다 평균 1~2일 안에 당신의 손에 도착하죠
          - article [ref=e169]:
            - img "빠른 시안 피드백" [ref=e170]
            - heading "빠른 시안 피드백" [level=4] [ref=e171]
            - paragraph [ref=e172]: 결제 후 곧바로 시안을 받아보세요 마음이 ‘예스’ 할 때까지 수정 가능합니다
          - article [ref=e173]:
            - img "빠르고 간편한 부착" [ref=e174]
            - heading "빠르고 간편한 부착" [level=4] [ref=e175]
            - paragraph [ref=e176]: 스티커가 시트에서 쉽게 떼어져 원하는 곳에 빠르고 간편하게 부착할 수 있습니다.
        - generic [ref=e178]:
          - article [ref=e179]:
            - generic [ref=e182]:
              - heading "색감은 생생하게, 내구성은 완벽하게" [level=2] [ref=e183]
              - paragraph [ref=e184]: 고품질 인쇄와 두꺼운 소재로 구현한 화려하고 선명한 색감. 비, 햇빛, 고온에도 쉽게 흐려지지 않는 뛰어난 내구성. 붙이는 순간부터 오래도록 변하지 않는 품질을 느껴보세요.
          - article [ref=e185]:
            - generic [ref=e188]:
              - heading "쉽게 붙이고, 깔끔하게 제거" [level=2] [ref=e189]
              - paragraph [ref=e190]: 매끄럽게 부착되고, 흔적 없이 깔끔하게 떨어집니다. 접착은 강력하지만, 표면은 안전하게 보호합니다. 필요할 땐 단번에 제거되고, 남는 건 깔끔함뿐입니다.
          - article [ref=e191]:
            - generic [ref=e194]:
              - heading "디자인에 맞게 정확하게 컷팅" [level=2] [ref=e195]
              - paragraph [ref=e196]: 로고, 일러스트, 사진을 업로드하면 컷팅선에 맞춰 정밀하게 스티커로 제작됩니다. 복잡한 패턴도 머스티커의 고유한 절단 기술로 완벽하게 표현됩니다.
        - generic [ref=e199]:
          - generic [ref=e200]:
            - generic [ref=e201]:
              - heading "사진만 올리면, 스티커 완성" [level=2] [ref=e202]
              - paragraph [ref=e203]: 사진을 올리면 스티커 모양을 바로 확인할 수 있어요. 크기와 커팅라인도 원하는 대로 조절하고, 완성된 모습 그대로 주문하세요.
            - button "주문 방법 보기" [ref=e204] [cursor=pointer]:
              - generic [ref=e205]: 주문 방법 보기
              - img [ref=e206]
          - generic "가을 공원 잔디밭에서 하얀 강아지와 함께 뛰어오는 아이를 스마트폰으로 촬영하는 여성" [ref=e209]
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
            - heading "255개 사진 후기가 보장해요" [level=2] [ref=e227]
            - paragraph [ref=e228]: 직접 사용한 고객들의 생생한 리뷰를 확인해보세요. 리얼 사용 이미지와 함께 실제 만족도를 보여드립니다.
            - generic [ref=e229]:
              - button "이전 리뷰" [disabled] [ref=e230] [cursor=pointer]:
                - img [ref=e231]
                - generic [ref=e233]: 이전 리뷰
              - button "다음 리뷰" [ref=e234] [cursor=pointer]:
                - img [ref=e235]
                - generic [ref=e237]: 다음 리뷰
          - generic [ref=e239]:
            - article [ref=e241]:
              - generic [ref=e242]:
                - img "박효****" [ref=e244]
                - paragraph [ref=e246]: 선명하게 인쇄 잘 해주셔서 감사합니다
              - generic [ref=e247]:
                - generic [ref=e248]:
                  - generic [ref=e249]: 박
                  - generic [ref=e250]:
                    - strong [ref=e251]: 박효****
                    - generic [ref=e252]: 2026-10-19
                - generic [ref=e253]:
                  - img [ref=e254]
                  - img [ref=e256]
                  - img [ref=e258]
                  - img [ref=e260]
                  - img [ref=e262]
            - article [ref=e265]:
              - generic [ref=e266]:
                - img "지선****" [ref=e268]
                - paragraph [ref=e270]: 좋았습니다
              - generic [ref=e271]:
                - generic [ref=e272]:
                  - generic [ref=e273]: 지
                  - generic [ref=e274]:
                    - strong [ref=e275]: 지선****
                    - generic [ref=e276]: 2026-10-19
                - generic [ref=e277]:
                  - img [ref=e278]
                  - img [ref=e280]
                  - img [ref=e282]
                  - img [ref=e284]
                  - img [ref=e286]
            - article [ref=e289]:
              - generic [ref=e290]:
                - img "홍은****" [ref=e292]
                - paragraph [ref=e294]: 배송도 빠르고 너무너무 만족해용 다음에 또 이용할게요 ^.^
              - generic [ref=e295]:
                - generic [ref=e296]:
                  - generic [ref=e297]: 홍
                  - generic [ref=e298]:
                    - strong [ref=e299]: 홍은****
                    - generic [ref=e300]: 2026-10-18
                - generic [ref=e301]:
                  - img [ref=e302]
                  - img [ref=e304]
                  - img [ref=e306]
                  - img [ref=e308]
                  - img [ref=e310]
            - article [ref=e313]:
              - generic [ref=e314]:
                - img "mi****" [ref=e316]
                - paragraph [ref=e318]: 시안 확정 누르기전에 직접 어떻게 시안이 나올것인지 볼 수 있어서 좋았구 칼선도 직접 받아보니까 그대로 잘나와서 너무 만족했어요!! 앞으로도 잘 이용할거 같습니당 감사합니다!
              - generic [ref=e319]:
                - generic [ref=e320]:
                  - generic [ref=e321]: M
                  - generic [ref=e322]:
                    - strong [ref=e323]: mi****
                    - generic [ref=e324]: 2026-10-18
                - generic [ref=e325]:
                  - img [ref=e326]
                  - img [ref=e328]
                  - img [ref=e330]
                  - img [ref=e332]
                  - img [ref=e334]
            - article [ref=e337]:
              - generic [ref=e338]:
                - img "mi****" [ref=e340]
                - paragraph [ref=e342]: 졸업전시 스티커 제작중에 알아보게 되어서 주문하게 되었습니다. 빠르게 받아야해서 희망일자를 적었는데 희망일자보다 더 빠르게 배송이 되어서 너무 좋았고 디자인 뽑기전에 어떻게 나올것인지 체크할 수 있었던 점도 너무 좋았어요!! 그리고 무엇보다 친절하신게 느껴졌어요 스티커도 직접 받아보니까 시안 그대로 똑같이 나와서 좋아요👍👍
              - generic [ref=e343]:
                - generic [ref=e344]:
                  - generic [ref=e345]: M
                  - generic [ref=e346]:
                    - strong [ref=e347]: mi****
                    - generic [ref=e348]: 2026-10-18
                - generic [ref=e349]:
                  - img [ref=e350]
                  - img [ref=e352]
                  - img [ref=e354]
                  - img [ref=e356]
                  - img [ref=e358]
            - article [ref=e361]:
              - generic [ref=e362]:
                - img "ㅅㅇ****" [ref=e364]
                - paragraph [ref=e366]: 만족하게 나왔어요 짱 예뻐요
              - generic [ref=e367]:
                - generic [ref=e368]:
                  - generic [ref=e369]: ㅅ
                  - generic [ref=e370]:
                    - strong [ref=e371]: ㅅㅇ****
                    - generic [ref=e372]: 2026-10-17
                - generic [ref=e373]:
                  - img [ref=e374]
                  - img [ref=e376]
                  - img [ref=e378]
                  - img [ref=e380]
                  - img [ref=e382]
            - article [ref=e385]:
              - generic [ref=e386]:
                - img "김상****" [ref=e388]
                - paragraph [ref=e390]: 깔끔하네요 다른도안으로 추가주문할까 합니다
              - generic [ref=e391]:
                - generic [ref=e392]:
                  - generic [ref=e393]: 김
                  - generic [ref=e394]:
                    - strong [ref=e395]: 김상****
                    - generic [ref=e396]: 2026-10-17
                - generic [ref=e397]:
                  - img [ref=e398]
                  - img [ref=e400]
                  - img [ref=e402]
                  - img [ref=e404]
                  - img [ref=e406]
            - article [ref=e409]:
              - generic [ref=e410]:
                - img "김상****" [ref=e412]
                - paragraph [ref=e414]: 깔끔하네요 다른도안으로 추가주문할까 합니다
              - generic [ref=e415]:
                - generic [ref=e416]:
                  - generic [ref=e417]: 김
                  - generic [ref=e418]:
                    - strong [ref=e419]: 김상****
                    - generic [ref=e420]: 2026-10-17
                - generic [ref=e421]:
                  - img [ref=e422]
                  - img [ref=e424]
                  - img [ref=e426]
                  - img [ref=e428]
                  - img [ref=e430]
            - article [ref=e433]:
              - generic [ref=e434]:
                - img "김보****" [ref=e436]
                - paragraph [ref=e438]: 원하는 날짜에 맞춰서 배송해주시고, 투명스티커인데도 잘 찢어지지 않는 고품질 스티커라 너무 만족했습니다!! 앞으로 또 제작 할 일이 있다면 맡기겠습니다 !!
              - generic [ref=e439]:
                - generic [ref=e440]:
                  - generic [ref=e441]: 김
                  - generic [ref=e442]:
                    - strong [ref=e443]: 김보****
                    - generic [ref=e444]: 2026-10-15
                - generic [ref=e445]:
                  - img [ref=e446]
                  - img [ref=e448]
                  - img [ref=e450]
                  - img [ref=e452]
                  - img [ref=e454]
            - article [ref=e457]:
              - generic [ref=e458]:
                - img "임기****" [ref=e460]
                - paragraph [ref=e462]: 퀄리티 좋고 원하는 시안대로 스티커 제작되어서 좋아요~!
              - generic [ref=e463]:
                - generic [ref=e464]:
                  - generic [ref=e465]: 임
                  - generic [ref=e466]:
                    - strong [ref=e467]: 임기****
                    - generic [ref=e468]: 2026-10-13
                - generic [ref=e469]:
                  - img [ref=e470]
                  - img [ref=e472]
                  - img [ref=e474]
                  - img [ref=e476]
                  - img [ref=e478]
            - article [ref=e481]:
              - generic [ref=e482]:
                - img "박범****" [ref=e484]
                - paragraph [ref=e486]: 1. 제미나이로 초안 작업한 결과물을 업체에 보냄. 2. 파일에 전혀 이상이 없었음. 업체에서 후작업을 진행함. 3. 결과물에 오류가 있었음. (본인도 확인을 제대로 못함.) 4. 결과물을 받고 작업자(대표)와 통화함. 우리는 무조건 잘못없다고 쏘아 붙임. 5. 본인도 작업물 자체에 오류가 없었으나, 전달과정에서 파일이 손상되거나 이상이 있었던 거 같음. 이를 인정하고 재작업을 요청드리려 했으나 계속 공격적인 어투로 재작업원하면 온라인으로 신청해라만 반복. 소량 제작 물품이고, 소통 과정에서 실수는 발생할 수 있다고 생각함. 그러나 업체의 대응 과정에서 기분이 너무 상함. 돈을 안내겠다도 아니고, 수정해서 재작업하면 되는 부분인데, 응대과정이 너무 미흡하고 공격적이라 생각함. 물건 맡기실 분은 생각해보시길, 인스타나 관련 홍보글에 모두 댓글 달고 싶었으나, 여기도 자영업자라 생각하고 참으려 함.
              - generic [ref=e487]:
                - generic [ref=e488]:
                  - generic [ref=e489]: 박
                  - generic [ref=e490]:
                    - strong [ref=e491]: 박범****
                    - generic [ref=e492]: 2026-10-12
                - img [ref=e494]
            - article [ref=e497]:
              - generic [ref=e498]:
                - img "안수****" [ref=e500]
                - paragraph [ref=e502]: 주문한 스티커를 너무 만족스럽게 만들어주셨습니다. 감사해요!
              - generic [ref=e503]:
                - generic [ref=e504]:
                  - generic [ref=e505]: 안
                  - generic [ref=e506]:
                    - strong [ref=e507]: 안수****
                    - generic [ref=e508]: 2026-10-11
                - generic [ref=e509]:
                  - img [ref=e510]
                  - img [ref=e512]
                  - img [ref=e514]
                  - img [ref=e516]
                  - img [ref=e518]
            - article [ref=e521]:
              - generic [ref=e522]:
                - img "이상****" [ref=e524]
                - paragraph [ref=e526]: 원하는대로 작업해주셔서 감사합니다 작업 시스템이 훌륭합니다
              - generic [ref=e527]:
                - generic [ref=e528]:
                  - generic [ref=e529]: 이
                  - generic [ref=e530]:
                    - strong [ref=e531]: 이상****
                    - generic [ref=e532]: 2026-10-10
                - generic [ref=e533]:
                  - img [ref=e534]
                  - img [ref=e536]
                  - img [ref=e538]
                  - img [ref=e540]
                  - img [ref=e542]
            - article [ref=e545]:
              - generic [ref=e546]:
                - img "김영****" [ref=e548]
                - paragraph [ref=e550]: 너무 만족합니다 잘 받았고 다음에 또 주문하겠습니다. 번창하세요
              - generic [ref=e551]:
                - generic [ref=e552]:
                  - generic [ref=e553]: 김
                  - generic [ref=e554]:
                    - strong [ref=e555]: 김영****
                    - generic [ref=e556]: 2026-10-07
                - generic [ref=e557]:
                  - img [ref=e558]
                  - img [ref=e560]
                  - img [ref=e562]
                  - img [ref=e564]
                  - img [ref=e566]
            - article [ref=e569]:
              - generic [ref=e570]:
                - img "김영****" [ref=e572]
                - paragraph [ref=e574]: 너무 만족합니다 잘 받았고 다음에 또 주문하겠습니다. 번창하세요
              - generic [ref=e575]:
                - generic [ref=e576]:
                  - generic [ref=e577]: 김
                  - generic [ref=e578]:
                    - strong [ref=e579]: 김영****
                    - generic [ref=e580]: 2026-10-07
                - generic [ref=e581]:
                  - img [ref=e582]
                  - img [ref=e584]
                  - img [ref=e586]
                  - img [ref=e588]
                  - img [ref=e590]
            - article [ref=e593]:
              - generic [ref=e594]:
                - img "이승****" [ref=e596]
                - paragraph [ref=e598]: 다른회사 스티커 견적도 다 받아보았지만 가격도 합리적인데 가장 빠르기까지 한 업체를 드디어 만났습니다. 상담도 잘해주셔서 알맞은 인쇄물이 나왔습니다 감사합니다.
              - generic [ref=e599]:
                - generic [ref=e600]:
                  - generic [ref=e601]: 이
                  - generic [ref=e602]:
                    - strong [ref=e603]: 이승****
                    - generic [ref=e604]: 2026-10-06
                - generic [ref=e605]:
                  - img [ref=e606]
                  - img [ref=e608]
                  - img [ref=e610]
                  - img [ref=e612]
                  - img [ref=e614]
        - generic [ref=e617]:
          - generic [ref=e618]:
            - img "text" [ref=e619]
            - generic [ref=e620]:
              - heading "타원형 판스티커 FAQ" [level=2] [ref=e621]
              - paragraph [ref=e622]:
                - text: 멤버십, 주문, 디자인 파일 업로드, 인쇄, 결제, 반품·환불에 대한 자세한 내용은 자주 묻는
                - link "질문(FAQ) 페이지에서 확인해 주세요" [ref=e623] [cursor=pointer]:
                  - /url: https://www.musticker.com/faq
                - text: .
          - generic [ref=e624]:
            - generic [ref=e625]:
              - generic [ref=e626] [cursor=pointer]:
                - heading "타원형 판스티커란 무엇인가요?" [level=3] [ref=e627]
                - paragraph [ref=e630]: 타원형 판스티커는 여러 개의 타원형 스티커를 한 장의 시트에 배치해 제작하는 스티커입니다. 각 스티커는 키스컷 방식으로 제작되어 시트는 그대로 유지되며, 스티커를 한 장씩 쉽게 떼어 사용할 수 있습니다.
              - button [ref=e631] [cursor=pointer]:
                - img [ref=e632]
            - generic [ref=e634]:
              - generic [ref=e635] [cursor=pointer]:
                - heading "타원형 판스티커는 방수 및 내구성이 있나요?" [level=3] [ref=e636]
                - paragraph [ref=e637]: 네. 머스티커의 타원형 판스티커는 방수 기능이 있으며, 내구성이 뛰어난 PVC 소재로 제작됩니다. 다만 날카로운 물체나 강한 마찰에는 긁힘이 생길 수 있으니 주의해 주세요.
              - button [ref=e638] [cursor=pointer]:
                - img [ref=e639]
            - generic [ref=e641]:
              - generic [ref=e642] [cursor=pointer]:
                - heading "한 장의 시트에는 타원형 스티커를 몇 개까지 제작할 수 있나요?" [level=3] [ref=e643]
                - paragraph [ref=e644]: 선택한 스티커 사이즈와 시트 크기에 따라 제작 가능한 수량이 달라집니다. 작은 스티커는 한 장의 시트에 더 많이 배치할 수 있으며, 큰 스티커는 제작 가능한 수량이 줄어듭니다.
              - button [ref=e645] [cursor=pointer]:
                - img [ref=e646]
            - generic [ref=e648]:
              - generic [ref=e649] [cursor=pointer]:
                - heading "타원형 판스티커는 어떤 소재를 선택할 수 있나요?" [level=3] [ref=e650]
                - paragraph [ref=e651]: 타원형 판스티커는 PVC(백색), 투명, 홀로그램 소재로 제작할 수 있습니다. 제품 라벨부터 홍보용 스티커까지 용도에 맞는 소재를 선택해 원하는 분위기를 연출할 수 있습니다.
              - button [ref=e652] [cursor=pointer]:
                - img [ref=e653]
            - generic [ref=e655]:
              - generic [ref=e656] [cursor=pointer]:
                - heading "타원형 스티커는 가로형과 세로형 모두 제작할 수 있나요?" [level=3] [ref=e657]
                - paragraph [ref=e658]: 네. 디자인에 맞게 가로형 또는 세로형으로 제작할 수 있습니다. 가로형은 가로로 넓은 디자인에, 세로형은 세로로 긴 디자인에 적합합니다.
              - button [ref=e659] [cursor=pointer]:
                - img [ref=e660]
          - generic [ref=e662]:
            - generic [ref=e663]:
              - heading "궁금한 점이 더 있으신가요?" [level=4] [ref=e664]
              - paragraph [ref=e665]: 원하시는 답변을 찾지 못하셨다면 언제든지 문의해 주세요.
            - button "문의하기" [ref=e666] [cursor=pointer]:
              - generic [ref=e667]: 문의하기
      - navigation "네이버 톡톡으로 문의하기" [ref=e668]:
        - link "카카오채널로 문의하기" [ref=e669] [cursor=pointer]:
          - /url: https://pf.kakao.com/_nJxnTX/chat
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 카카오채널로 문의하기
          - img [ref=e671]
        - link "네이버 톡톡 으로 문의하기" [ref=e672] [cursor=pointer]:
          - /url: https://talk.naver.com/ct/w2luxqo
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 네이버 톡톡 으로 문의하기
          - img [ref=e674]
        - button "이메일로 문의하기" [ref=e675] [cursor=pointer]:
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 이메일로 문의하기
          - img [ref=e677]
    - contentinfo [ref=e678]:
      - generic [ref=e681]:
        - generic [ref=e682]:
          - generic [ref=e683]:
            - generic [ref=e684]:
              - paragraph [ref=e685]: 제품
              - list [ref=e686]:
                - listitem [ref=e687]:
                  - link "스티커" [ref=e688] [cursor=pointer]:
                    - /url: /kr/stickers
                - listitem [ref=e689]:
                  - link "롤스티커" [ref=e690] [cursor=pointer]:
                    - /url: /kr/roll-stickers
                - listitem [ref=e691]:
                  - link "판스티커" [ref=e692] [cursor=pointer]:
                    - /url: /kr/sheet-stickers
                - listitem [ref=e693]:
                  - link "홀로그램 스티커" [ref=e694] [cursor=pointer]:
                    - /url: /kr/stickers/hologram-sticker
                - listitem [ref=e695]:
                  - link "글자 커팅 스티커" [ref=e696] [cursor=pointer]:
                    - /url: /kr/stickers/vinyl-lettering
            - generic [ref=e697]:
              - paragraph [ref=e698]: 주문 안내
              - list [ref=e699]:
                - listitem [ref=e700]:
                  - link "주문 방법" [ref=e701] [cursor=pointer]:
                    - /url: /kr/faq?topic=order
                - listitem [ref=e702]:
                  - link "파일 가이드" [ref=e703] [cursor=pointer]:
                    - /url: /kr/faq?topic=artwork
                - listitem [ref=e704]:
                  - link "배송 안내" [ref=e705] [cursor=pointer]:
                    - /url: /kr/faq?topic=order&question=shippingStart
                - listitem [ref=e706]:
                  - link "재인쇄ㆍ환불안내" [ref=e707] [cursor=pointer]:
                    - /url: /kr/faq?topic=refund
                - listitem [ref=e708]:
                  - link "자주 묻는 질문" [ref=e709] [cursor=pointer]:
                    - /url: /kr/faq
            - generic [ref=e710]:
              - paragraph [ref=e711]: 회사
              - list [ref=e712]:
                - listitem [ref=e713]:
                  - link "브랜드 소개" [ref=e714] [cursor=pointer]:
                    - /url: /kr/about
                - listitem [ref=e715]:
                  - link "공지사항" [ref=e716] [cursor=pointer]:
                    - /url: /kr/announcements
                - listitem [ref=e717]:
                  - button "고객리뷰" [ref=e718] [cursor=pointer]
                - listitem [ref=e719]:
                  - button "대량주문ㆍ제휴문의" [ref=e720] [cursor=pointer]
            - generic [ref=e721]:
              - paragraph [ref=e722]: 정책
              - list [ref=e723]:
                - listitem [ref=e724]:
                  - link "이용약관" [ref=e725] [cursor=pointer]:
                    - /url: /kr/terms-of-use
                - listitem [ref=e726]:
                  - link "개인정보처리방침" [ref=e727] [cursor=pointer]:
                    - /url: /kr/privacy-policy
                - listitem [ref=e728]:
                  - button "사업자정보확인" [ref=e729] [cursor=pointer]
                - listitem [ref=e730]:
                  - link "오픈소스 고지" [ref=e731] [cursor=pointer]:
                    - /url: /kr/open-source-licenses
          - generic [ref=e732]:
            - generic [ref=e733]:
              - img "musticker logo" [ref=e734]
              - generic [ref=e735]: / 머스티커
            - generic [ref=e736]:
              - paragraph [ref=e737]: 고객센터
              - link "1899-5529" [ref=e738] [cursor=pointer]:
                - /url: tel:1899-5529
              - generic [ref=e739]:
                - paragraph [ref=e740]: 평일 09:00 – 18:00 · 토·일·공휴일 휴무
                - paragraph [ref=e741]:
                  - generic [ref=e742]: 구매 문의
                  - link "sales@musticker.com" [ref=e743] [cursor=pointer]:
                    - /url: mailto:sales@musticker.com
            - generic [ref=e744]:
              - link "instagram icon" [ref=e745] [cursor=pointer]:
                - /url: https://www.instagram.com/musticker_official/
                - img "instagram icon"
              - link "KakaoTalk Channel" [ref=e746] [cursor=pointer]:
                - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic [ref=e747]:
          - separator [ref=e748]
          - generic [ref=e749]:
            - generic [ref=e750]:
              - paragraph [ref=e751]: (주)글로픽스 · 대표 여일석 · 사업자번호 877-88-03313 · 통신판매업신고 2026-부산해운대-0792호
              - paragraph [ref=e752]: 부산광역시 해운대구 해운대해변로 203 오션타워 1014호 · 호스팅 Amazon Web Services
            - paragraph [ref=e753]: © 2026 GLOPHICS Corp. All rights reserved.
  - dialog [ref=e755]:
    - banner [ref=e756]:
      - heading "장바구니 미리보기 (1)" [level=3] [ref=e757]
      - button "쇼핑 계속하기" [ref=e758] [cursor=pointer]:
        - generic [ref=e759]:
          - paragraph [ref=e760]: 쇼핑 계속하기
          - img [ref=e761]
    - article [ref=e766]:
      - generic [ref=e767]:
        - img "illustrations/products/sheet-stickers/oval-sheet.svg" [ref=e769]
        - generic [ref=e770]:
          - heading "타원형 판스티커" [level=4] [ref=e771]
          - paragraph [ref=e772]: "개별 사이즈: 50x30mm"
          - paragraph [ref=e773]: "수량: 20시트"
          - paragraph [ref=e774]: "소재: 홀로그램"
      - generic [ref=e775]:
        - strong [ref=e776]: 11,730원
        - generic [ref=e777]:
          - button "상품 수정" [ref=e778] [cursor=pointer]:
            - img [ref=e779]
            - generic [ref=e781]: 상품 수정
          - button "상품 삭제" [ref=e782] [cursor=pointer]:
            - img [ref=e783]
            - generic [ref=e785]: 상품 삭제
    - contentinfo [ref=e786]:
      - generic [ref=e787]:
        - paragraph [ref=e788]:
          - generic [ref=e789]: 합계
          - strong [ref=e790]: 11,730원
        - generic [ref=e791]:
          - paragraph [ref=e792]: 참고
          - paragraph [ref=e793]: 배송비 및 할인 내역은 결제 시 적용됩니다.
      - generic [ref=e794]:
        - button "장바구니 보기" [ref=e795] [cursor=pointer]:
          - generic [ref=e796]: 장바구니 보기
        - button "주문하기" [ref=e797] [cursor=pointer]:
          - generic [ref=e798]:
            - img [ref=e799]
            - text: 주문하기
```

# Test source

```ts
  401 |       }
  402 | 
  403 |       if (allowTransientCartCreateFailures && isCartCreateCorsFailure(text)) {
  404 |         pendingCartCreateNetworkFailures += 1;
  405 |         return;
  406 |       }
  407 | 
  408 |       if (
  409 |         allowTransientCartCreateFailures &&
  410 |         pendingCartCreateNetworkFailures > 0 &&
  411 |         text === 'Failed to load resource: net::ERR_FAILED'
  412 |       ) {
  413 |         return;
  414 |       }
  415 | 
  416 |       if (allowTransientCartCreateFailures && isCartCreateFetchFailure(text)) {
  417 |         pendingCartCreateNetworkFailures = Math.max(0, pendingCartCreateNetworkFailures - 1);
  418 |         return;
  419 |       }
  420 | 
  421 |       if (allowKnownPriceWarnings && isSupersededPricingRequest(text)) {
  422 |         hadSupersededPricingRequest = true;
  423 |         return;
  424 |       }
  425 | 
  426 |       if (allowKnownPriceWarnings && hadSupersededPricingRequest && text === 'Unable to retrieve prices.') {
  427 |         hadSupersededPricingRequest = false;
  428 |         return;
  429 |       }
  430 | 
  431 |       if (isKnownConsoleMessage(text, guardOptions)) {
  432 |         return;
  433 |       }
  434 | 
  435 |       consoleFailures.push(`[${message.type()}] ${text}`);
  436 |     });
  437 | 
  438 |     page.on('response', (response) => {
  439 |       const status = response.status();
  440 |       if (status < 400) {
  441 |         return;
  442 |       }
  443 | 
  444 |       const url = response.url();
  445 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  446 |         return;
  447 |       }
  448 | 
  449 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  450 |         return;
  451 |       }
  452 | 
  453 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  454 |         return;
  455 |       }
  456 | 
  457 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  458 |         pendingTransientProductPageFailures += 1;
  459 |         return;
  460 |       }
  461 | 
  462 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  463 |         pendingExpectedNotFoundResponses += 1;
  464 |         return;
  465 |       }
  466 | 
  467 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  468 |         return;
  469 |       }
  470 | 
  471 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  472 |         return;
  473 |       }
  474 | 
  475 |       if (allowStudioModelLoadNoise && isStudioModelMissingTokenizerConfig(status, url)) {
  476 |         return;
  477 |       }
  478 | 
  479 |       responseFailures.push(`${status} ${url}`);
  480 |     });
  481 | 
  482 |     await applyInternalOriginHeader(page);
  483 |     await use(page);
  484 | 
  485 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  486 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  487 |     // that nothing retried still fails the run.
  488 |     const throttleBlocks = retriedThrottleBlockCount(page);
  489 | 
  490 |     expect
  491 |       .soft(
  492 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  493 |         'Unexpected browser console errors or warnings'
  494 |       )
  495 |       .toEqual([]);
  496 |     expect
  497 |       .soft(
  498 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  499 |         'Unexpected failed HTTP responses'
  500 |       )
> 501 |       .toEqual([]);
      |        ^ Error: Unexpected failed HTTP responses
  502 |   }
  503 | });
  504 | 
  505 | export { expect };
  506 | 
```