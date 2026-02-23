"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// カテゴリー情報
const CATEGORIES: { [key: string]: { label: string; icon: string } } = {
  vegetable: { label: "野菜", icon: "🥬" },
  fruit: { label: "果物", icon: "🍎" },
  rice: { label: "米・穀物", icon: "🌾" },
  processed: { label: "加工品", icon: "🫙" },
  other: { label: "その他", icon: "📦" },
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

// 商品カード コンポーネント
function ItemCard({
  item,
  onDelete,
}: {
  item: ListingItem;
  onDelete: (id: string) => void;
}) {
  const categoryInfo = CATEGORIES[item.category] || {
    label: "その他",
    icon: "📦",
  };
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(item.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative">
      <Link href={`/item?id=${item.id}`} className="block">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
          {/* 商品画像 */}
          <div className="relative aspect-square">
            <img
              src={item.images[0]}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            {/* ステータスバッジ */}
            {item.status === "sold" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                  SOLD
                </span>
              </div>
            )}
            {/* カテゴリーバッジ */}
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium">
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </div>
          </div>
          {/* 商品情報 */}
          <div className="p-3">
            <h3 className="mb-1 line-clamp-2 text-sm font-medium text-stone-800">
              {item.name}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-red-600">
                ¥{item.price.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500">
                {item.shippingIncluded ? "送料込み" : "送料別"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* メニューボタン */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
      >
        <svg
          className="h-4 w-4 text-stone-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(false);
            }}
          />
          <div className="absolute top-10 right-2 z-30 min-w-[140px] rounded-lg bg-white py-2 shadow-lg">
            <Link
              href={`/item?id=${item.id}`}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
              onClick={(e) => e.stopPropagation()}
            >
              📄 詳細を見る
            </Link>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              🗑️ 出品を取り消す
            </button>
          </div>
        </>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold text-stone-800">
              出品を取り消しますか？
            </h3>
            <p className="mb-4 text-sm text-stone-600">
              「{item.name}」の出品を取り消します。この操作は元に戻せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 rounded-lg border border-stone-300 px-4 py-3 font-medium transition hover:bg-stone-50"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600"
              >
                取り消す
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [myListings, setMyListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // localStorageから出品商品を読み込む
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("myListings") || "[]");
    setMyListings(items);
    setIsLoading(false);
  }, []);

  // 商品を削除
  const handleDeleteItem = (itemId: string) => {
    const updatedItems = myListings.filter((item) => item.id !== itemId);
    setMyListings(updatedItems);
    localStorage.setItem("myListings", JSON.stringify(updatedItems));
  };

  const activeItems = myListings.filter((item) => item.status === "active");
  const soldItems = myListings.filter((item) => item.status === "sold");

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-6 pb-16">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-2 text-center text-xl font-bold text-white">
            マイページ
          </h1>
        </div>
      </div>

      <div className="mx-auto -mt-12 max-w-2xl px-4">
        {/* プロフィールカード */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-start gap-4">
            {/* アバター */}
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=hanako"
              alt="ユーザー"
              className="h-20 w-20 rounded-full border-4 border-white shadow-md"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-stone-800">田中 花子</h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  4.8
                </span>
                <span>•</span>
                <span>東京都世田谷区</span>
              </div>
            </div>
          </div>

          {/* 自己紹介 */}
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            趣味で野菜を育てています🌱
            無農薬・有機栽培にこだわっています。採れたての新鮮野菜をお届けします！
          </p>

          {/* 統計 */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stone-100 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {myListings.length}
              </div>
              <div className="text-xs text-stone-500">出品数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {soldItems.length}
              </div>
              <div className="text-xs text-stone-500">販売数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">0</div>
              <div className="text-xs text-stone-500">レビュー</div>
            </div>
          </div>
        </div>

        {/* 出品中の商品 */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-800">
              出品中の商品
              <span className="ml-2 text-sm font-normal text-stone-500">
                ({activeItems.length}件)
              </span>
            </h2>
            <Link
              href="/stock/new"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              + 新規出品
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-lg bg-white p-8 text-center">
              <p className="text-stone-500">読み込み中...</p>
            </div>
          ) : activeItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {activeItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center">
              <p className="mb-4 text-stone-500">出品中の商品はありません</p>
              <Link
                href="/stock/new"
                className="inline-block rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition hover:bg-emerald-600"
              >
                出品する
              </Link>
            </div>
          )}
        </div>

        {/* 売却済みの商品 */}
        {soldItems.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold text-stone-800">
              売却済み
              <span className="ml-2 text-sm font-normal text-stone-500">
                ({soldItems.length}件)
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {soldItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* メニュー */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <button className="flex w-full items-center justify-between border-b border-stone-100 px-4 py-4 transition hover:bg-stone-50">
            <div className="flex items-center gap-3">
              <span className="text-xl">📝</span>
              <span className="font-medium text-stone-700">
                プロフィール編集
              </span>
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
          </button>
          <button className="flex w-full items-center justify-between border-b border-stone-100 px-4 py-4 transition hover:bg-stone-50">
            <div className="flex items-center gap-3">
              <span className="text-xl">💰</span>
              <span className="font-medium text-stone-700">売上管理</span>
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
          </button>
          <button className="flex w-full items-center justify-between border-b border-stone-100 px-4 py-4 transition hover:bg-stone-50">
            <div className="flex items-center gap-3">
              <span className="text-xl">⭐</span>
              <span className="font-medium text-stone-700">レビュー一覧</span>
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
          </button>
          <button className="flex w-full items-center justify-between px-4 py-4 transition hover:bg-stone-50">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <span className="font-medium text-stone-700">設定</span>
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
          </button>
        </div>
      </div>
    </div>
  );
}
