"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";

interface StockDetail {
  item: {
    item_id: string;
    title: string;
    description: string | null;
    price: number;
    quantity: number;
    category_id: number | null;
    category_name: string | null;
    condition: number;
    status: number;
    likes_count: number;
    is_liked: boolean;
    brand: string | null;
    weight: number | null;
    shipping_payer_type: number;
    images: Array<{
      image_id: number;
      image_url: string;
      display_order: number;
    }>;
    seller: {
      user_id: number;
      username: string;
      display_name: string;
      avatar_url: string | null;
      rating_average: number | null;
      rating_count: number;
    };
    created_at: string;
    updated_at: string;
  };
  relatedItems: Array<{
    item_id: string;
    title: string;
    price: number;
    thumbnail_url: string | null;
  }>;
}

export default function StocksDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchStockDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchStockDetail = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi<StockDetail>(`/v1/market/items/${id}`, {
        credentials: "include",
      });
      setStock(data);
      setIsLiked(data.item.is_liked);
    } catch (err: any) {
      setError(err.message || "在庫の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isLiked) {
        await fetchApi(`/v1/user/favorites/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setIsLiked(false);
        if (stock) {
          setStock({
            ...stock,
            item: {
              ...stock.item,
              likes_count: stock.item.likes_count - 1,
            },
          });
        }
      } else {
        await fetchApi(`/v1/user/favorites/${id}`, {
          method: "POST",
          credentials: "include",
        });
        setIsLiked(true);
        if (stock) {
          setStock({
            ...stock,
            item: {
              ...stock.item,
              likes_count: stock.item.likes_count + 1,
            },
          });
        }
      }
    } catch (err: any) {
      alert(err.message || "お気に入りの操作に失敗しました");
    }
  };

  const handleAddToCart = async () => {
    if (!stock) return;
    setIsProcessing(true);
    try {
      await fetchApi("/v1/market/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: stock.item.item_id, quantity: 1 }),
        credentials: "include",
      });
      if (confirm("カートに追加しました。カートへ移動しますか？")) {
        router.push("/basket");
      }
    } catch (err: any) {
      alert(err.message || "カートへの追加に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = () => {
    router.push(`/purchase?itemId=${id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  const getConditionText = (condition: number) => {
    const conditions = [
      "新品",
      "未使用に近い",
      "目立った傷や汚れなし",
      "やや傷や汚れあり",
      "傷や汚れあり",
      "全体的に状態が悪い",
    ];
    return conditions[condition] || "不明";
  };

  const getShippingText = (type: number) => {
    return type === 0 ? "送料込み（出品者負担）" : "着払い（購入者負担）";
  };

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error || !stock) {
    return (
      <div className="error-page">
        <p>{error || "在庫が見つかりませんでした"}</p>
        <button onClick={() => router.push("/stocks")} className="back-button">
          在庫一覧に戻る
        </button>
      </div>
    );
  }

  const { item, relatedItems } = stock;

  return (
    <div className="stock-detail-page">
      <div className="stock-container">
        {/* 画像ギャラリー */}
        <div className="image-gallery">
          <div className="main-image">
            {item.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.images[selectedImage].image_url} alt={item.title} />
            ) : (
              <div className="no-image">画像なし</div>
            )}
          </div>
          {item.images.length > 1 && (
            <div className="thumbnail-list">
              {item.images.map((image, index) => (
                <div
                  key={image.image_id}
                  className={`thumbnail ${index === selectedImage ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.image_url} alt={`${item.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 商品情報 */}
        <div className="stock-info">
          <h1 className="stock-title">{item.title}</h1>
          <p className="stock-price">{formatPrice(item.price)}</p>

          <div className="stock-meta">
            <span className="likes-count">♥ {item.likes_count}</span>
            {item.category_name && (
              <span className="category">{item.category_name}</span>
            )}
          </div>

          <div className="actions">
            <button
              onClick={handlePurchase}
              className={`purchase-button ${item.quantity <= 0 ? "sold-out" : ""}`}
              disabled={item.quantity <= 0}
            >
              {item.quantity <= 0 ? "売り切れ" : "購入する"}
            </button>

            <button
              onClick={handleAddToCart}
              className="cart-button"
              disabled={item.quantity <= 0 || isProcessing}
            >
              {isProcessing ? "処理中..." : "カートに追加"}
            </button>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`favorite-button ${isLiked ? "liked" : ""}`}
          >
            {isLiked ? "♥ お気に入り解除" : "♡ お気に入り"}
          </button>

          <div className="stock-description">
            <h2>商品説明</h2>
            <p>{item.description || "説明はありません"}</p>
          </div>

          <div className="stock-details">
            <h2>商品情報</h2>
            <dl>
              <dt>カテゴリ</dt>
              <dd>{item.category_name || "未設定"}</dd>
              <dt>状態</dt>
              <dd>{getConditionText(item.condition)}</dd>
              <dt>ブランド</dt>
              <dd>{item.brand || "未設定"}</dd>
              <dt>重量</dt>
              <dd>{item.weight ? `${item.weight}g` : "未設定"}</dd>
              <dt>送料</dt>
              <dd>{getShippingText(item.shipping_payer_type)}</dd>
              <dt>在庫</dt>
              <dd>{item.quantity}</dd>
            </dl>
          </div>

          {relatedItems?.length > 0 && (
            <div className="related-section">
              <h2>関連商品</h2>
              <div className="related-grid">
                {relatedItems.map((related) => (
                  <div
                    key={related.item_id}
                    className="related-card"
                    onClick={() => router.push(`/stocks/${related.item_id}`)}
                  >
                    <div className="related-image">
                      {related.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={related.thumbnail_url}
                          alt={related.title}
                        />
                      ) : (
                        <div className="no-image">画像なし</div>
                      )}
                    </div>
                    <div className="related-info">
                      <div className="related-title">{related.title}</div>
                      <div className="related-price">
                        {formatPrice(related.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .stock-detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .stock-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        @media (max-width: 768px) {
          .stock-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .image-gallery {
          position: sticky;
          top: 24px;
          align-self: start;
        }

        @media (max-width: 768px) {
          .image-gallery {
            position: static;
          }
        }

        .main-image {
          width: 100%;
          aspect-ratio: 1;
          background: #f5f5f5;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-list {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .thumbnail {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          border: 2px solid transparent;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          background: #f5f5f5;
        }

        .thumbnail.active {
          border-color: #333;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .stock-info {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
        }

        .stock-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0 0 16px 0;
        }

        .stock-price {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
        }

        .stock-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .purchase-button,
        .cart-button {
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .purchase-button {
          background: #111827;
          color: #fff;
        }

        .purchase-button.sold-out {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .cart-button {
          background: #f3f4f6;
          color: #111827;
        }

        .cart-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .actions {
            grid-template-columns: 1fr;
          }
        }

        .likes-count {
          color: #e91e63;
          font-size: 14px;
        }

        .category {
          background: #f5f5f5;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 14px;
          color: #666;
        }

        .favorite-button {
          width: 100%;
          padding: 16px;
          background: #fff;
          border: 2px solid #e91e63;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #e91e63;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 32px;
        }

        .favorite-button.liked {
          background: #e91e63;
          color: #fff;
        }

        .favorite-button:hover {
          opacity: 0.8;
        }

        .stock-description,
        .stock-details {
          margin-bottom: 32px;
        }

        .stock-description h2,
        .stock-details h2,
        .related-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
        }

        .stock-description p {
          color: #666;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .stock-details dl {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 12px;
          margin: 0;
        }

        .stock-details dt {
          font-weight: 600;
          color: #666;
        }

        .stock-details dd {
          margin: 0;
          color: #333;
        }

        .related-section {
          margin-top: 48px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .related-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .related-card:hover {
          transform: translateY(-4px);
        }

        .related-image {
          width: 100%;
          aspect-ratio: 1;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .related-info {
          padding: 12px;
        }

        .related-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .related-price {
          font-size: 16px;
          font-weight: 700;
          color: #333;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #999;
        }
      `}</style>
    </div>
  );
}
