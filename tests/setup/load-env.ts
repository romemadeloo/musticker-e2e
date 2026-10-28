import dotenv from 'dotenv';

/**
 * Loads .production.env when E2E_ENVIRONMENT=production is set in the shell, otherwise
 * .development.env, which also holds the run settings (E2E_ENVIRONMENT, HEADED, RUN_*). A legacy
 * .env, if present, is read first and wins. Nothing overrides a variable that is already set, so
 * real environment variables (CI) win over every file. All three files are gitignored; see
 * .development.env.example and .production.env.example.
 */
dotenv.config();
dotenv.config({
  path: process.env.E2E_ENVIRONMENT === 'production' ? '.production.env' : '.development.env',
  quiet: true,
});
