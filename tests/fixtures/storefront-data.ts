import { stickersPerSheet } from './sheet-packing.js';

export const ko = {
  homeHero: '\uc2a4\ud2f0\ucee4\u314b\u314b\u314b, \uc774\uc720\uac00 \uc788\uad6c\ub098',
  notFoundHeading: '\uc557! \ud398\uc774\uc9c0\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.',
  backToHome: '\ud648\uc73c\ub85c \ub3cc\uc544\uac00\uae30',
  stickers: '\uc2a4\ud2f0\ucee4',
  rollStickers: '\ub864\uc2a4\ud2f0\ucee4',
  sheetStickers: '판스티커',
  fastOrder: '\ube60\ub978 \uc8fc\ubb38',
  orderNow: '\ubc14\ub85c \uc8fc\ubb38\ud558\uae30',
  inquiryCta: '\uc81c\uc791 \ubb38\uc758\ud558\uae30',
  reviews225: /\uc0ac\uc9c4 \ud6c4\uae30\s*\d+\uac1c|\d+\uac1c \uc0ac\uc9c4 \ud6c4\uae30/,
  footerBrand: 'MUSTICKER / \uba38\uc2a4\ud2f0\ucee4',
  terms: '\uc774\uc6a9\uc57d\uad00',
  privacy: '\uac1c\uc778\uc815\ubcf4\ucc98\ub9ac\ubc29\uce68',
  faq: '\uc790\uc8fc \ubb3b\ub294 \uc9c8\ubb38',
  account: '\uacc4\uc815',
  cart: '\uc7a5\ubc14\uad6c\ub2c8',
  nextStep: '\ub2e4\uc74c \ub2e8\uacc4',
  customSize: '\uc6d0\ud558\ub294 \ud06c\uae30 \uc785\ub825',
  // The cart edit dialogs label the same custom-size choice differently to the product page's
  // 원하는 크기 입력 pill -- there it is a 맞춤 사이즈 option inside a ui-select listbox.
  cartCustomSize: '맞춤 사이즈',
  cartUpdate: '업데이트',
  sizeGuideOpen: '배치 가이드 보기',
  sizeGuideCustomSize: '직접 입력',
  sizeGuideApply: '적용하기',
  // The storefront shows one of two rejection lines for this rule. When only the height is over, an
  // axis-specific line names the offending axis and the exact limit (`...들어가도록 세로 길이를 97mm
  // 이하로 입력해 주세요.`, deployed to production 2026-08-31); when the width exceeds the work area,
  // the original generic line still appears (`더 작은 사이즈를 입력해 주세요. 한 시트에 최소 2개의
  // 스티커가 들어가야 합니다.`). Matched on the clause the two share, so either satisfies the rule
  // being announced at all -- which is what every caller here is asserting.
  minimumTwoPerSheetError: /한 시트에 최소 2개의 스티커/,
  minimumSizeError: '가로 또는 세로 크기는 최소 10×10mm 이상이어야 합니다.',
  customQuantity: '\uc6d0\ud558\ub294 \uc218\ub7c9 \uc785\ub825',
  medium75: '\uc911\ud615 75x75',
  transparent: '\ud22c\uba85',
  faqHero: '\ub3c4\uc6c0\uc774 \ud544\uc694\ud558\uc2e0\uac00\uc694?',
  faqSearchPlaceholder: '\uad81\uae08\ud55c \uc0ac\ud56d\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694.',
  orderTopic: '\uc8fc\ubb38',
  guestOrderQuestion: '\ube44\ud68c\uc6d0\uc73c\ub85c\ub3c4 \uc8fc\ubb38\uc774 \uac00\ub2a5\ud55c\uac00\uc694?',
  coupon: '\ucfe0\ud3f0',
  inquiry: '\ubb38\uc758',
  oneToOneInquiry: '1:1\ubb38\uc758\ud558\uae30',
  namePlaceholder: '\uc131\ud568\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.',
  emailPlaceholder: '\uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694.',
  messagePlaceholder: '\uc5ec\uae30\uc5d0 \ubb38\uc758\ud558\uc2e4 \ub0b4\uc6a9\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.',
  fileSelect: '\ud30c\uc77c \uc120\ud0dd',
  cancel: '\ucde8\uc18c',
  kakaoInquiry: '\uce74\uce74\uc624\ucc44\ub110\ub85c \ubb38\uc758\ud558\uae30',
  naverInquiry: '\ub124\uc774\ubc84 \ud1a1\ud1a1 \uc73c\ub85c \ubb38\uc758\ud558\uae30',
  addToCart: '\uc7a5\ubc14\uad6c\ub2c8 \ub2f4\uae30',
  sendFileLater: '\uc774 \ub2e8\uacc4\ub97c \uac74\ub108\ub6f0\uace0 \ub098\uc911\uc5d0 \ud30c\uc77c \ubcf4\ub0b4\uae30',
  secureCheckout: '\uc548\uc804 \uacb0\uc81c',
  payNow: '\uacb0\uc81c\ud558\uae30',
  checkoutEmailPlaceholder: '\uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694.',
  checkoutNamePlaceholder: '\uc131\ud568\uc744 \uc785\ub825\ud558\uc138\uc694',
  checkoutPostalCodePlaceholder: '\uc6b0\ud3b8\ubc88\ud638\ub97c \uc785\ub825\ud558\uc138\uc694',
  hologram: '\ud640\ub85c\uadf8\ub7a8',
  pvcMatte: 'PVC \ub9e4\ud2b8',
  sizeChangeAction: '\uc0ac\uc774\uc988 \ubcc0\uacbd',
  addImageLink: '\uc774\ubbf8\uc9c0 \ucd94\uac00',
  changeImageLink: '\uc774\ubbf8\uc9c0 \ubcc0\uacbd',
  black: '\uac80\uc815',
  fullColor: '\ud480 \uceec\ub7ec',
  kakaoPay: '\uce74\uce74\uc624\ud398\uc774',
  otpConfirm: '\ud655\uc778',
  orderCompletedHeading: '\uc8fc\ubb38\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4!'
} as const;

