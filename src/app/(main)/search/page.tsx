"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ItemCard } from "@/components/market/ItemCard";

interface SearchItem {
  itemId?: number;
  item_id?: number | string;
  id?: number;
  f_id?: number;
  title?: string;
  name?: string;
  f_name?: string;
  price?: number;
  f_price?: number;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
}

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [items, setItems] = useState<SearchItem[]>([]);

  useEffect(() => {
    if (!query) {
      setItems([]);
      return;
    }

    const fetchResults = async () => {
      // 前に作ったエンドポイント api/v1/market/items/search を叩く
      const response = await fetch(
        `http://localhost:8080/api/v1/market/items/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      const normalizedItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      setItems(normalizedItems);
      console.log("API Response:", data);
    };

    fetchResults().catch((err) => {
      console.error("Failed to fetch search results", err);
      setItems([]);
    });
  }, [query]);

  // グローバルに inputRef を公開してMobileNavigationからアクセス可能にする
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).searchInputRef = inputRef;
    }
    // アンマウント時にクリーンアップ
    return () => {
      if (typeof window !== "undefined") {
        (window as any).searchInputRef = null;
      }
    };
  }, []);

  const getImageUrl = (item: SearchItem) => {
    const raw =
      item.thumbnail_url ??
      item.thumbnailUrl ??
      item.image_url ??
      item.imageUrl ??
      null;

    if (!raw) return "/images/no-image.png";
    if (raw.startsWith("http")) return raw;

    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${raw}`;
  };

  return (
  <div className="min-h-screen bg-white px-4 py-8 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
    <h1 className="mb-8 text-2xl font-bold">
      「{query ?? ""}」の検索結果: <span className="text-green-600">{items.length}</span>件
    </h1>

    {/* 商品グリッド*/}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item, index) => (
        <ItemCard
          key={item.item_id ?? item.id ?? index}
          item={{
            id: String(item.item_id ?? item.id),
            name: item.title ?? item.name ?? "名称未設定",
            price: item.price ?? 0,
            images: [getImageUrl(item)],
            status: "available", // 実際はデータに合わせて変更
          }}
        />
      ))}
    </div>

    {/* 検索結果が0件の時のフォロー */}
    {items.length === 0 && (
      <div className="mt-20 text-center">
        <p className="text-stone-500">該当する商品が見つかりませんでした。</p>
      </div>
    )}
  </div>
  );
}