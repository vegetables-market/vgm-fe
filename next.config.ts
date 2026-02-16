import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  productionBrowserSourceMaps: false,
  trailingSlash: true,
  images: {
    // unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
