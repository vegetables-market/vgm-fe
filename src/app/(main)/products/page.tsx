"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PURCHASE_ITEM } from "@/lib/data";

// ダミー商品リスト（今は1件だけ）
const PRODUCTS = [PURCHASE_ITEM];

export default function ProductListPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ヘッダー */}
            <header className="border-b border-gray-200 dark:border-gray-700 py-4 px-6 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto flex items-center">
                    <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2">
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
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">商品を選択</h1>

                {/* 商品グリッド */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {PRODUCTS.map((product) => (
                        <Link
                            key={product.id}
                            href={`/purchase?id=${product.id}`}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all group shadow-sm hover:shadow-md"
                        >
                            {/* 商品画像 */}
                            <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                />
                                {/* 価格バッジ */}
                                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-sm font-bold px-2 py-1 rounded">
                                    ¥{product.price.toLocaleString()}
                                </div>
                            </div>

                            {/* 商品情報 */}
                            <div className="p-3">
                                <h3 className="text-sm font-medium line-clamp-2 mb-1 text-gray-900 dark:text-white">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {product.producer}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
