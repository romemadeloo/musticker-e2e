// eslint.config.js

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
  {
    ignores: [
      "allure-report/**",
      "allure-results/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["scripts/promotion.mjs", "scripts/tests/**/*.mjs"],
    languageOptions: { globals: { process: "readonly", console: "readonly", Buffer: "readonly", URL: "readonly" } },
  },

  {
    files: ["tests/**/*.ts"],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs.recommended.rules,
      "playwright/expect-expect": [
        "warn",
        {
          assertFunctionPatterns: ["^expect"],
        },
      ],
      "playwright/no-skipped-test": "off",
      "playwright/no-conditional-in-test": "off",
    },
  },

  // `expect(await pom.read())` compares one snapshot of a page that may still be rendering --
  // MS-CFG-027 read the studio price before its discount landed and failed 2 runs in 4.
  // prefer-web-first-assertions only sees raw locator reads, not reads wrapped in a POM method, so
  // this catches the wrapped form too. API specs compare settled HTTP responses and are exempt.
  {
    files: ["tests/e2e/**/*.spec.ts"],
    ignores: ["tests/e2e/**/api/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='expect'] > AwaitExpression",
          message:
            "One-shot read of a live page. Use `await expect.poll(() => read()).toBe(...)` or a web-first locator assertion.",
        },
        {
          selector: "CallExpression[callee.object.name='expect'][callee.property.name='soft'] > AwaitExpression",
          message:
            "One-shot read of a live page. Use `await expect.poll(() => read()).toBe(...)` or a web-first locator assertion.",
        },
      ],
    },
  },

  {
    files: ["tests/pom/**/*.ts", "tests/fixtures/**/*.ts"],
    rules: {
      "playwright/no-conditional-expect": "off",
      "playwright/no-force-option": "off",
      "playwright/no-wait-for-timeout": "error",
    },
  },

  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
    },
  },
];
