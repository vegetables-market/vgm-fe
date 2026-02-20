"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
    <div>
      <h1>「{query ?? ""}」の検索結果: {items.length}件</h1>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => {
          const itemKey =
            item.itemId ?? item.item_id ?? item.id ?? item.f_id ?? index;
          const itemName =
            item.title ?? item.name ?? item.f_name ?? "名称未設定";
          const itemPrice = item.price ?? item.f_price ?? 0;

          return (
            <div key={itemKey} className="rounded border p-4">
              <div className="mb-2 w-1/2 aspect-square overflow-hidden rounded bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(item)}
                  alt={itemName}
                  className="h-full w-full object-cover"
                />
              </div>
              <p>{itemName}</p>
              <p>{itemPrice}円</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

