import { test, expect } from '../../fixtures/e2e-test.js';
import { ko } from '../../fixtures/storefront-data.js';
import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { InquiryV2Form } from '../../pom/inquiry-form.js';

test.describe('storefront v2 inquiry validation', { tag: ['@validation', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowExpectedAuthFailures: true, allowKnownNuxtPayloadFailures: true });

  test.beforeEach(async ({ page }) => {
    await gotoStorefront(page, appPath());
  });

  test('MS-V2-017 inquiry form validates blank and invalid email submissions', async ({ page }) => {
    const inquiry = new InquiryV2Form(page);

    await inquiry.open();
    await inquiry.expectVisible();
    await inquiry.submitBlankAndExpectValidation();
    await inquiry.fillInvalidEmailAndExpectStillOpen();
  });

  test('MS-V2-018 inquiry form documents supported attachment constraints', async ({ page }) => {
    const inquiry = new InquiryV2Form(page);

    await inquiry.open();
    await inquiry.expectVisible();
    await inquiry.expectUploadGuidance();
  });

  test('MS-V2-019 external inquiry links point to Kakao and Naver destinations', async ({ page }) => {
    const kakaoLink = page.getByRole('link', { name: ko.kakaoInquiry }).first();
    await expect(kakaoLink).toHaveAttribute('href', /pf\.kakao\.com/);

    const naverLink = page.getByRole('link', { name: ko.naverInquiry }).first();
    await expect(naverLink).toHaveAttribute('href', /talk\.naver\.com/);
  });
});

