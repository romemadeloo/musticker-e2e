import dotenv from 'dotenv';

/**
 * Loads .env, then the secrets file for the environment it targets: .production.env when
 * E2E_ENVIRONMENT=production, .development.env for qa and dev-*. Neither file overrides a variable
 * that is already set, so real environment variables (CI) win over .env, and .env wins over both.
 * Both files are gitignored; see .development.env.example and .production.env.example.
 */
dotenv.config();
dotenv.config({
  path: process.env.E2E_ENVIRONMENT === 'production' ? '.production.env' : '.development.env',
  quiet: true,
});
