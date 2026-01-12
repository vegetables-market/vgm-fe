import type { Metadata, Viewport } from "next"; // ★Viewportを追加
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

//Viewport設定
export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // アプリっぽくするために拡大縮小を無効化
  userScalable: false, 
};

export const metadata: Metadata = {
  title: "Harvest Market",
  description: "Fresh vegetables and foods market",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Harvest",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <CartProvider>
          <SmoothScroll />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}