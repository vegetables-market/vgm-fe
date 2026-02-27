"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getStockImageUrl } from "@/lib/market/stocks/get-image-url";
import { usePurchasePage } from "@/hooks/purchase/usePurchasePage";
// TODO: Create mockData module or replace with real API
import {
  MOCK_PAYMENT_METHODS,
} from "@/lib/mockData";

import { ShippingAddressSection } from "@/components/purchase/ShippingAddressSection";
import { PaymentMethodSection } from "@/components/purchase/PaymentMethodSection";
import { DeliveryPlaceSection } from "@/components/purchase/DeliveryPlaceSection";
import { PaymentMethodSelectModal } from "@/components/purchase/PaymentMethodSelectModal";
import { AddressSelectModal } from "@/components/purchase/AddressSelectModal";
import { DeliveryPlaceSelectModal } from "@/components/purchase/DeliveryPlaceSelectModal";
import { AddAddressModal } from "@/components/purchase/AddAddressModal";
import { PurchaseLoadingView } from "@/components/purchase/PurchaseLoadingView";
import { PurchaseErrorView } from "@/components/purchase/PurchaseErrorView";
import { PurchaseSuccessView } from "@/components/purchase/PurchaseSuccessView";
import { PurchaseOrderSummary } from "@/components/purchase/PurchaseOrderSummary";
import AuthGuard from "@/components/features/auth/AuthGuard";

function PurchaseContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const {
    stock,
    isLoading,
    error,
    isPurchased,
    isProcessing,
    addresses,
    selectedAddress,
    selectedPayment,
    selectedDeliveryPlace,
    showAddressModal,
    showAddAddressModal,
    showPaymentModal,
    showPlaceModal,
    setSelectedAddress,
    setSelectedPayment,
    setSelectedDeliveryPlace,
    setShowAddressModal,
    setShowAddAddressModal,
    setShowPaymentModal,
    setShowPlaceModal,
    handleAddAddress,
    handlePurchase,
  } = usePurchasePage(itemId);

  // ローディング中
  if (isLoading) {
    return <PurchaseLoadingView />;
  }

  // エラー時
  if (error || !stock) {
    return <PurchaseErrorView message={error || "商品が見つかりません"} />;
  }

  // 購入完了画面
  if (isPurchased) {
    return <PurchaseSuccessView />;
  }

  const item = stock.item;
  const thumbnailUrl =
    item.images.length > 0
      ? getStockImageUrl(item.images[0].imageUrl)
      : "/images/no-image.png";
  const shippingText = item.shippingPayerType === 0 ? "送料込み" : "着払い";

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center">
          <Link
            href={`/stocks/${item.itemId}`}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
            戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <h1 className="mb-8 text-2xl font-bold" style={{ color: "inherit" }}>
          購入の確認
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左側：商品情報と各種設定 */}
          <div className="space-y-6 lg:col-span-2">
            {/* 注意事項 */}
            <div
              className="flex items-start gap-3 rounded-lg p-4"
              style={{
                backgroundColor: "rgb(254 243 199)",
                border: "1px solid rgb(217 119 6)",
              }}
            >
              <svg
                className="mt-0.5 h-6 w-6 flex-shrink-0"
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
            <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <Image
                  src={thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.seller.displayName}
                </p>
                <p className="mt-1 font-bold text-red-500">
                  ¥{item.price.toLocaleString()}
                  <span className="ml-1 text-xs text-gray-400">
                    (税込) {shippingText}
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
            <PurchaseOrderSummary
              itemPrice={item.price}
              selectedPayment={selectedPayment}
              isProcessing={isProcessing}
              onPurchase={() => {
                void handlePurchase();
              }}
            />
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
    <AuthGuard mode="redirect">
      <Suspense
        fallback={
          <div className="bg-background flex min-h-screen items-center justify-center text-gray-900 dark:text-white">
            読み込み中...
          </div>
        }
      >
        <PurchaseContent />
      </Suspense>
    </AuthGuard>
  );
}
