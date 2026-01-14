import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    // ★オフライン時の挙動を安定させるための重要設定
    navigationPreload: false, 
    runtimeCaching: [
      {
        // ページ遷移（HTMLリクエスト）のキャッシュ設定
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst', // 通常はネットワーク、オフラインなら即座にキャッシュを使用
        options: {
          cacheName: 'pages-cache',
          expiration: { maxEntries: 50 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // 画像（Unsplashなど）のキャッシュ設定
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst', // 画像はキャッシュから即出し
        options: {
          cacheName: 'images-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  output: 'export',
  // ★重要：静的サイトのパスを "/cart/" 形式に固定してキャッシュのヒット率を100%にする
  trailingSlash: true, 
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  turbopack: {}, 
};

export default withPWA(nextConfig);