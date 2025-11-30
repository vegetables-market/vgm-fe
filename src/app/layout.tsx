import type { Metadata } from "next";
// もしローカルフォントを使うならここで next/font/local の設定が必要だけど、一旦保留
import SmoothScroll from "@/components/SmoothScroll"; // さっき作ったやつ
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
      <body>
        {/* クライアント側でLenisを起動 */}
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}