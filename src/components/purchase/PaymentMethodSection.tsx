"use client";

import { PaymentMethod } from "@/lib/types";

interface PaymentMethodSectionProps {
  selectedMethod: PaymentMethod;
  onChangeClick: () => void;
}

// カードブランドのバッジ表示
function CardBrandBadge({ brand }: { brand?: PaymentMethod["cardBrand"] }) {
  const brandConfig = {
    visa: { bg: "bg-blue-600", text: "VISA" },
    mastercard: { bg: "bg-orange-500", text: "MC" },
    amex: { bg: "bg-blue-400", text: "AMEX" },
    jcb: { bg: "bg-green-600", text: "JCB" },
  };

  if (!brand || !brandConfig[brand]) {
    return null;
  }

  const config = brandConfig[brand];
  return (
    <span
      className={`${config.bg} text-white text-xs font-bold px-2 py-1 rounded`}
    >
      {config.text}
    </span>
  );
}

export function PaymentMethodSection({
  selectedMethod,
  onChangeClick,
}: PaymentMethodSectionProps) {
  const isCard = selectedMethod.type === "credit_card";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">支払い方法</h3>
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

      {isCard ? (
        <div className="flex items-center gap-3">
          <CardBrandBadge brand={selectedMethod.cardBrand} />
          <div>
            <span className="text-gray-700 dark:text-gray-300">
              ************{selectedMethod.cardLastFour}{" "}
              {selectedMethod.cardExpiry}
            </span>
            {selectedMethod.fee && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ({selectedMethod.fee})
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 dark:text-gray-300">
            {selectedMethod.label}
          </p>
          {selectedMethod.sublabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedMethod.sublabel}
            </p>
          )}
        </div>
      )}

      {/* 支払回数 */}
      {isCard && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            支払回数
          </p>
          <div className="relative">
            <select
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-gray-900 dark:text-white appearance-none cursor-pointer"
              defaultValue="1"
            >
              <option value="1">1回払い</option>
              <option value="2">2回払い</option>
              <option value="3">3回払い</option>
              <option value="6">6回払い</option>
              <option value="12">12回払い</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
