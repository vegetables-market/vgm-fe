import type { Metadata, Viewport } from "next"; // ★Viewportを追加
import SmoothScroll from "@/components/SmoothScroll";
import DeviceInfoWrapper from "@/components/DeviceInfoWrapper";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SerwistProvider } from "./serwist";
import DebugConsole from "@/components/features/auth/DebugConsole";


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
        startupImage: [
            // --- iPad Pro 12.9" ---
            {
                url: "/splash/apple-splash-2048-2732.jpg",
                media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            },
            // --- iPad Pro 11" ---
            {
                url: "/splash/apple-splash-1668-2388.jpg",
                media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            },
            // --- iPad Air/Mini (Legacy) ---
            {
                url: "/splash/apple-splash-1536-2048.jpg",
                media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            },
            // --- iPhone 15 Pro Max / 14 Pro Max ---
            {
                url: "/splash/apple-splash-1290-2796.jpg",
                media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 15 Pro / 14 Pro ---
            {
                url: "/splash/apple-splash-1179-2556.jpg",
                media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 14 Plus / 13 Pro Max ---
            {
                url: "/splash/apple-splash-1284-2778.jpg",
                media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 14 / 13 Pro / 13 / 12 Pro / 12 ---
            {
                url: "/splash/apple-splash-1170-2532.jpg",
                media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 11 Pro Max / XS Max ---
            {
                url: "/splash/apple-splash-1242-2688.jpg",
                media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 11 / XR ---
            {
                url: "/splash/apple-splash-828-1792.jpg",
                media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            },
            // --- iPhone 11 Pro / XS / X ---
            {
                url: "/splash/apple-splash-1125-2436.jpg",
                media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 8 Plus / 7 Plus / 6s Plus ---
            {
                url: "/splash/apple-splash-1242-2208.jpg",
                media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            },
            // --- iPhone 8 / 7 / 6s / SE (2nd & 3rd gen) ---
            {
                url: "/splash/apple-splash-750-1334.jpg",
                media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 完全静的サイト: localStorageのみを使用
    // デバイス判定はクライアント側で実施（DeviceInfoWrapper内部で処理）
    return (
        <html lang="ja">
            <body className="antialiased">
                <SerwistProvider swUrl="/sw.js">
                    <ThemeProvider>
                        <AuthProvider>
                            <CartProvider>
                                <SmoothScroll />
                                <DeviceInfoWrapper initialIsPWA={false} initialDeviceType={undefined}>
      <DebugConsole />

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
