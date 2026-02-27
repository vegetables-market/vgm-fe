"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStockImageUrl } from "@/lib/market/stocks/get-image-url";
import type { StockListItem } from "@/lib/market/stocks/types/stock-list-item";
import { getStocks } from "@/service/market/stocks/get-stocks";

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [items, setItems] = useState<StockListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setItems([]);
      setError("");
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await getStocks({ keyword: query, page: 1, limit: 40 });
        if (!cancelled) {
          setItems(result.items);
        }
      } catch (err) {
        console.error("Failed to fetch search results", err);
        if (!cancelled) {
          setItems([]);
          setError("�������ʂ̎擾�Ɏ��s���܂���");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scopedWindow = window as Window & {
        searchInputRef?: typeof inputRef;
      };
      scopedWindow.searchInputRef = inputRef;
    }

    return () => {
      if (typeof window !== "undefined") {
        const scopedWindow = window as Window & {
          searchInputRef?: typeof inputRef;
        };
        scopedWindow.searchInputRef = undefined;
      }
    };
  }, []);

  return (
    <div>
      <h1>�u{query}�v�̌�������: {items.length}��</h1>

      {isLoading && <p>�ǂݍ��ݒ�...</p>}
      {!isLoading && error && <p>{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.itemId} className="rounded border p-4">
            <div className="mb-2 w-1/2 aspect-square overflow-hidden rounded bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getStockImageUrl(item.thumbnailUrl ?? item.imageUrl)}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <p>{item.title}</p>
            <p>{item.price}�~</p>
          </div>
        ))}
      </div>
    </div>
  );
}
