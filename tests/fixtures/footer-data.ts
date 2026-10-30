// The storefront footer as it stands on production, explored read-only on 2026-10-30 and identical on
// dev-1 that day. Every page with the site layout renders it (home, categories, products, FAQ, about);
// the cart page has none. The 처음 주문해도 걱정할 필요 없어요 CTA band above the columns is home-only.

export type FooterLink = {
  name: string;
  /** Path relative to the storefront base, as appPath() takes it. */
  path: string;
  /** Opens in a new tab (target=_blank, rel="noopener noreferrer"). */
  newTab: boolean;
  /** The destination's level-1 heading. Several wrap onto two lines, hence patterns. */
  heading: RegExp;
};

/**
 * The four link columns, in render order. Column titles are paragraphs, not headings. The 회사
 * column also ends with a 고객리뷰 button (not a link), covered on its own by MS-NAV-015.
 */
export const footerColumns: ReadonlyArray<{ title: string; links: readonly FooterLink[] }> = [
  {
    title: '제품',
    links: [
      { name: '스티커', path: './stickers', newTab: false, heading: /^스티커$/ },
      { name: '롤스티커', path: './roll-stickers', newTab: false, heading: /^롤스티커$/ },
      { name: '판스티커', path: './sheet-stickers', newTab: false, heading: /^판스티커$/ },
      { name: '홀로그램 스티커', path: './stickers/hologram-sticker', newTab: false, heading: /^홀로그램 스티커$/ },
      { name: '글자 커팅 스티커', path: './stickers/vinyl-lettering', newTab: false, heading: /^글자 커팅 스티커$/ }
    ]
  },
  {
    // Their FAQ deep links (topic and question selection) are covered by MS-DSC-008 to MS-DSC-011.
    title: '주문 안내',
    links: [
      { name: '주문 방법', path: './faq?topic=order', newTab: false, heading: /^FAQ$/ },
      { name: '파일 가이드', path: './faq?topic=artwork', newTab: false, heading: /^FAQ$/ },
      { name: '배송 안내', path: './faq?topic=order&question=shippingStart', newTab: false, heading: /^FAQ$/ },
      { name: '재인쇄ㆍ환불안내', path: './faq?topic=refund', newTab: false, heading: /^FAQ$/ },
      { name: '자주 묻는 질문', path: './faq', newTab: false, heading: /^FAQ$/ }
    ]
  },
  {
    title: '혜택·지원',
    links: [
      { name: '학교·공공기관 주문', path: './institutions', newTab: true, heading: /학교·공공기관 스티커 발주/ },
      { name: '대량주문·기업 견적', path: './business', newTab: true, heading: /대량 주문/ },
      { name: '제휴·파트너십 문의', path: './partnership', newTab: true, heading: /스티커 제작은 머스티커가/ }
    ]
  },
  {
    title: '회사',
    links: [
      { name: '브랜드 소개', path: './about', newTab: true, heading: /우리가 만드는 것은/ },
      // Rendering covered by MS-DSC-015.
      { name: '공지사항', path: './announcements', newTab: false, heading: /^공지사항$/ },
      { name: '인재채용', path: './careers', newTab: true, heading: /좋은 결과는/ }
    ]
  }
];

/** The legal row under the business details. Destinations are covered by MS-DSC-012 to MS-DSC-014. */
export const footerLegalLinks = [
  { name: '이용약관', path: './terms-of-use' },
  { name: '개인정보처리방침', path: './privacy-policy' },
  { name: '오픈소스고지', path: './open-source-licenses' }
] as const;

export const footerContact = {
  supportLabel: '고객센터',
  phone: '1899-5529',
  hours: '평일 09:00 – 18:00 · 토·일·공휴일 휴무',
  salesLabel: '구매 문의',
  salesEmail: 'sales@musticker.com'
} as const;

// Korean e-commerce law requires the seller's registration details on every page and a link to the
// FTC's public lookup for that registration number.
export const footerBusiness = {
  company: '(주)글로픽스',
  representative: '대표 여일석',
  registration: '사업자번호 877-88-03313',
  /** The registration number as the FTC lookup takes it (wrkr_no). */
  registrationDigits: '8778803313',
  mailOrderNumber: '통신판매업신고 2026-부산해운대-0792호',
  address: '부산광역시 해운대구 해운대해변로 203 오션타워 1014호',
  businessInfoButton: '사업자정보확인',
  ftcLookupUrl: 'https://www.ftc.go.kr/bizCommPop.do',
  // The rendered text carries a leading space, so the pattern is not anchored at the start.
  copyright: /© \d{4} GLOPHICS Corp\. All rights reserved\.$/
} as const;

export const footerSocialLinks = [
  // The accessible name comes from the icon's alt text.
  { name: 'instagram icon', href: 'https://www.instagram.com/musticker_official/' },
  { name: 'KakaoTalk Channel', href: 'https://pf.kakao.com/_nJxnTX/chat' }
] as const;

export const footerCta = {
  heading: '처음 주문해도 걱정할 필요 없어요',
  inquiry: '제작 문의하기',
  order: '바로 주문하기',
  // 바로 주문하기 opens the 자유형 조각스티커 product page.
  orderPath: './stickers/die-cut-sticker',
  orderHeading: '자유형 조각스티커',
  inquiryHeading: '문의',
  inquiryCancel: '취소'
} as const;

export const footerReviews = {
  button: '고객리뷰',
  // From any other page the button opens the home page at #reviews.
  hash: '#reviews',
  sectionHeading: /^사진 후기 \d+개, 만족도는 이미 증명됐어요$/
} as const;
