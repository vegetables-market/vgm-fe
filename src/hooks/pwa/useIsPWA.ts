"use client";

import { useState, useEffect } from "react";

export function useIsPWA(initialState: boolean = false) {
  const [isPWA, setIsPWA] = useState(initialState);

  useEffect(() => {
    // スタンドアロンモード（PWAとしてインストールされているか）のチェック
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
    const isMinimalUi = window.matchMedia("(display-mode: minimal-ui)").matches;

    // iOS Safari用のチェック
    // @ts-ignore
    const isIOSStandalone = window.navigator.standalone === true;

    // いずれかのモードならPWAとみなす
    const result = isStandalone || isFullscreen || isMinimalUi || isIOSStandalone;
    setIsPWA(result);

    // Cookieに保存 (有効期限: 1年)
    // 注意: ブラウザとPWAでCookieが共有される場合、ブラウザアクセス時もPWA扱いになるリスクがあるが、
    // ユーザー要望の「高速化」を優先する。多くのモバイルOSではPWAのCookieは分離される。
    document.cookie = `is_pwa=${result}; path=/; max-age=31536000`;
  }, []);

  return isPWA;
}

