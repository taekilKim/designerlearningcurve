import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 외부 큐레이션 콘텐츠를 위해 모든 HTTPS 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
