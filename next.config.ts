import type { NextConfig } from 'next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};
export default nextConfig;

initOpenNextCloudflareForDev();
