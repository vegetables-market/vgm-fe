"use client";

import { ShippingAddress } from "@/lib/types";

interface ShippingAddressSectionProps {
  address: ShippingAddress;
  onChangeClick: () => void;
}

export function ShippingAddressSection({
  address,
  onChangeClick,
}: ShippingAddressSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">配送先</h3>
        <button
          onClick={onChangeClick}
          className="text-blue-500 text-sm hover:underline flex items-center gap-1"
        >
          変更する
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-1">
        {/* 登録済み住所ラベル */}
        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded mb-2">
          登録済み
        </span>

        {/* 氏名とフリガナ */}
        <p className="text-gray-900 dark:text-white font-medium">
          {address.name}（{address.nameKana}）
        </p>

        {/* 郵便番号 */}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          〒{address.postalCode}
        </p>

        {/* 住所 */}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {address.prefecture}
          {address.city}
          {address.address1}
        </p>
        {address.address2 && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {address.address2}
          </p>
        )}
      </div>
    </div>
  );
}
