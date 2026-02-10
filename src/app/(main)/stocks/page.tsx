"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";

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
  
  const [products, setProducts] = useState<Product[]>([]);
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
    searchProducts();
  }, [searchParams]);

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

  return (
    <div className="products-page">
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
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.itemId}
                className="product-card"
                onClick={() => router.push(`/stocks/${product.itemId}`)}
              >
                <div className="product-image">
                  {product.thumbnailUrl ? (
                    <img src={product.thumbnailUrl} alt={product.title} />
                  ) : (
                    <div className="no-image">画像なし</div>
                  )}
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
              <p>在庫が見つかりませんでした</p>
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
          color: #333;
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
