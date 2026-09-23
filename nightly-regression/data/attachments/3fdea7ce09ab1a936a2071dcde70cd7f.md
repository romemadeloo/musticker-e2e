# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchasing/sheet-sticker-size-rules.spec.ts >> storefront v2 sheet sticker size rules (minimum two stickers per sheet) >> MS-V2-076 circle sheet sticker: both cart edit dialogs reject a one-per-sheet custom size
- Location: tests/e2e/purchasing/sheet-sticker-size-rules.spec.ts:134:3

# Error details

```
Error: Storefront returned 403 Forbidden for https://www.musticker.com/kr/cart on all 6 attempts over ~54s.
The document request itself was refused.
This is WAF/rate-limit throttling of the CI egress IP, not a broken page: the same URL
normally answers 200 on a manual re-check.

Refused 403 https://www.musticker.com/kr/cart
  x-internal-origin on that request: present (40 chars)
  answered by: server: awselb/2.0
  body: 403 Forbidden

An x-internal-origin key was configured for this run. If the header reached the refused request above and it was refused anyway, the exemption is not being honoured, and that is a question for whoever owns the rule rather than a test fix. If the header was absent, it never reached the wire and the fault is ours: see applyInternalOriginHeader in tests/fixtures/internal-origin.ts.

Failing that, widen throttleRetryDelaysMs in tests/fixtures/navigation.ts if the block windows
have grown.
```

```
Error: Unexpected browser console errors or warnings

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 144

- Array []
+ Array [
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+   "[error] Failed to load resource: the server responded with a status of 403 ()",
+ ]
```

