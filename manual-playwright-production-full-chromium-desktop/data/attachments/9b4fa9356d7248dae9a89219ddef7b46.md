# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/navigation/footer.spec.ts >> Footer >> MS-NAV-019 footer inquiry form is announced as a dialog, takes focus and closes on Escape
- Location: tests/e2e/storefront/navigation/footer.spec.ts:111:3

# Error details

```
Error: the form must be exposed as a named dialog

expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: '문의' })
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - the form must be exposed as a named dialog with timeout 3000ms
  - waiting for getByRole('dialog', { name: '문의' })

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
            - img "Musticker" [ref=e8]
          - generic [ref=e9]:
            - button "공지사항 열기" [ref=e11] [cursor=pointer]:
              - img [ref=e13]
            - button "검색" [ref=e16] [cursor=pointer]:
              - img [ref=e17]
            - button "장바구니" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
            - button "계정" [ref=e26] [cursor=pointer]:
              - img [ref=e28]
        - navigation "Primary":
          - link "스티커" [ref=e31] [cursor=pointer]:
            - /url: javascript:;
          - link "롤스티커" [ref=e32] [cursor=pointer]:
            - /url: javascript:;
          - link "판스티커" [ref=e33] [cursor=pointer]:
            - /url: javascript:;
          - link "샘플팩" [ref=e34] [cursor=pointer]:
            - /url: /kr/sample-pack
    - main [ref=e35]:
      - main [ref=e36]:
        - generic [ref=e38]:
          - generic:
            - img "스티커ㅋㅋㅋ, 이유가 있구나"
          - generic [ref=e39]:
            - generic [ref=e40]:
              - heading "스티커ㅋㅋㅋ, 이유가 있구나" [level=1] [ref=e41]:
                - text: 스티커ㅋㅋㅋ,
                - generic [ref=e42]: 이유가 있구나
              - paragraph [ref=e43]: 빠른데, 퀄리티까지 미쳤다
            - button "빠른 주문" [ref=e44] [cursor=pointer]:
              - generic [ref=e45]: 빠른 주문
        - generic [ref=e46]:
          - generic [ref=e48]:
            - link "스티커" [ref=e49] [cursor=pointer]:
              - /url: /kr/stickers/die-cut-sticker
              - img [ref=e51]
              - paragraph [ref=e52]: 스티커
            - link "롤스티커" [ref=e53] [cursor=pointer]:
              - /url: /kr/roll-stickers/die-cut-roll
              - img [ref=e55]
              - paragraph [ref=e56]: 롤스티커
            - link "판스티커" [ref=e57] [cursor=pointer]:
              - /url: /kr/stickers/sticker-sheet
              - img [ref=e59]
              - paragraph [ref=e60]: 판스티커
            - link "홀로그램" [ref=e61] [cursor=pointer]:
              - /url: /kr/stickers/hologram-sticker
              - img [ref=e63]
              - paragraph [ref=e64]: 홀로그램
            - link "글자 커팅 스티커" [ref=e65] [cursor=pointer]:
              - /url: /kr/stickers/vinyl-lettering
              - img [ref=e67]
              - paragraph [ref=e68]: 글자 커팅 스티커
          - generic [ref=e70]:
            - dialog "급해서 맡겼는데, 퀄리티 때문에 기억나는 스티커" [ref=e72]:
              - generic [ref=e73]:
                - button "음소거 해제" [ref=e75] [cursor=pointer]:
                  - img [ref=e76]
                - generic:
                  - slider "재생 위치"
                  - button "전체화면":
                    - img
            - generic [ref=e78]:
              - heading "급해서 맡겼는데, 퀄리티 때문에 기억나는 스티커" [level=2] [ref=e79]:
                - text: 급해서 맡겼는데,
                - text: 퀄리티 때문에 기억나는 스티커
              - paragraph [ref=e80]: 파일만 첨부하면 시안이 전달되고, 승인 즉시 제작이 시작됩니다. 급한 작업이어도 색감·라인·마감까지 정교해 “여기 또 써야겠다”는 말이 나올 거예요. 우리는 빨리 만드는 게 아니라, 빠르게 ‘잘’ 만드는 것을 목표로 합니다.
          - region "고객 리뷰 캐러셀" [ref=e81]:
            - generic [ref=e82]:
              - generic [ref=e83]:
                - heading "사진 후기 327개, 만족도는 이미 증명됐어요" [level=2] [ref=e84]:
                  - text: 사진 후기 327개,
                  - text: 만족도는 이미 증명됐어요
                - generic [ref=e85]:
                  - button "이전 리뷰로 이동" [disabled] [ref=e86]:
                    - img [ref=e87]
                    - generic [ref=e89]: 이전 리뷰로 이동
                  - button "다음 리뷰로 이동" [ref=e90] [cursor=pointer]:
                    - img [ref=e91]
                    - generic [ref=e93]: 다음 리뷰로 이동
              - region "고객 리뷰 캐러셀" [ref=e94]:
                - generic [ref=e95]:
                  - article "Review 1 of 16" [ref=e96] [cursor=pointer]:
                    - img "정은****" [ref=e98]
                    - generic [ref=e99]:
                      - generic [ref=e100]:
                        - heading "정은****" [level=3] [ref=e102]
                        - paragraph [ref=e103]: 주문하기도 편하고 빠르게 처리해주시고 맘에들어요. 저희가 좀 급하게 주문 할 일이 많았는데 엄청 빠르게 시안 + 배송 해주셔서 감사드립니다. 벌써 2주안에 4번 주문중입니다. 앞으로 도 스티커 필요시에 꾸준히 주문할 듯 합니다.
                      - generic [ref=e104]:
                        - img [ref=e105]
                        - img [ref=e107]
                        - img [ref=e109]
                        - img [ref=e111]
                        - img [ref=e113]
                        - generic [ref=e115]: 2026-11-25
                  - article "Review 2 of 16" [ref=e116] [cursor=pointer]:
                    - generic [ref=e117]:
                      - img "샐리" [ref=e118]
                      - img "AI-generated image" [ref=e119]
                    - generic [ref=e120]:
                      - generic [ref=e121]:
                        - heading "샐리" [level=3] [ref=e123]
                        - paragraph [ref=e124]: 주문 과정도 간편하고 배송도 정말 빨라서 좋았습니다. 인쇄 품질이 매우 선명하고 화면으로 보던 시안과 똑같이 나와서 아주 만족스럽습니다. 소재도 튼튼하고 가성비가 훌륭해서 다음에도 꼭 다시 주문하고 싶습니다.
                      - generic [ref=e125]:
                        - img [ref=e126]
                        - img [ref=e128]
                        - img [ref=e130]
                        - img [ref=e132]
                        - img [ref=e134]
                        - generic [ref=e136]: 2026-11-23
                  - article "Review 3 of 16" [ref=e137] [cursor=pointer]:
                    - generic [ref=e138]:
                      - img "샐리" [ref=e139]
                      - img "AI-generated image" [ref=e140]
                    - generic [ref=e141]:
                      - generic [ref=e142]:
                        - heading "샐리" [level=3] [ref=e144]
                        - paragraph [ref=e145]: 주문 과정이 정말 간편해서 좋았고 배송도 빠르게 도착했습니다. 인쇄 품질이 매우 선명하고 화면으로 보던 시안과 거의 똑같이 나와서 아주 마음에 듭니다. 가격 대비 퀄리티가 훌륭해서 다음에도 꼭 다시 이용하고 싶어요.
                      - generic [ref=e146]:
                        - img [ref=e147]
                        - img [ref=e149]
                        - img [ref=e151]
                        - img [ref=e153]
                        - img [ref=e155]
                        - generic [ref=e157]: 2026-11-23
                  - article "Review 4 of 16" [ref=e158] [cursor=pointer]:
                    - img "문채****" [ref=e160]
                    - generic [ref=e161]:
                      - generic [ref=e162]:
                        - heading "문채****" [level=3] [ref=e164]
                        - paragraph [ref=e165]: 사내 용품들에 붙이려고 주문한 스티커였는데, 회사 내부 인원들 모두 만족했습니다!
                      - generic [ref=e166]:
                        - img [ref=e167]
                        - img [ref=e169]
                        - img [ref=e171]
                        - img [ref=e173]
                        - img [ref=e175]
                        - generic [ref=e177]: 2026-11-23
                  - article "Review 5 of 16" [ref=e178] [cursor=pointer]:
                    - img "정은****" [ref=e180]
                    - generic [ref=e181]:
                      - generic [ref=e182]:
                        - heading "정은****" [level=3] [ref=e184]
                        - paragraph [ref=e185]: 급하게 스티커를 주문할 일이 많았는데 다른 사이트보다 주문도 쉽고 빠르고 전문적으로 해주셔서 진짜 좋았어요. 앞으로도 여기서 주문하려고요. 오늘도 추가 주문 중입니다.
                      - generic [ref=e186]:
                        - img [ref=e187]
                        - img [ref=e189]
                        - img [ref=e191]
                        - img [ref=e193]
                        - img [ref=e195]
                        - generic [ref=e197]: 2026-11-23
                  - article "Review 6 of 16" [ref=e198] [cursor=pointer]:
                    - img "임예****" [ref=e200]
                    - generic [ref=e201]:
                      - generic [ref=e202]:
                        - heading "임예****" [level=3] [ref=e204]
                        - paragraph [ref=e205]: CYMK 제작은 처음이라 시안보다 조금 채도가 낮고 흐릿하게 나왔지만 그래도 만족스러워요 ! 배송이 빠르게 진행되어 필요할때 잘 받았습니다 ☺️
                      - generic [ref=e206]:
                        - img [ref=e207]
                        - img [ref=e209]
                        - img [ref=e211]
                        - img [ref=e213]
                        - generic [ref=e215]: 2026-11-23
                  - article "Review 7 of 16" [ref=e216] [cursor=pointer]:
                    - img "임예****" [ref=e218]
                    - generic [ref=e219]:
                      - generic [ref=e220]:
                        - heading "임예****" [level=3] [ref=e222]
                        - paragraph [ref=e223]: CYMK 제작은 처음이라 시안보다 조금 채도가 낮고 흐릿하게 나왔지만 그래도 만족스러워요 ! 배송이 빠르게 진행되어 필요할때 잘 받았습니다 ☺️
                      - generic [ref=e224]:
                        - img [ref=e225]
                        - img [ref=e227]
                        - img [ref=e229]
                        - img [ref=e231]
                        - generic [ref=e233]: 2026-11-23
                  - article "Review 8 of 16" [ref=e234] [cursor=pointer]:
                    - img "임예****" [ref=e236]
                    - generic [ref=e237]:
                      - generic [ref=e238]:
                        - heading "임예****" [level=3] [ref=e240]
                        - paragraph [ref=e241]: CYMK 제작은 처음이라 시안보다 조금 채도가 낮고 흐릿하게 나왔지만 그래도 만족스러워요 ! 배송이 빠르게 진행되어 필요할때 잘 받았습니다 ☺️
                      - generic [ref=e242]:
                        - img [ref=e243]
                        - img [ref=e245]
                        - img [ref=e247]
                        - img [ref=e249]
                        - generic [ref=e251]: 2026-11-23
                  - article "Review 9 of 16" [ref=e252] [cursor=pointer]:
                    - img "임예****" [ref=e254]
                    - generic [ref=e255]:
                      - generic [ref=e256]:
                        - heading "임예****" [level=3] [ref=e258]
                        - paragraph [ref=e259]: CYMK 제작은 처음이라 시안보다 조금 채도가 낮고 흐릿하게 나왔지만 그래도 만족스러워요 ! 배송이 빠르게 진행되어 필요할때 잘 받았습니다 ☺️
                      - generic [ref=e260]:
                        - img [ref=e261]
                        - img [ref=e263]
                        - img [ref=e265]
                        - img [ref=e267]
                        - generic [ref=e269]: 2026-11-23
                  - article "Review 10 of 16" [ref=e270] [cursor=pointer]:
                    - img "임예****" [ref=e272]
                    - generic [ref=e273]:
                      - generic [ref=e274]:
                        - heading "임예****" [level=3] [ref=e276]
                        - paragraph [ref=e277]: CYMK 제작은 처음이라 시안보다 조금 채도가 낮고 흐릿하게 나왔지만 그래도 만족스러워요 ! 배송이 빠르게 진행되어 필요할때 잘 받았습니다 ☺️
                      - generic [ref=e278]:
                        - img [ref=e279]
                        - img [ref=e281]
                        - img [ref=e283]
                        - img [ref=e285]
                        - generic [ref=e287]: 2026-11-23
                  - article "Review 11 of 16" [ref=e288] [cursor=pointer]:
                    - img "임예****" [ref=e290]
                    - generic [ref=e291]:
                      - generic [ref=e292]:
                        - heading "임예****" [level=3] [ref=e294]
                        - paragraph [ref=e295]: CYMK 제작은 처음이라 시안보다 조금 채도가 낮고 흐릿하게 나왔지만 그래도 만족스러워요 ! 배송이 빠르게 진행되어 필요할때 잘 받았습니다 ☺️
                      - generic [ref=e296]:
                        - img [ref=e297]
                        - img [ref=e299]
                        - img [ref=e301]
                        - img [ref=e303]
                        - generic [ref=e305]: 2026-11-23
                  - article "Review 12 of 16" [ref=e306] [cursor=pointer]:
                    - img "김이****" [ref=e308]
                    - generic [ref=e309]:
                      - generic [ref=e310]:
                        - heading "김이****" [level=3] [ref=e312]
                        - paragraph [ref=e313]: 원하던대로 제작되서 좋았습니다 샘플로 조금 제작했는데 만족스러워서 재구매할 예정입니다 ~~!
                      - generic [ref=e314]:
                        - img [ref=e315]
                        - img [ref=e317]
                        - img [ref=e319]
                        - img [ref=e321]
                        - img [ref=e323]
                        - generic [ref=e325]: 2026-11-23
                  - article "Review 13 of 16" [ref=e326] [cursor=pointer]:
                    - generic [ref=e327]:
                      - img "김건" [ref=e328]
                      - img "AI-generated image" [ref=e329]
                    - generic [ref=e330]:
                      - generic [ref=e331]:
                        - heading "김건" [level=3] [ref=e333]
                        - paragraph [ref=e334]: 너무 만족스럽습니다 !!
                      - generic [ref=e335]:
                        - img [ref=e336]
                        - img [ref=e338]
                        - img [ref=e340]
                        - img [ref=e342]
                        - img [ref=e344]
                        - generic [ref=e346]: 2026-11-23
                  - article "Review 14 of 16" [ref=e347] [cursor=pointer]:
                    - img "박정****" [ref=e349]
                    - generic [ref=e350]:
                      - generic [ref=e351]:
                        - heading "박정****" [level=3] [ref=e353]
                        - paragraph [ref=e354]: 새로운 쇼핑몰에서의 제작도 매끄럽게 진행해주셔서 너무 감사합니다~ 또 주문해야겠어요~
                      - generic [ref=e355]:
                        - img [ref=e356]
                        - img [ref=e358]
                        - img [ref=e360]
                        - img [ref=e362]
                        - img [ref=e364]
                        - generic [ref=e366]: 2026-11-22
                  - article "Review 15 of 16" [ref=e367] [cursor=pointer]:
                    - img "나승****" [ref=e369]
                    - generic [ref=e370]:
                      - generic [ref=e371]:
                        - heading "나승****" [level=3] [ref=e373]
                        - paragraph [ref=e374]: 만족스럽습니다 다음에도 부탁드리겠습니다 !!
                      - generic [ref=e375]:
                        - img [ref=e376]
                        - img [ref=e378]
                        - img [ref=e380]
                        - img [ref=e382]
                        - img [ref=e384]
                        - generic [ref=e386]: 2026-11-21
                  - article "Review 16 of 16" [ref=e387] [cursor=pointer]:
                    - generic [ref=e388]:
                      - img "김지****" [ref=e389]
                      - img "AI-generated image" [ref=e390]
                    - generic [ref=e391]:
                      - generic [ref=e392]:
                        - heading "김지****" [level=3] [ref=e394]
                        - paragraph [ref=e395]: 일단 너무너무 친절하시고, 다른 유명한 인쇄사이트는 오류 수정했을 때 확인이 늦어서 너무 답답했는데 머스티커는 정말 바로바로 해주시고 답장도 정말 빨리 주셔서 너무 좋았어요. 또 배송도 시안이 확정되고 출력되자마자 당일발송해주셔서 두번 시켰는데 모두 다음날에 바로 배송됐었어요. 전시가 얼마남지않아 굉장히 급한 상황이었는데.....정말 너무너무 감사드립니다...앞으로 스티커 제작할 일 생기면 머스티커에 부탁드리고 싶어요.
                      - generic [ref=e396]:
                        - img [ref=e397]
                        - img [ref=e399]
                        - img [ref=e401]
                        - img [ref=e403]
                        - img [ref=e405]
                        - generic [ref=e407]: 2026-11-21
          - generic [ref=e409]:
            - article [ref=e410]:
              - img "100% 품질 보장" [ref=e412]
              - generic [ref=e413]:
                - heading "100% 품질 보장" [level=3] [ref=e414]
                - paragraph [ref=e415]: 문제가 생기면 변명하지 않습니다 재인쇄 또는 환불까지 끝까지 책임집니다
            - article [ref=e416]:
              - img "오늘 제작 · 내일 발송" [ref=e418]
              - generic [ref=e419]:
                - heading "오늘 제작 · 내일 발송" [level=3] [ref=e420]
                - paragraph [ref=e421]: 디자인 승인 후 바로 제작이 시작되며, 승인이 빠를수록 다음 날 바로 출고됩니다
            - article [ref=e422]:
              - img "5만원 이상 무료배송" [ref=e424]
              - generic [ref=e425]:
                - heading "5만원 이상 무료배송" [level=3] [ref=e426]
                - paragraph [ref=e427]: 기본 배송비는 3,000원이며, 5만원 이상 주문 시 무료배송입니다
      - navigation "네이버 톡톡으로 문의하기" [ref=e428]:
        - link "카카오채널로 문의하기" [ref=e429] [cursor=pointer]:
          - /url: https://pf.kakao.com/_nJxnTX/chat
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 카카오채널로 문의하기
          - img [ref=e431]
        - link "네이버 톡톡 으로 문의하기" [ref=e432] [cursor=pointer]:
          - /url: https://talk.naver.com/ct/w2luxqo
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 네이버 톡톡 으로 문의하기
          - img [ref=e434]
        - button "이메일로 문의하기" [ref=e435] [cursor=pointer]:
          - generic:
            - generic:
              - generic:
                - img
              - paragraph: 이메일로 문의하기
          - img [ref=e437]
      - button [ref=e438] [cursor=pointer]:
        - img [ref=e439]
    - contentinfo [ref=e441]:
      - generic [ref=e444]:
        - heading "처음 주문해도 걱정할 필요 없어요" [level=2] [ref=e445]
        - generic [ref=e446]:
          - button "제작 문의하기" [active] [ref=e447] [cursor=pointer]:
            - generic [ref=e448]: 제작 문의하기
          - button "바로 주문하기" [ref=e449] [cursor=pointer]:
            - generic [ref=e450]: 바로 주문하기
      - generic [ref=e453]:
        - generic [ref=e454]:
          - generic [ref=e455]:
            - generic [ref=e456]:
              - paragraph [ref=e457]: 제품
              - list [ref=e458]:
                - listitem [ref=e459]:
                  - link "스티커" [ref=e460] [cursor=pointer]:
                    - /url: /kr/stickers
                - listitem [ref=e461]:
                  - link "롤스티커" [ref=e462] [cursor=pointer]:
                    - /url: /kr/roll-stickers
                - listitem [ref=e463]:
                  - link "판스티커" [ref=e464] [cursor=pointer]:
                    - /url: /kr/sheet-stickers
                - listitem [ref=e465]:
                  - link "홀로그램 스티커" [ref=e466] [cursor=pointer]:
                    - /url: /kr/stickers/hologram-sticker
                - listitem [ref=e467]:
                  - link "글자 커팅 스티커" [ref=e468] [cursor=pointer]:
                    - /url: /kr/stickers/vinyl-lettering
            - generic [ref=e469]:
              - paragraph [ref=e470]: 주문 안내
              - list [ref=e471]:
                - listitem [ref=e472]:
                  - link "주문 방법" [ref=e473] [cursor=pointer]:
                    - /url: /kr/faq?topic=order
                - listitem [ref=e474]:
                  - link "파일 가이드" [ref=e475] [cursor=pointer]:
                    - /url: /kr/faq?topic=artwork
                - listitem [ref=e476]:
                  - link "배송 안내" [ref=e477] [cursor=pointer]:
                    - /url: /kr/faq?topic=order&question=shippingStart
                - listitem [ref=e478]:
                  - link "재인쇄ㆍ환불안내" [ref=e479] [cursor=pointer]:
                    - /url: /kr/faq?topic=refund
                - listitem [ref=e480]:
                  - link "자주 묻는 질문" [ref=e481] [cursor=pointer]:
                    - /url: /kr/faq
            - generic [ref=e482]:
              - paragraph [ref=e483]: 혜택·지원
              - list [ref=e484]:
                - listitem [ref=e485]:
                  - link "학교·공공기관 주문" [ref=e486] [cursor=pointer]:
                    - /url: /kr/institutions
                - listitem [ref=e487]:
                  - link "대량주문·기업 견적" [ref=e488] [cursor=pointer]:
                    - /url: /kr/business
                - listitem [ref=e489]:
                  - link "제휴·파트너십 문의" [ref=e490] [cursor=pointer]:
                    - /url: /kr/partnership
            - generic [ref=e491]:
              - paragraph [ref=e492]: 회사
              - list [ref=e493]:
                - listitem [ref=e494]:
                  - link "브랜드 소개" [ref=e495] [cursor=pointer]:
                    - /url: /kr/about
                - listitem [ref=e496]:
                  - link "공지사항" [ref=e497] [cursor=pointer]:
                    - /url: /kr/announcements
                - listitem [ref=e498]:
                  - link "인재채용" [ref=e499] [cursor=pointer]:
                    - /url: /kr/careers
                - listitem [ref=e500]:
                  - button "고객리뷰" [ref=e501] [cursor=pointer]
          - generic [ref=e502]:
            - generic [ref=e503]:
              - img "musticker logo" [ref=e504]
              - generic [ref=e505]: / 머스티커
            - generic [ref=e506]:
              - paragraph [ref=e507]: 고객센터
              - link "1899-5529" [ref=e508] [cursor=pointer]:
                - /url: tel:1899-5529
              - generic [ref=e509]:
                - paragraph [ref=e510]: 평일 09:00 – 18:00 · 토·일·공휴일 휴무
                - paragraph [ref=e511]:
                  - generic [ref=e512]: 구매 문의
                  - link "sales@musticker.com" [ref=e513] [cursor=pointer]:
                    - /url: mailto:sales@musticker.com
            - generic [ref=e514]:
              - link "Instagram" [ref=e515] [cursor=pointer]:
                - /url: https://www.instagram.com/musticker_official/
              - link "Naver Blog" [ref=e517] [cursor=pointer]:
                - /url: https://blog.naver.com/musticker
              - link "KakaoTalk Channel" [ref=e519] [cursor=pointer]:
                - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic [ref=e521]:
          - separator [ref=e522]
          - generic [ref=e523]:
            - generic [ref=e525]:
              - paragraph [ref=e526]: (주)글로픽스 · 대표 여일석 · 사업자번호 877-88-03313 · 통신판매업신고 2026-부산해운대-0792호
              - paragraph [ref=e527]: 부산광역시 해운대구 해운대해변로 203 오션타워 1014호 · 호스팅 Amazon Web Services
              - paragraph [ref=e528]:
                - link "이용약관" [ref=e529] [cursor=pointer]:
                  - /url: /kr/terms-of-use
                - text: ·
                - link "개인정보처리방침" [ref=e530] [cursor=pointer]:
                  - /url: /kr/privacy-policy
                - text: ·
                - button "사업자정보확인" [ref=e531] [cursor=pointer]
                - text: ·
                - link "오픈소스고지" [ref=e532] [cursor=pointer]:
                  - /url: /kr/open-source-licenses
              - paragraph [ref=e533]:
                - text: "International:"
                - link "Terms & Conditions" [ref=e534] [cursor=pointer]:
                  - /url: /terms-of-use
                - text: ·
                - link "Privacy Policy" [ref=e535] [cursor=pointer]:
                  - /url: /privacy-policy
            - paragraph [ref=e536]: © 2026 GLOPHICS Corp. All rights reserved.
  - generic [ref=e537]:
    - img [ref=e539] [cursor=pointer]
    - generic [ref=e541]:
      - img "inquiry chat bubbles" [ref=e542]
      - generic [ref=e543]:
        - heading "문의" [level=5] [ref=e544]
        - paragraph [ref=e545]: 궁금한 점이 있으신가요? 제품이나 서비스에 대해 문의사항이 있으시면 언제든 메시지를 보내주세요.
    - generic [ref=e546]:
      - generic [ref=e548]:
        - generic [ref=e550]: 문의 유형
        - button "선택" [ref=e552] [cursor=pointer]:
          - generic [ref=e553]: 선택
          - img [ref=e554]
        - generic:
          - generic:
            - list:
              - listitem:
                - link "상품":
                  - /url: javascript:;
              - listitem:
                - link "디자인 파일 업로드":
                  - /url: javascript:;
              - listitem:
                - link "결제":
                  - /url: javascript:;
              - listitem:
                - link "배송":
                  - /url: javascript:;
              - listitem:
                - link "교환/환불/취소":
                  - /url: javascript:;
              - listitem:
                - link "회원가입/멤버십":
                  - /url: javascript:;
              - listitem:
                - link "기타":
                  - /url: javascript:;
      - generic [ref=e556]:
        - generic [ref=e558] [cursor=pointer]: 성함
        - textbox "성함" [ref=e560]:
          - /placeholder: 성함을 입력해 주세요.
      - generic [ref=e561]:
        - generic [ref=e563] [cursor=pointer]: 이메일 주소
        - textbox "이메일 주소" [ref=e565]:
          - /placeholder: 이메일 주소를 입력해 주세요.
      - generic [ref=e566]:
        - generic [ref=e568]: 문의 내용
        - textbox "여기에 문의하실 내용을 입력해 주세요." [ref=e570]
      - generic [ref=e572]:
        - generic [ref=e574]: 첨부파일
        - generic [ref=e575]:
          - generic [ref=e576]:
            - generic [ref=e577]:
              - img [ref=e578]
              - paragraph [ref=e580]: 업로드할 파일을 이곳에 끌어서 올려주세요.
            - paragraph [ref=e581]: "허용되는 파일 : .eps, .ai, .psd, .pdf, .tif, .tiff, .zip, .png, .jpg, and .jpeg. 최대 4개 파일 / 총 50MB까지 업로드 가능"
          - button "파일 선택" [ref=e582] [cursor=pointer]:
            - generic [ref=e583]: 파일 선택
    - generic [ref=e584]:
      - button "취소" [ref=e585] [cursor=pointer]:
        - generic [ref=e586]: 취소
      - button "문의하기" [ref=e587] [cursor=pointer]:
        - generic [ref=e588]: 문의하기
```

