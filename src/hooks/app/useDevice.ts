"use client";

import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export const useDevice = (initialType?: DeviceType) => {
  const [deviceType, setDeviceType] = useState<DeviceType>(
    initialType || "desktop",
  );

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    // 1. iPadOS 13+ (デスクトップサイト表示) の判定
    // UAはMacだが、タッチポイントがある場合はiPadとみなす
    const isIpadOS = ua.includes("macintosh") && navigator.maxTouchPoints > 1;

    // 2. 通常のタブレット判定
    // - iPad: 古いiPad
    // - Android: "Android"を含み、かつ"Mobile"を含まない
    const isTabletUA =
      (/ipad|macintosh/.test(ua) && "ontouchend" in document) || // 旧iPad判定の予備
      (ua.includes("android") && !ua.includes("mobile"));

    let newType: DeviceType = "desktop";
    if (isIpadOS || isTabletUA) {
      newType = "tablet";
    } else if (/iphone|ipod|android.*mobile/.test(ua)) {
      newType = "mobile";
    }

    setDeviceType(newType);

    // Cookieに保存 (有効期限: 1年)
    document.cookie = `device_type=${newType}; path=/; max-age=31536000`;
  }, []);

  return {
    deviceType,
    isTablet: deviceType === "tablet",
    isMobile: deviceType === "mobile",
    isDesktop: deviceType === "desktop",
  };
};
