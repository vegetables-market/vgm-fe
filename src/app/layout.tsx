import type { Metadata, Viewport } from "next"; // ★Viewportを追加
import SmoothScroll from "@/components/SmoothScroll";
import DeviceInfoWrapper from "@/components/DeviceInfoWrapper";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SerwistProvider } from "./serwist";

//Viewport設定
export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // アプリっぽくするために拡大縮小を無効化
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Grand Market",
  description: "Fresh vegetables and foods market",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Grand Market",
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
        <SerwistProvider swUrl="/sw.js">
          <CartProvider>
            <SmoothScroll />
            <DeviceInfoWrapper>
              {children}
            </DeviceInfoWrapper>
          </CartProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}