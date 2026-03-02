"use client";

import SettingsTitle from "@/components/features3/settings/ui/SettingsTitle";
import { AddressSettingsPanel } from "@/components/features3/settings/address/AddressSettingsPanel";

export default function SenderAddressPage() {
  return (
    <div>
      <SettingsTitle>発送元住所</SettingsTitle>
      <AddressSettingsPanel
        description="出品時に利用する発送元住所を管理できます"
        addressType="SENDER"
      />
    </div>
  );
}
