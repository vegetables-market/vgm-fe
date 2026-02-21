"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { StockListSort } from "@/lib/market/types/stock-list-sort";
import { useStocks } from "@/hooks/market/use-stocks";

export default function StocksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { result, isLoading, error, searchStocks } = useStocks();

  // 讀懃ｴ｢繝代Λ繝｡繝ｼ繧ｿ
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const categoryId = searchParams.get("categoryId") || "";
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState<StockListSort>(
    (searchParams.get("sort") as StockListSort) || "newest",
  );

  useEffect(() => {
    const rawSort = searchParams.get("sort");
    const page = Number(searchParams.get("page") || "1");
    const resolvedPage = Number.isFinite(page) && page > 0 ? page : 1;

    const load = async () => {
      try {
        await searchStocks({
          keyword: searchParams.get("q") || undefined,
          categoryId: searchParams.get("categoryId") || undefined,
          minPrice: searchParams.get("minPrice") || undefined,
          maxPrice: searchParams.get("maxPrice") || undefined,
          sort: (rawSort as StockListSort) || "newest",
          page: resolvedPage,
          limit: 20,
        });
      } catch {
        // error state is managed in hook
      }
    };

    load();
  }, [searchParams, searchStocks]);

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
    const imagePath = raw?.trim();
    if (!imagePath) return "/images/no-image.png";
    if (imagePath.startsWith("http")) return imagePath;

    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    const cleanedPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    return `${baseUrl}/${cleanedPath}`;
  };

  return (
    <div className="stocks-page">
      <div className="page-header">
        <h1 className="page-title">蝨ｨ蠎ｫ讀懃ｴ｢</h1>
      </div>

      {/* 讀懃ｴ｢繝舌・ */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="蝨ｨ蠎ｫ繧呈､懃ｴ｢..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            讀懃ｴ｢
          </button>
        </div>

        {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
        <div className="filters">
          <div className="filter-group">
            <label>萓｡譬ｼ遽・峇</label>
            <div className="price-range">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="譛菴惹ｾ｡譬ｼ"
                className="price-input"
              />
              <span>〜</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="譛鬮倅ｾ｡譬ｼ"
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>並び替え</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as StockListSort)}
              className="sort-select"
            >
              <option value="newest">新着順</option>
              <option value="price_asc">価格が安い順</option>
              <option value="price_desc">価格が高い順</option>
              <option value="popular">人気順</option>
            </select>
          </div>

          <button onClick={handleSearch} className="filter-apply-button">
            驕ｩ逕ｨ
          </button>
        </div>
      </div>

      {/* 繧ｨ繝ｩ繝ｼ陦ｨ遉ｺ */}
      {error && <div className="error-box">{error}</div>}

      {/* 繝ｭ繝ｼ繝・ぅ繝ｳ繧ｰ */}
      {isLoading && <div className="loading">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div>}

      {/* 蝠・刀荳隕ｧ */}
      {!isLoading && (
        <>
          <div className="stocks-grid">
            {result.items.map((stock) => (
              <div
                key={stock.itemId}
                className="stock-card"
                onClick={() => router.push(`/stocks/${stock.itemId}`)}
              >
                <div className="stock-image">
                  <img
                    src={getImageUrl(
                      stock.thumbnailUrl ?? stock.imageUrl,
                    )}
                    alt={stock.title}
                    onError={(e) => {
                      e.currentTarget.src = "/images/no-image.png";
                    }}
                  />
                </div>
                <div className="stock-info">
                  <h3 className="stock-title">{stock.title}</h3>
                  <p className="stock-price">{formatPrice(stock.price)}</p>
                  <div className="stock-meta">
                    <span className="likes-count">笙･ {stock.likesCount}</span>
                    {stock.categoryName && (
                      <span className="category">{stock.categoryName}</span>
                    )}
                  </div>
                  <div className="seller-info">
                    <span className="seller-name">{stock.seller.displayName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 繝壹・繧ｸ繝阪・繧ｷ繝ｧ繝ｳ */}
          {result.pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(result.pagination.page - 1)}
                disabled={result.pagination.page === 1}
                className="pagination-button"
              >
                蜑阪∈
              </button>
              <span className="pagination-info">
                {result.pagination.page} / {result.pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(result.pagination.page + 1)}
                disabled={result.pagination.page === result.pagination.totalPages}
                className="pagination-button"
              >
                谺｡縺ｸ
              </button>
            </div>
          )}

          {result.items.length === 0 && !isLoading && (
            <div className="no-results">
              <p>蝨ｨ蠎ｫ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆</p>
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
          background: #333;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-button:hover {
          background: #555;
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

        .stocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stock-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
          color: #333;
          margin: 0 0 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .stock-price {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0 0 12px 0;
        }

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

