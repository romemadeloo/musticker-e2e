# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin/panel/admin-auth-guard.spec.ts >> Admin sign-in guard >> MS-ADM-002 an anonymous visitor to /manage-shipping is sent to sign in and back
- Location: tests/e2e/admin/panel/admin-auth-guard.spec.ts:18:5

# Error details

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 401 ()",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e11]:
  - heading "Login to your Account" [level=3] [ref=e12]
  - generic [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e16]:
        - paragraph [ref=e18]: Email Address *
        - textbox "Email Address *" [ref=e23]:
          - /placeholder: Enter your email
      - generic [ref=e25]:
        - paragraph [ref=e27]: Password *
        - textbox "Password *" [ref=e32]:
          - /placeholder: Enter your password
      - paragraph [ref=e39] [cursor=pointer]: Keep me signed in
    - button "Sign In" [ref=e41] [cursor=pointer]:
      - paragraph [ref=e42]: Sign In
```

# Test source

```ts
  568 |       }
  569 | 
  570 |       if (
  571 |         message.type() === 'warning' &&
  572 |         (isBenignPretendardMetadataWarning(text) ||
  573 |           isBenignPretendardPreloadWarning(text) ||
  574 |           isBenignNuxtPreloadWarning(text) ||
  575 |           isBenignFirefoxIllustrationPreloadWarning(text) ||
  576 |           isBenignWorkerModelFallbackWarning(text))
  577 |       ) {
  578 |         return;
  579 |       }
  580 | 
  581 |       if (isKnownConsoleMessage(text, guardOptions)) {
  582 |         return;
  583 |       }
  584 | 
  585 |       const abortedKind = allowNavigationAbortedFetches ? abortedFetchConsoleKind(text) : undefined;
  586 |       if (abortedKind) {
  587 |         abortedFetchConsoleErrors.push({ kind: abortedKind, entry: `[${message.type()}] ${text}`, at: Date.now() });
  588 |         return;
  589 |       }
  590 | 
  591 |       consoleFailures.push(`[${message.type()}] ${text}`);
  592 |     });
  593 | 
  594 |     page.on('response', (response) => {
  595 |       const status = response.status();
  596 |       if (status < 400) {
  597 |         return;
  598 |       }
  599 | 
  600 |       const url = response.url();
  601 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  602 |         return;
  603 |       }
  604 | 
  605 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  606 |         return;
  607 |       }
  608 | 
  609 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  610 |         return;
  611 |       }
  612 | 
  613 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  614 |         pendingTransientProductPageFailures += 1;
  615 |         return;
  616 |       }
  617 | 
  618 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  619 |         pendingExpectedNotFoundResponses += 1;
  620 |         return;
  621 |       }
  622 | 
  623 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  624 |         return;
  625 |       }
  626 | 
  627 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  628 |         return;
  629 |       }
  630 | 
  631 |       if (allowStudioModelLoadNoise && isStudioModelMissingTokenizerConfig(status, url)) {
  632 |         return;
  633 |       }
  634 | 
  635 |       if (allowKnownArtworkReminderFailure && isArtworkReminderServerFailure(status, url)) {
  636 |         seenArtworkReminderFailure = true;
  637 |         return;
  638 |       }
  639 | 
  640 |       responseFailures.push(`${status} ${url}`);
  641 |     });
  642 | 
  643 |     await applyInternalOriginHeader(page);
  644 |     await use(page);
  645 | 
  646 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  647 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  648 |     // that nothing retried still fails the run.
  649 |     const throttleBlocks = retriedThrottleBlockCount(page);
  650 | 
  651 |     for (const { kind, entry, at } of abortedFetchConsoleErrors) {
  652 |       if (!abortedFetches.some((aborted) => aborted.kind === kind && Math.abs(aborted.at - at) <= ABORTED_FETCH_MATCH_WINDOW_MS)) {
  653 |         consoleFailures.push(entry);
  654 |       }
  655 |     }
  656 | 
  657 |     if (consoleFailures.length || responseFailures.length || testInfo.status !== testInfo.expectedStatus) {
  658 |       await testInfo.attach('browser-diagnostics.json', {
  659 |         body: JSON.stringify({ networkFailures, consoleSources }), contentType: 'application/json'
  660 |       });
  661 |     }
  662 | 
  663 |     expect
  664 |       .soft(
  665 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  666 |         'Unexpected browser console errors or warnings'
  667 |       )
> 668 |       .toEqual([]);
      |        ^ Error: Unexpected browser console errors or warnings
  669 |     expect
  670 |       .soft(
  671 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  672 |         'Unexpected failed HTTP responses'
  673 |       )
  674 |       .toEqual([]);
  675 |   }
  676 | });
  677 | 
  678 | export { expect };
  679 | 
```