// The order-summary row labels on /kr/checkout, captured live from development-1 on 2026-08-27.
// Keyed off the label text because the rows carry no test ids -- only `.checkout-summary-line` with
// a `-label`/`-value` pair, and `.is-total` on the last one.
export const checkoutSummaryLabels = {
  subtotal: '소계',
  shipping: '배송비',
  pointsDiscount: '포인트 할인',
  couponDiscount: '쿠폰 할인',
  total: '합계'
} as const;

// The storefront promises 5만원 이상 무료배송 on every product page (asserted by MS-V2-013). Verified
// live on development-1 on 2026-08-27: a 32,500원 subtotal is charged 3,000원, a 106,000원 subtotal
// is charged 0원.
export const freeShippingThresholdWon = 50_000;

// Cart copy shared by the preview drawer and the full cart page.
export const cartCopy = {
  pageHeading: '내 장바구니',
  summaryHeading: '주문 요약',
  removeItem: '상품 삭제',
  emptyDrawer: '현재 장바구니가 비어 있습니다.',
  checkoutFromCart: '주문하기',
  // The full cart page confirms every removal through a modal rather than deleting straight away.
  removeConfirmHeading: '장바구니에서 이 상품을 삭제하시겠습니까?'
} as const;

// Order history (/kr/account/orders), captured live from development-1 on 2026-08-27. The page is a
// master/detail: `.order-list .order-item` cards on the left, `.orders-main` invoice on the right.
export const orderHistoryCopy = {
  heading: '주문 현황',
  inProgressTab: '진행 중',
  pastTab: '이전 내역',
  noSelectionPrompt: '주문을 선택해 주세요',
  // Order numbers are `AO-<yymmdd><seq>` plus an environment suffix on the dev servers
  // (`AO-2608260005-dev`); production omits the suffix.
  orderNumberPattern: /AO-[\w-]+/,
  // Rows every order invoice carries, whatever its payment state.
  invoiceLabels: ['상품 금액', '배송비', '총계'] as const
} as const;

// Guest order lookup (the 비회원 mode of /kr/auth/login), verified on development-1 on 2026-08-27.
// `POST /sys/kr/auth/login/guest/verification` answers HTTP 200 for an unknown order and carries the
// refusal in the body, surfaced on the order-number field.
export const guestOrderLookupCopy = {
  unknownOrder: '존재하지 않는 주문입니다.',
  requiredField: '필수 입력 항목입니다.'
} as const;