```
Error: Unexpected failed HTTP responses

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 144

- Array []
+ Array [
+   "403 https://www.musticker.com/_nuxt/9cCx9al2.js",
+   "403 https://www.musticker.com/logos/full/colored/musticker.svg",
+   "403 https://www.musticker.com/_nuxt/Rating.DBx42G1D.css",
+   "403 https://www.musticker.com/_nuxt/DnAJ71Km.js",
+   "403 https://www.musticker.com/_nuxt/BxFejRTI.js",
+   "403 https://www.musticker.com/_nuxt/nQtDrFP4.js",
+   "403 https://www.musticker.com/_nuxt/DiOkxj08.js",
+   "403 https://www.musticker.com/_nuxt/bZE15Nm7.js",
+   "403 https://www.musticker.com/_nuxt/DxOXUCgF.js",
+   "403 https://www.musticker.com/_nuxt/MuOption.dKZ6TuRf.css",
+   "403 https://www.musticker.com/_nuxt/BOVjIpYb.js",
+   "403 https://www.musticker.com/_nuxt/DVI3M3z5.js",
+   "403 https://www.musticker.com/_nuxt/BiDE3i29.js",
+   "403 https://www.musticker.com/_nuxt/oKjf6818.js",
+   "403 https://www.musticker.com/_nuxt/DN2uTbkf.js",
+   "403 https://www.musticker.com/logos/mark/gold/musticker.svg",
+   "403 https://www.musticker.com/_nuxt/MuModal.D9bbztq4.css",
+   "403 https://www.musticker.com/_nuxt/CDLNpt7K.js",
+   "403 https://www.musticker.com/_nuxt/BGN23svF.js",
+   "403 https://www.musticker.com/_nuxt/ilnxVlId.js",
+   "403 https://www.musticker.com/_nuxt/eOv8ypMt.js",
+   "403 https://www.musticker.com/_nuxt/BC5Ch3Hl.js",
+   "403 https://www.musticker.com/_nuxt/sticker-sheet.B5Xrcpdu.css",
+   "403 https://www.musticker.com/fonts/PretendardVariable.kr.woff2",
+   "403 https://www.musticker.com/_nuxt/MCDJUkWM.js",
+   "403 https://www.musticker.com/logos/mark/white/musticker.svg",
+   "403 https://www.musticker.com/fonts/PretendardVariable.latin.woff2",
+   "403 https://www.musticker.com/_nuxt/OMWvSm2i.js",
+   "403 https://www.musticker.com/_nuxt/CSqJhnTQ.js",
+   "403 https://www.musticker.com/_nuxt/tThkvwww.js",
+   "403 https://www.musticker.com/_nuxt/uiB2CTkr.js",
+   "403 https://www.musticker.com/_nuxt/BUkNEhBM.js",
+   "403 https://www.musticker.com/_nuxt/B9a6rSjo.js",
+   "403 https://www.musticker.com/_nuxt/C8pZVI-f.js",
+   "403 https://www.musticker.com/_nuxt/CjfD6RH8.js",
+   "403 https://www.musticker.com/_nuxt/3UKZwEpd.js",
+   "403 https://www.musticker.com/_nuxt/3c0tC285.js",
+   "403 https://www.musticker.com/_nuxt/rsZLWLPj.js",
+   "403 https://www.musticker.com/_nuxt/z0cvxY0D.js",
+   "403 https://www.musticker.com/_nuxt/ZWkWVRa0.js",
+   "403 https://www.musticker.com/_nuxt/1CuYXREy.js",
+   "403 https://www.musticker.com/icons/sprite.svg?v=1788835890778",
+   "403 https://www.musticker.com/kr/sheet-stickers/circle-sheet/_payload.json?_b=f92dab84-65bb-4775-b851-5ab1a04edd69",
+   "403 https://www.musticker.com/_nuxt/BtpuTpx_.js",
+   "403 https://www.musticker.com/_nuxt/wCl1pr0n.js",
+   "403 https://www.musticker.com/_nuxt/CwrzKFBu.js",
+   "403 https://www.musticker.com/_nuxt/CiKHwZLP.js",
+   "403 https://www.musticker.com/_nuxt/zN6dGbAG.js",
+   "403 https://www.musticker.com/_nuxt/CcRtyfv8.js",
+   "403 https://www.musticker.com/_nuxt/CD27_CEZ.js",
+   "403 https://www.musticker.com/_nuxt/HclGiUj8.js",
+   "403 https://www.musticker.com/_nuxt/Bj9vKzun.js",
+   "403 https://www.musticker.com/_nuxt/srur2yE-.js",
+   "403 https://www.musticker.com/_nuxt/CXETXg1N.js",
+   "403 https://www.musticker.com/_nuxt/CKzFTJTi.js",
+   "403 https://www.musticker.com/_nuxt/BvLIVxMa.js",
+   "403 https://www.musticker.com/_nuxt/nk0Dr8s9.js",
+   "403 https://www.musticker.com/_nuxt/qeyXhCrq.js",
+   "403 https://www.musticker.com/_nuxt/BrUhvzbF.js",
+   "403 https://www.musticker.com/_nuxt/BP1EAdby.js",
+   "403 https://www.musticker.com/_nuxt/B1fEGDYK.js",
+   "403 https://www.musticker.com/_nuxt/DBOwOePF.js",
+   "403 https://www.musticker.com/_nuxt/DZx40SaP.js",
+   "403 https://www.musticker.com/_nuxt/DxdvV8PD.js",
+   "403 https://www.musticker.com/_nuxt/hePW80VL.js",
+   "403 https://www.musticker.com/_nuxt/D0K79V27.js",
+   "403 https://www.musticker.com/_nuxt/BzXQ69k0.js",
+   "403 https://www.musticker.com/_nuxt/CVeglwSI.js",
+   "403 https://www.musticker.com/_nuxt/tNaGXx3-.js",
+   "403 https://www.musticker.com/_nuxt/CgVzYefl.js",
+   "403 https://www.musticker.com/_nuxt/B4ww0OYn.js",
+   "403 https://www.musticker.com/_nuxt/C9zEnenD.js",
+   "403 https://www.musticker.com/_nuxt/Bu0J79JK.js",
+   "403 https://www.musticker.com/_nuxt/BAvq1uW6.js",
+   "403 https://www.musticker.com/_nuxt/BbqdM35-.js",
+   "403 https://www.musticker.com/_nuxt/C-q54uUF.js",
+   "403 https://www.musticker.com/_nuxt/BnDj2MT5.js",
+   "403 https://www.musticker.com/_nuxt/fxwBcp7Z.js",
+   "403 https://www.musticker.com/_nuxt/CbCGM9my.js",
+   "403 https://www.musticker.com/_nuxt/gkozJG8v.js",
+   "403 https://www.musticker.com/_nuxt/n8hsHcx-.js",
+   "403 https://www.musticker.com/_nuxt/BMhjzZUC.js",
+   "403 https://www.musticker.com/_nuxt/BsyeVbey.js",
+   "403 https://www.musticker.com/_nuxt/D22bhERP.js",
+   "403 https://www.musticker.com/_nuxt/BMr_13Pa.js",
+   "403 https://www.musticker.com/_nuxt/1rHu73If.js",
+   "403 https://www.musticker.com/_nuxt/J8PEjp8-.js",
+   "403 https://www.musticker.com/_nuxt/9X6PhxSt.js",
+   "403 https://www.musticker.com/_nuxt/BHYUB4fI.js",
+   "403 https://www.musticker.com/_nuxt/CNs_Ozdc.js",
+   "403 https://www.musticker.com/_nuxt/D45FCys6.js",
+   "403 https://www.musticker.com/_nuxt/8qGwLbmd.js",
+   "403 https://www.musticker.com/_nuxt/rxhDcyfF.js",
+   "403 https://www.musticker.com/_nuxt/C8ZnAID-.js",
+   "403 https://www.musticker.com/_nuxt/qHhas9P8.js",
+   "403 https://www.musticker.com/_nuxt/DZhYQpi1.js",
+   "403 https://www.musticker.com/_nuxt/BvGGxfN2.js",
+   "403 https://www.musticker.com/_nuxt/BBK3NzGX.js",
+   "403 https://www.musticker.com/_nuxt/BUKXlyOL.js",
+   "403 https://www.musticker.com/_nuxt/DNWVUFjV.js",
+   "403 https://www.musticker.com/_nuxt/CSkzb9CE.js",
+   "403 https://www.musticker.com/_nuxt/sXhvLryI.js",
+   "403 https://www.musticker.com/_nuxt/C9kCRzFX.js",
+   "403 https://www.musticker.com/_nuxt/CMtcnRQd.js",
+   "403 https://www.musticker.com/_nuxt/CwwbERSa.js",
+   "403 https://www.musticker.com/_nuxt/DIiZ8ja5.js",
+   "403 https://www.musticker.com/_nuxt/DJ2f06p7.js",
+   "403 https://www.musticker.com/_nuxt/AmrDRqI1.js",
+   "403 https://www.musticker.com/_nuxt/CQs3Tya3.js",
+   "403 https://www.musticker.com/_nuxt/_XvszYgR.js",
+   "403 https://www.musticker.com/_nuxt/DQ4SHwlo.js",
+   "403 https://www.musticker.com/_nuxt/B3HvS2Hw.js",
+   "403 https://www.musticker.com/_nuxt/qQx2HTKe.js",
+   "403 https://www.musticker.com/_nuxt/DCs0VRbO.js",
+   "403 https://www.musticker.com/_nuxt/CZivCArI.js",
+   "403 https://www.musticker.com/_nuxt/DKHFFk8t.js",
+   "403 https://www.musticker.com/_nuxt/DZSZtPmm.js",
+   "403 https://www.musticker.com/_nuxt/BLGeOxqF.js",
+   "403 https://www.musticker.com/_nuxt/g5dYrfi1.js",
+   "403 https://www.musticker.com/_nuxt/CSkFquRN.js",
+   "403 https://www.musticker.com/_nuxt/D_VsXQPI.js",
+   "403 https://www.musticker.com/_nuxt/CY9ZFmpu.js",
+   "403 https://www.musticker.com/_nuxt/DU8ZfPVb.js",
+   "403 https://www.musticker.com/_nuxt/Card.BGe_udBI.css",
+   "403 https://www.musticker.com/_nuxt/Ch_iXqdO.js",
+   "403 https://www.musticker.com/_nuxt/B3xsGg2c.js",
+   "403 https://www.musticker.com/_nuxt/pdf.worker.min.iDqQPrd3.mjs",
+   "403 https://www.musticker.com/_nuxt/rgIpi23d.js",
+   "403 https://www.musticker.com/_nuxt/BldcXfT_.js",
+   "403 https://www.musticker.com/_nuxt/BdUzhpJi.js",
+   "403 https://www.musticker.com/_nuxt/I2tkR1Vg.js",
+   "403 https://www.musticker.com/fonts/PretendardVariable.latin.woff2",
+   "403 https://www.musticker.com/fonts/PretendardVariable.kr.woff2",
+   "403 https://www.musticker.com/images/products/guarantees/delivery-truck.svg",
+   "403 https://www.musticker.com/images/products/guarantees/proof-review.svg",
+   "403 https://www.musticker.com/images/products/guarantees/quick-easy-application.svg",
+   "403 https://www.musticker.com/kr/cart",
+   "403 https://www.musticker.com/kr/cart",
+   "403 https://www.musticker.com/kr/cart",
+   "403 https://www.musticker.com/kr/cart",
+   "403 https://www.musticker.com/kr/cart",
+   "403 https://www.musticker.com/kr/cart",
+ ]
```

