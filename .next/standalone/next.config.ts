import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for production deployment
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  compiler: {
    // Remove console.logs in production for better performance
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Optimizations for modern Next.js versions
    optimizePackageImports: ['lucide-react', 'react-icons', 'radix-ui'],
  },
};

export default nextConfig;
