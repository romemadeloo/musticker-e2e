# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/inquiry/partner-inquiry.spec.ts >> Partner inquiry >> MS-INQ-008 학교·공공기관: 준비 중 payment routes cannot be chosen, and 카드·간편결제 can
- Location: tests/e2e/storefront/inquiry/partner-inquiry.spec.ts:67:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('listbox').getByRole('option')
Timeout: 10000ms
- Expected  - 7
+ Received  + 1

- Array [
-   "세금계산서 후 계좌이체",
-   "카드·간편결제",
-   "아직 모름 (상담 필요)",
-   /^학교장터\(S2B\)\s*준비 중$/,
-   /^나라장터\s*준비 중$/,
- ]
+ Array []

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for getByRole('listbox').getByRole('option')
    14 × locator resolved to 0 elements

```

# Page snapshot

```yaml
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
    - generic [ref=e36]:
      - generic [ref=e40]:
        - heading "학교·공공기관 스티커 발주, 견적서부터 세금계산서까지 한 번에" [level=1] [ref=e41]
        - paragraph [ref=e42]: 서류는 바로 발급, 제작은 승인 당일, 발송은 다음 날 🚚
        - link "기관 전용 견적 받기" [ref=e43] [cursor=pointer]:
          - /url: "#contact"
        - list [ref=e44]:
          - listitem [ref=e45]: 전자세금계산서 발행
          - listitem [ref=e46]: ·ISO 9001:2015 인증 제조
          - listitem [ref=e47]: ·5만원 이상 무료배송
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]: 담당자의 고민
          - heading "행정 절차 때문에 발주가 늦어지는 일, 더는 없도록" [level=2] [ref=e52]
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: 📄
            - heading "품의서에 붙일 견적서가 급해요" [level=3] [ref=e56]
            - paragraph [ref=e57]: 제품·수량·규격을 입력하면 기관명이 기재된 견적서를 바로 받아볼 수 있습니다. 비교 견적용 발급도 가능합니다.
          - generic [ref=e58]:
            - generic [ref=e59]: 💳
            - heading "기관은 카드 선결제가 어려워요" [level=3] [ref=e60]
            - paragraph [ref=e61]: 세금계산서 발행 후 계좌이체, 선지급 후 분할 주문 등 기관 지출 방식에 맞춰 결제 순서를 조정합니다.
          - generic [ref=e62]:
            - generic [ref=e63]: 🧾
            - heading "지출증빙 서류를 따로 요청하기 번거로워요" [level=3] [ref=e64]
            - paragraph [ref=e65]: 거래명세서·전자세금계산서·사업자등록증·통장사본을 주문 화면에서 한 번에 내려받습니다.
          - generic [ref=e66]:
            - generic [ref=e67]: 🎨
            - heading "디자인 파일이 없고, 만들 사람도 없어요" [level=3] [ref=e68]
            - paragraph [ref=e69]: 머스티커 스튜디오에서 로고·사진을 올리고 문구만 입력하면 바로 주문할 수 있습니다.
      - generic [ref=e73]:
        - generic [ref=e74]: 머스티커 스튜디오
        - heading "로고만 올리면, 스티커 완성" [level=2] [ref=e75]
        - paragraph [ref=e76]: 기관 로고나 문구를 올리면 칼선까지 자동으로 잡힙니다. 크기만 고르고, 확인한 모습 그대로 주문하세요. 디자인 프로그램도, 디자이너도 필요 없습니다.
        - link "스튜디오에서 만들기" [ref=e77] [cursor=pointer]:
          - /url: /kr/stickers/die-cut-sticker
          - text: 스튜디오에서 만들기
          - img [ref=e78]
      - generic [ref=e83]:
        - generic [ref=e84]:
          - generic [ref=e85]: 기관별 구매 절차
          - heading "우리 기관 결제 방식을 고르면, 그대로 진행됩니다" [level=2] [ref=e86]
          - paragraph [ref=e87]: 결제 방식에 따라 서류 발급 시점과 제작 시작 시점이 다릅니다. 담당자님 상황에 맞는 순서를 확인하세요.
        - generic [ref=e88]:
          - tablist [ref=e89]:
            - tab "세금계산서 후불" [selected] [ref=e90] [cursor=pointer]
            - tab "카드 · 간편결제" [ref=e91] [cursor=pointer]
            - tab "학교장터 · 나라장터" [ref=e92] [cursor=pointer]
            - tab "선지급 · 분할 주문" [ref=e93] [cursor=pointer]
          - tabpanel "세금계산서 후불" [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]:
                - heading "세금계산서 발행 후 계좌이체로 결제" [level=3] [ref=e97]
                - paragraph [ref=e98]: 선결제 없이 서류를 먼저 받고, 기관 내부 결재 후 입금하는 순서입니다. 대부분의 학교·공공기관이 이용하는 방식입니다.
              - generic [ref=e99]: 기관 결제 기본
            - generic [ref=e100]:
              - generic [ref=e101]:
                - generic [ref=e102]: "1"
                - generic [ref=e103]: 견적서 요청
                - generic [ref=e104]: 아래 문의 폼 또는 담당 매니저에게 제품·수량·규격 전달
              - generic [ref=e105]:
                - generic [ref=e106]: "2"
                - generic [ref=e107]: 품의 · 발주 확정
                - generic [ref=e108]: 기관 내부 결재 후 발주 확정 회신 (이메일·카카오채널)
              - generic [ref=e109]:
                - generic [ref=e110]: "3"
                - generic [ref=e111]: 시안 승인 · 제작
                - generic [ref=e112]: 칼선 적용 시안 확인 후 승인 즉시 제작 시작
              - generic [ref=e113]:
                - generic [ref=e114]: "4"
                - generic [ref=e115]: 발송 · 서류 발행
                - generic [ref=e116]: 거래명세서·전자세금계산서 발행, 확인 후 계좌이체
      - generic [ref=e118]:
        - generic [ref=e119]:
          - generic [ref=e120]:
            - generic [ref=e121]: 기관에서 많이 찾는 제품
            - heading "학교와 기관 현장에서 바로 쓰는 스티커" [level=2] [ref=e122]
          - link "전체 제품 보기" [ref=e123] [cursor=pointer]:
            - /url: /kr/stickers
            - text: 전체 제품 보기
            - img [ref=e124]
        - generic [ref=e126]:
          - link "명찰 · 이름 스티커 제품 이미지 학급 · 학생 명찰 · 이름 스티커 교복·사물함·교재용. 방수 재질로 학기 내내 선명하게 유지됩니다." [ref=e127] [cursor=pointer]:
            - /url: /kr/stickers/die-cut-sticker
            - img "명찰 · 이름 스티커 제품 이미지" [ref=e128]
            - generic [ref=e129]:
              - generic [ref=e130]: 학급 · 학생
              - generic [ref=e131]: 명찰 · 이름 스티커
              - generic [ref=e132]: 교복·사물함·교재용. 방수 재질로 학기 내내 선명하게 유지됩니다.
          - link "안내 · 표지 스티커 제품 이미지 시설 · 안내 안내 · 표지 스티커 출입구, 교실 문패, 분리수거, 비상 대피 안내. 실내외 겸용 재질 선택 가능." [ref=e133] [cursor=pointer]:
            - /url: /kr/stickers/die-cut-sticker
            - img "안내 · 표지 스티커 제품 이미지" [ref=e134]
            - generic [ref=e135]:
              - generic [ref=e136]: 시설 · 안내
              - generic [ref=e137]: 안내 · 표지 스티커
              - generic [ref=e138]: 출입구, 교실 문패, 분리수거, 비상 대피 안내. 실내외 겸용 재질 선택 가능.
          - link "행사 홍보 스티커 제품 이미지 행사 · 홍보 행사 홍보 스티커 축제·공모전·캠페인 굿즈. 소량 샘플 후 대량 주문으로 이어집니다." [ref=e139] [cursor=pointer]:
            - /url: /kr/stickers/die-cut-sticker
            - img "행사 홍보 스티커 제품 이미지" [ref=e140]
            - generic [ref=e141]:
              - generic [ref=e142]: 행사 · 홍보
              - generic [ref=e143]: 행사 홍보 스티커
              - generic [ref=e144]: 축제·공모전·캠페인 굿즈. 소량 샘플 후 대량 주문으로 이어집니다.
          - link "칭찬 · 보상 판스티커 제품 이미지 교실 · 보상 칭찬 · 보상 판스티커 한 장에 여러 개를 배치한 판스티커. 학급 운영 보상용으로 가장 많이 쓰입니다." [ref=e145] [cursor=pointer]:
            - /url: /kr/stickers/sticker-sheet
            - img "칭찬 · 보상 판스티커 제품 이미지" [ref=e146]
            - generic [ref=e147]:
              - generic [ref=e148]: 교실 · 보상
              - generic [ref=e149]: 칭찬 · 보상 판스티커
              - generic [ref=e150]: 한 장에 여러 개를 배치한 판스티커. 학급 운영 보상용으로 가장 많이 쓰입니다.
          - link "비품 관리 라벨 (롤) 제품 이미지 자산 · 물품 비품 관리 라벨 (롤) 기관명·관리번호 일련 인쇄. 롤 형태로 대량 부착이 빠릅니다." [ref=e151] [cursor=pointer]:
            - /url: /kr/roll-stickers/die-cut-roll
            - img "비품 관리 라벨 (롤) 제품 이미지" [ref=e152]
            - generic [ref=e153]:
              - generic [ref=e154]: 자산 · 물품
              - generic [ref=e155]: 비품 관리 라벨 (롤)
              - generic [ref=e156]: 기관명·관리번호 일련 인쇄. 롤 형태로 대량 부착이 빠릅니다.
          - link "홀로그램 봉인 스티커 제품 이미지 보안 · 봉인 홀로그램 봉인 스티커 시험지·서류 봉투·장비 봉인용. 복제가 어려운 홀로그램 재질." [ref=e157] [cursor=pointer]:
            - /url: /kr/stickers/hologram-sticker
            - img "홀로그램 봉인 스티커 제품 이미지" [ref=e158]
            - generic [ref=e159]:
              - generic [ref=e160]: 보안 · 봉인
              - generic [ref=e161]: 홀로그램 봉인 스티커
              - generic [ref=e162]: 시험지·서류 봉투·장비 봉인용. 복제가 어려운 홀로그램 재질.
      - generic [ref=e164]:
        - generic [ref=e165]:
          - generic [ref=e166]: 왜 머스티커인가
          - heading "급하게 맡겨도, 퀄리티 때문에 다시 찾는 곳" [level=2] [ref=e167]
        - generic [ref=e168]:
          - generic [ref=e169]:
            - generic [ref=e170]: 오늘 제작 · 내일 발송
            - paragraph [ref=e171]: 디자인 승인 즉시 제작이 시작됩니다. 행사 일정이 촉박해도 맞출 수 있습니다.
          - generic [ref=e172]:
            - generic [ref=e173]: 100% 품질 보장
            - paragraph [ref=e174]: 문제가 생기면 변명하지 않습니다. 재인쇄 또는 환불까지 끝까지 책임집니다.
          - generic [ref=e175]:
            - generic [ref=e176]: 시안 미리보기
            - paragraph [ref=e177]: 파일만 첨부하면 칼선이 적용된 시안을 먼저 확인하고 승인합니다. 결재 전 공유용으로도 쓰입니다.
          - generic [ref=e178]:
            - generic [ref=e179]: 직접 제조
            - paragraph [ref=e180]: ISO 9001:2015 인증을 받은 자체 공장에서 인쇄·커팅·검수까지 직접 진행합니다.
      - generic [ref=e182]:
        - generic [ref=e183]:
          - generic [ref=e184]: 기관 전용 혜택
          - heading "한 번 등록하면, 다음 주문은 더 간단해집니다" [level=2] [ref=e185]
          - paragraph [ref=e186]: 기관 계정으로 주문 이력·시안·서류가 한곳에 모입니다. 학기마다, 행사마다 반복되는 주문을 몇 번의 클릭으로 처리하세요.
          - link "기관 계정 등록 문의" [ref=e187] [cursor=pointer]:
            - /url: "#contact"
        - generic [ref=e188]:
          - generic [ref=e189]:
            - generic [ref=e190]: 수량별 대량 할인
            - generic [ref=e191]: 사이트 자동 견적에 수량별 할인이 이미 적용돼 있어 수량을 고를때 바로 확인됩니다. 자동 견적에 없는 규격·수량은 별도 문의하시면 따로 할인해 드립니다.
          - generic [ref=e192]:
            - generic [ref=e193]: 10초 재주문
            - generic [ref=e194]: 지난 주문의 시안·규격을 그대로 불러와 수량만 바꿔 주문합니다.
          - generic [ref=e195]:
            - generic [ref=e196]: 서류 일괄 내려받기
            - generic [ref=e197]: 견적서·거래명세서·세금계산서·사업자등록증·통장사본을 주문별로 묶어 제공합니다.
          - generic [ref=e198]:
            - generic [ref=e199]: 기관 담당 매니저
            - generic [ref=e200]: 규격 추천, 납기 조율, 서류 발급까지 한 명의 담당자가 연속으로 응대합니다. (디자인 제작·편집은 지원하지 않습니다)
          - generic [ref=e201]:
            - generic [ref=e202]: 담당자 인수인계 지원
            - generic [ref=e203]: 담당자가 바뀌어도 기관 계정의 주문 이력과 시안은 그대로 이어집니다.
          - generic [ref=e204]:
            - generic [ref=e205]: 샘플 먼저, 대량은 나중에
            - generic [ref=e206]: 소량으로 재질·색감을 확인한 뒤 같은 시안으로 대량 주문할 수 있습니다.
      - generic [ref=e208]:
        - generic [ref=e209]:
          - generic [ref=e210]: 기관 고객 이야기
          - heading "사진 후기 255개, 그중 기관 담당자의 목소리" [level=2] [ref=e211]
        - generic [ref=e212]:
          - figure "***대학교 행정실" [ref=e213]:
            - generic [ref=e214]: “
            - blockquote [ref=e215]: 시안 확정 전에 완성 모습을 미리 확인할 수 있어 편리했습니다. 칼선 파일도 직접 검토할 수 있어 안심하고 주문할 수 있었고, 실제 제작물도 확인했던 시안과 동일하게 나와 만족스러웠습니다. 다음 제작 시에도 이용하고 싶습니다.
            - generic [ref=e216]:
              - generic [ref=e217]: 대
              - generic [ref=e218]:
                - generic [ref=e219]: "***대학교"
                - generic [ref=e220]: 행정실
          - figure "***유치원 원감" [ref=e221]:
            - generic [ref=e222]: “
            - blockquote [ref=e223]: 진짜 퀄리티 정말 좋아요!! 나눔용 봉투에 붙이려고 샀는데 오피셜 굿즈보다 오히려 더 좋은...?! 주문도 편리하고 퀄리티 배송 뭐하나 빠지는게 없어서 너무 만족스럽습니다!! 앞으로도 자주 구매하려고 합니다!
            - generic [ref=e224]:
              - generic [ref=e225]: 유
              - generic [ref=e226]:
                - generic [ref=e227]: "***유치원"
                - generic [ref=e228]: 원감
          - figure "***기관 총무팀" [ref=e229]:
            - generic [ref=e230]: “
            - blockquote [ref=e231]: 제작이 완료될 때 까지 책임감을 갖고 일하는 업체라는 인상을 강하게 받았습니다. 친절함과 책임감이 작업을 의뢰하는 입장에서는 정말 중요하다고 생각하는데 이 곳은 그 두 조건은 다 만족시켜주는 곳이라고 생각합니다.
            - generic [ref=e232]:
              - generic [ref=e233]: 기
              - generic [ref=e234]:
                - generic [ref=e235]: "***기관"
                - generic [ref=e236]: 총무팀
      - generic [ref=e238]:
        - generic [ref=e239]:
          - generic [ref=e240]: 자주 묻는 질문
          - heading "기관 담당자가 가장 많이 묻는 질문" [level=2] [ref=e241]
        - generic [ref=e242]:
          - button "견적서에 기관명과 사업자 정보를 넣어 주나요?" [ref=e244] [cursor=pointer]:
            - generic [ref=e245]: 견적서에 기관명과 사업자 정보를 넣어 주나요?
            - generic [ref=e246]: +
          - button "후불(세금계산서 발행 후 입금)이 가능한가요?" [ref=e248] [cursor=pointer]:
            - generic [ref=e249]: 후불(세금계산서 발행 후 입금)이 가능한가요?
            - generic [ref=e250]: +
          - button "학교장터(S2B)·나라장터 계약이 가능한가요?" [ref=e252] [cursor=pointer]:
            - generic [ref=e253]: 학교장터(S2B)·나라장터 계약이 가능한가요?
            - generic [ref=e254]: +
          - button "디자인 파일이 없어도 주문할 수 있나요?" [ref=e256] [cursor=pointer]:
            - generic [ref=e257]: 디자인 파일이 없어도 주문할 수 있나요?
            - generic [ref=e258]: +
          - button "대량 주문 시 납기는 얼마나 걸리나요?" [ref=e260] [cursor=pointer]:
            - generic [ref=e261]: 대량 주문 시 납기는 얼마나 걸리나요?
            - generic [ref=e262]: +
          - button "인쇄 결과에 문제가 있으면 어떻게 되나요?" [ref=e264] [cursor=pointer]:
            - generic [ref=e265]: 인쇄 결과에 문제가 있으면 어떻게 되나요?
            - generic [ref=e266]: +
      - generic [ref=e268]:
        - generic [ref=e269]:
          - generic [ref=e270]: 기관 전용 견적 문의
          - heading "기관명만 적어주시면 견적서를 보내드립니다" [level=2] [ref=e271]
          - paragraph [ref=e272]: 영업일 기준 당일 회신. 파일이 아직 없어도 괜찮습니다. 규격과 수량만 알려주시면 품의용 견적서를 먼저 드립니다.
          - generic [ref=e273]:
            - generic [ref=e274]:
              - img [ref=e275]
              - generic [ref=e277]: 고객센터 1899-5529 · 평일 09:00–18:00
            - generic [ref=e278]:
              - img [ref=e279]
              - generic [ref=e282]: 메일 문의 sales@musticker.com
            - generic [ref=e284]:
              - link "카카오채널 문의 (팝업 창)" [ref=e285] [cursor=pointer]:
                - /url: https://pf.kakao.com/_nJxnTX/chat
                - img [ref=e286]
                - text: 카카오채널 문의
              - generic [ref=e287]: ·
              - link "네이버 톡톡 문의 (팝업 창)" [ref=e288] [cursor=pointer]:
                - /url: https://talk.naver.com/ct/w2luxqo
                - img [ref=e289]
                - text: 네이버 톡톡 문의
        - generic [ref=e292]:
          - generic [ref=e293]:
            - generic [ref=e294]:
              - generic [ref=e295]: 기관명
              - textbox "기관명" [ref=e296]:
                - /placeholder: "예: ○○초등학교"
            - generic [ref=e297]:
              - generic [ref=e298]: 기관 유형
              - combobox "기관 유형" [ref=e300] [cursor=pointer]:
                - generic [ref=e301]: 초·중·고등학교
                - img [ref=e302]
            - generic [ref=e304]:
              - generic [ref=e305]: 담당자 성함
              - textbox "담당자 성함" [ref=e306]
            - generic [ref=e307]:
              - generic [ref=e308]: 연락처
              - group [ref=e310]:
                - textbox "연락처 앞자리" [ref=e311]:
                  - /placeholder: "000"
                - generic [ref=e312]: "-"
                - textbox "연락처 가운데 자리" [ref=e313]:
                  - /placeholder: "0000"
                - generic [ref=e314]: "-"
                - textbox "연락처 뒷자리" [ref=e315]:
                  - /placeholder: "0000"
            - generic [ref=e316]:
              - generic [ref=e317]: 이메일 (견적서 수신)
              - textbox "이메일 (견적서 수신)" [ref=e318]
            - generic [ref=e319]:
              - generic [ref=e320]: 희망 결제 방식
              - combobox "희망 결제 방식" [active] [ref=e322] [cursor=pointer]:
                - generic [ref=e323]: 세금계산서 후 계좌이체
                - img [ref=e324]
            - generic [ref=e326]:
              - generic [ref=e327]: 제품·수량·용도
              - textbox "제품·수량·용도" [ref=e328]:
                - /placeholder: "예: 학생 명찰 스티커 60×30mm 500장, 11월 초 행사 전까지 필요"
            - group "필요한 서류" [ref=e330]:
              - generic [ref=e331]: 필요한 서류
              - generic [ref=e332]:
                - generic [ref=e333] [cursor=pointer]:
                  - checkbox "견적서" [ref=e334]
                  - generic [ref=e335]: 견적서
                - generic [ref=e336] [cursor=pointer]:
                  - checkbox "거래명세서" [ref=e337]
                  - generic [ref=e338]: 거래명세서
                - generic [ref=e339] [cursor=pointer]:
                  - checkbox "전자세금계산서" [ref=e340]
                  - generic [ref=e341]: 전자세금계산서
                - generic [ref=e342] [cursor=pointer]:
                  - checkbox "사업자등록증·통장사본" [ref=e343]
                  - generic [ref=e344]: 사업자등록증·통장사본
          - generic [ref=e345]:
            - generic [ref=e346]: 디자인 파일 (선택)
            - button "디자인 파일 (선택)" [ref=e347]
            - button "디자인 파일 선택" [ref=e349] [cursor=pointer]:
              - img [ref=e350]
              - generic [ref=e352]:
                - generic [ref=e353]: 파일 선택
                - generic [ref=e354]: 또는 여기로 파일을 끌어 놓으세요
            - paragraph [ref=e355]: ai, eps, psd, pdf, png, jpg, jpeg · 최대 50MB · 1개
          - button "견적서 요청하기" [ref=e356] [cursor=pointer]
          - paragraph [ref=e357]: 입력하신 정보는 견적 안내 목적으로만 사용되며, 개인정보처리방침에 따라 관리됩니다.
    - navigation "네이버 톡톡으로 문의하기" [ref=e358]:
      - link "카카오채널로 문의하기" [ref=e359] [cursor=pointer]:
        - /url: https://pf.kakao.com/_nJxnTX/chat
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 카카오채널로 문의하기
        - img [ref=e361]
      - link "네이버 톡톡 으로 문의하기" [ref=e362] [cursor=pointer]:
        - /url: https://talk.naver.com/ct/w2luxqo
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 네이버 톡톡 으로 문의하기
        - img [ref=e364]
      - button "이메일로 문의하기" [ref=e365] [cursor=pointer]:
        - generic:
          - generic:
            - generic:
              - img
            - paragraph: 이메일로 문의하기
        - img [ref=e367]
    - button [ref=e368] [cursor=pointer]:
      - img [ref=e369]
  - contentinfo [ref=e371]:
    - generic [ref=e374]:
      - generic [ref=e375]:
        - generic [ref=e376]:
          - generic [ref=e377]:
            - paragraph [ref=e378]: 제품
            - list [ref=e379]:
              - listitem [ref=e380]:
                - link "스티커" [ref=e381] [cursor=pointer]:
                  - /url: /kr/stickers
              - listitem [ref=e382]:
                - link "롤스티커" [ref=e383] [cursor=pointer]:
                  - /url: /kr/roll-stickers
              - listitem [ref=e384]:
                - link "판스티커" [ref=e385] [cursor=pointer]:
                  - /url: /kr/sheet-stickers
              - listitem [ref=e386]:
                - link "홀로그램 스티커" [ref=e387] [cursor=pointer]:
                  - /url: /kr/stickers/hologram-sticker
              - listitem [ref=e388]:
                - link "글자 커팅 스티커" [ref=e389] [cursor=pointer]:
                  - /url: /kr/stickers/vinyl-lettering
          - generic [ref=e390]:
            - paragraph [ref=e391]: 주문 안내
            - list [ref=e392]:
              - listitem [ref=e393]:
                - link "주문 방법" [ref=e394] [cursor=pointer]:
                  - /url: /kr/faq?topic=order
              - listitem [ref=e395]:
                - link "파일 가이드" [ref=e396] [cursor=pointer]:
                  - /url: /kr/faq?topic=artwork
              - listitem [ref=e397]:
                - link "배송 안내" [ref=e398] [cursor=pointer]:
                  - /url: /kr/faq?topic=order&question=shippingStart
              - listitem [ref=e399]:
                - link "재인쇄ㆍ환불안내" [ref=e400] [cursor=pointer]:
                  - /url: /kr/faq?topic=refund
              - listitem [ref=e401]:
                - link "자주 묻는 질문" [ref=e402] [cursor=pointer]:
                  - /url: /kr/faq
          - generic [ref=e403]:
            - paragraph [ref=e404]: 혜택·지원
            - list [ref=e405]:
              - listitem [ref=e406]:
                - link "학교·공공기관 주문" [ref=e407] [cursor=pointer]:
                  - /url: /kr/institutions
              - listitem [ref=e408]:
                - link "대량주문·기업 견적" [ref=e409] [cursor=pointer]:
                  - /url: /kr/business
              - listitem [ref=e410]:
                - link "제휴·파트너십 문의" [ref=e411] [cursor=pointer]:
                  - /url: /kr/partnership
          - generic [ref=e412]:
            - paragraph [ref=e413]: 회사
            - list [ref=e414]:
              - listitem [ref=e415]:
                - link "브랜드 소개" [ref=e416] [cursor=pointer]:
                  - /url: /kr/about
              - listitem [ref=e417]:
                - link "공지사항" [ref=e418] [cursor=pointer]:
                  - /url: /kr/announcements
              - listitem [ref=e419]:
                - link "인재채용" [ref=e420] [cursor=pointer]:
                  - /url: /kr/careers
              - listitem [ref=e421]:
                - button "고객리뷰" [ref=e422] [cursor=pointer]
        - generic [ref=e423]:
          - generic [ref=e424]:
            - img "musticker logo" [ref=e425]
            - generic [ref=e426]: / 머스티커
          - generic [ref=e427]:
            - paragraph [ref=e428]: 고객센터
            - link "1899-5529" [ref=e429] [cursor=pointer]:
              - /url: tel:1899-5529
            - generic [ref=e430]:
              - paragraph [ref=e431]: 평일 09:00 – 18:00 · 토·일·공휴일 휴무
              - paragraph [ref=e432]:
                - generic [ref=e433]: 구매 문의
                - link "sales@musticker.com" [ref=e434] [cursor=pointer]:
                  - /url: mailto:sales@musticker.com
          - generic [ref=e435]:
            - link "Instagram" [ref=e436] [cursor=pointer]:
              - /url: https://www.instagram.com/musticker_official/
            - link "Naver Blog" [ref=e438] [cursor=pointer]:
              - /url: https://blog.naver.com/musticker
            - link "KakaoTalk Channel" [ref=e440] [cursor=pointer]:
              - /url: https://pf.kakao.com/_nJxnTX/chat
      - generic [ref=e442]:
        - separator [ref=e443]
        - generic [ref=e444]:
          - generic [ref=e446]:
            - paragraph [ref=e447]: (주)글로픽스 · 대표 여일석 · 사업자번호 877-88-03313 · 통신판매업신고 2026-부산해운대-0792호
            - paragraph [ref=e448]: 부산광역시 해운대구 해운대해변로 203 오션타워 1014호 · 호스팅 Amazon Web Services
            - paragraph [ref=e449]:
              - link "이용약관" [ref=e450] [cursor=pointer]:
                - /url: /kr/terms-of-use
              - text: ·
              - link "개인정보처리방침" [ref=e451] [cursor=pointer]:
                - /url: /kr/privacy-policy
              - text: ·
              - button "사업자정보확인" [ref=e452] [cursor=pointer]
              - text: ·
              - link "오픈소스고지" [ref=e453] [cursor=pointer]:
                - /url: /kr/open-source-licenses
            - paragraph [ref=e454]:
              - text: "International:"
              - link "Terms & Conditions" [ref=e455] [cursor=pointer]:
                - /url: /terms-of-use
              - text: ·
              - link "Privacy Policy" [ref=e456] [cursor=pointer]:
                - /url: /privacy-policy
          - paragraph [ref=e457]: © 2026 GLOPHICS Corp. All rights reserved.
