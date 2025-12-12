"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // スクロールの速さ・重さ調整
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 慣性の動き
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
  }, []);

  return null; // UIには何も表示しないコンポーネント
}