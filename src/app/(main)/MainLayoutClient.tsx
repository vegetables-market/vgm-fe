"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDevice, DeviceType } from "@/hooks/useDevice";
import { useIsPWA } from "@/hooks/useIsPWA";

const Header = dynamic(() => import("@/components/layouts/WebHeader"));
const MobileNavigation = dynamic(() => import("@/components/layouts/MobileNavigation"));
const TabletLeftNavigation = dynamic(() => import("@/components/layouts/TabletLeftNavigation"));
const InstallPrompt = dynamic(() => import("@/components/layout/InstallPrompt"), { ssr: false });

export default function MainLayoutClient({
  children,
  initialDeviceType,
  initialIsPWA,
}: {
  children: React.ReactNode;
  initialDeviceType?: DeviceType;
  initialIsPWA?: boolean;
}) {
  // 初期値をフックに渡す
  const isPWA = useIsPWA(initialIsPWA);
  const { deviceType } = useDevice(initialDeviceType);

  // 初期値（特にDeviceType）がある場合は、マウント待ちをスキップして即描画
  // これによりCookieがある場合の2回目以降の起動が高速化される
  const hasInitialData = initialDeviceType !== undefined;
  const [isMounted, setIsMounted] = useState(hasInitialData);

  useEffect(() => {
    if (!hasInitialData) {
      setIsMounted(true);
    }
  }, [hasInitialData]);

  if (!isMounted) {
    return null;
  }

  // Headerを表示する条件: デスクトップ、またはブラウザモード（非PWA）
  const showHeader = deviceType === "desktop" || !isPWA;

  // PWAかつモバイルの場合のみMobileNavigationを表示
  const showMobileNav = isPWA && deviceType === "mobile";

  // PWAかつタブレットの場合のみTabletLeftNavigationを表示
  const showTabletNav = isPWA && deviceType === "tablet";

  return (
    <section className={`flex relative ${deviceType === "tablet" ? "" : "flex-col"} `}>
      {showHeader && <Header />}
      {showMobileNav && <MobileNavigation />}
      {showTabletNav && <TabletLeftNavigation />}
      <main className="w-full">{children}</main>
      <InstallPrompt />
    </section>
  );
}
