import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // ★ここをコメントアウト（または削除）する！
  reactStrictMode: true,

  // プロキシ設定を追加
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // バックエンドのURL
      },
    ];
  },
};

export default nextConfig;

