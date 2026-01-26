"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

export default function ListingPage() {
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                            setImages((prev) => [...prev, ...newImages].slice(0, 10)); // 最大10枚
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

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-stone-50">
                {/* ヘッダー部分 */}
                <div className="bg-white border-b border-stone-200 py-6">
                    <div className="max-w-2xl mx-auto px-4">
                        <h1 className="text-2xl font-bold text-center text-stone-800">出品</h1>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-8">
                    {/* 出品するボタン */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2 mb-6"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        出品する
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {/* 下書き一覧 */}
                    <button className="w-full border-2 border-red-500 text-red-500 font-bold py-4 px-6 rounded-lg transition hover:bg-red-50 flex items-center justify-center gap-2 mb-8">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        下書き一覧
                    </button>

                    {/* アップロードされた画像プレビュー */}
                    {images.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm mb-8">
                            <h2 className="font-bold text-stone-700 mb-3">アップロードされた画像 ({images.length}/10)</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img src={img} alt={`商品画像 ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                        <button
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

                    {/* 出品に関するヒント */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <h2 className="font-bold text-stone-600 px-4 py-3 bg-stone-100">出品に関するヒント</h2>

                        <Link href="#" className="flex items-center px-4 py-4 border-b border-stone-100 hover:bg-stone-50 transition">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-xl">🎯</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-stone-800">売れるためのコツを見る</h3>
                                <p className="text-sm text-stone-500">売れるための出品のコツを確認できます</p>
                            </div>
                            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <Link href="#" className="flex items-center px-4 py-4 border-b border-stone-100 hover:bg-stone-50 transition">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-xl">📦</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-stone-800">配送方法早わかり表を見る</h3>
                                <p className="text-sm text-stone-500">利用できる主な配送方法を確認できます</p>
                            </div>
                            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <Link href="#" className="flex items-center px-4 py-4 hover:bg-stone-50 transition">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-xl">📋</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-stone-800">梱包の方法を見る</h3>
                                <p className="text-sm text-stone-500">本や衣類など、梱包方法を確認できます</p>
                            </div>
                            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute >
    );
}
