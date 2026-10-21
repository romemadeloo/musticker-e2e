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
