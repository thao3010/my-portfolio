import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
  transpilePackages: ['@portfolio/shared'],
  async redirects() {
    return [
      { source: '/en/:username', destination: '/:username', permanent: true },
      { source: '/vi/:username', destination: '/:username', permanent: true },
      { source: '/en', destination: '/', permanent: true },
      { source: '/vi', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
