"use client";

import SettingsNavigation from "@/components/features3/settings/SettingsNavigation";
import { SETTINGS_NAVIGATION_ITEMS } from "@/constants/settings-navigation";

export default function SettingsPage() {
  return <SettingsNavigation items={SETTINGS_NAVIGATION_ITEMS} />;
}
