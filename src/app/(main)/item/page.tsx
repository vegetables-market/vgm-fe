"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// カテゴリー情報
const CATEGORIES: { [key: string]: { label: string; icon: string } } = {
  vegetable: { label: "野菜", icon: "🥬" },
  fruit: { label: "果物", icon: "🍎" },
  rice: { label: "米・穀物", icon: "🌾" },
  processed: { label: "加工品", icon: "🫙" },
  other: { label: "その他", icon: "📦" },
};

// 受け渡し方法
const DELIVERY_METHODS: { [key: string]: { label: string; icon: string } } = {
  handover: { label: "手渡し", icon: "🤝" },
  dropoff: { label: "置き配", icon: "📍" },
  shipping: { label: "配送", icon: "📦" },
};

// 商品の型定義
interface ListingItem {
  id: string;
  name: string;
  description: string;
  price: number;
  shippingIncluded: boolean;
  category: string;
  harvestDate?: string;
  expiryDate: string;
  deliveryMethod: string;
  deliveryLocation?: string;
  preferredTime?: string;
  images: string[];
  createdAt: string;
  status: string;
}

function ItemDetailContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");
  const [item, setItem] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // localStorageから商品を取得
  useEffect(() => {
    if (!itemId) {
      setIsLoading(false);
      return;
    }
    const items = JSON.parse(localStorage.getItem("myListings") || "[]");
    const foundItem = items.find((i: ListingItem) => i.id === itemId);
    setItem(foundItem || null);
    setIsLoading(false);
  }, [itemId]);

  // 読み込み中
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <p className="text-stone-500">読み込み中...</p>
      </div>
    );
  }

  // 商品が見つからない場合
  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h1 className="mb-2 text-xl font-bold text-stone-800">
            商品が見つかりません
          </h1>
          <p className="mb-4 text-stone-500">
            この商品は削除されたか、存在しません。
          </p>
          <Link
            href="/profile"
            className="inline-block rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition hover:bg-emerald-600"
          >
            マイページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORIES[item.category] || {
    label: "その他",
    icon: "📦",
  };
  const deliveryInfo = DELIVERY_METHODS[item.deliveryMethod] || {
    label: "未設定",
    icon: "❓",
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* パンくずリスト */}
        <nav className="mb-4 hidden text-sm text-stone-500 md:block">
          <Link href="/" className="hover:text-emerald-600">
            ホーム
          </Link>
          <span className="mx-2">›</span>
          <Link href="/profile" className="hover:text-emerald-600">
            マイページ
          </Link>
          <span className="mx-2">›</span>
          <span className="text-stone-700">{item.name}</span>
        </nav>

        {/* メインコンテンツ */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* 左側: 画像セクション（スティッキー） */}
          <div className="lg:sticky lg:top-20 lg:w-1/2">
            <div className="flex gap-3">
              {/* サムネイル列（デスクトップ） */}
              {item.images.length > 1 && (
                <div className="hidden w-20 flex-col gap-2 md:flex">
                  {item.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-emerald-500 ring-2 ring-emerald-200"
                          : "border-transparent hover:border-stone-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${item.name} - 画像${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* メイン画像 */}
              <div className="relative flex-1">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-900">
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                  {/* 売却済みオーバーレイ */}
                  {item.status === "sold" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="rounded-full bg-red-500 px-8 py-3 text-xl font-bold text-white">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                  {/* 画像ナビゲーション矢印 */}
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? item.images.length - 1 : prev - 1,
                          )
                        }
                        className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition hover:bg-white"
                      >
                        <svg
                          className="h-6 w-6 text-stone-700"
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
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === item.images.length - 1 ? 0 : prev + 1,
                          )
                        }
                        className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition hover:bg-white"
                      >
                        <svg
                          className="h-6 w-6 text-stone-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                  {/* 画像カウンター */}
                  <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                </div>

                {/* モバイル用サムネイル */}
                {item.images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2 md:hidden">
                    {item.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-emerald-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${item.name} - 画像${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右側: 商品情報（スクロール可能） */}
          <div className="pb-24 lg:w-1/2 lg:pb-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* 商品名 */}
              <h1 className="mb-2 text-2xl font-bold text-stone-800">
                {item.name}
              </h1>

              {/* カテゴリー */}
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-sm">
                <span>{categoryInfo.icon}</span>
                <span className="text-stone-600">{categoryInfo.label}</span>
              </div>

              {/* 価格 */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-red-600">
                  ¥{item.price.toLocaleString()}
                </span>
                <span className="rounded bg-stone-100 px-2 py-1 text-sm text-stone-500">
                  {item.shippingIncluded ? "送料込み" : "送料別"}
                </span>
              </div>

              {/* アクションボタン */}
              <div className="mb-6 flex gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-3 transition hover:bg-stone-50">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>3</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-3 transition hover:bg-stone-50">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>2</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-3 transition hover:bg-stone-50">
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span>保存</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-3 transition hover:bg-stone-50">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>通報</span>
                </button>
              </div>

              {/* 購入ボタン */}
              {item.status === "active" && (
                <button className="mb-6 w-full rounded-lg bg-red-500 py-4 text-lg font-bold text-white transition hover:bg-red-600">
                  購入手続きへ
                </button>
              )}

              {/* 商品説明 */}
              <div className="border-t border-stone-200 pt-6">
                <h2 className="mb-3 text-lg font-bold text-stone-800">
                  商品の説明
                </h2>
                <p className="leading-relaxed whitespace-pre-wrap text-stone-600">
                  {item.description || "説明はありません"}
                </p>
              </div>

              {/* 食材情報 */}
              <div className="mt-6 border-t border-stone-200 pt-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-stone-800">
                  <span>🌱</span>
                  食材情報
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {item.harvestDate && (
                    <div className="rounded-lg bg-stone-50 p-3">
                      <div className="mb-1 text-xs text-stone-500">収穫日</div>
                      <div className="font-medium text-stone-800">
                        {new Date(item.harvestDate).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                  )}
                  {item.expiryDate && (
                    <div className="rounded-lg bg-red-50 p-3">
                      <div className="mb-1 text-xs text-red-500">賞味期限</div>
                      <div className="font-medium text-red-600">
                        {new Date(item.expiryDate).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 受け渡し情報 */}
              <div className="mt-6 border-t border-stone-200 pt-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-stone-800">
                  <span>🤝</span>
                  受け渡し方法
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
                    <span className="text-2xl">{deliveryInfo.icon}</span>
                    <div>
                      <div className="font-medium text-stone-800">
                        {deliveryInfo.label}
                      </div>
                      {item.deliveryLocation && (
                        <div className="text-sm text-stone-500">
                          {item.deliveryLocation}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.preferredTime && (
                    <div className="text-sm text-stone-600">
                      <span className="font-medium">希望日時：</span>
                      {item.preferredTime}
                    </div>
                  )}
                </div>
              </div>

              {/* 出品者情報 */}
              <div className="mt-6 border-t border-stone-200 pt-6">
                <h2 className="mb-3 text-lg font-bold text-stone-800">
                  出品者
                </h2>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg bg-stone-50 p-3 transition hover:bg-stone-100"
                >
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=hanako"
                    alt="出品者"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-stone-800">田中 花子</div>
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        4.8
                      </span>
                      <span>•</span>
                      <span>東京都世田谷区</span>
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* 出品日 */}
              <div className="mt-6 text-center text-sm text-stone-400">
                出品日：{new Date(item.createdAt).toLocaleDateString("ja-JP")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* モバイル用固定購入ボタン */}
      {item.status === "active" && (
        <div className="fixed right-0 bottom-0 left-0 border-t border-stone-200 bg-white p-4 lg:hidden">
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 py-3">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="flex-[3] rounded-lg bg-red-500 py-3 font-bold text-white">
              購入手続きへ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItemPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <p className="text-stone-500">読み込み中...</p>
        </div>
      }
    >
      <ItemDetailContent />
    </Suspense>
  );
}
