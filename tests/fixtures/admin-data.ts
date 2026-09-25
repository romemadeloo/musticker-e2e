// Copy and status codes for the order-processing flow, on both sides of it. Read live off
// static-1 on 2026-09-25 while walking AO-2609240008-dev and AO-2609250005-dev through
// the whole lifecycle.

/**
 * Item-level status codes as the activity log reports them, in lifecycle order, with the label
 * both the admin panel and the storefront show. The item carries the fine-grained stage; the order's
 * own status (BP/FP/SP/CP) only moves at the header actions.
 *
 * LA is not a code the API ever reports in the activity log -- an item with no artwork has no
 * activity entries yet -- so it is checked by status id (1) instead.
 */
export const itemStatus = {
  lackingArtwork: { id: 1, label: '디자인 파일 미제출' },
  artworkSubmitted: { code: 'SA', label: '디자인 파일 제출 완료' },
  checkingArtwork: { code: 'CA', label: '디자인 파일 검토 중' },
  evaluationFailed: { code: 'FE', label: '검토 반려' },
  evaluationPassed: { code: 'PE', label: '검토 승인' },
  needsApproval: { code: 'NA', label: '승인 대기' },
  approvedAwaitingProduction: { code: 'A-FPA', label: '승인 완료 - 제작 승인 대기' },
  preparingOrder: { code: 'PO', label: '주문 준비 중' },
  printing: { code: 'P', label: '인쇄 진행 중' },
  readyToShip: { code: 'RS', label: '출고 준비 완료' },
  onDelivery: { code: 'OD', label: '배송 중' },
  delivered: { code: 'DE', label: '배송 완료' }
} as const;

export const orderStatus = {
  beforeProduction: { code: 'BP', label: '제작 전' },
  forProduction: { code: 'FP', label: '제작 진행 중' },
  shipping: { code: 'SP', label: '배송 중' },
  completed: { code: 'CP', label: '주문 완료' }
} as const;

// The admin panel is English-labelled apart from status names.
export const adminCopy = {
  searchPlaceholder: 'Search name, email or invoice no.',
  makeEvaluation: 'Make Evaluation',
  reEvaluate: 'Re-Evaluate',
  evaluationPassed: 'Passed',
  evaluationFailed: 'Failed',
  evaluationFeedbackPlaceholder: 'Enter feedback here...',
  submitEvaluation: 'Submit Evaluation',
  evaluationSaved: 'Artwork evaluation completed successfully.',
  finalProofMessagePlaceholder: /Enter final proofing message/,
  sendFinalProof: 'Send Final Proof',
  finalProofSent: 'Final proof sent successfully.',
  moveToProduction: 'Move to Production',
  markAsPrinting: 'Mark as Printing',
  addTrackingNumber: 'Add Tracking Number',
  addTracking: 'Add Tracking',
  trackingAdded: 'Tracking number added successfully.',
  close: 'Close',
  sendTracking: 'Send',
  confirmSendTracking: 'Yes, Send Tracking',
  trackingSent: 'Tracking details sent successfully.',
  updateTracking: 'Update',
  updateTrackingStatus: 'Update Status'
} as const;

export const storefrontOrderCopy = {
  uploadDesign: '디자인 파일 업로드',
  uploadDesignSubmit: '업로드하기',
  resubmitDesign: '디자인 파일 재접수',
  resubmitDesignSubmit: '재접수하기',
  replaceDesign: '디자인 파일 교체',
  reviewerFeedbackLabel: '담당자 의견',
  viewFinalProof: '최종 시안 확인',
  proofModalName: '디자인 상세 모달',
  approveProof: '승인',
  approveProofConfirmHeading: '최종 시안을 승인하시겠습니까?',
  approveAndProduce: '승인 & 제작 진행',
  trackingSection: '배송 조회',
  trackingNumberLabel: '운송장 번호'
} as const;

/**
 * A tracking number the admin input accepts unchanged. The input reformats whatever is typed into
 * four groups of four (verified: "QA-TEST-2609250008" was stored as QATEST2609250008 and displayed
 * as QATE-ST26-0925-0008), so the test types exactly 16 characters and compares without dashes.
 */
export function qaTrackingNumber(now = new Date()): string {
  return `QATE${String(now.getTime()).slice(-12)}`;
}
