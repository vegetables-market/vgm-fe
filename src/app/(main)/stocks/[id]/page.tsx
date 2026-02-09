"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/api-client";

interface ProductDetail {
  item: {
    itemId: number;
    title: string;
    description: string | null;
    price: number;
    quantity: number;
    categoryId: number | null;
    categoryName: string | null;
    condition: number;
    status: number;
    likesCount: number;
    isLiked: boolean;
    brand: string | null;
    weight: number | null;
    shippingPayerType: number;
    images: Array<{
      imageId: number;
      imageUrl: string;
      displayOrder: number;
    }>;
    seller: {
      userId: number;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      ratingAverage: number | null;
      ratingCount: number;
    };
    createdAt: string;
    updatedAt: string;
  };
  relatedItems: Array<{
    itemId: number;
    title: string;
    price: number;
    thumbnailUrl: string | null;
  }>;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const loginRedirect = (target: string) => `/login?redirect_to=${encodeURIComponent(target)}`;

  useEffect(() => {
    fetchProductDetail();
  }, [params.id]);

  const fetchProductDetail = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi<ProductDetail>(
        `/v1/market/items/${params.id}`,
        { credentials: "include" }
      );
      setProduct(data);
      setIsLiked(data.item.isLiked);
    } catch (err: any) {
      setError(err.message || "在庫の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isLiked) {
        await fetchApi(`/v1/user/favorites/${params.id}`, {
          method: "DELETE",
          credentials: "include"
        });
        setIsLiked(false);
        if (product) {
          setProduct({
            ...product,
            item: {
              ...product.item,
              likesCount: product.item.likesCount - 1
            }
          });
        }
      } else {
        await fetchApi(`/v1/user/favorites/${params.id}`, {
          method: "POST",
          credentials: "include"
        });
        setIsLiked(true);
        if (product) {
          setProduct({
            ...product,
            item: {
              ...product.item,
              likesCount: product.item.likesCount + 1
            }
          });
        }
      }
    } catch (err: any) {
      if (err?.status === 401) {
        router.push(loginRedirect(`/stocks/${params.id}`));
        return;
      }
      alert(err.message || "お気に入りの操作に失敗しました");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY"
    }).format(price);
  };

  const getConditionText = (condition: number) => {
    const conditions = ["新品", "未使用に近い", "目立った傷や汚れなし", "やや傷や汚れあり", "傷や汚れあり", "全体的に状態が悪い"];
    return conditions[condition] || "不明";
  };

  const getShippingText = (type: number) => {
    return type === 0 ? "送料込み（出品者負担）" : "着払い（購入者負担）";
  };

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <p>{error || "在庫が見つかりませんでした"}</p>
        <button onClick={() => router.push("/stocks")} className="back-button">
          在庫一覧に戻る
        </button>
      </div>
    );
  }

  const { item, relatedItems } = product;

  return (
    <div className="product-detail-page">
      <div className="product-container">
        {/* 画像ギャラリー */}
        <div className="image-gallery">
          <div className="main-image">
            {item.images.length > 0 ? (
              <img
                src={item.images[selectedImage].imageUrl}
                alt={item.title}
              />
            ) : (
              <div className="no-image">画像なし</div>
            )}
          </div>
          {item.images.length > 1 && (
            <div className="thumbnail-list">
              {item.images.map((image, index) => (
                <div
                  key={image.imageId}
                  className={`thumbnail ${index === selectedImage ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.imageUrl} alt={`${item.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 商品情報 */}
        <div className="product-info">
          <h1 className="product-title">{item.title}</h1>
          <div className="product-price">{formatPrice(item.price)}</div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="likes-count">♥ {item.likesCount}</span>
            </div>
            {item.categoryName && (
              <div className="meta-item">
                <span className="category">{item.categoryName}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`favorite-button ${isLiked ? "liked" : ""}`}
          >
            {isLiked ? "♥ お気に入り解除" : "♡ お気に入りに追加"}
          </button>

          <div className="product-description">
            <h2>在庫説明</h2>
            <p>{item.description || "説明はありません"}</p>
          </div>

          <div className="product-details">
            <h2>在庫詳細</h2>
            <dl>
              <dt>在庫の状態</dt>
              <dd>{getConditionText(item.condition)}</dd>
              {item.brand && (
                <>
                  <dt>ブランド</dt>
                  <dd>{item.brand}</dd>
                </>
              )}
              {item.weight && (
                <>
                  <dt>重量</dt>
                  <dd>{item.weight}g</dd>
                </>
              )}
              <dt>配送料の負担</dt>
              <dd>{getShippingText(item.shippingPayerType)}</dd>
            </dl>
          </div>

          {/* 出品者情報 */}
          <div className="seller-section">
            <h2>出品者</h2>
            <div className="seller-card">
              <div className="seller-avatar">
                {item.seller.avatarUrl ? (
                  <img src={item.seller.avatarUrl} alt={item.seller.displayName} />
                ) : (
                  <div className="avatar-placeholder">
                    {item.seller.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="seller-info">
                <div className="seller-name">{item.seller.displayName}</div>
                {item.seller.ratingAverage !== null && (
                  <div className="seller-rating">
                    ⭐ {item.seller.ratingAverage.toFixed(1)} ({item.seller.ratingCount}件)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 関連商品 */}
      {relatedItems.length > 0 && (
        <div className="related-section">
          <h2>関連在庫</h2>
          <div className="related-grid">
            {relatedItems.map((related) => (
              <div
                key={related.itemId}
                className="related-card"
                onClick={() => router.push(`/stocks/${related.itemId}`)}
              >
                <div className="related-image">
                  {related.thumbnailUrl ? (
                    <img src={related.thumbnailUrl} alt={related.title} />
                  ) : (
                    <div className="no-image">画像なし</div>
                  )}
                </div>
                <div className="related-info">
                  <div className="related-title">{related.title}</div>
                  <div className="related-price">{formatPrice(related.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .loading,
        .error-page {
          text-align: center;
          padding: 64px 24px;
          color: #999;
        }

        .back-button {
          margin-top: 16px;
          padding: 12px 24px;
          background: #333;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .product-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        @media (max-width: 768px) {
          .product-container {
            grid-template-columns: 1fr;
          }
        }

        .image-gallery {
          position: sticky;
          top: 24px;
          height: fit-content;
        }

        .main-image {
          width: 100%;
          aspect-ratio: 1;
          background: #f5f5f5;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          color: #999;
        }

        .thumbnail-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
        }

        .thumbnail {
          aspect-ratio: 1;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .thumbnail:hover {
          border-color: #ddd;
        }

        .thumbnail.active {
          border-color: #333;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
        }

        .product-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0 0 16px 0;
        }

        .product-price {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
        }

        .product-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
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

        .product-description,
        .product-details,
        .seller-section {
          margin-bottom: 32px;
        }

        .product-description h2,
        .product-details h2,
        .seller-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
        }

        .product-description p {
          color: #666;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .product-details dl {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 12px;
          margin: 0;
        }

        .product-details dt {
          font-weight: 600;
          color: #666;
        }

        .product-details dd {
          margin: 0;
          color: #333;
        }

        .seller-card {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .seller-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seller-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 24px;
          font-weight: 700;
          color: #999;
        }

        .seller-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .seller-rating {
          font-size: 14px;
          color: #666;
        }

        .related-section {
          margin-top: 48px;
        }

        .related-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 0 0 24px 0;
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
      `}</style>
    </div>
  );
}
