import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public", // サービスワーカーの出力先を指定
  disable: false, 
  // ★修正: skipWaiting は workboxOptions の中に入れる
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true, // 新しいサービスワーカーを即座に有効化する設定
  },
});

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  // Turbopackの警告対策
  turbopack: {}, 
};

export default withPWA(nextConfig);