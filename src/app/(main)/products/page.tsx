"use client";

import { useState, useEffect, MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api/api-client";
import { useAuth } from "@/context/AuthContext";

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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState<Set<number>>(new Set());

  // 検索パラメータ
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    searchProducts();
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }
    loadFavorites();
  }, [isAuthenticated]);

  const searchProducts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (keyword) params.append("q", keyword);
      if (categoryId) params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("sort", sort);
      params.append("page", searchParams.get("page") || "1");
      params.append("limit", "20");

      const data = await fetchApi<PaginatedResponse>(
        `/v1/market/items/search?${params.toString()}`,
        { credentials: "include" }
      );

      setProducts(data.items);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "商品の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const limit = 200;
      let page = 1;
      const ids = new Set<number>();

      while (true) {
        const data = await fetchApi<PaginatedResponse>(
          `/v1/user/favorites?page=${page}&limit=${limit}`,
          { credentials: "include" }
        );
        data.items.forEach((item) => ids.add(item.itemId));

        if (page >= data.pagination.totalPages) {
          break;
        }
        page += 1;
      }

      setFavoriteIds(ids);
    } catch (err: any) {
      if (err?.status === 401) {
        setFavoriteIds(new Set());
        return;
      }
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (categoryId) params.append("categoryId", categoryId);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    params.append("sort", sort);
    params.append("page", "1");

    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY"
    }).format(price);
  };

  const getMediaUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${url}`;
  };

  const loginRedirect = (target: string) => `/login?redirect_to=${encodeURIComponent(target)}`;

  const handleToggleFavorite = async (event: MouseEvent, itemId: number) => {
    event.stopPropagation();
    const redirectTarget = `/products/${itemId}`;

    if (!isAuthenticated) {
      router.push(loginRedirect(redirectTarget));
      return;
    }

    if (favoriteLoadingIds.has(itemId)) {
      return;
    }

    setFavoriteLoadingIds((prev) => new Set(prev).add(itemId));

    try {
      if (favoriteIds.has(itemId)) {
        await fetchApi(`/v1/user/favorites/${itemId}`, {
          method: "DELETE",
          credentials: "include"
        });
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        setProducts((prev) =>
          prev.map((product) =>
            product.itemId === itemId
              ? { ...product, likesCount: Math.max(0, product.likesCount - 1) }
              : product
          )
        );
      } else {
        await fetchApi(`/v1/user/favorites/${itemId}`, {
          method: "POST",
          credentials: "include"
        });
        setFavoriteIds((prev) => new Set(prev).add(itemId));
        setProducts((prev) =>
          prev.map((product) =>
            product.itemId === itemId
              ? { ...product, likesCount: product.likesCount + 1 }
              : product
          )
        );
      }
    } catch (err: any) {
      if (err?.status === 401) {
        router.push(loginRedirect(redirectTarget));
        return;
      }
      alert(err.message || "お気に入りの操作に失敗しました");
    } finally {
      setFavoriteLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">商品一覧</h1>
      </div>

      {/* 検索バー */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="商品を検索..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            検索
          </button>
        </div>

        {/* フィルター */}
        <div className="filters">
          <div className="filter-group">
            <label>価格範囲</label>
            <div className="price-range">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="最低価格"
                className="price-input"
              />
              <span>〜</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="最高価格"
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>並び替え</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
            >
              <option value="newest">新着順</option>
              <option value="price_asc">価格が安い順</option>
              <option value="price_desc">価格が高い順</option>
              <option value="popular">人気順</option>
            </select>
          </div>

          <button onClick={handleSearch} className="filter-apply-button">
            適用
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {error && <div className="error-box">{error}</div>}

      {/* ローディング */}
      {isLoading && <div className="loading">読み込み中...</div>}

      {/* 商品一覧 */}
      {!isLoading && (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.itemId}
                className="product-card"
                onClick={() => router.push(`/products/${product.itemId}`)}
              >
                <div className="product-image">
                  {product.thumbnailUrl ? (
                    <img src={getMediaUrl(product.thumbnailUrl) || ""} alt={product.title} />
                  ) : (
                    <div className="no-image">画像なし</div>
                  )}
                  <button
                    className={`favorite-toggle ${favoriteIds.has(product.itemId) ? "liked" : ""}`}
                    onClick={(e) => handleToggleFavorite(e, product.itemId)}
                    disabled={favoriteLoadingIds.has(product.itemId)}
                    title={favoriteIds.has(product.itemId) ? "お気に入り解除" : "お気に入りに追加"}
                    aria-label={favoriteIds.has(product.itemId) ? "お気に入り解除" : "お気に入りに追加"}
                  >
                    {favoriteIds.has(product.itemId) ? "♥" : "♡"}
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <div className="product-meta">
                    <span className="likes-count">♥ {product.likesCount}</span>
                    {product.categoryName && (
                      <span className="category">{product.categoryName}</span>
                    )}
                  </div>
                  <div className="seller-info">
                    <span className="seller-name">{product.seller.displayName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="pagination-button"
              >
                前へ
              </button>
              <span className="pagination-info">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="pagination-button"
              >
                次へ
              </button>
            </div>
          )}

          {products.length === 0 && !isLoading && (
            <div className="no-results">
              <p>商品が見つかりませんでした</p>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .products-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .search-section {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-button {
          padding: 12px 32px;
          background: #e53935;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-button:hover {
          background: #c62828;
        }

        .filters {
          display: flex;
          gap: 16px;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        .price-range {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .price-input {
          width: 120px;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .sort-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          min-width: 150px;
        }

        .filter-apply-button {
          padding: 8px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-apply-button:hover {
          background: #e5e5e5;
        }

        .error-box {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #999;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .product-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .product-image {
          width: 100%;
          height: 200px;
          background: #f5f5f5;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          color: #999;
          font-size: 14px;
        }

        .favorite-toggle {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid #eee;
          background: rgba(255, 255, 255, 0.95);
          color: #e91e63;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
        }

        .favorite-toggle:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
        }

        .favorite-toggle.liked {
          background: #e91e63;
          color: #fff;
          border-color: #e91e63;
        }

        .favorite-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .product-info {
          padding: 16px;
        }

        .product-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-price {
          font-size: 20px;
          font-weight: 700;
          color: #e53935;
          margin: 0 0 12px 0;
        }

        .product-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 8px;
        }

        .likes-count {
          font-size: 12px;
          color: #e91e63;
        }

        .category {
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .seller-info {
          font-size: 12px;
          color: #999;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 32px;
        }

        .pagination-button {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-button:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 14px;
          color: #666;
        }

        .no-results {
          text-align: center;
          padding: 64px 24px;
          color: #999;
        }
      `}</style>
    </div>
  );
}