// Shopper-facing copy for the authentication surfaces (login, register, and the account profile's
// password section), captured live from development-1 on 2026-08-27. Kept as literal Korean rather
// than escapes so a copy change stays greppable against what the app actually renders.
export const authCopy = {
  loginHeading: '로그인',
  registerHeading: '회원가입',
  forgotPasswordHeading: '비밀번호를 잊으셨나요?',
  // The register form reports a blank field with a different string to the login form -- 
  // '필수 항목입니다.' vs '필수 입력 항목입니다.' -- so neither can stand in for the other.
  requiredFieldRegister: '필수 항목입니다.',
  requiredFieldLogin: '필수 입력 항목입니다.',
  invalidEmailFormat: '이메일 형식이 올바르지 않습니다.',
  // Deliberately identical whether or not the address is registered, so the form does not leak
  // account existence. MS-V2-030 asserts exactly that.
  invalidCredentials: '이메일 주소 & 비밀번호가 일치하지 않습니다.',
  loginSuccessToast: '로그인에 성공했습니다.',
  registerPasswordPolicy: /비밀번호는 최소 6자 이상[\s\S]*대문자, 숫자/,
  registerWeakPassword: '비밀번호가 요구 사항을 충족하지 않습니다.',
  registerOtpHeading: '인증 요청',
  registerOtpMismatch: '입력하신 인증번호가 일치하지 않습니다.',
  emailAlreadyRegisteredHeading: '이미 등록된 이메일입니다.',
  registerWelcomeHeading: /님, 환영합니다!/,
  // The account profile's password section reports each failure with its own distinct message.
  passwordMismatch: '비밀번호가 일치하지 않습니다.',
  passwordPolicyUnmet: '비밀번호가 설정 요구사항을 충족하지 않습니다.',
  currentPasswordWrong: '비밀번호가 올바르지 않습니다.'
} as const;

// Credentials for accounts the suite creates and then abandons. Registration is gated behind a real
// emailed OTP, so the address must belong to a live disposable inbox (mail.tm) rather than being a
// made-up string -- see tests/fixtures/mail-tm.ts.
export const throwawayAccount = {
  fullName: 'E2E Test User',
  // Satisfies the register form's stated policy: at least 6 characters including an uppercase
  // letter, a digit, or a special character.
  password: 'E2eSuite!2026',
  rotatedPassword: 'E2eSuite!2027'
} as const;

// A syntactically valid address that is never registered, for negative login tests. example.com is
// reserved by RFC 2606, so this can never collide with a real customer.
export const unregisteredLogin = {
  email: 'invalid-login-e2e@example.com',
  password: 'WrongPass!2026'
} as const;

// Verified working guest checkout profile for full-payment tests (see checkout-destructive.spec.ts).
// Hardcoded rather than sourced from the CHECKOUT_* vars in .env.example: those were never wired up
// by anything, and this data only needs to pass client-side validation, not represent a real person.
export const guestCheckoutProfile = {
  fullName: '\ud14c\uc2a4\ud2b8 \uc0ac\uc6a9\uc790',
  postalCode: '06168',
  phone: ['010', '1234', '5678'] as const,
  province: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc',
  city: '\uac15\ub0a8\uad6c',
  streetAddress: '\ud14c\ud5e4\ub780\ub85c 152',
  detailAddress: '101\ud638'
} as const;

export const aboutPage = {
  heroHeading: '\uc6b0\ub9ac\uac00 \ub9cc\ub4dc\ub294 \uac83\uc740',
  subNav: [
    '\uc65c \ub9cc\ub4e4\uc5c8\ub098',
    '\uc6b0\ub9ac\uc758 \ucca0\ud559',
    '\uc65c \ube60\ub978\uac00',
    '\uc6b0\ub9ac\uac00 \uac00\ub294 \uae38'
  ],
  viewStoryCta: '\uc6b0\ub9ac\uc758 \uc774\uc57c\uae30 \ubcf4\uae30',
  statYears: '10\ub144+',
  statOrders: '\uc218\uc2ed\ub9cc \uac74'
} as const;

