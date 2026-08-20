import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  experimental: { serverActions: { bodySizeLimit: '14mb' } },
};

export default nextConfig;
