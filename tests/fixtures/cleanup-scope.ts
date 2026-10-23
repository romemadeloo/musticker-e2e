export type CleanupScope = { runId: string; storefrontOrigin: string; apiOrigin: string };
export function cleanupEndpoint(value: string, scope: CleanupScope): string {
  const url = new URL(value);
  const host = new URL(scope.apiOrigin).hostname;
  if (!/^(shared-dev-static-api(?:-[2-6])?\.musticker\.com|localhost|127\.0\.0\.1|\[::1\])$/.test(host)) throw new Error('Account cleanup requires a dev API.');
  if (url.origin !== scope.apiOrigin || !['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Cleanup endpoint must match this run\'s dev API origin.');
  return url.href.replace(/\/$/, '');
}
export function sameCleanupScope(record: Partial<CleanupScope>, scope: CleanupScope): boolean {
  return record.runId === scope.runId && record.storefrontOrigin === scope.storefrontOrigin && record.apiOrigin === scope.apiOrigin;
}
