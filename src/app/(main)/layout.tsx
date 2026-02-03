import React from "react";
import MainLayoutClient from "./MainLayoutClient";
import FCMHandler from "@/components/FCMHandler";
import { SerwistProvider } from "@/app/serwist";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/SmoothScroll";
import AuthDebugConsole from "@/components/debug/AuthDebugConsole";
import ThemeSwitcher from "@/components/debug/ThemeSwitcher";
import DeviceInfoWrapper from "@/components/debug/DeviceInfoWrapper";

function MainLayout({ children }: { children: React.ReactNode }) {
  // 完全静的サイト: localStorageのみを使用
  // クライアント側で判定（初回はチラつきあり、2回目以降はlocalStorageで高速化）
  return (
    <MainLayoutClient initialDeviceType={undefined} initialIsPWA={false}>
      {children}
    </MainLayoutClient>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <SerwistProvider swUrl="/sw.js">
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <SmoothScroll />
                {}
                <FCMHandler />
                <DeviceInfoWrapper
                  initialIsPWA={false}
                  initialDeviceType={undefined}
                >
                  <AuthDebugConsole />
                  {children}
                </DeviceInfoWrapper>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
