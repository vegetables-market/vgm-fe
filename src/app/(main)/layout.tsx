"use client";

import React from "react";
import Header from "@/components/parts/Header";
import MobileNavigation from "@/components/parts/MobileNavigation";
import TabletLeftNavigation from "@/components/parts/TabletLeftNavigation";
import { useDevice } from '@/hooks/useDevice';
import { useIsPWA } from "@/hooks/useIsPWA";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const isPWA = useIsPWA();
    const { deviceType } = useDevice();

    // PWAかつタブレットの場合のみMobileNavigationを表示
    // const showMobileNav = (isPWA && deviceType === 'tablet');
    // タブレットの場合のみTabletLeftNavigationを表示
    const showTabletNav = (isPWA && deviceType === 'tablet');

    return (
        <section className="relative w-full">
            <Header />

            <MobileNavigation />
            {/* PWAかつタブレットの場合のみ表示 */}
            {showTabletNav && <TabletLeftNavigation />}

            <main>{children}</main>
        </section>
    );
}