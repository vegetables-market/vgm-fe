"use client";

import React from "react";
import Header from "@/components/parts/WebHeader";
// import HeaderSpacer from "@/components/parts/WebHeaderSpacer";
// import MobileHeader from "@/components/parts/MobileHeader";
import MobileNavigation from "@/components/parts/MobileNavigation";
// import TabletHeader from "@/components/parts/TabletHeader";
import TabletLeftNavigation from "@/components/parts/TabletLeftNavigation";
import { useDevice } from "@/hooks/useDevice";
import { useIsPWA } from "@/hooks/useIsPWA";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPWA = useIsPWA();
  const { deviceType } = useDevice();

  // Headerを表示する条件: デスクトップ、またはブラウザモード（非PWA）
  const showHeader = deviceType === "desktop" || !isPWA;

  // PWAかつモバイルの場合のみMobileNavigationを表示
  const showMobileNav = deviceType === "mobile";

  // PWAかつタブレットの場合のみTabletLeftNavigationを表示
  const showTabletNav = isPWA && deviceType === "tablet";

  return (
    <section className="flex relative flex-col">
      {showHeader && <Header />}
      {/*{showHeader && <HeaderSpacer />}*/}
      {showMobileNav && <MobileNavigation />}
      {showTabletNav && <TabletLeftNavigation />}
      <main className="w-full">{children}</main>
    </section>
  );
}
