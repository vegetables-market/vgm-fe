import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // ← OpenNext Cloudflare使用時は必須
  productionBrowserSourceMaps: false,
  // output: 'export', // SSRを使用するためコメントアウト
  // ★重要：静的エクスポートでURLの末尾に「/」を付けて、キャッシュのヒット率を上げる
  // trailingSlash: true, // ← 一旦無効化してルーティング問題を切り分け
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  turbopack: {}, 
};

export default nextConfig;
