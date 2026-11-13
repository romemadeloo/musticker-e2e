import { test, expect } from '../../../fixtures/e2e-test.js';
import {
  institutionPaymentMethods,
  partnerInquiryCopy,
  partnerInquiryPages,
  partnershipWebsite,
  type PartnerInquiryKind
} from '../../../fixtures/partner-inquiry-data.js';
import { PartnerInquiryV2Page } from '../../../pom/storefront/partner-inquiry-page.js';

// The B2B quote forms on /business, /institutions and /partnership, explored read-only on production
// on 2026-11-13. MS-NAV-014 only checks that each page opens; these cases cover the forms. Nothing is
// ever sent: the page object aborts every non-GET Musticker request, and each test ends by asserting
// that none was attempted.

const pageFor = (kind: PartnerInquiryKind) => {
  const data = partnerInquiryPages.find((candidate) => candidate.kind === kind);

  if (!data) {
    throw new Error(`No partner inquiry page data for ${kind}`);
  }

  return data;
};

test.describe('Partner inquiry', { tag: ['@regression', '@validation', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  for (const data of partnerInquiryPages) {
    test(`${data.id} ${data.name}: the hero CTA brings the quote form into view, and a blank submit flags every required field without sending`, async ({ page }) => {
      const inquiry = new PartnerInquiryV2Page(page, data);

      await inquiry.goto();
      await inquiry.openFormFromHero();
      await inquiry.expectNoRequiredErrors();

      await inquiry.submit();

      await inquiry.expectRequiredErrors();
      inquiry.expectNothingSent();
    });
  }

  test('MS-INQ-007 기업 견적: a malformed email is refused and the phone boxes keep only digits', async ({ page }) => {
    const inquiry = new PartnerInquiryV2Page(page, pageFor('business'));
    const { sample } = partnerInquiryCopy;

    await inquiry.goto();
    await inquiry.fill('회사명', sample.company);
    await inquiry.fill('담당자', sample.contact);
    await inquiry.fillPhone(sample.phoneWithLetters, sample.phoneMiddle, sample.phoneLast);
    await inquiry.fill('이메일', sample.malformedEmail);
    await inquiry.fill('제품 · 수량 · 납기', sample.message);

    await expect(inquiry.phonePart(0)).toHaveValue(sample.phoneDigits);

    await inquiry.submit();

    await expect(inquiry.field('email')).toContainText(partnerInquiryCopy.invalidEmail);
    await expect(inquiry.form.getByLabel('이메일', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    // Only the email is wrong, so it must be the only error on the form.
    await inquiry.expectNoRequiredErrors();
    await expect(inquiry.form.locator('[aria-invalid="true"]')).toHaveCount(1);
    inquiry.expectNothingSent();
  });

  test('MS-INQ-008 학교·공공기관: 준비 중 payment routes cannot be chosen, and 카드·간편결제 can', async ({ page }) => {
    const inquiry = new PartnerInquiryV2Page(page, pageFor('institutions'));
    const payment = inquiry.select(institutionPaymentMethods.label);

    await inquiry.goto();
    await expect(payment).toHaveText(institutionPaymentMethods.default);

    const menu = await inquiry.openSelect(institutionPaymentMethods.label);
    await expect(menu.getByRole('option')).toHaveText([
      ...institutionPaymentMethods.selectable,
      ...institutionPaymentMethods.comingSoon.map((name) => new RegExp(`^${escapeRegExp(name)}\\s*${institutionPaymentMethods.comingSoonBadge}$`))
    ]);

    for (const name of institutionPaymentMethods.comingSoon) {
      const option = menu.getByRole('option', { name: new RegExp(escapeRegExp(name)) });

      await expect(option).toHaveAttribute('aria-disabled', 'true');
      // Dispatched, because click() would wait for the option to become enabled; the point is that a
      // click which does land changes nothing.
      await option.dispatchEvent('click');
      await expect(payment).toHaveText(institutionPaymentMethods.default);
    }

    await inquiry.openSelect(institutionPaymentMethods.label);
    await menu.getByRole('option', { name: institutionPaymentMethods.card.label, exact: true }).click();

    await expect(payment).toHaveText(institutionPaymentMethods.card.label);
    await expect(payment).toHaveAttribute('aria-expanded', 'false');
    // The hidden native select is what the form submits; CSS because it is aria-hidden by design.
    await expect(inquiry.form.locator('select[name="payment_method"]')).toHaveValue(institutionPaymentMethods.card.value);
    inquiry.expectNothingSent();
  });

  test('MS-INQ-009 제휴: the optional website must be an http(s) address, and a valid one clears the error', async ({ page }) => {
    const inquiry = new PartnerInquiryV2Page(page, pageFor('partnership'));
    const website = inquiry.form.getByLabel(partnershipWebsite.label, { exact: true });

    await inquiry.goto();
    await website.fill(partnerInquiryCopy.sample.malformedWebsite);
    await inquiry.submit();

    await expect(website).toHaveAttribute('aria-invalid', 'true');
    // The wording is MS-INQ-010's concern; here the message only has to name the accepted schemes.
    await expect(inquiry.fieldError('website')).toContainText(partnershipWebsite.schemeHint);

    await website.fill(partnerInquiryCopy.sample.validWebsite);
    await inquiry.submit();

    await expect(website).not.toHaveAttribute('aria-invalid', 'true');
    await expect(inquiry.fieldError('website')).toHaveCount(0);
    // The required fields are still blank, so they (and only they) stay flagged.
    await inquiry.expectRequiredErrors();
    inquiry.expectNothingSent();
  });

  test('MS-INQ-010 제휴: the website error is written in Korean', async ({ page }) => {
    test.fail(true, 'DEFECT MUS-QA-029: the partnership website error is shown in English');
    const inquiry = new PartnerInquiryV2Page(page, pageFor('partnership'));
    const website = inquiry.form.getByLabel(partnershipWebsite.label, { exact: true });

    await inquiry.goto();
    await website.fill(partnerInquiryCopy.sample.malformedWebsite);
    await inquiry.submit();
    await expect(website).toHaveAttribute('aria-invalid', 'true');

    await expect(inquiry.fieldError('website')).toHaveText(partnershipWebsite.koreanMessage);
    inquiry.expectNothingSent();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
