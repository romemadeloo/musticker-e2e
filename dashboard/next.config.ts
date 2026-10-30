import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The dashboard lives inside the Playwright repo; keep Next from treating the parent as its root.
  outputFileTracingRoot: __dirname
};

export default nextConfig;