# Page snapshot

```yaml
- heading "403 Forbidden" [level=1] [ref=e3]
```

# Test source

```ts
  372 | 
  373 |       if (allowTransientApiCorsFailures && isTransientApiFetchFailure(text)) {
  374 |         pendingTransientApiNetworkFailures = Math.max(0, pendingTransientApiNetworkFailures - 1);
  375 |         return;
  376 |       }
  377 | 
  378 |       if (allowTransientCartCreateFailures && isCartCreateCorsFailure(text)) {
  379 |         pendingCartCreateNetworkFailures += 1;
  380 |         return;
  381 |       }
  382 | 
  383 |       if (
  384 |         allowTransientCartCreateFailures &&
  385 |         pendingCartCreateNetworkFailures > 0 &&
  386 |         text === 'Failed to load resource: net::ERR_FAILED'
  387 |       ) {
  388 |         return;
  389 |       }
  390 | 
  391 |       if (allowTransientCartCreateFailures && isCartCreateFetchFailure(text)) {
  392 |         pendingCartCreateNetworkFailures = Math.max(0, pendingCartCreateNetworkFailures - 1);
  393 |         return;
  394 |       }
  395 | 
  396 |       if (allowKnownPriceWarnings && isSupersededPricingRequest(text)) {
  397 |         hadSupersededPricingRequest = true;
  398 |         return;
  399 |       }
  400 | 
  401 |       if (allowKnownPriceWarnings && hadSupersededPricingRequest && text === 'Unable to retrieve prices.') {
  402 |         hadSupersededPricingRequest = false;
  403 |         return;
  404 |       }
  405 | 
  406 |       if (isKnownConsoleMessage(text, guardOptions)) {
  407 |         return;
  408 |       }
  409 | 
  410 |       consoleFailures.push(`[${message.type()}] ${text}`);
  411 |     });
  412 | 
  413 |     page.on('response', (response) => {
  414 |       const status = response.status();
  415 |       if (status < 400) {
  416 |         return;
  417 |       }
  418 | 
  419 |       const url = response.url();
  420 |       if (allowGuestUserMe401 && isExpectedGuestUserMe401(status, url)) {
  421 |         return;
  422 |       }
  423 | 
  424 |       if (allowExpectedAuthFailures && isExpectedAuthFailure(status, url)) {
  425 |         return;
  426 |       }
  427 | 
  428 |       if (allowKnownNuxtPayloadFailures && isKnownNuxtPayloadFailure(status, url)) {
  429 |         return;
  430 |       }
  431 | 
  432 |       if (allowTransientProductPageFailures && isTransientProductPageServerFailure(status, url)) {
  433 |         pendingTransientProductPageFailures += 1;
  434 |         return;
  435 |       }
  436 | 
  437 |       if (allowExpectedNotFound && isExpectedStorefrontNotFound(status, url)) {
  438 |         pendingExpectedNotFoundResponses += 1;
  439 |         return;
  440 |       }
  441 | 
  442 |       if (allowGuestCheckoutBootstrap401 && isExpectedGuestCheckoutBootstrap401(status, url)) {
  443 |         return;
  444 |       }
  445 | 
  446 |       if (allowPostLogout401 && isPostLogoutMemberDataUnauthorized(status, url)) {
  447 |         return;
  448 |       }
  449 | 
  450 |       responseFailures.push(`${status} ${url}`);
  451 |     });
  452 | 
  453 |     await applyInternalOriginHeader(page);
  454 |     await use(page);
  455 | 
  456 |     // gotoStorefront() retries past WAF 403s, but the listeners above have already recorded each
  457 |     // blocked attempt by the time it does. Forgive exactly as many as it navigated past -- a 403
  458 |     // that nothing retried still fails the run.
  459 |     const throttleBlocks = retriedThrottleBlockCount(page);
  460 | 
  461 |     expect
  462 |       .soft(
  463 |         dropForgiven(consoleFailures, throttleBlocks, isThrottleBlockConsoleFailure),
  464 |         'Unexpected browser console errors or warnings'
  465 |       )
  466 |       .toEqual([]);
  467 |     expect
  468 |       .soft(
  469 |         dropForgiven(responseFailures, throttleBlocks, isThrottleBlockResponseFailure),
  470 |         'Unexpected failed HTTP responses'
  471 |       )
> 472 |       .toEqual([]);
      |        ^ Error: Unexpected failed HTTP responses
  473 |   }
  474 | });
  475 | 
  476 | export { expect };
  477 | 
```