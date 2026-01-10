import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'brunch.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'medium.com',
      },
    ],
  },
};

export default nextConfig;
