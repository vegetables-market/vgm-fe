import React from "react";
//import MainLayoutClient from "./MainLayoutClient";
import FCMHandler from "@/components/FCMHandler";
import { SerwistProvider } from "@/app/serwist";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/SmoothScroll";
import AuthDebugConsole from "@/components/debug/AuthDebugConsole";
import DeviceInfoWrapper from "@/components/debug/DeviceInfoWrapper";

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
