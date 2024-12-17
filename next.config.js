/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Only allow our own domain
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/image-proxy/**',
      },
      {
        protocol: 'https',
        hostname: process.env.VERCEL_URL || 'example.com', // Fallback to example.com if VERCEL_URL is not set
        port: '',
        pathname: '/api/image-proxy/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;

