"use client";

import { useEffect, useState } from "react";
import { AddAddressModal } from "@/components/purchase/AddAddressModal";
import type { ShippingAddress } from "@/lib/types";
import { getErrorMessage } from "@/lib/api/error-handler";
import { getAddresses } from "@/service/user/addresses/get-addresses";
import { createAddress } from "@/service/user/addresses/create-address";
import {
  mapShippingAddressToUpsertRequestDto,
  mapUserAddressDtoToShippingAddress,
} from "@/service/user/addresses/mappers";

type AddressSettingsPanelProps = {
  description: string;
  addressType: "DELIVERY" | "SENDER";
};

export function AddressSettingsPanel({
  description,
  addressType,
}: AddressSettingsPanelProps) {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadAddresses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getAddresses(addressType);
      setAddresses(response.addresses.map(mapUserAddressDtoToShippingAddress));
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "住所一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, [addressType]);

  const handleAddAddress = async (newAddress: ShippingAddress) => {
    const requestDto = mapShippingAddressToUpsertRequestDto(newAddress);
    const response = await createAddress(requestDto, addressType);
    const created = mapUserAddressDtoToShippingAddress(response.address);
    setAddresses((prev) => {
      const next = [...prev, created];
      return next.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    });
  };

  return (
    <div className="pb-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{description}</p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          住所を追加
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          読み込み中...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          住所が設定されていません
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-1 flex items-center gap-2">
                <p className="font-semibold text-gray-900">{address.name}</p>
                {address.isDefault && (
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    デフォルト
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">〒{address.postalCode}</p>
              <p className="text-sm text-gray-600">
                {address.prefecture}
                {address.city}
                {address.address1}
              </p>
              {address.address2 && (
                <p className="text-sm text-gray-600">{address.address2}</p>
              )}
              {address.phone && (
                <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAddress}
      />
    </div>
  );
}
