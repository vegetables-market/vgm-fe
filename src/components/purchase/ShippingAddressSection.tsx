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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">配送先</h3>
        <button
          onClick={onChangeClick}
          className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
        >
          変更する
          <svg
            className="h-4 w-4"
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
        <span className="mb-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          登録済み
        </span>

        {/* 氏名とフリガナ */}
        <p className="font-medium text-gray-900 dark:text-white">
          {address.name}（{address.nameKana}）
        </p>

        {/* 郵便番号 */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          〒{address.postalCode}
        </p>

        {/* 住所 */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {address.prefecture}
          {address.city}
          {address.address1}
        </p>
        {address.address2 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {address.address2}
          </p>
        )}
      </div>
    </div>
  );
}
