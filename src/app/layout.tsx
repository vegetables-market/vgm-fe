import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
// ★追加: CartProviderをインポート
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Harvest Market",
  description: "Fresh vegetables and foods market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* ★重要: 
          CartProviderで中身を全部囲むことで、アプリ内のどこからでも
          「カートの状態」にアクセスできるようになるよ。
        */}
        <CartProvider>
          {/* SmoothScroll (Lenis) もここで読み込む */}
          <SmoothScroll />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}