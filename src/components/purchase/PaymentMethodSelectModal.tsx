"use client";

import { PaymentMethod } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentMethodSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  selectedMethodId: string;
  onSelect: (method: PaymentMethod) => void;
}

// カードブランドのアイコン
function CardBrandIcon({ brand }: { brand?: PaymentMethod["cardBrand"] }) {
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
      className={`${config.bg} min-w-[40px] rounded px-2 py-1 text-center text-xs font-bold text-white`}
    >
      {config.text}
    </span>
  );
}

export function PaymentMethodSelectModal({
  isOpen,
  onClose,
  paymentMethods,
  selectedMethodId,
  onSelect,
}: PaymentMethodSelectModalProps) {
  // クレジットカードとその他の支払い方法を分離
  const creditCards = paymentMethods.filter((m) => m.type === "credit_card");
  const otherMethods = paymentMethods.filter((m) => m.type !== "credit_card");

  const handleSelect = (method: PaymentMethod) => {
    onSelect(method);
    onClose();
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
              <h2 className="text-lg font-bold text-white">支払い方法</h2>
              <button className="flex items-center gap-1 text-sm text-blue-400 hover:underline">
                編集する
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

            <div className="space-y-6 p-4">
              {/* クレジットカード */}
              <div className="space-y-3">
                {creditCards.map((card) => (
                  <label
                    key={card.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-800"
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedMethodId === card.id}
                      onChange={() => handleSelect(card)}
                      className="h-5 w-5 accent-blue-500"
                    />
                    <CardBrandIcon brand={card.cardBrand} />
                    <div className="flex-1">
                      <p className="text-white">
                        ************{card.cardLastFour} {card.cardExpiry}
                      </p>
                      <p className="text-xs text-gray-400">{card.fee}</p>
                    </div>
                  </label>
                ))}

                {/* 新しいカードを登録 */}
                <button className="flex items-center gap-2 py-2 text-sm text-blue-400 hover:underline">
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
                  新しいクレジットカードを登録する
                </button>
              </div>

              <div className="border-t border-gray-700 pt-4" />

              {/* その他の支払い方法 */}
              <div className="space-y-3">
                {otherMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-800"
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedMethodId === method.id}
                      onChange={() => handleSelect(method)}
                      className="h-5 w-5 accent-blue-500"
                    />
                    <div className="flex-1">
                      <p className="text-white">{method.label}</p>
                      {method.sublabel && (
                        <p className="text-xs text-gray-400">
                          {method.sublabel}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* フッターリンク */}
              <div className="space-y-2 border-t border-gray-700 pt-4">
                <button className="flex w-full items-center justify-end gap-1 text-sm text-blue-400 hover:underline">
                  支払い方法について &gt;
                </button>
                <button className="flex w-full items-center justify-end gap-1 text-sm text-blue-400 hover:underline">
                  決済手数料について &gt;
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
