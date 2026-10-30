import 'server-only';
import { timingSafeEqual } from 'node:crypto';

// Constant-time bearer check for the ingest and cron routes. An unset secret refuses everything.
export function hasBearer(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const header = request.headers.get('authorization') ?? '';
  const supplied = Buffer.from(header.replace(/^Bearer\s+/i, ''));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
