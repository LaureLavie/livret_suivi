/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'strapi' },
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Correction du warning turbopack
  experimental: {
    turbopack: {
      root: './frontend',
    },
  },

  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;