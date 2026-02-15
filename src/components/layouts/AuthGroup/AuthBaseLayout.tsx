"use client";

import React, { useEffect } from "react";
import { useDevice } from "@/hooks/app/useDevice";

interface AuthBaseLayoutProps {
  children: React.ReactNode;
}

export default function AuthBaseLayout({ children }: AuthBaseLayoutProps) {
  const { isMobile, isTablet } = useDevice();

  useEffect(() => {
    // スマホ・タブレットの場合、bodyにbg-surfaceを適用
    if (isMobile || isTablet) {
      document.body.classList.add("!bg-surface");
    }

    // クリーンアップ: コンポーネントのアンマウント時にクラスを削除
    return () => {
      document.body.classList.remove("!bg-surface");
    };
  }, [isMobile, isTablet]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="bg-surface relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl pt-8 pb-12 sm:w-125">
        {children}
      </div>
    </div>
  );
}
