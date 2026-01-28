import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 完全静的サイトとしてエクスポート
  productionBrowserSourceMaps: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