```

# Test source

```ts
  1   | import { test, expect } from '../../../fixtures/e2e-test.js';
  2   | import {
  3   |   institutionPaymentMethods,
  4   |   partnerInquiryCopy,
  5   |   partnerInquiryPages,
  6   |   partnershipWebsite,
  7   |   type PartnerInquiryKind
  8   | } from '../../../fixtures/partner-inquiry-data.js';
  9   | import { PartnerInquiryV2Page } from '../../../pom/storefront/partner-inquiry-page.js';
  10  | 
  11  | // The B2B quote forms on /business, /institutions and /partnership, explored read-only on production
  12  | // on 2026-11-13. MS-NAV-014 only checks that each page opens; these cases cover the forms. Nothing is
  13  | // ever sent: the page object aborts every non-GET Musticker request, and each test ends by asserting
  14  | // that none was attempted.
  15  | 
  16  | const pageFor = (kind: PartnerInquiryKind) => {
  17  |   const data = partnerInquiryPages.find((candidate) => candidate.kind === kind);
  18  | 
  19  |   if (!data) {
  20  |     throw new Error(`No partner inquiry page data for ${kind}`);
  21  |   }
  22  | 
  23  |   return data;
  24  | };
  25  | 
  26  | test.describe('Partner inquiry', { tag: ['@regression', '@validation', '@production'] }, () => {
  27  |   test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });
  28  | 
  29  |   for (const data of partnerInquiryPages) {
  30  |     test(`${data.id} ${data.name}: the hero CTA brings the quote form into view, and a blank submit flags every required field without sending`, async ({ page }) => {
  31  |       const inquiry = new PartnerInquiryV2Page(page, data);
  32  | 
  33  |       await inquiry.goto();
  34  |       await inquiry.openFormFromHero();
  35  |       await inquiry.expectNoRequiredErrors();
  36  | 
  37  |       await inquiry.submit();
  38  | 
  39  |       await inquiry.expectRequiredErrors();
  40  |       inquiry.expectNothingSent();
  41  |     });
  42  |   }
  43  | 
  44  |   test('MS-INQ-007 기업 견적: a malformed email is refused and the phone boxes keep only digits', async ({ page }) => {
  45  |     const inquiry = new PartnerInquiryV2Page(page, pageFor('business'));
  46  |     const { sample } = partnerInquiryCopy;
  47  | 
  48  |     await inquiry.goto();
  49  |     await inquiry.fill('회사명', sample.company);
  50  |     await inquiry.fill('담당자', sample.contact);
  51  |     await inquiry.fillPhone(sample.phoneWithLetters, sample.phoneMiddle, sample.phoneLast);
  52  |     await inquiry.fill('이메일', sample.malformedEmail);
  53  |     await inquiry.fill('제품 · 수량 · 납기', sample.message);
  54  | 
  55  |     await expect(inquiry.phonePart(0)).toHaveValue(sample.phoneDigits);
  56  | 
  57  |     await inquiry.submit();
  58  | 
  59  |     await expect(inquiry.field('email')).toContainText(partnerInquiryCopy.invalidEmail);
  60  |     await expect(inquiry.form.getByLabel('이메일', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  61  |     // Only the email is wrong, so it must be the only error on the form.
  62  |     await inquiry.expectNoRequiredErrors();
  63  |     await expect(inquiry.form.locator('[aria-invalid="true"]')).toHaveCount(1);
  64  |     inquiry.expectNothingSent();
  65  |   });
  66  | 
  67  |   test('MS-INQ-008 학교·공공기관: 준비 중 payment routes cannot be chosen, and 카드·간편결제 can', async ({ page }) => {
  68  |     const inquiry = new PartnerInquiryV2Page(page, pageFor('institutions'));
  69  |     const payment = inquiry.select(institutionPaymentMethods.label);
  70  | 
  71  |     await inquiry.goto();
  72  |     await expect(payment).toHaveText(institutionPaymentMethods.default);
  73  | 
  74  |     const menu = await inquiry.openSelect(institutionPaymentMethods.label);
> 75  |     await expect(menu.getByRole('option')).toHaveText([
      |                                            ^ Error: expect(locator).toHaveText(expected) failed
  76  |       ...institutionPaymentMethods.selectable,
  77  |       ...institutionPaymentMethods.comingSoon.map((name) => new RegExp(`^${escapeRegExp(name)}\\s*${institutionPaymentMethods.comingSoonBadge}$`))
  78  |     ]);
  79  | 
  80  |     for (const name of institutionPaymentMethods.comingSoon) {
  81  |       const option = menu.getByRole('option', { name: new RegExp(escapeRegExp(name)) });
  82  | 
  83  |       await expect(option).toHaveAttribute('aria-disabled', 'true');
  84  |       // Dispatched, because click() would wait for the option to become enabled; the point is that a
  85  |       // click which does land changes nothing.
  86  |       await option.dispatchEvent('click');
  87  |       await expect(payment).toHaveText(institutionPaymentMethods.default);
  88  |     }
  89  | 
  90  |     await inquiry.openSelect(institutionPaymentMethods.label);
  91  |     await menu.getByRole('option', { name: institutionPaymentMethods.card.label, exact: true }).click();
  92  | 
  93  |     await expect(payment).toHaveText(institutionPaymentMethods.card.label);
  94  |     await expect(payment).toHaveAttribute('aria-expanded', 'false');
  95  |     // The hidden native select is what the form submits; CSS because it is aria-hidden by design.
  96  |     await expect(inquiry.form.locator('select[name="payment_method"]')).toHaveValue(institutionPaymentMethods.card.value);
  97  |     inquiry.expectNothingSent();
  98  |   });
  99  | 
  100 |   test('MS-INQ-009 제휴: the optional website must be an http(s) address, and a valid one clears the error', async ({ page }) => {
  101 |     const inquiry = new PartnerInquiryV2Page(page, pageFor('partnership'));
  102 |     const website = inquiry.form.getByLabel(partnershipWebsite.label, { exact: true });
  103 | 
  104 |     await inquiry.goto();
  105 |     await website.fill(partnerInquiryCopy.sample.malformedWebsite);
  106 |     await inquiry.submit();
  107 | 
  108 |     await expect(website).toHaveAttribute('aria-invalid', 'true');
  109 |     // The wording is MS-INQ-010's concern; here the message only has to name the accepted schemes.
  110 |     await expect(inquiry.fieldError('website')).toContainText(partnershipWebsite.schemeHint);
  111 | 
  112 |     await website.fill(partnerInquiryCopy.sample.validWebsite);
  113 |     await inquiry.submit();
  114 | 
  115 |     await expect(website).not.toHaveAttribute('aria-invalid', 'true');
  116 |     await expect(inquiry.fieldError('website')).toHaveCount(0);
  117 |     // The required fields are still blank, so they (and only they) stay flagged.
  118 |     await inquiry.expectRequiredErrors();
  119 |     inquiry.expectNothingSent();
  120 |   });
  121 | 
  122 |   test('MS-INQ-010 제휴: the website error is written in Korean', async ({ page }) => {
  123 |     test.fail(true, 'DEFECT MUS-QA-029: the partnership website error is shown in English');
  124 |     const inquiry = new PartnerInquiryV2Page(page, pageFor('partnership'));
  125 |     const website = inquiry.form.getByLabel(partnershipWebsite.label, { exact: true });
  126 | 
  127 |     await inquiry.goto();
  128 |     await website.fill(partnerInquiryCopy.sample.malformedWebsite);
  129 |     await inquiry.submit();
  130 |     await expect(website).toHaveAttribute('aria-invalid', 'true');
  131 | 
  132 |     await expect(inquiry.fieldError('website')).toHaveText(partnershipWebsite.koreanMessage);
  133 |     inquiry.expectNothingSent();
  134 |   });
  135 | });
  136 | 
  137 | function escapeRegExp(value: string): string {
  138 |   return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  139 | }
  140 | 
```