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
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <p className="text-stone-500">読み込み中...</p>
            </div>
        );
    }

    // 商品が見つからない場合
    if (!item) {
        return (
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-xl font-bold text-stone-800 mb-2">商品が見つかりません</h1>
                    <p className="text-stone-500 mb-4">この商品は削除されたか、存在しません。</p>
                    <Link
                        href="/profile"
                        className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition"
                    >
                        マイページに戻る
                    </Link>
                </div>
            </div>
        );
    }

    const categoryInfo = CATEGORIES[item.category] || { label: "その他", icon: "📦" };
    const deliveryInfo = DELIVERY_METHODS[item.deliveryMethod] || { label: "未設定", icon: "❓" };

    return (
        <div className="min-h-screen bg-stone-100">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* パンくずリスト */}
                <nav className="text-sm text-stone-500 mb-4 hidden md:block">
                    <Link href="/" className="hover:text-emerald-600">ホーム</Link>
                    <span className="mx-2">›</span>
                    <Link href="/profile" className="hover:text-emerald-600">マイページ</Link>
                    <span className="mx-2">›</span>
                    <span className="text-stone-700">{item.name}</span>
                </nav>

                {/* メインコンテンツ */}
                <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
                    {/* 左側: 画像セクション（スティッキー） */}
                    <div className="lg:w-1/2 lg:sticky lg:top-20">
                        <div className="flex gap-3">
                            {/* サムネイル列（デスクトップ） */}
                            {item.images.length > 1 && (
                                <div className="hidden md:flex flex-col gap-2 w-20">
                                    {item.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? "border-emerald-500 ring-2 ring-emerald-200"
                                                    : "border-transparent hover:border-stone-300"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${item.name} - 画像${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* メイン画像 */}
                            <div className="flex-1 relative">
                                <div className="bg-stone-900 rounded-lg overflow-hidden aspect-square relative">
                                    <img
                                        src={item.images[currentImageIndex]}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                    {/* 売却済みオーバーレイ */}
                                    {item.status === "sold" && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-8 py-3 rounded-full font-bold text-xl">
                                                SOLD OUT
                                            </span>
                                        </div>
                                    )}
                                    {/* 画像ナビゲーション矢印 */}
                                    {item.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1))}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                                            >
                                                <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1))}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                                            >
                                                <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    {/* 画像カウンター */}
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                                        {currentImageIndex + 1} / {item.images.length}
                                    </div>
                                </div>

                                {/* モバイル用サムネイル */}
                                {item.images.length > 1 && (
                                    <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-2">
                                        {item.images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                        ? "border-emerald-500"
                                                        : "border-transparent"
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${item.name} - 画像${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 右側: 商品情報（スクロール可能） */}
                    <div className="lg:w-1/2 pb-24 lg:pb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* 商品名 */}
                            <h1 className="text-2xl font-bold text-stone-800 mb-2">{item.name}</h1>

                            {/* カテゴリー */}
                            <div className="inline-flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-sm mb-4">
                                <span>{categoryInfo.icon}</span>
                                <span className="text-stone-600">{categoryInfo.label}</span>
                            </div>

                            {/* 価格 */}
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold text-red-600">
                                    ¥{item.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                    {item.shippingIncluded ? "送料込み" : "送料別"}
                                </span>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex gap-3 mb-6">
                                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>3</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>2</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    <span>保存</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>通報</span>
                                </button>
                            </div>

                            {/* 購入ボタン */}
                            {item.status === "active" && (
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition text-lg mb-6">
                                    購入手続きへ
                                </button>
                            )}

                            {/* 商品説明 */}
                            <div className="border-t border-stone-200 pt-6">
                                <h2 className="font-bold text-stone-800 text-lg mb-3">商品の説明</h2>
                                <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                                    {item.description || "説明はありません"}
                                </p>
                            </div>

                            {/* 食材情報 */}
                            <div className="border-t border-stone-200 pt-6 mt-6">
                                <h2 className="font-bold text-stone-800 text-lg mb-3 flex items-center gap-2">
                                    <span>🌱</span>
                                    食材情報
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {item.harvestDate && (
                                        <div className="bg-stone-50 p-3 rounded-lg">
                                            <div className="text-xs text-stone-500 mb-1">収穫日</div>
                                            <div className="font-medium text-stone-800">
                                                {new Date(item.harvestDate).toLocaleDateString("ja-JP")}
                                            </div>
                                        </div>
                                    )}
                                    {item.expiryDate && (
                                        <div className="bg-red-50 p-3 rounded-lg">
                                            <div className="text-xs text-red-500 mb-1">賞味期限</div>
                                            <div className="font-medium text-red-600">
                                                {new Date(item.expiryDate).toLocaleDateString("ja-JP")}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 受け渡し情報 */}
                            <div className="border-t border-stone-200 pt-6 mt-6">
                                <h2 className="font-bold text-stone-800 text-lg mb-3 flex items-center gap-2">
                                    <span>🤝</span>
                                    受け渡し方法
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg">
                                        <span className="text-2xl">{deliveryInfo.icon}</span>
                                        <div>
                                            <div className="font-medium text-stone-800">{deliveryInfo.label}</div>
                                            {item.deliveryLocation && (
                                                <div className="text-sm text-stone-500">{item.deliveryLocation}</div>
                                            )}
                                        </div>
                                    </div>
                                    {item.preferredTime && (
                                        <div className="text-sm text-stone-600">
                                            <span className="font-medium">希望日時：</span>{item.preferredTime}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 出品者情報 */}
                            <div className="border-t border-stone-200 pt-6 mt-6">
                                <h2 className="font-bold text-stone-800 text-lg mb-3">出品者</h2>
                                <Link href="/profile" className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=hanako"
                                        alt="出品者"
                                        className="w-12 h-12 rounded-full"
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
                                    <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            {/* 出品日 */}
                            <div className="text-sm text-stone-400 mt-6 text-center">
                                出品日：{new Date(item.createdAt).toLocaleDateString("ja-JP")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* モバイル用固定購入ボタン */}
            {item.status === "active" && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 lg:hidden">
                    <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 border border-stone-300 py-3 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button className="flex-[3] bg-red-500 text-white font-bold py-3 rounded-lg">
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
        <Suspense fallback={<div className="min-h-screen bg-stone-100 flex items-center justify-center"><p className="text-stone-500">読み込み中...</p></div>}>
            <ItemDetailContent />
        </Suspense>
    );
}
