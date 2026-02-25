"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";

interface StockItem {
  item_id: string;
  title: string;
  description: string | null;
  price: number;
  category_id: number | null;
  category_name: string | null;
  condition: number;
  status: number;
  likes_count: number;
  thumbnail_url: string | null;
  thumbnailUrl?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  seller: {
    user_id: number;
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  created_at: string;
}

interface PaginatedResponse {
  items: StockItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function StocksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 検索パラメータ
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const categoryId = searchParams.get("categoryId") || "";
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    searchStocks();
  }, [searchParams]);

  const searchStocks = async () => {
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
        `/api/v1/market/items/search?${params.toString()}`,
        { credentials: "include" }
      );

      setStocks(data.items);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "在庫の取得に失敗しました");
    } finally {
      setIsLoading(false);
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

    router.push(`/stocks?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/stocks?${params.toString()}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY"
    }).format(price);
  };

  const getImageUrl = (raw: string | null | undefined) => {
    if (!raw) return "/images/no-image.png";
    if (raw.startsWith("http")) return raw;

    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${raw}`;
  };

  return (
    <div className="stocks-page">
      <div className="page-header">
        <h1 className="page-title">在庫検索</h1>
      </div>

      {/* 検索バー */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="在庫を検索..."
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
          <div className="stocks-grid">
            {stocks.map((stock) => (
              <div
                key={stock.item_id}
                className="stock-card"
                onClick={() => router.push(`/stocks/${stock.item_id}`)}
              >
                <div className="stock-image">
                  <img
                    src={getImageUrl(
                      stock.thumbnail_url ??
                      stock.thumbnailUrl ??
                      stock.image_url ??
                      stock.imageUrl,
                    )}
                    alt={stock.title}
                  />
                </div>
                <div className="stock-info">
                  <h3 className="stock-title">{stock.title}</h3>
                  <p className="stock-price">{formatPrice(stock.price)}</p>
                  <div className="stock-meta">
                    <span className="likes-count">♥ {stock.likes_count}</span>
                    {stock.category_name && (
                      <span className="category">{stock.category_name}</span>
                    )}
                  </div>
                  <div className="seller-info">
                    <span className="seller-name">{stock.seller.display_name}</span>
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

          {stocks.length === 0 && !isLoading && (
            <div className="no-results">
              <p>在庫が見つかりませんでした</p>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .stocks-page {
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
          color: #1c1c1c;
          margin: 0;
        }
        :global(.dark) .page-title { color: #f4f4f5; }

        .search-section {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        :global(.dark) .search-section {
          background: #18181b;
          border-color: #27272a;
          box-shadow: none;
        }
        .search-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-input, .price-input, .sort-select {
          flex: 1;
          padding: 12px 16px;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #1c1c1c; /* ライトモード時の文字色 */
        }
        :global(.dark) .search-input,
        :global(.dark) .price-input,
        :global(.dark) .sort-select {
          background: #27272a;
          border-color: #3f3f46;
          color: #f4f4f5; /* ダークモード時の文字色 */
        }
        .search-button {
          padding: 12px 32px;
          background: #18181b;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        :global(.dark) .search-button {
          background: #f4f4f5;
          color: #18181b;
        }

        :global(.dark) .search-button:hover {
          background: #e4e4e7;
          opacity: 0.9;
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
          color: #18181b;
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

        .stocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stock-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        :global(.dark) .stock-card {
          background: #18181b;
          border-color: #27272a;
        }

        .stock-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stock-image {
          width: 100%;
          height: 200px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stock-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          color: #999;
          font-size: 14px;
        }

        .stock-info {
          padding: 16px;
        }

        .stock-title {
          font-size: 16px;
          font-weight: 600;
          color: #1c1c1c;
          margin: 0 0 8px 0;
        }
        :global(.dark) .stock-title { color: #f4f4f5; }

        .stock-price {
          font-size: 20px;
          font-weight: 700;
          color: #dc2626;
          margin: 0 0 12px 0;
        }
        :global(.dark) .stock-price { color: #ef4444; }

        .stock-meta {
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
