import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false, 
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    // インストール時に全ファイルを強制的に保存する
    skipWaiting: true,
    clientsClaim: true,
    // 外部サイトの画像もオフラインで見れるように保存
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/images\.unsplash\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'unsplash-images',
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }
        }
      }
    ]
  },
});

const nextConfig: NextConfig = {
  output: 'export',
  // ★重要：静的エクスポートでURLの末尾に「/」を付けて、キャッシュのヒット率を上げる
  trailingSlash: true, 
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  turbopack: {}, 
};

export default withPWA(nextConfig);