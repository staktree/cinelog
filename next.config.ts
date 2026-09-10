import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 영화 정보 조회 기능에서 TMDB 포스터/이미지를 표시하기 위해 허용한다
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
