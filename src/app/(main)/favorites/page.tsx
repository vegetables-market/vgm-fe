"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/api-client";

interface Product {
  itemId: number;
  title: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  condition: number;
  status: number;
  likesCount: number;
  thumbnailUrl: string | null;
  seller: {
    userId: number;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

interface PaginatedResponse {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
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
      const data = await fetchApi<PaginatedResponse>(
        `/v1/user/favorites?page=${page}&limit=20`,
        { credentials: "include" },
      );

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

    if (!confirm("お気に入りから削除しますか？")) {
      return;
    }

    // TODO: 削除APIを呼び出す
    try {
      await fetchApi(`/v1/user/favorites/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // 削除成功後、リストから削除
      setProducts((prev) => prev.filter((p) => p.itemId !== itemId));
    } catch (err: any) {
      alert(err.message || "削除に失敗しました");
    }
  };

  // ページネーション処理
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchFavorites(newPage);
    }
  };

  // 商品詳細へ遷移
  const handleProductClick = (itemId: number) => {
    router.push(`/items/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">お気に入り</h1>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            お気に入りはまだありません
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.itemId}
              onClick={() => handleProductClick(product.itemId)}
              className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              {/* サムネイル */}
              <div className="relative aspect-square bg-gray-200">
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

                {/* 削除ボタン */}
                <button
                  onClick={(e) => handleRemoveFavorite(product.itemId, e)}
                  className="absolute top-2 right-2 rounded-full bg-white p-2 text-red-500 shadow-md hover:bg-red-50"
                >
                  ✕
                </button>
              </div>

              {/* 商品情報 */}
              <div className="p-4">
                <h3 className="mb-1 line-clamp-2 font-semibold text-gray-900">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-indigo-600">
                  ¥{product.price.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {product.seller.displayName}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              前へ
            </button>

            <span className="text-gray-600">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
