"use client";

import { useEffect, useState } from "react";
import { AddAddressModal } from "@/components/purchase/AddAddressModal";
import type { ShippingAddress } from "@/lib/types";
import { getErrorMessage } from "@/lib/api/error-handler";
import { getAddresses } from "@/service/user/addresses/get-addresses";
import { createAddress } from "@/service/user/addresses/create-address";
import { updateAddress } from "@/service/user/addresses/update-address";
import { deleteAddress } from "@/service/user/addresses/delete-address";
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
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null,
  );
  const canCreateAddress = !(
    addressType === "SENDER" && addresses.length >= 1
  );

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

  const handleSaveAddress = async (newAddress: ShippingAddress) => {
    if (!editingAddress && !canCreateAddress) {
      setError("発送元住所は1件まで登録できます。既存住所を編集してください。");
      throw new Error("Sender address limit reached");
    }

    const requestDto = mapShippingAddressToUpsertRequestDto(newAddress);
    if (editingAddress) {
      const response = await updateAddress(
        Number(editingAddress.id),
        requestDto,
        addressType,
      );
      const updated = mapUserAddressDtoToShippingAddress(response.address);
      setAddresses((prev) =>
        prev
          .map((address) => (address.id === editingAddress.id ? updated : address))
          .sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
      );
      return;
    }

    const response = await createAddress(requestDto, addressType);
    const created = mapUserAddressDtoToShippingAddress(response.address);
    setAddresses((prev) =>
      [...prev, created].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    );
  };

  const handleDeleteAddress = async (address: ShippingAddress) => {
    const confirmed = window.confirm("この住所を削除しますか？");
    if (!confirmed) return;
    try {
      await deleteAddress(Number(address.id), addressType);
      setAddresses((prev) => prev.filter((a) => a.id !== address.id));
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "住所の削除に失敗しました");
    }
  };

  const openCreateModal = () => {
    setEditingAddress(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (address: ShippingAddress) => {
    setEditingAddress(address);
    setIsAddModalOpen(true);
  };

  return (
    <div className="pb-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{description}</p>
        <button
          onClick={openCreateModal}
          disabled={!canCreateAddress}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          住所を追加
        </button>
      </div>

      {!canCreateAddress && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          発送元住所は1件のみ登録できます。追加ではなく既存住所を編集してください。
        </div>
      )}

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
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => openEditModal(address)}
                  className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void handleDeleteAddress(address);
                  }}
                  className="rounded border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAddress(null);
        }}
        onAdd={handleSaveAddress}
        initialAddress={editingAddress}
        title={editingAddress ? "住所を編集" : "新しい住所を追加"}
        submitLabel={editingAddress ? "住所を更新する" : "住所を追加する"}
      />
    </div>
  );
}
