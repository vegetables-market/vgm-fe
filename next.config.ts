import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本番ビルド時のみ静的エクスポート（開発時は無効）
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true'
    ? { output: 'export' }
    : {}),
  productionBrowserSourceMaps: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