// Category-card names as the listing pages render them, re-captured from production on 2026-09-25
// after the storefront renamed several products (자유형 스티커 -> 자유형 조각스티커, 키스컷 -> 도무송,
// 아트지 롤 -> 종이 롤, and every 시트 스티커 -> 판스티커). A product page's H1 does not always match its
// card -- see the per-product headings below.
export const categoryLinks = {
  stickers: [
    '자유형 조각스티커',
    '원형 스티커',
    '직사각형 스티커',
    '정사각형 스티커',
    '타원형 스티커',
    '둥근 사각 스티커',
    '도무송 스티커',
    '판스티커',
    '투명 스티커',
    '홀로그램 스티커',
    '풀 컬러 레터링 스티커',
    '글자 커팅 스티커'
  ],
  rollStickers: [
    '자유형 롤 스티커',
    '투명 롤 스티커',
    '원형 롤 스티커',
    '정사각형 롤 스티커',
    '직사각형 롤 스티커',
    '둥근 사각 롤 스티커',
    '타원형 롤 스티커',
    '종이 롤 스티커'
  ],
  sheetStickers: [
    '자유형 판스티커',
    '원형 판스티커',
    '타원형 판스티커',
    '정사각형 판스티커',
    '직사각형 판스티커',
    '둥근 사각 판스티커'
  ]
} as const;

// The page behind each card in categoryLinks, index for index. A card's href carries this slug and
// survives renames, so the category tests fall back to it when a name changes (see self-heal.ts).
const categoryProductPaths = {
  stickers: [
    './stickers/die-cut-sticker',
    './stickers/circle-sticker',
    './stickers/rectangle-sticker',
    './stickers/square-sticker',
    './stickers/oval-sticker',
    './stickers/rounded-sticker',
    './stickers/kiss-cut-sticker',
    './stickers/sticker-sheet',
    './stickers/clear-sticker',
    './stickers/hologram-sticker',
    './stickers/transfer-sticker',
    './stickers/vinyl-lettering'
  ],
  rollStickers: [
    './roll-stickers/die-cut-roll',
    './roll-stickers/clear-roll',
    './roll-stickers/circle-roll',
    './roll-stickers/square-roll',
    './roll-stickers/rectangle-roll',
    './roll-stickers/rounded-roll',
    './roll-stickers/oval-roll',
    './roll-stickers/paper-roll'
  ],
  sheetStickers: [
    './sheet-stickers/die-cut-sheet',
    './sheet-stickers/circle-sheet',
    './sheet-stickers/oval-sheet',
    './sheet-stickers/square-sheet',
    './sheet-stickers/rectangle-sheet',
    './sheet-stickers/rounded-sheet'
  ]
} as const;

export type CategoryProduct = { readonly name: string; readonly path: string };

function pairCategory(names: readonly string[], paths: readonly string[]): readonly CategoryProduct[] {
  if (names.length !== paths.length) {
    throw new Error(`categoryLinks and categoryProductPaths disagree: ${names.length} names, ${paths.length} paths.`);
  }

  return names.map((name, index) => ({ name, path: paths[index] ?? '' }));
}

export const categoryProducts = {
  stickers: pairCategory(categoryLinks.stickers, categoryProductPaths.stickers),
  rollStickers: pairCategory(categoryLinks.rollStickers, categoryProductPaths.rollStickers),
  sheetStickers: pairCategory(categoryLinks.sheetStickers, categoryProductPaths.sheetStickers)
} as const;

// The cart names a line after the product's category card, which is not always the product page's
// H1. Products where the two differ carry an explicit cartName.
export function cartLineName(product: { readonly heading: string; readonly cartName?: string }): string {
  return product.cartName ?? product.heading;
}

export const v2Products = {
  dieCutSticker: {
    path: './stickers/die-cut-sticker',
    heading: categoryLinks.stickers[0],
    size: ko.medium75,
    quantity: 100
  },
  dieCutRoll: {
    path: './roll-stickers/die-cut-roll',
    heading: categoryLinks.rollStickers[0],
    size: ko.medium75,
    quantity: 300
  },
  dieCutSheet: {
    path: './sheet-stickers/die-cut-sheet',
    heading: categoryLinks.sheetStickers[0],
    material: ko.transparent,
    sheetSize: 'A5',
    quantity: 50
  }
} as const;

