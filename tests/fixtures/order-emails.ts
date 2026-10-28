// What the customer should receive by email at each step of an order, from registering as a member
// through checkout to delivered.
// Checked by MS-ADMO-019 (tests/e2e/admin/orders/order-emails.spec.ts) against a mail.tm inbox.
//
// Each step maps to the emails it sends, in arrival order, or to `undefined` while that is not yet
// known. A run meets an undefined step by collecting whatever arrives and then failing with a
// ready-to-paste entry for it here. `ORDER_EMAIL_CAPTURE=true` turns that failure into a pass, for
// the first run that records them. An empty list is a step confirmed to send nothing.
//
// Admin-side emails go to sales@musticker.com, which the suite cannot read, so they are not
// covered here yet.

/** Values the journey writes into the order and can look for in an email. */
export type OrderEmailFact =
  | 'orderNumber'
  | 'productName'
  | 'customerName'
  | 'recipientName'
  | 'rejectionFeedback'
  | 'proofMessage'
  | 'trackingNumber';

export type OrderEmailExpectation = {
  /** The exact subject, with `{orderNumber}` standing in for the order number. */
  subject: string;
  from: string;
  /** Facts the subject or body must contain. */
  facts: readonly OrderEmailFact[];
};

export const orderEmailSteps = [
  // After the registration code, which the journey reads itself: a welcome email, if any.
  'registration',
  'checkout',
  'customerReviewsOrder',
  'customerSendsDesign',
  'adminRejectsDesign',
  'customerResubmitsDesign',
  'adminPassesDesign',
  'adminSendsProof',
  'customerApprovesProof',
  'adminMarksPrinting',
  'adminAddsTracking',
  'adminSendsTracking',
  'adminMarksDelivered',
  'customerSeesDelivered'
] as const;

export type OrderEmailStep = (typeof orderEmailSteps)[number];

// Recorded on dev-1 on 2026-10-28 from a full run (member musticker-e2e-1793146692870-2hhwf2).
// Every email comes from system@musticker.com.
const SENDER = 'system@musticker.com';

export const customerOrderEmails: Record<OrderEmailStep, readonly OrderEmailExpectation[] | undefined> = {
  registration: [{ subject: '[회원가입 완료] 머스티커에 오신 것을 환영합니다!', from: SENDER, facts: ['customerName'] }],
  // Addressed to the shipping recipient, not the account name. The artwork reminder the confirmation
  // page asks the API to send (POST /orders/checkout/complete/send/artwork/<id>) answers 500
  // (MUS-QA-025), so no reminder email is listed here. Add it once that is fixed.
  checkout: [
    {
      subject: '[주문 안내] 주문이 정상적으로 접수되었습니다. (주문번호 : {orderNumber})',
      from: SENDER,
      facts: ['recipientName', 'orderNumber', 'productName']
    }
  ],
  // Only opens the order page.
  customerReviewsOrder: [],
  customerSendsDesign: [],
  // Does not quote the reviewer's feedback: the customer reads it on the site.
  adminRejectsDesign: [
    {
      subject: '[시안 검토 반려] 상품 번호 001 - 주문번호 {orderNumber}',
      from: SENDER,
      facts: ['customerName', 'orderNumber', 'productName']
    }
  ],
  customerResubmitsDesign: [],
  adminPassesDesign: [],
  // Does not quote staff's proof message either.
  adminSendsProof: [
    {
      subject: '[최종 시안 확인 요청] 주문 번호 {orderNumber} - 상품 번호 001',
      from: SENDER,
      facts: ['customerName', 'orderNumber', 'productName']
    }
  ],
  customerApprovesProof: [],
  adminMarksPrinting: [
    { subject: '[제작 시작] 주문 번호: {orderNumber}', from: SENDER, facts: ['customerName', 'orderNumber', 'productName'] }
  ],
  adminAddsTracking: [],
  adminSendsTracking: [
    {
      subject: '[배송 시작] 주문 번호: {orderNumber}',
      from: SENDER,
      facts: ['customerName', 'recipientName', 'orderNumber', 'trackingNumber', 'productName']
    }
  ],
  adminMarksDelivered: [{ subject: '[배송 완료] 주문 번호: {orderNumber}', from: SENDER, facts: ['customerName', 'orderNumber'] }],
  // Only opens the order page.
  customerSeesDelivered: []
};

/**
 * Text that should never reach a customer: an unfilled template placeholder, or a value the
 * template rendered from something missing.
 */
export const brokenTemplateMarkers = [/\{\{|\}\}/, /\bundefined\b/, /\bNaN\b/, /\[object Object\]/] as const;

/**
 * Whether a fact's value appears in the email. The tracking number is compared without dashes or
 * spaces, because the panel stores it plain and displays it in groups of four.
 */
export function emailContainsFact(fact: OrderEmailFact, value: string, subjectAndBody: string): boolean {
  if (fact === 'trackingNumber') {
    return subjectAndBody.replace(/[-\s]/g, '').includes(value.replace(/[-\s]/g, ''));
  }

  return subjectAndBody.includes(value);
}
