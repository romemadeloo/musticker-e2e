# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront/auth/registration.spec.ts >> Registration >> MS-AUTH-019 registering an existing email offers sign-in instead of a duplicate account @credentialed
- Location: tests/e2e/storefront/auth/registration.spec.ts:115:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 502 ()",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "502 https://www.musticker.com/kr/auth/register",
+ ]
```

```
Error: page.waitForFunction: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- heading "502 Bad Gateway" [level=1] [ref=e3]
```

# Test source

```ts
  1   | import type { Locator, Page, Response } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | 
  4   | import { appPath } from '../../fixtures/env.js';
  5   | import { authCopy } from '../../fixtures/storefront-data.js';
  6   | import { waitForPasswordFormInteractive } from '../../fixtures/hydration.js';
  7   | import { gotoStorefront } from '../../fixtures/navigation.js';
  8   | 
  9   | export type RegistrationDetails = {
  10  |   fullName: string;
  11  |   email: string;
  12  |   password: string;
  13  |   agreeToTerms?: boolean;
  14  |   optInToPromotions?: boolean;
  15  | };
  16  | 
  17  | /**
  18  |  * `/kr/auth/register`.
  19  |  *
  20  |  * Registration is a two-stage flow: submitting the form only requests a verification code
  21  |  * (`POST /auth/register/verification`), and the account itself is not created until a 4-digit code
  22  |  * from the resulting email is confirmed (`POST /auth/register`). Everything up to and including the
  23  |  * request stage is safe to exercise anywhere; only `submitVerificationCode` creates an account.
  24  |  */
  25  | export class RegisterPage {
  26  |   readonly page: Page;
  27  |   readonly root: Locator;
  28  |   readonly fullNameInput: Locator;
  29  |   readonly emailInput: Locator;
  30  |   readonly passwordInput: Locator;
  31  |   readonly passwordToggleButton: Locator;
  32  |   readonly agreeTermsCheckbox: Locator;
  33  |   readonly agreeTermsLabel: Locator;
  34  |   readonly termsError: Locator;
  35  |   readonly termsLink: Locator;
  36  |   readonly privacyLink: Locator;
  37  |   readonly optInPromosCheckbox: Locator;
  38  |   readonly submitButton: Locator;
  39  |   readonly loginLink: Locator;
  40  | 
  41  |   readonly verificationSubmitButton: Locator;
  42  |   readonly verificationResendButton: Locator;
  43  | 
  44  |   readonly emailRegisteredModal: Locator;
  45  |   readonly emailRegisteredPasswordInput: Locator;
  46  |   readonly emailRegisteredContinueButton: Locator;
  47  |   readonly emailRegisteredForgotLink: Locator;
  48  |   readonly emailRegisteredCloseButton: Locator;
  49  | 
  50  |   constructor(page: Page) {
  51  |     this.page = page;
  52  |     this.root = page.getByTestId('auth-register-page');
  53  |     this.fullNameInput = page.getByTestId('auth-register-full-name-input-control');
  54  |     this.emailInput = page.getByTestId('auth-register-email-input-control');
  55  |     this.passwordInput = page.getByTestId('auth-register-password-input-control');
  56  |     this.passwordToggleButton = page.getByTestId('auth-register-password-toggle');
  57  |     this.agreeTermsCheckbox = page.getByTestId('auth-register-agree-terms-control');
  58  |     this.agreeTermsLabel = page.getByTestId('auth-register-agree-terms');
  59  |     this.termsError = page.getByTestId('auth-register-terms-error');
  60  |     this.termsLink = page.getByTestId('auth-register-terms-link');
  61  |     this.privacyLink = page.getByTestId('auth-register-privacy-link');
  62  |     this.optInPromosCheckbox = page.getByTestId('auth-register-opt-in-promos-control');
  63  |     this.submitButton = page.getByTestId('auth-register-submit');
  64  |     this.loginLink = page.getByTestId('auth-register-login-link');
  65  | 
  66  |     this.verificationSubmitButton = page.getByTestId('auth-register-verification-submit');
  67  |     this.verificationResendButton = page.getByTestId('auth-register-verification-resend');
  68  | 
  69  |     this.emailRegisteredModal = page.getByTestId('auth-email-registered-modal');
  70  |     this.emailRegisteredPasswordInput = page.getByTestId('auth-email-registered-password-input-control');
  71  |     this.emailRegisteredContinueButton = page.getByTestId('auth-email-registered-modal-continue');
  72  |     this.emailRegisteredForgotLink = page.getByTestId('auth-email-registered-forgot-link');
  73  |     this.emailRegisteredCloseButton = page.getByTestId('auth-email-registered-modal-close');
  74  |   }
  75  | 
  76  |   verificationCodeInput(position: number): Locator {
  77  |     return this.page.getByTestId(`auth-register-verification-code-${position}`);
  78  |   }
  79  | 
  80  |   async goto(): Promise<void> {
  81  |     const appBootstrap = Promise.allSettled([
  82  |       this.page.waitForResponse((response) => response.url().includes('/sys/kr/navigation/categories'), { timeout: 10_000 }),
  83  |       this.page.waitForResponse((response) => response.url().includes('/sys/kr/user/me'), { timeout: 10_000 })
  84  |     ]);
  85  | 
  86  |     await gotoStorefront(this.page, appPath('./auth/register'));
> 87  |     await this.page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__));
      |                     ^ Error: page.waitForFunction: Test timeout of 60000ms exceeded.
  88  |     await appBootstrap;
  89  |     await expect(this.root).toBeVisible();
  90  |     await waitForPasswordFormInteractive(this.passwordToggleButton, this.passwordInput);
  91  |   }
  92  | 
  93  |   async expectRegisterControls(): Promise<void> {
  94  |     await expect(this.page.getByRole('heading', { name: authCopy.registerHeading })).toBeVisible();
  95  |     await expect(this.fullNameInput).toBeVisible();
  96  |     await expect(this.emailInput).toBeVisible();
  97  |     await expect(this.passwordInput).toBeVisible();
  98  |     await expect(this.passwordInput).toHaveAttribute('type', 'password');
  99  |     await expect(this.passwordToggleButton).toBeVisible();
  100 |     await expect(this.agreeTermsLabel).toBeVisible();
  101 |     await expect(this.termsLink).toHaveAttribute('href', /\/kr\/terms-of-use/);
  102 |     await expect(this.privacyLink).toHaveAttribute('href', /\/kr\/privacy-policy/);
  103 |     await expect(this.optInPromosCheckbox).toBeAttached();
  104 |     await expect(this.submitButton).toBeVisible();
  105 |     await expect(this.loginLink).toBeVisible();
  106 |     await expect(this.root).toContainText(authCopy.registerPasswordPolicy);
  107 |   }
  108 | 
  109 |   /**
  110 |    * Fills the form without submitting. `agreeToTerms` defaults to true because every path that goes
  111 |    * on to submit needs it; negative tests pass false explicitly.
  112 |    */
  113 |   async fillDetails({ fullName, email, password, agreeToTerms = true, optInToPromotions = false }: RegistrationDetails): Promise<void> {
  114 |     await this.fullNameInput.fill(fullName);
  115 |     await this.emailInput.fill(email);
  116 |     await this.passwordInput.fill(password);
  117 | 
  118 |     if (agreeToTerms) {
  119 |       await this.agreeToTerms();
  120 |     }
  121 | 
  122 |     if (optInToPromotions) {
  123 |       await this.optInPromosCheckbox.check({ force: true });
  124 |     }
  125 |   }
  126 | 
  127 |   /**
  128 |    * Ticks the terms checkbox. The input itself is visually replaced by a styled box, so it is
  129 |    * checked directly rather than through a normal actionability pass.
  130 |    */
  131 |   async agreeToTerms(): Promise<void> {
  132 |     await this.agreeTermsCheckbox.check({ force: true });
  133 |   }
  134 | 
  135 |   async submit(): Promise<void> {
  136 |     await this.submitButton.click({ force: true });
  137 |   }
  138 | 
  139 |   /** Submits and waits for the verification-code request the server answers with 201. */
  140 |   async submitAndAwaitVerificationRequest(): Promise<void> {
  141 |     const verificationRequested = this.page.waitForResponse(
  142 |       (response) => response.url().includes('/sys/kr/auth/register/verification') && response.status() === 201,
  143 |       { timeout: 30_000 }
  144 |     );
  145 | 
  146 |     await this.submit();
  147 |     await verificationRequested;
  148 |     await this.expectVerificationModal();
  149 |   }
  150 | 
  151 |   async expectVerificationModal(): Promise<void> {
  152 |     await expect(this.page.getByRole('heading', { name: authCopy.registerOtpHeading })).toBeVisible();
  153 |     await expect(this.verificationCodeInput(1)).toBeVisible();
  154 |     await expect(this.verificationResendButton).toBeVisible();
  155 |   }
  156 | 
  157 |   async fillVerificationCode(code: string): Promise<void> {
  158 |     if (!/^\d{4}$/.test(code)) {
  159 |       throw new Error(`Expected a 4-digit verification code, received "${code}".`);
  160 |     }
  161 | 
  162 |     for (let position = 1; position <= 4; position += 1) {
  163 |       await this.verificationCodeInput(position).fill(code[position - 1]);
  164 |     }
  165 |   }
  166 | 
  167 |   /**
  168 |    * Confirms the code and waits for the account-creation call. The endpoint answers 201 only when
  169 |    * the code matches; a mismatch is also an HTTP 200 carrying `success: false`, so the status alone
  170 |    * distinguishes the two outcomes.
  171 |    */
  172 |   async submitVerificationCode(code: string): Promise<Response> {
  173 |     await this.fillVerificationCode(code);
  174 | 
  175 |     const registered = this.page.waitForResponse(
  176 |       (response) => response.url().includes('/sys/kr/auth/register') && !response.url().includes('/verification'),
  177 |       { timeout: 30_000 }
  178 |     );
  179 | 
  180 |     await this.verificationSubmitButton.click({ force: true });
  181 | 
  182 |     return registered;
  183 |   }
  184 | 
  185 |   async expectVerificationRejected(): Promise<void> {
  186 |     await expect(this.page.getByText(authCopy.registerOtpMismatch)).toBeVisible();
  187 |     await expect(this.verificationCodeInput(1)).toBeVisible();
```