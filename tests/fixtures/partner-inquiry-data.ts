// The three B2B landing pages linked from the footer's 고객지원 column, each ending in its own quote
// form (#contact). Explored read-only on production on 2026-11-13: every form was probed with its
// non-GET requests blocked, so nothing was ever sent. The fields share one component, whose ids are
// `partner-inquiry-<kind>-<field>`; phone numbers are three digit-only boxes.

export type PartnerInquiryKind = 'business' | 'institutions' | 'partnership';

export type PartnerInquiryPage = {
  id: string;
  kind: PartnerInquiryKind;
  name: string;
  /** Path relative to the storefront base, as appPath() takes it. */
  path: string;
  /** The level-1 heading, also asserted by MS-NAV-014. */
  heading: RegExp;
  /** The first in-page link to #contact (the hero CTA). */
  heroCta: string;
  submit: string;
  /**
   * The fields a blank submit flags, in form order: `key` names the field's wrapper
   * (data-testid partner-inquiry-field-<key>), which also holds its error. 연락처 is the three
   * phone boxes, and its label points at no control, so they are reached by their own names.
   */
  requiredFields: ReadonlyArray<{ key: string; label: string }>;
};

export const partnerInquiryPages: readonly PartnerInquiryPage[] = [
  {
    id: 'MS-INQ-004',
    kind: 'business',
    name: '대량주문·기업 견적',
    path: './business',
    heading: /대량 주문/,
    heroCta: '기업 견적 받기',
    submit: '견적 요청하기',
    requiredFields: [
      { key: 'company_name', label: '회사명' },
      { key: 'contact_name', label: '담당자' },
      { key: 'phone', label: '연락처' },
      { key: 'email', label: '이메일' },
      { key: 'message', label: '제품 · 수량 · 납기' }
    ]
  },
  {
    id: 'MS-INQ-005',
    kind: 'institutions',
    name: '학교·공공기관 주문',
    path: './institutions',
    heading: /학교·공공기관 스티커 발주/,
    heroCta: '기관 전용 견적 받기',
    submit: '견적서 요청하기',
    requiredFields: [
      { key: 'organization_name', label: '기관명' },
      { key: 'contact_name', label: '담당자 성함' },
      { key: 'phone', label: '연락처' },
      { key: 'email', label: '이메일 (견적서 수신)' },
      { key: 'message', label: '제품·수량·용도' }
    ]
  },
  {
    id: 'MS-INQ-006',
    kind: 'partnership',
    name: '제휴·파트너십 문의',
    path: './partnership',
    heading: /스티커 제작은 머스티커가/,
    heroCta: '제휴 문의하기',
    submit: '제휴 문의 보내기',
    requiredFields: [
      { key: 'company_name', label: '회사명 · 브랜드명' },
      { key: 'contact_name', label: '담당자' },
      { key: 'phone', label: '연락처' },
      { key: 'email', label: '이메일' },
      { key: 'message', label: '제휴 내용 · 예상 물량 · 시작 시점' }
    ]
  }
];

export const partnerInquiryCopy = {
  required: '필수 항목입니다.',
  invalidEmail: '유효한 이메일 주소를 입력해 주세요',
  phoneParts: ['연락처 앞자리', '연락처 가운데 자리', '연락처 뒷자리'],
  /** Typed values. None is ever submitted: every test blocks non-GET Musticker requests first. */
  sample: {
    company: 'QA 자동화 점검',
    contact: 'QA',
    phoneWithLetters: 'ab010',
    phoneDigits: '010',
    phoneMiddle: '1234',
    phoneLast: '5678',
    malformedEmail: 'not-an-email',
    validEmail: 'qa-check@example.com',
    message: '자동화 점검용 입력입니다. 전송하지 않습니다.',
    malformedWebsite: 'musticker shop',
    validWebsite: 'https://example.com'
  }
} as const;

/** 학교·공공기관 희망 결제 방식, in menu order. The marketplace routes are listed but not open yet. */
export const institutionPaymentMethods = {
  label: '희망 결제 방식',
  default: '세금계산서 후 계좌이체',
  selectable: ['세금계산서 후 계좌이체', '카드·간편결제', '아직 모름 (상담 필요)'],
  comingSoon: ['학교장터(S2B)', '나라장터'],
  comingSoonBadge: '준비 중',
  card: { label: '카드·간편결제', value: 'card' }
} as const;

export const partnershipWebsite = {
  label: '홈페이지 · 스토어 주소 (선택)',
  /**
   * What the error should say. DEFECT MUS-QA-029: production shows the English "Please enter a valid
   * address starting with http:// or https://." on the Korean storefront (2026-11-13). Product has
   * not given the Korean copy yet, so MS-INQ-009 asserts only that the message is Korean.
   */
  koreanMessage: /[가-힣]/,
  /** Any wording of the error should name the schemes it accepts. */
  schemeHint: 'https://'
} as const;
