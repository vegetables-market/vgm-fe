"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// カテゴリーの定義
const CATEGORIES = [
    { value: "vegetable", label: "野菜", icon: "🥬" },
    { value: "fruit", label: "果物", icon: "🍎" },
    { value: "rice", label: "米・穀物", icon: "🌾" },
    { value: "processed", label: "加工品", icon: "🫙" },
    { value: "other", label: "その他", icon: "📦" },
];

// 受け渡し方法の定義
const DELIVERY_METHODS = [
    { value: "handover", label: "手渡し", description: "直接会って受け渡し" },
    { value: "dropoff", label: "置き配", description: "指定場所に置いておく" },
    { value: "shipping", label: "配送", description: "宅配便で発送" },
];

export default function ListingPage() {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // フォームの状態
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [shippingIncluded, setShippingIncluded] = useState(true);
    const [category, setCategory] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [deliveryLocation, setDeliveryLocation] = useState("");
    const [preferredTime, setPreferredTime] = useState("");

    // 画像アップロード処理
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        if (newImages.length === files.length) {
                            setImages((prev) => [...prev, ...newImages].slice(0, 10));
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // 画像削除
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // フォーム送信
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 新規商品データを作成
        const newItem = {
            id: `item-${Date.now()}`,
            name: productName,
            description,
            price: Number(price),
            shippingIncluded,
            category,
            harvestDate,
            expiryDate,
            deliveryMethod,
            deliveryLocation,
            preferredTime,
            images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1546470427-227c7369a9b5?w=400"],
            createdAt: new Date().toISOString(),
            status: "active",
        };

        // localStorageから既存の商品を取得
        const existingItems = JSON.parse(localStorage.getItem("myListings") || "[]");

        // 新しい商品を追加
        existingItems.unshift(newItem);

        // localStorageに保存
        localStorage.setItem("myListings", JSON.stringify(existingItems));

        alert("出品が完了しました！");

        // プロフィールページにリダイレクト
        router.push("/profile");
    };

    return (
        <div className="min-h-screen bg-stone-50">
            {/* ヘッダー部分 */}
            <div className="bg-white border-b border-stone-200 py-6">
                <div className="max-w-2xl mx-auto px-4">
                    <h1 className="text-2xl font-bold text-center text-stone-800">出品</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
                {/* 画像アップロードセクション */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                    <h2 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <span className="text-lg">📷</span>
                        商品画像
                        <span className="text-red-500 text-sm">*</span>
                    </h2>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium py-4 px-6 rounded-lg border-2 border-dashed border-stone-300 transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        画像を追加（最大10枚）
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {images.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-stone-500 mb-2">{images.length}/10 枚</p>
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img src={img} alt={`商品画像 ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/80"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 商品名・説明文 */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                    <h2 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <span className="text-lg">✏️</span>
                        商品情報
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">
                                商品名 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="例：朝採れトマト 1kg"
                                maxLength={100}
                                required
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                            />
                            <p className="text-xs text-stone-400 mt-1 text-right">{productName.length}/100</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">
                                商品の説明
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="商品の状態、栽培方法、おすすめの食べ方など"
                                maxLength={1000}
                                rows={4}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                            />
                            <p className="text-xs text-stone-400 mt-1 text-right">{description.length}/1000</p>
                        </div>
                    </div>
                </div>

                {/* カテゴリー選択 */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                    <h2 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <span className="text-lg">🏷️</span>
                        カテゴリー
                        <span className="text-red-500 text-sm">*</span>
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setCategory(cat.value)}
                                className={`p-3 rounded-lg border-2 transition flex items-center gap-2 ${category === cat.value
                                    ? "border-red-500 bg-red-50 text-red-700"
                                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                                    }`}
                            >
                                <span className="text-xl">{cat.icon}</span>
                                <span className="font-medium">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 価格設定 */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                    <h2 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        価格
                        <span className="text-red-500 text-sm">*</span>
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">
                                販売価格
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">¥</span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="300"
                                    min="100"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition ${shippingIncluded ? "border-red-500 bg-red-50" : "border-stone-200"
                                }`}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    checked={shippingIncluded}
                                    onChange={() => setShippingIncluded(true)}
                                    className="sr-only"
                                />
                                <span className={`font-medium ${shippingIncluded ? "text-red-700" : "text-stone-600"}`}>
                                    送料込み
                                </span>
                            </label>
                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition ${!shippingIncluded ? "border-red-500 bg-red-50" : "border-stone-200"
                                }`}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    checked={!shippingIncluded}
                                    onChange={() => setShippingIncluded(false)}
                                    className="sr-only"
                                />
                                <span className={`font-medium ${!shippingIncluded ? "text-red-700" : "text-stone-600"}`}>
                                    送料別（着払い）
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 収穫日・賞味期限 */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                    <h2 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        収穫日・賞味期限
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">
                                収穫日
                            </label>
                            <input
                                type="date"
                                value={harvestDate}
                                onChange={(e) => setHarvestDate(e.target.value)}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">
                                賞味期限 / 消費期限 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                            />
                            <p className="text-xs text-stone-500 mt-1">
                                ※ 食品の安全のため、賞味期限または消費期限の入力が必要です
                            </p>
                        </div>
                    </div>
                </div>

                {/* 受け渡し場所・方法 */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                    <h2 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <span className="text-lg">🤝</span>
                        受け渡し方法
                        <span className="text-red-500 text-sm">*</span>
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            {DELIVERY_METHODS.map((method) => (
                                <label
                                    key={method.value}
                                    className={`block p-4 rounded-lg border-2 cursor-pointer transition ${deliveryMethod === method.value
                                        ? "border-red-500 bg-red-50"
                                        : "border-stone-200 hover:border-stone-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value={method.value}
                                        checked={deliveryMethod === method.value}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className={`font-medium ${deliveryMethod === method.value ? "text-red-700" : "text-stone-700"
                                                }`}>
                                                {method.label}
                                            </span>
                                            <p className="text-sm text-stone-500">{method.description}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMethod === method.value
                                            ? "border-red-500 bg-red-500"
                                            : "border-stone-300"
                                            }`}>
                                            {deliveryMethod === method.value && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {(deliveryMethod === "handover" || deliveryMethod === "dropoff") && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">
                                        受け渡し場所 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryLocation}
                                        onChange={(e) => setDeliveryLocation(e.target.value)}
                                        placeholder={deliveryMethod === "handover" ? "例：〇〇駅改札前" : "例：自宅前（詳細は購入後に連絡）"}
                                        required={deliveryMethod === "handover" || deliveryMethod === "dropoff"}
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">
                                        希望日時
                                    </label>
                                    <input
                                        type="text"
                                        value={preferredTime}
                                        onChange={(e) => setPreferredTime(e.target.value)}
                                        placeholder="例：平日18時以降、土日終日OK"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 出品ボタン */}
                <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    出品する
                </button>

                {/* 下書き保存ボタン */}
                <button
                    type="button"
                    className="w-full mt-4 border-2 border-stone-300 text-stone-600 font-bold py-4 px-6 rounded-lg transition hover:bg-stone-100 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    下書き保存
                </button>
            </form>
        </div>
    );
}
