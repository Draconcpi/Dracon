/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Automatic Image Optimization ──────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // ─── Performance Optimizations ─────────────────────────────────
  // Note: compiler.removeConsole only works in production builds (not with Turbopack dev)
  ...(process.env.NODE_ENV === 'production' ? { compiler: { removeConsole: true } } : {}),
  poweredByHeader: false,
  compress: true,

  // ─── Webpack optimizations ─────────────────────────────────────
  webpack: (config, { isServer }) => {
    // Tree-shake Three.js - only import what's used
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three/examples': false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;
