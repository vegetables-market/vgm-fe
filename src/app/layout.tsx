import type { Metadata, Viewport } from "next"; // ★Viewportを追加
import SmoothScroll from "@/components/SmoothScroll";
import DeviceInfoWrapper from "@/components/DeviceInfoWrapper";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SerwistProvider } from "./serwist";
import { DeviceType } from "@/hooks/useDevice";
import { cookies } from "next/headers";

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
  description: "地域の美味しいものを発見。とれたて新鮮な野菜をあなたに",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Grand Market",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // デバイスタイプの取得
  const deviceTypeCookie = cookieStore.get("device_type");
  let initialDeviceType: DeviceType | undefined = undefined;
  if (deviceTypeCookie) {
    const val = deviceTypeCookie.value;
    if (val === "mobile" || val === "tablet" || val === "desktop") {
      initialDeviceType = val;
    }
  }

  // PWA状態の取得
  const isPWACookie = cookieStore.get("is_pwa");
  let initialIsPWA = false;
  if (isPWACookie) {
    initialIsPWA = isPWACookie.value === "true";
  }

  return (
    <html lang="ja">
      <body className="bg-slate-50">
        <SerwistProvider swUrl="/sw.js">
          <CartProvider>
            <SmoothScroll />
            <DeviceInfoWrapper
              initialIsPWA={initialIsPWA}
              initialDeviceType={initialDeviceType}
            >
              {children}
            </DeviceInfoWrapper>
          </CartProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
