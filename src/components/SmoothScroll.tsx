"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // スムーススクロールを無効化するページ
    const disabledPages = [
      "/settings", // 設定ページ（ネストされたスクロール）
      "/welcome", // 独自のLenisインスタンスを使用
      "/basket", // カートページ（フォーム主体）
      "/purchase", // 購入ページ（フォーム主体）
      "/my/stocks/new", // 出品ページ（フォーム主体）
      "/login", // ログインページ
      "/register", // 登録ページ
    ];

    // 現在のパスがdisabledPagesに含まれるか、またはその配下のページか
    const shouldDisable = disabledPages.some((page) =>
      pathname.startsWith(page),
    );

    if (shouldDisable) {
      return; // スムーススクロールを適用しない
    }

    const lenis = new Lenis({
      duration: 1.2, // スクロールの速さ・重さ調整
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 慣性の動き
      wheelEventsTarget: window,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // クリーンアップ
    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null; // UIには何も表示しないコンポーネント
}
