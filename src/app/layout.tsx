import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VGM Frontend",
  description: "Video Game Music Frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
