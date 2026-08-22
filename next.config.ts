import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Global CSP tuned to this app's integrations: no third-party browser scripts,
// same-origin API/server actions/uploads, inline styles/scripts required by
// Next.js without nonce-based dynamic rendering (see next/dist/docs CSP guide).
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Self-scoped capture keeps the binding voice/photo intake flows viable
  // (Web Speech in hausmeister-composer) without opening cross-origin access.
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(), browsing-topics=()' },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  serverExternalPackages: ['better-sqlite3'],
  experimental: { serverActions: { bodySizeLimit: '14mb' } },
  turbopack: { root: process.cwd() },
  async headers(){
    return [
      {source:'/(.*)',headers:securityHeaders},
      {source:'/sw.js',headers:[{key:'Cache-Control',value:'no-cache, no-store, must-revalidate'}]},
      {source:'/manifest.webmanifest',headers:[{key:'Cache-Control',value:'no-cache, max-age=0, must-revalidate'}]},
    ];
  },
};

export default nextConfig;
