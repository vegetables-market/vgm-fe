// @ts-check
import { serwist } from "@serwist/next/config";

export default serwist({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  // Static export with Next.js creates files in 'out' directory
  // We need to tell Serwist to look there for precaching
  globDirectory: "out",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf,eot,ico,webmanifest}",
  ],
});
