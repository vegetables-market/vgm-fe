"use client";

import SettingsTitle from "@/components/features3/settings/ui/SettingsTitle";
import { AddressSettingsPanel } from "@/components/features3/settings/address/AddressSettingsPanel";

export default function DeliveryAddressPage() {
  return (
    <div>
      <SettingsTitle>発送先住所</SettingsTitle>
      <AddressSettingsPanel
        description="購入時に利用する発送先住所を管理できます"
        addressType="DELIVERY"
      />
    </div>
  );
}
