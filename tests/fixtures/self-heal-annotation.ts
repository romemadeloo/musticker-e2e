// Shared by tests/fixtures/self-heal.ts (which writes it) and tests/reporters/self-heal-reporter.ts
// (which reads it). Kept dependency-free so the reporter does not load the test runtime.
export const selfHealAnnotationType = 'self-healed';
