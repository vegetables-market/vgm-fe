"use client";

import { ShippingAddress } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface AddressSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: ShippingAddress[];
  selectedAddressId: string;
  onSelect: (address: ShippingAddress) => void;
  onAddNewClick: () => void;
}

export function AddressSelectModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelect,
  onAddNewClick,
}: AddressSelectModalProps) {
  const handleSelect = (address: ShippingAddress) => {
    onSelect(address);
    onClose();
  };

  const handleAddNew = () => {
    onClose();
    onAddNewClick();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />

          {/* モーダル本体 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-gray-900 md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
          >
            {/* ヘッダー */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-700 bg-gray-900 p-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-white">配送先を選択</h2>
              <div className="w-10" /> {/* スペーサー */}
            </div>

            <div className="space-y-4 p-4">
              {/* 住所リスト */}
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                    selectedAddressId === address.id
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === address.id}
                      onChange={() => handleSelect(address)}
                      className="mt-1 h-5 w-5 accent-blue-500"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{address.name}</p>
                        {address.isDefault && (
                          <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                            デフォルト
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        〒{address.postalCode}
                      </p>
                      <p className="text-sm text-gray-400">
                        {address.prefecture}
                        {address.city}
                        {address.address1}
                      </p>
                      {address.address2 && (
                        <p className="text-sm text-gray-400">
                          {address.address2}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">{address.phone}</p>
                    </div>
                  </div>
                </label>
              ))}

              {/* 新しい住所を追加 */}
              <button
                onClick={handleAddNew}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 py-4 text-sm text-blue-400 transition-colors hover:border-blue-500 hover:underline"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                新しい配送先を追加する
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
