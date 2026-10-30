// The redesigned guest checkout as it stands on production, explored read-only on 2026-10-30 (a guest
// cart only; nothing was submitted or paid). dev-1 matched except where noted.

/**
 * The payment options, in render order. dev-1 still labels two of them the old way (Naver Pay,
 * 무통장 입); the page object falls back to their position, which is the same on both, and records a
 * self-heal annotation rather than failing on the copy.
 */
export const checkoutPaymentMethods = [
  { name: 'Npay', group: '간편결제' },
  { name: '카카오페이', group: '간편결제' },
  { name: '토스페이', group: '간편결제' },
  { name: '페이코', group: '간편결제' },
  { name: '신용카드', group: '기타 결제' },
  { name: '실시간 계좌이체', group: '기타 결제' },
  { name: '가상계좌', group: '기타 결제' },
  { name: '무통장 입금', group: '기타 결제' }
] as const;

export type CheckoutPaymentMethod = (typeof checkoutPaymentMethods)[number]['name'];

export const checkoutCopy = {
  paymentHeading: '결제 수단',
  defaultPaymentMethod: 'Npay' as CheckoutPaymentMethod,
  // Shown only while 무통장 입금 is selected.
  depositorLabel: '입금자명',
  depositorNote: '안내: 무통장 입금은 입금 확인 및 처리까지 영업일 기준 1~2일이 소요될 수 있습니다.',
  depositBank: '하나은행',

  shippingHeading: '배송 정보',
  shippingMethod: '일반 배송',
  shippingMethodNote: '안내 : 오늘 주문 확정 시 도착 예정일입니다.',
  // "예상 배송일: 2026년 11월 3일 - 5일"; the end date names its month only when it differs.
  estimatedDelivery: /예상 배송일: (\d{4})년 (\d{1,2})월 (\d{1,2})일 - (?:(\d{1,2})월 )?(\d{1,2})일/,
  roadAddressLabel: '도로명 주소',

  consignment: '위탁배송 이용하기',
  consignmentMemberNote: '주소 저장은 회원만 이용할 수 있습니다.',
  nameLabel: '성함',
  companyLabel: '회사명 (선택사항)',

  contactHeading: '연락처 정보',
  login: '로그인',
  loginPromo: '오늘 회원가입하고 첫 주문 시 특별 혜택을 누려보세요!',
  loginMemberTab: '회원',
  loginGuestTab: '비회원',
  editSummary: '주문 요약 수정',
  shippingFeeInfo: '배송비 정보 보기'
} as const;

/**
 * The explanations behind the checkout's info icons, in page order. The first three icons have no
 * accessible name (MUS-QA-027), so they are told apart by position.
 */
export const checkoutInfoTips = [
  { about: 'email', title: '이메일 인증 및 업데이트', text: '계정 보유 여부를 확인하고 주문 업데이트를 보내는 데 사용됩니다.' },
  { about: 'road address', title: '도로명 주소', text: '주소 찾기를 이용해 주소를 검색해 주세요.' },
  { about: 'consignment', title: '위탁배송 이용하기', text: '머스티커가 제작, 포장, 배송까지 대신 진행합니다.' }
] as const;

export const checkoutShippingFeeTip = {
  title: '배송비',
  text: '배송비는 선택한 배송 방법과 지역에 따라 계산됩니다.',
  note: '5만원 이상 주문 시 무료배송'
} as const;
