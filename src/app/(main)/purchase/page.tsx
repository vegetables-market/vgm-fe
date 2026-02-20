"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { fetchApi } from "@/lib/api/fetch";
// TODO: Create mockData module or replace with real API
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
import AuthGuard from "@/components/features/auth/AuthGuard";

interface StockDetail {
  item: {
    itemId: number;
    title: string;
    description: string | null;
    price: number;
    quantity: number;
    categoryId: number | null;
    categoryName: string | null;
    condition: number;
    status: number;
    likesCount: number;
    isLiked: boolean;
    brand: string | null;
    weight: number | null;
    shippingPayerType: number;
    images: Array<{
      imageId: number;
      imageUrl: string;
      displayOrder: number;
    }>;
    seller: {
      userId: number;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      ratingAverage: number | null;
      ratingCount: number;
    };
    createdAt: string;
    updatedAt: string;
  };
  relatedItems: Array<{
    itemId: number;
    title: string;
    price: number;
    thumbnailUrl: string | null;
  }>;
}

function PurchaseContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");

  // 商品データ
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  // 商品データを取得
  useEffect(() => {
    if (!itemId) {
      setError("商品が指定されていません");
      setIsLoading(false);
      return;
    }

    const fetchStock = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchApi<StockDetail>(`/v1/market/items/${itemId}`, {
          credentials: "include",
        });

        // 出品中(status=2)でない場合はエラー
        if (data.item.status !== 2) {
          setError("この商品は現在購入できません");
          setStock(null);
        } else {
          setStock(data);
        }
      } catch (err: any) {
        setError(err.message || "商品の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [itemId]);

  // 画像URLを構築
  const getMediaUrl = (url: string | null) => {
    if (!url) return "/images/no-image.png";
    if (url.startsWith("http")) return url;
    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${url}`;
  };

  // 新しい住所を追加
  const handleAddAddress = (newAddress: ShippingAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
  };

  const handlePurchase = async () => {
    if (!stock) return;

    setIsProcessing(true);
    try {
      // 1. 注文を作成
      const orderResponse = await fetchApi<{
        orderId: number;
        totalAmount: number;
        status: number;
      }>("/v1/market/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: stock.item.itemId,
          quantity: 1,
          shippingName: selectedAddress.name,
          shippingZipCode: selectedAddress.postalCode,
          shippingPrefecture: selectedAddress.prefecture,
          shippingCity: selectedAddress.city,
          shippingAddressLine1: selectedAddress.address1,
          shippingAddressLine2: selectedAddress.address2 || null,
          paymentMethod:
            selectedPayment.type === "credit_card"
              ? "card"
              : selectedPayment.type,
        }),
      });

      // 2. 決済を処理
      await fetchApi(`/v1/market/orders/${orderResponse.orderId}/pay`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod:
            selectedPayment.type === "credit_card"
              ? "card"
              : selectedPayment.type,
        }),
      });

      setIsPurchased(true);
    } catch (err: any) {
      alert(err.message || "購入処理に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-500"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時
  if (error || !stock) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {error || "商品が見つかりません"}
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            商品ページに戻って再度お試しください。
          </p>
          <Link
            href="/stocks"
            className="inline-block rounded-lg bg-red-500 px-8 py-3 font-bold text-white transition-colors hover:bg-red-600"
          >
            商品一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // 購入完了画面
  if (isPurchased) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
            <svg
              className="h-10 w-10 text-white"
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
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            購入が完了しました
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            ご注文ありがとうございます。
            <br />
            商品の発送まで今しばらくお待ちください。
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-red-500 px-8 py-3 font-bold text-white transition-colors hover:bg-red-600"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const item = stock.item;
  const thumbnailUrl =
    item.images.length > 0
      ? getMediaUrl(item.images[0].imageUrl)
      : "/images/no-image.png";
  const shippingText = item.shippingPayerType === 0 ? "送料込み" : "着払い";

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center">
          <Link
            href={`/stocks/${itemId}`}
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
            <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>商品代金</span>
                  <span className="text-gray-900 dark:text-white">
                    ¥{item.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <span className="font-bold text-gray-900 dark:text-white">
                    支払い金額
                  </span>
                  <span className="text-xl font-bold text-red-500">
                    ¥{item.price.toLocaleString()}
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
                onClick={handlePurchase}
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-4 font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
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
