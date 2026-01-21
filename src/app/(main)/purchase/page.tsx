"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { PURCHASE_ITEM } from "@/lib/data";
import {
  MOCK_ADDRESSES,
  MOCK_PAYMENT_METHODS,
  DEFAULT_DELIVERY_PLACE,
} from "@/lib/mockData";
import {
  ShippingAddress,
  PaymentMethod,
  DeliveryPlaceOption,
} from "@/lib/types";

import { ShippingAddressSection } from "@/components/purchase/ShippingAddressSection";
import { PaymentMethodSection } from "@/components/purchase/PaymentMethodSection";
import { DeliveryPlaceSection } from "@/components/purchase/DeliveryPlaceSection";
import { PaymentMethodSelectModal } from "@/components/purchase/PaymentMethodSelectModal";
import { AddressSelectModal } from "@/components/purchase/AddressSelectModal";
import { DeliveryPlaceSelectModal } from "@/components/purchase/DeliveryPlaceSelectModal";
import { AddAddressModal } from "@/components/purchase/AddAddressModal";

function PurchaseContent() {
  // 購入状態
  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 住所リスト（ローカルで管理）
  const [addresses, setAddresses] = useState<ShippingAddress[]>(MOCK_ADDRESSES);

  // 選択された配送先・支払い方法・置き配
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(
    MOCK_ADDRESSES.find((a) => a.isDefault) || MOCK_ADDRESSES[0],
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    MOCK_PAYMENT_METHODS[0],
  );
  const [selectedDeliveryPlace, setSelectedDeliveryPlace] =
    useState<DeliveryPlaceOption>(DEFAULT_DELIVERY_PLACE);

  // モーダル表示状態
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  // 新しい住所を追加
  const handleAddAddress = (newAddress: ShippingAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress); // 追加した住所を選択
  };

  const product = PURCHASE_ITEM;

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsPurchased(true);
  };

  // 購入完了画面
  if (isPurchased) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            購入が完了しました
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ご注文ありがとうございます。
            <br />
            商品の発送まで今しばらくお待ちください。
          </p>
          <Link
            href="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 dark:border-gray-700 py-4 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link
            href="/products"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
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
            戻る
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "inherit" }}>
          購入の確認
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左側：商品情報と各種設定 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 注意事項 */}
            <div
              className="rounded-lg p-4 flex items-start gap-3"
              style={{
                backgroundColor: "rgb(254 243 199)",
                border: "1px solid rgb(217 119 6)",
              }}
            >
              <svg
                className="w-6 h-6 flex-shrink-0 mt-0.5"
                style={{ color: "rgb(146 64 14)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "rgb(120 53 15)" }}
                >
                  お支払い前にご確認ください
                </p>
                <p className="text-sm" style={{ color: "rgb(146 64 14)" }}>
                  商品内容をご確認の上、購入を確定してください。
                </p>
              </div>
            </div>

            {/* 商品情報 */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex gap-4 shadow-sm">
              <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {product.producer}
                </p>
                <p className="text-red-500 font-bold mt-1">
                  ¥{product.price.toLocaleString()}
                  <span className="text-gray-400 text-xs ml-1">
                    (税込) 送料込み
                  </span>
                </p>
              </div>
            </div>

            {/* 支払い方法 */}
            <PaymentMethodSection
              selectedMethod={selectedPayment}
              onChangeClick={() => setShowPaymentModal(true)}
            />

            {/* 配送先 */}
            <ShippingAddressSection
              address={selectedAddress}
              onChangeClick={() => setShowAddressModal(true)}
            />

            {/* 置き配の指定 */}
            <DeliveryPlaceSection
              selectedPlace={selectedDeliveryPlace}
              onChangeClick={() => setShowPlaceModal(true)}
            />
          </div>

          {/* 右側：注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-4 shadow-sm">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>商品代金</span>
                  <span className="text-gray-900 dark:text-white">
                    ¥{product.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <span className="font-bold text-gray-900 dark:text-white">
                    支払い金額
                  </span>
                  <span className="text-red-500 font-bold text-xl">
                    ¥{product.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>支払い方法</span>
                  <span>
                    {selectedPayment.type === "credit_card"
                      ? "クレジットカード"
                      : selectedPayment.label}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                <span className="text-blue-500">利用規約</span>および
                <span className="text-blue-500">プライバシーポリシー</span>
                に同意の上、ご購入ください。
              </p>

              <p className="text-xs text-gray-400 mb-4">
                ※不正利用検知および不正利用防止のために、お客さまの情報をクレジットカード発行会社に提供させていただくことがあります
              </p>

              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
          </div>
        </div>
      </main>

      {/* モーダル群 */}
      <PaymentMethodSelectModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentMethods={MOCK_PAYMENT_METHODS}
        selectedMethodId={selectedPayment.id}
        onSelect={setSelectedPayment}
      />

      <AddressSelectModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addresses={addresses}
        selectedAddressId={selectedAddress.id}
        onSelect={setSelectedAddress}
        onAddNewClick={() => setShowAddAddressModal(true)}
      />

      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onAdd={handleAddAddress}
      />

      <DeliveryPlaceSelectModal
        isOpen={showPlaceModal}
        onClose={() => setShowPlaceModal(false)}
        selectedPlace={selectedDeliveryPlace}
        onSelect={setSelectedDeliveryPlace}
      />
    </div>
  );
}

export default function PurchasePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-gray-900 dark:text-white">
          読み込み中...
        </div>
      }
    >
      <PurchaseContent />
    </Suspense>
  );
}
