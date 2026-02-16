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

if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev(),
  );
}
