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
    onDelete
}: {
    item: ListingItem;
    onDelete: (id: string) => void;
}) {
    const categoryInfo = CATEGORIES[item.category] || { label: "その他", icon: "📦" };
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
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    {/* 商品画像 */}
                    <div className="relative aspect-square">
                        <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        {/* ステータスバッジ */}
                        {item.status === "sold" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                                    SOLD
                                </span>
                            </div>
                        )}
                        {/* カテゴリーバッジ */}
                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <span>{categoryInfo.icon}</span>
                            <span>{categoryInfo.label}</span>
                        </div>
                    </div>
                    {/* 商品情報 */}
                    <div className="p-3">
                        <h3 className="font-medium text-stone-800 text-sm line-clamp-2 mb-1">
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
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition z-10"
            >
                <svg className="w-4 h-4 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
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
                    <div className="absolute top-10 right-2 bg-white rounded-lg shadow-lg py-2 z-30 min-w-[140px]">
                        <Link
                            href={`/item?id=${item.id}`}
                            className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            📄 詳細を見る
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            🗑️ 出品を取り消す
                        </button>
                    </div>
                </>
            )}

            {/* 削除確認モーダル */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={cancelDelete}
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-stone-800 mb-2">出品を取り消しますか？</h3>
                        <p className="text-stone-600 text-sm mb-4">
                            「{item.name}」の出品を取り消します。この操作は元に戻せません。
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
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
                <div className="max-w-2xl mx-auto px-4">
                    <h1 className="text-xl font-bold text-white text-center mb-2">マイページ</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-12">
                {/* プロフィールカード */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-start gap-4">
                        {/* アバター */}
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=hanako"
                            alt="ユーザー"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-stone-800">田中 花子</h2>
                            <div className="flex items-center gap-2 text-sm text-stone-500 mt-1">
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
                    <p className="text-stone-600 text-sm mt-4 leading-relaxed">
                        趣味で野菜を育てています🌱 無農薬・有機栽培にこだわっています。採れたての新鮮野菜をお届けします！
                    </p>

                    {/* 統計 */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-stone-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">{myListings.length}</div>
                            <div className="text-xs text-stone-500">出品数</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">{soldItems.length}</div>
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-stone-800">
                            出品中の商品
                            <span className="ml-2 text-sm font-normal text-stone-500">
                                ({activeItems.length}件)
                            </span>
                        </h2>
                        <Link
                            href="/my/stocks/new"
                            className="text-sm text-emerald-600 font-medium hover:underline"
                        >
                            + 新規出品
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="bg-white rounded-lg p-8 text-center">
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
                        <div className="bg-white rounded-lg p-8 text-center">
                            <p className="text-stone-500 mb-4">出品中の商品はありません</p>
                            <Link
                                href="/my/stocks/new"
                                className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition"
                            >
                                出品する
                            </Link>
                        </div>
                    )}
                </div>

                {/* 売却済みの商品 */}
                {soldItems.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-stone-800 mb-4">
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
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <button className="w-full flex items-center justify-between px-4 py-4 border-b border-stone-100 hover:bg-stone-50 transition">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📝</span>
                            <span className="font-medium text-stone-700">プロフィール編集</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-4 border-b border-stone-100 hover:bg-stone-50 transition">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">💰</span>
                            <span className="font-medium text-stone-700">売上管理</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-4 border-b border-stone-100 hover:bg-stone-50 transition">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⭐</span>
                            <span className="font-medium text-stone-700">レビュー一覧</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-stone-50 transition">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⚙️</span>
                            <span className="font-medium text-stone-700">設定</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
