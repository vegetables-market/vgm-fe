"use client";

import React from "react";
import AuthGuard from "@/components/features/auth/AuthGuard";
import SettingsNavigation from "@/components/features3/settings/SettingsNavigation";
import SettingsMainLayout from "@/components/features3/settings/SettingsMainLayout";

import { SETTINGS_NAVIGATION_ITEMS } from "@/constants/settings-navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthGuard mode="redirect">
      <div
        className="relative flex w-full overflow-hidden px-4 md:px-0"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* 左サイドバーナビゲーション (PC用) */}
        <div className="hidden shrink-0 overflow-y-auto md:block md:w-64 lg:w-72">
          <SettingsNavigation items={SETTINGS_NAVIGATION_ITEMS} />
        </div>

        {/* 中央コンテンツエリア */}
        <SettingsMainLayout>{children}</SettingsMainLayout>
      </div>
    </AuthGuard>
  );
}
