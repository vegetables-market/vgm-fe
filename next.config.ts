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
  const openNextModuleName = "@opennextjs/cloudflare";

  // Avoid hard type-resolution failure when devDependencies are omitted.
  void import(openNextModuleName)
    .then((m) => m.initOpenNextCloudflareForDev())
    .catch(() => {
      console.warn(
        `${openNextModuleName} is not installed. Skipping OpenNext Cloudflare dev init.`,
      );
    });
}
