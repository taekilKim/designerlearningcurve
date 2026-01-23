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
      {
        protocol: 'https',
        hostname: '**.daumcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'blogcodestates.com',
      },
      {
        protocol: 'https',
        hostname: '**.adobe.com',
      },
      {
        protocol: 'https',
        hostname: 'img-svr.elancer.co.kr',
      },
      {
        protocol: 'https',
        hostname: '**.toss-internal.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'yozm.wishket.com',
      },
      {
        protocol: 'https',
        hostname: 'velog.io',
      },
    ],
  },
};

export default nextConfig;