// Product detail pages from sitemap.xml not already deep-tested via v2Products. Also crawled here
// for render-only smoke coverage (heading + options panel visible) even where a deeper config+cart
// flow exists elsewhere (dieCutShapeStickers, dieCutRollStickers, stickerSheetProduct,
// vinylLetteringProduct, transferStickerProduct, sheetStickerConfiguratorProducts) -- the two
// layers aren't mutually exclusive.
export const catalogPaths = [
  './stickers/sticker-sheet',
  './stickers/hologram-sticker',
  './stickers/vinyl-lettering',
  './stickers/circle-sticker',
  './stickers/rectangle-sticker',
  './stickers/square-sticker',
  './stickers/oval-sticker',
  './stickers/rounded-sticker',
  './stickers/kiss-cut-sticker',
  './stickers/clear-sticker',
  './stickers/transfer-sticker',
  './roll-stickers/clear-roll',
  './roll-stickers/circle-roll',
  './roll-stickers/square-roll',
  './roll-stickers/rectangle-roll',
  './roll-stickers/rounded-roll',
  './roll-stickers/oval-roll',
  './roll-stickers/paper-roll',
  './sheet-stickers/circle-sheet',
  './sheet-stickers/oval-sheet',
  './sheet-stickers/square-sheet',
  './sheet-stickers/rectangle-sheet',
  './sheet-stickers/rounded-sheet'
] as const;

// Plain size+quantity die-cut shape variants under ./stickers/, distinct from
// v2Products.dieCutSticker (./stickers/die-cut-sticker) only by heading/size-label/price. Verified
// live against development-3 on 2026-08-13: none of these expose a material selector.
export const dieCutShapeStickers = [
  { path: './stickers/hologram-sticker', heading: '홀로그램 스티커', size: ko.medium75, quantity: 100 },
  { path: './stickers/circle-sticker', heading: '원형 스티커', size: '중형 60x60', quantity: 100 },
  { path: './stickers/rectangle-sticker', heading: '직사각형 스티커', size: '중형 75x50', quantity: 100 },
  { path: './stickers/square-sticker', heading: '정사각형 스티커', size: ko.medium75, quantity: 100 },
  { path: './stickers/oval-sticker', heading: '타원형 스티커', size: '중형 75x50', quantity: 100 },
  { path: './stickers/rounded-sticker', heading: '둥근 사각 스티커', size: ko.medium75, quantity: 100 },
  { path: './stickers/kiss-cut-sticker', heading: '도무송 스티커', size: ko.medium75, quantity: 100 },
  { path: './stickers/clear-sticker', heading: '투명 스티커', size: ko.medium75, quantity: 100 }
] as const;

// Plain size+quantity die-cut roll variants under ./roll-stickers/, same shape as
// v2Products.dieCutRoll (./roll-stickers/die-cut-roll). Verified live against development-3 on
// 2026-08-13: none expose a material selector or sheet-size controls.
export const dieCutRollStickers = [
  { path: './roll-stickers/clear-roll', heading: '투명 롤 스티커', size: ko.medium75, quantity: 100 },
  { path: './roll-stickers/circle-roll', heading: '원형 롤 스티커', size: '중형 60x60', quantity: 100 },
  { path: './roll-stickers/square-roll', heading: '정사각형 롤 스티커', size: ko.medium75, quantity: 100 },
  { path: './roll-stickers/rectangle-roll', heading: '직사각형 롤 스티커', size: '중형 75x50', quantity: 100 },
  // The H1 reads 둥근 사각형 while the category card and the cart line still say 둥근 사각
  // (production, 2026-09-25).
  {
    path: './roll-stickers/rounded-roll',
    heading: '둥근 사각형 롤 스티커',
    cartName: '둥근 사각 롤 스티커',
    size: ko.medium75,
    quantity: 100
  },
  { path: './roll-stickers/oval-roll', heading: '타원형 롤 스티커', size: '중형 75x50', quantity: 100 },
  { path: './roll-stickers/paper-roll', heading: '종이 롤 스티커', size: ko.medium75, quantity: 100 }
] as const;

// Sheet-template flow (material + sheet size + quantity) like v2Products.dieCutSheet, but a
// distinct product under ./stickers/. Verified live against development-3 on 2026-08-13.
export const stickerSheetProduct = {
  path: './stickers/sticker-sheet',
  heading: '판스티커',
  material: ko.pvcMatte,
  sheetSize: 'A5',
  quantity: 10
} as const;

// Live-text lettering flow: a color swatch (accessible name is the English color name, e.g.
// aria-label="Black", with the Korean label only in a child tooltip span) plus a contenteditable
// text canvas, no design-file upload. Verified live against development-3 on 2026-08-13.
export const vinylLetteringProduct = {
  path: './stickers/vinyl-lettering',
  heading: '글자 커팅 스티커',
  colorLabel: ko.black,
  text: 'MUSTICKER QA',
  quantity: 1
} as const;

