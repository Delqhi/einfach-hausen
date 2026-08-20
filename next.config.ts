import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  experimental: { serverActions: { bodySizeLimit: '14mb' } },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
