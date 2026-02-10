"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// TODO: Implement favorite API
import { favoriteApi } from "@/lib/api/stubs";
import type { ItemResponse } from "@/types/market/item";

export default function FavoritesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ItemResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async (page: number = 1) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await favoriteApi.getFavorites(page, 20);
      setProducts(data.items);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "お気に入りの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (
    itemId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();

    if (!confirm("お気に入りから削除しますか?")) {
      return;
    }

    try {
      await favoriteApi.removeFavorite(itemId);
      // 削除後にリストを更新
      setProducts(products.filter((p) => p.itemId !== itemId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err: any) {
      alert(err.message || "お気に入りの削除に失敗しました");
    }
  };

  const handleProductClick = (itemId: number) => {
    router.push(`/items/${itemId}`);
  };

  return (
    <div className="p-8 pt-24">
      <h1 className="mb-6 text-2xl font-bold">お気に入り</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>
      )}

      {isLoading ? (
        <div className="py-8 text-center">読み込み中...</div>
      ) : products.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          お気に入りの商品はありません
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.itemId}
                onClick={() => handleProductClick(product.itemId)}
                className="cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square bg-gray-100">
                  {product.thumbnailUrl ? (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <button
                    onClick={(e) => handleRemoveFavorite(product.itemId, e)}
                    className="absolute top-2 right-2 rounded-full bg-white p-2 shadow hover:bg-red-50"
                    title="お気に入りから削除"
                  >
                    ❤️
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="truncate font-medium">{product.title}</h3>
                  <p className="text-lg font-bold text-red-600">
                    ¥{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchFavorites(page)}
                  className={`rounded px-4 py-2 ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
