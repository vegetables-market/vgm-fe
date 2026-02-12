"use client";

import React from "react";
import AuthGuard from "@/components/features/auth/AuthGuard";
import SettingsNavigation from "@/components/features3/settings/SettingsNavigation";
import SettingsMainLayout from "@/components/features3/settings/SettingsMainLayout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthGuard mode="content">
      <div
        className="relative flex w-full overflow-hidden"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* 左サイドバーナビゲーション */}
        <div className="hidden shrink-0 overflow-y-auto md:block md:w-64 lg:w-72">
          <SettingsNavigation />
        </div>

        {/* 中央コンテンツエリア */}
        <SettingsMainLayout>{children}</SettingsMainLayout>
      </div>
    </AuthGuard>
  );
}
