// Public routes and copy verified on production on 2026-10-23.
export const faqFooterLinks = [
  { id: 'MS-DSC-008', name: 'order', label: '주문 방법', topic: 'order', topicLabel: '주문', question: '비회원으로도 주문이 가능한가요?' },
  { id: 'MS-DSC-009', name: 'artwork', label: '파일 가이드', topic: 'artwork', topicLabel: '디자인 파일 업로드', question: '어떤 파일 형식이 접수 가능한가요?' },
  { id: 'MS-DSC-010', name: 'shipping', label: '배송 안내', topic: 'order', topicLabel: '주문', question: '주문 후 제작 및 발송은 언제부터 시작되나요?', questionKey: 'shippingStart' },
  { id: 'MS-DSC-011', name: 'refund', label: '재인쇄ㆍ환불안내', topic: 'refund', topicLabel: '반품/환불', question: '반품/교환 하려면 어떻게 해야하나요?' }
] as const;

export const publicFooterPages = [
  { id: 'MS-DSC-012', name: 'terms', label: '이용약관', path: './terms-of-use', heading: /이용약관/, section: '#cancellation-refunds-returns' },
  { id: 'MS-DSC-013', name: 'privacy', label: '개인정보처리방침', path: './privacy-policy', heading: /개인정보처리방침/, section: '#user-rights-and-how-to-exercise' },
  { id: 'MS-DSC-014', name: 'licenses', label: '오픈소스 고지', path: './open-source-licenses', heading: /라이선스 및 콘텐츠 이용안내/, section: undefined },
  { id: 'MS-DSC-015', name: 'announcements', label: '공지사항', path: './announcements', heading: /공지사항/, section: undefined }
] as const;

export const discoveryCopy = {
  membershipQuestion: '회원가입 시 혜택이 궁금합니다.',
  guestOrderAnswer: '회원가입 없이도 비회원으로 간편하게 주문하실 수 있습니다.',
  shippingAnswer: '영업일 기준',
  stickerQuery: '스티커',
  noMatchQuery: 'qa-no-matching-product-7f302a91'
} as const;

export type FaqFooterLink = (typeof faqFooterLinks)[number];
export type PublicFooterPage = (typeof publicFooterPages)[number];
