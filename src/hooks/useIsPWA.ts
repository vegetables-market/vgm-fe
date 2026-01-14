"use client";

import { useState, useEffect } from 'react';

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // スタンドアロンモード（PWAとしてインストールされているか）のチェック
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // iOS Safari用のチェック
    // @ts-ignore
    const isIOSStandalone = window.navigator.standalone === true;

    setIsPWA(isStandalone || isIOSStandalone);
  }, []);

  return isPWA;
}
