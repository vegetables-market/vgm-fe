import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ここから追加 */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  /* ここまで追加 */
};

export default nextConfig;

