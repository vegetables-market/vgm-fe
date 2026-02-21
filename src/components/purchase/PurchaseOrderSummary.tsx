import Link from "next/link";
import type { PaymentMethod } from "@/lib/types";

type PurchaseOrderSummaryProps = {
  itemPrice: number;
  selectedPayment: PaymentMethod;
  isProcessing: boolean;
  onPurchase: () => void;
};

export function PurchaseOrderSummary({
  itemPrice,
  selectedPayment,
  isProcessing,
  onPurchase,
}: PurchaseOrderSummaryProps) {
  return (
    <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>商品代金</span>
          <span className="text-gray-900 dark:text-white">
            ¥{itemPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <span className="font-bold text-gray-900 dark:text-white">
            支払い金額
          </span>
          <span className="text-xl font-bold text-red-500">
            ¥{itemPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>支払い方法</span>
          <span>
            {selectedPayment.type === "credit_card"
              ? "クレジットカード"
              : selectedPayment.label}
          </span>
        </div>
      </div>

      <p className="mb-4 text-xs text-gray-500">
        <Link href="/terms" className="text-blue-500 underline">
          利用規約
        </Link>
        および
        <span className="text-blue-500">プライバシーポリシー</span>
        に同意の上、ご購入ください。
      </p>

      <p className="mb-4 text-xs text-gray-400">
        ※不正利用検知および不正利用防止のために、お客さまの情報をクレジットカード発行会社に提供させていただくことがあります
      </p>

      <button
        onClick={onPurchase}
        disabled={isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-4 font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isProcessing ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            処理中...
          </>
        ) : (
          "購入を確定する"
        )}
      </button>
    </div>
  );
}