// Despite the "글자 커팅" name this behaves like a plain die-cut shape page (color swatch + size +
// quantity + design-file upload), not a live-text tool. Verified live against development-3 on
// 2026-08-13.
export const transferStickerProduct = {
  path: './stickers/transfer-sticker',
  // The H1 was renamed but the category card and the cart line still read 풀 컬러 레터링 스티커
  // (production, 2026-09-25).
  heading: '풀 컬러 글자 커팅 스티커',
  cartName: '풀 컬러 레터링 스티커',
  colorLabel: ko.fullColor,
  size: ko.medium75,
  quantity: 1
} as const;

// Per-shape individual-sticker sheet configurators (material + individual size + sheet quantity,
// distinct from the die-cut sheet's A5-template flow above). categoryLinks.sheetStickers[0] is the
// freeform/die-cut variant already covered by v2Products.dieCutSheet, so it is skipped here.
//
// The preset tables below were re-cut on development-1 (verified 2026-08-26) so every preset packs
// at least two stickers onto an A5 sheet; the five products now share exactly two tables, one per
// shape family. Production still carries the older, wider tables (circle 40x40..100x100, square/
// rounded 30x30..125x125, oval/rectangle 50x25..125x100), seven of whose presets pack only one
// sticker per sheet and are still orderable there -- that is the defect this change closes.
const roundShapeSizePresets = [
  { label: '소형', dimensions: '30x30' },
  { label: '중형', dimensions: '50x50' },
  { label: '대형', dimensions: '75x75' },
  { label: '초대형', dimensions: '90x90' }
] as const;

const oblongShapeSizePresets = [
  { label: '소형', dimensions: '40x20' },
  { label: '중형', dimensions: '50x30' },
  { label: '대형', dimensions: '75x50' },
  { label: '초대형', dimensions: '90x60' }
] as const;

// A custom size that packs exactly one sticker per sheet on all five products, so it trips the
// minimum-two-per-sheet rule everywhere. 144x206 and larger packs zero and trips the same rule --
// there is deliberately no separate max-work-area message, see MS-V2-073.
export const blockedCustomSize = { widthMm: 123, heightMm: 123 } as const;

type SizePreset = { readonly label: string; readonly dimensions: string };

function presetDimensions(preset: SizePreset): { widthMm: number; heightMm: number } {
  const [widthMm, heightMm] = preset.dimensions.split('x').map(Number);

  return { widthMm, heightMm };
}

// Derived from the layout formula rather than restated, so re-cutting a preset table cannot leave a
// stale expected count behind.
export function presetStickersPerSheet(preset: SizePreset): number {
  const { widthMm, heightMm } = presetDimensions(preset);

  return stickersPerSheet(widthMm, heightMm);
}

export const sheetStickerConfiguratorProducts = [
  {
    path: './sheet-stickers/circle-sheet',
    heading: categoryLinks.sheetStickers[1],
    sizePresets: roundShapeSizePresets
  },
  {
    path: './sheet-stickers/oval-sheet',
    heading: categoryLinks.sheetStickers[2],
    sizePresets: oblongShapeSizePresets
  },
  {
    path: './sheet-stickers/square-sheet',
    heading: categoryLinks.sheetStickers[3],
    sizePresets: roundShapeSizePresets
  },
  {
    path: './sheet-stickers/rectangle-sheet',
    heading: categoryLinks.sheetStickers[4],
    sizePresets: oblongShapeSizePresets
  },
  {
    path: './sheet-stickers/rounded-sheet',
    // The only sheet product whose H1 kept the old wording: its card and cart line read 둥근 사각
    // 판스티커 but the page itself says 둥근 사각형 시트 스티커 (production, 2026-09-25).
    heading: '둥근 사각형 시트 스티커',
    cartName: categoryLinks.sheetStickers[5],
    sizePresets: roundShapeSizePresets
  }
] as const;

// The minimum-two-per-sheet gate, expressed through the layout formula in sheet-packing.ts. The
// storefront's documented gate is 138x97: the widest a single column can be, at the tallest two
// rows can be. Circle-sheet is the representative product for the boundary tests.
export const sheetSizeBoundary = {
  path: './sheet-stickers/circle-sheet',
  heading: categoryLinks.sheetStickers[1],
  largestAllowed: { widthMm: 138, heightMm: 97 },
  // One millimetre taller drops to a single row, so a single sticker per sheet.
  smallestBlocked: { widthMm: 138, heightMm: 98 }
} as const;