# Test source

```ts
  65  |     await tab.waitForURL((url) => url.href !== 'about:blank', { waitUntil: 'domcontentloaded' });
  66  |     return tab;
  67  |   }
  68  | 
  69  |   async expectContactDetails(): Promise<void> {
  70  |     await expect(this.root.getByText(footerContact.supportLabel, { exact: true })).toBeVisible();
  71  |     await expect(this.link(footerContact.phone)).toHaveAttribute('href', `tel:${footerContact.phone}`);
  72  |     await expect(this.root.getByText(footerContact.hours, { exact: true })).toBeVisible();
  73  |     await expect(this.root.getByText(footerContact.salesLabel)).toBeVisible();
  74  |     await expect(this.link(footerContact.salesEmail)).toHaveAttribute('href', `mailto:${footerContact.salesEmail}`);
  75  |   }
  76  | 
  77  |   async expectSocialLinks(): Promise<void> {
  78  |     for (const social of footerSocialLinks) {
  79  |       await this.expectLinkTarget(this.link(social.name), social.href, true);
  80  |     }
  81  |   }
  82  | 
  83  |   async expectBusinessDetails(): Promise<void> {
  84  |     for (const detail of [
  85  |       footerBusiness.company,
  86  |       footerBusiness.representative,
  87  |       footerBusiness.registration,
  88  |       footerBusiness.mailOrderNumber,
  89  |       footerBusiness.address
  90  |     ]) {
  91  |       await expect(this.root).toContainText(detail);
  92  |     }
  93  |     await expect(this.root.getByText(footerBusiness.copyright)).toBeVisible();
  94  |   }
  95  | 
  96  |   /**
  97  |    * Opens the FTC registration lookup and returns its tab. The government page itself is stubbed:
  98  |    * what the footer owns is the URL it opens, and a third-party site's uptime is not this suite's to
  99  |    * test.
  100 |    */
  101 |   async openBusinessInfo(): Promise<Page> {
  102 |     await this.page.context().route(`${footerBusiness.ftcLookupUrl}**`, (route) =>
  103 |       route.fulfill({ contentType: 'text/html; charset=utf-8', body: '<title>FTC lookup (stubbed)</title>' })
  104 |     );
  105 |     await waitForNuxtHydration(this.page);
  106 | 
  107 |     const [tab] = await Promise.all([
  108 |       this.page.waitForEvent('popup'),
  109 |       this.root.getByRole('button', { name: footerBusiness.businessInfoButton, exact: true }).click()
  110 |     ]);
  111 |     await tab.waitForURL((url) => url.href !== 'about:blank', { waitUntil: 'domcontentloaded' });
  112 |     return tab;
  113 |   }
  114 | 
  115 |   /** 고객리뷰 is a button, not a link: on home it scrolls, elsewhere it opens home at #reviews. */
  116 |   async openReviews(): Promise<void> {
  117 |     await waitForNuxtHydration(this.page);
  118 |     await this.root.getByRole('button', { name: footerReviews.button, exact: true }).click();
  119 |     await expect.poll(() => currentPath(this.page)).toBe(appPath());
  120 |     await expect(this.page.getByRole('heading', { name: footerReviews.sectionHeading })).toBeInViewport();
  121 |   }
  122 | 
  123 |   async expectCtaBand(): Promise<void> {
  124 |     await expect(this.root.getByRole('heading', { level: 2, name: footerCta.heading })).toBeVisible();
  125 |     await expect(this.ctaButton(footerCta.inquiry)).toBeVisible();
  126 |     await expect(this.ctaButton(footerCta.order)).toBeVisible();
  127 |   }
  128 | 
  129 |   async expectNoCtaBand(): Promise<void> {
  130 |     await expect(this.root.getByRole('heading', { name: footerCta.heading })).toHaveCount(0);
  131 |     await expect(this.ctaButton(footerCta.order)).toHaveCount(0);
  132 |   }
  133 | 
  134 |   async orderNow(): Promise<void> {
  135 |     await waitForNuxtHydration(this.page);
  136 |     await this.ctaButton(footerCta.order).click();
  137 |     await expect.poll(() => currentPath(this.page)).toBe(appPath(footerCta.orderPath));
  138 |     await expect(this.page.getByRole('heading', { level: 1, name: footerCta.orderHeading })).toBeVisible();
  139 |   }
  140 | 
  141 |   /**
  142 |    * Opens the inquiry form. It has no dialog role, accessible name or test id (MUS-QA-026), so it is
  143 |    * found by its CSS class -- the documented last resort.
  144 |    */
  145 |   async openInquiry(): Promise<Locator> {
  146 |     await waitForNuxtHydration(this.page);
  147 |     const form = this.page.locator('.inquiry-modal');
  148 |     await this.ctaButton(footerCta.inquiry).click();
  149 |     await expect(form).toBeVisible();
  150 |     await expect(form.getByRole('heading', { name: footerCta.inquiryHeading, exact: true })).toBeVisible();
  151 |     return form;
  152 |   }
  153 | 
  154 |   async cancelInquiry(form: Locator): Promise<void> {
  155 |     await form.getByRole('button', { name: footerCta.inquiryCancel, exact: true }).click();
  156 |     await expect(form).toBeHidden();
  157 |   }
  158 | 
  159 |   /**
  160 |    * What an accessible modal would offer: a named dialog that takes focus, closes on Escape and
  161 |    * hands focus back to its trigger. Bounded short because MS-NAV-019 expects this to fail today.
  162 |    */
  163 |   async expectInquiryIsAccessibleDialog(): Promise<void> {
  164 |     const dialog = this.page.getByRole('dialog', { name: footerCta.inquiryHeading });
> 165 |     await expect(dialog, 'the form must be exposed as a named dialog').toBeVisible({ timeout: 3_000 });
      |                                                                        ^ Error: the form must be exposed as a named dialog
  166 |     await expect(dialog.locator(':focus'), 'focus must move into the dialog').toHaveCount(1, { timeout: 3_000 });
  167 | 
  168 |     await this.page.keyboard.press('Escape');
  169 |     await expect(dialog).toBeHidden({ timeout: 3_000 });
  170 |     await expect(this.ctaButton(footerCta.inquiry), 'focus must return to the button that opened it').toBeFocused();
  171 |   }
  172 | 
  173 |   private ctaButton(name: string): Locator {
  174 |     return this.root.getByRole('button', { name, exact: true });
  175 |   }
  176 | 
  177 |   private async expectLinkTarget(link: Locator, href: string, newTab: boolean): Promise<void> {
  178 |     await expect(link).toHaveAttribute('href', href);
  179 | 
  180 |     if (newTab) {
  181 |       await expect(link).toHaveAttribute('target', '_blank');
  182 |       await expect(link).toHaveAttribute('rel', NEW_TAB_REL);
  183 |     } else {
  184 |       await expect(link).not.toHaveAttribute('target', '_blank');
  185 |     }
  186 |   }
  187 | }
  188 | 
```