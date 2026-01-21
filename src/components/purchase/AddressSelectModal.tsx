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
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* モーダル本体 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-gray-900 rounded-t-2xl md:rounded-2xl z-50 max-h-[90vh] overflow-y-auto md:max-w-lg md:w-full"
          >
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg
                  className="w-6 h-6"
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

            <div className="p-4 space-y-4">
              {/* 住所リスト */}
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
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
                      className="w-5 h-5 accent-blue-500 mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{address.name}</p>
                        {address.isDefault && (
                          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">
                            デフォルト
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        〒{address.postalCode}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {address.prefecture}
                        {address.city}
                        {address.address1}
                      </p>
                      {address.address2 && (
                        <p className="text-gray-400 text-sm">
                          {address.address2}
                        </p>
                      )}
                      <p className="text-gray-400 text-sm">{address.phone}</p>
                    </div>
                  </div>
                </label>
              ))}

              {/* 新しい住所を追加 */}
              <button
                onClick={handleAddNew}
                className="w-full flex items-center justify-center gap-2 text-blue-400 text-sm hover:underline py-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
