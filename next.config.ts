import type { NextConfig } from "next";

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

export default nextConfig;
