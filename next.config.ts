import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  serverExternalPackages: ['better-sqlite3'],
  experimental: { serverActions: { bodySizeLimit: '14mb' } },
  turbopack: { root: process.cwd() },
  async headers(){
    return [
      {source:'/sw.js',headers:[{key:'Cache-Control',value:'no-cache, no-store, must-revalidate'}]},
      {source:'/manifest.webmanifest',headers:[{key:'Cache-Control',value:'no-cache, max-age=0, must-revalidate'}]},
    ];
  },
};

export default nextConfig;
