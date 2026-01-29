"use client";

import Link from "next/link";
import Image from "next/image";
import { PURCHASE_ITEM } from "@/lib/data";

// ダミー商品リスト（今は1件だけ）
const PRODUCTS = [PURCHASE_ITEM];

export default function ProductListPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center">
          <Link
            href="/"
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
        <h1 className="mb-6 text-2xl font-bold" style={{ color: "inherit" }}>
          商品を選択
        </h1>

        {/* 商品グリッド */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/purchase?id=${product.id}`}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-red-500 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* 商品画像 */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                {/* 価格バッジ */}
                <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-sm font-bold text-white">
                  ¥{product.price.toLocaleString()}
                </div>
              </div>

              {/* 商品情報 */}
              <div className="p-3">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
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
