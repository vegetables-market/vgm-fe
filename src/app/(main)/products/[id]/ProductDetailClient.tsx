"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";

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

export default function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetail = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi<ProductDetail>(`/v1/market/items/${id}`, {
        credentials: "include",
      });
      setProduct(data);
      setIsLiked(data.item.isLiked);
    } catch (err: any) {
      setError(err.message || "商品の取得に失敗しました");
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
        if (product) {
          setProduct({
            ...product,
            item: {
              ...product.item,
              likesCount: product.item.likesCount - 1,
            },
          });
        }
      } else {
        await fetchApi(`/v1/user/favorites/${id}`, {
          method: "POST",
          credentials: "include",
        });
        setIsLiked(true);
        if (product) {
          setProduct({
            ...product,
            item: {
              ...product.item,
              likesCount: product.item.likesCount + 1,
            },
          });
        }
      }
    } catch (err: any) {
      alert(err.message || "お気に入りの操作に失敗しました");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsProcessing(true);
    try {
      await fetchApi("/v1/market/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: product.item.itemId, quantity: 1 }),
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

  const getMediaUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${url}`;
  };

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <p>{error || "商品が見つかりませんでした"}</p>
        <button onClick={() => router.back()} className="back-button">
          戻る
        </button>
        <style jsx>{`
          .error-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            min-height: 50vh;
          }

          p {
            font-size: 16px;
            margin-bottom: 16px;
            color: #c62828;
          }

          .back-button {
            padding: 12px 24px;
            background: #e53935;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  const item = product.item;
  const sortedImages = [...(item.images || [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const currentImage = sortedImages[selectedImage];

  return (
    <div className="product-detail">
      <div className="header">
        <button onClick={() => router.back()} className="back-button">
          ← 戻る
        </button>
      </div>

      <div className="content">
        <div className="image-section">
          <div className="main-image">
            {currentImage ? (
              <img
                src={getMediaUrl(currentImage.imageUrl) || ""}
                alt={item.title}
              />
            ) : (
              <div className="no-image">画像なし</div>
            )}
          </div>

          {sortedImages.length > 1 && (
            <div className="thumbnails">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.imageId}
                  className={`thumbnail ${idx === selectedImage ? "active" : ""}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={getMediaUrl(img.imageUrl) || ""} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <h1 className="title">{item.title}</h1>
          <div className="price">{formatPrice(item.price)}</div>

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

            <button
              onClick={handleToggleFavorite}
              className={`favorite-button ${isLiked ? "liked" : ""}`}
            >
              {isLiked
                ? `♥ お気に入り解除 (${item.likesCount})`
                : `♡ お気に入り (${item.likesCount})`}
            </button>
          </div>

          <div className="product-description">
            <h2>商品説明</h2>
            <p>{item.description || "説明はありません"}</p>
          </div>

          <div className="product-details">
            <h2>商品情報</h2>
            <dl>
              <dt>カテゴリ</dt>
              <dd>{item.categoryName || "未設定"}</dd>

              <dt>状態</dt>
              <dd>{getConditionText(item.condition)}</dd>

              <dt>ブランド</dt>
              <dd>{item.brand || "未設定"}</dd>

              <dt>重量</dt>
              <dd>{item.weight ? `${item.weight}g` : "未設定"}</dd>

              <dt>送料</dt>
              <dd>{getShippingText(item.shippingPayerType)}</dd>

              <dt>在庫</dt>
              <dd>{item.quantity}</dd>
            </dl>
          </div>

          <div className="seller-section">
            <h2>出品者</h2>
            <div className="seller-card">
              <div className="seller-avatar">
                {item.seller.avatarUrl ? (
                  <img
                    src={getMediaUrl(item.seller.avatarUrl) || ""}
                    alt={item.seller.displayName}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {item.seller.displayName?.[0] || "?"}
                  </div>
                )}
              </div>
              <div className="seller-info">
                <div className="seller-name">{item.seller.displayName}</div>
                <div className="seller-rating">
                  評価:{" "}
                  {item.seller.ratingAverage
                    ? `${item.seller.ratingAverage} (${item.seller.ratingCount}件)`
                    : "評価なし"}
                </div>
              </div>
            </div>
          </div>

          {product.relatedItems?.length > 0 && (
            <div className="related-section">
              <h2>関連商品</h2>
              <div className="related-grid">
                {product.relatedItems.map((rel) => (
                  <div
                    key={rel.itemId}
                    className="related-card"
                    onClick={() => router.push(`/products/${rel.itemId}`)}
                  >
                    <div className="related-image">
                      {rel.thumbnailUrl ? (
                        <img
                          src={getMediaUrl(rel.thumbnailUrl) || ""}
                          alt={rel.title}
                        />
                      ) : (
                        <div className="no-image">画像なし</div>
                      )}
                    </div>
                    <div className="related-info">
                      <div className="related-title">{rel.title}</div>
                      <div className="related-price">
                        {formatPrice(rel.price)}
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
        .product-detail {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .header {
          margin-bottom: 24px;
        }

        .back-button {
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #666;
          padding: 8px 0;
        }

        .content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        @media (max-width: 768px) {
          .content {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .image-section {
          position: sticky;
          top: 24px;
          align-self: start;
        }

        @media (max-width: 768px) {
          .image-section {
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

        .thumbnails {
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
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
          background: #f5f5f5;
        }

        .thumbnail.active {
          border-color: #e53935;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #333;
        }

        .price {
          font-size: 32px;
          font-weight: 800;
          color: #e53935;
          margin-bottom: 24px;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .purchase-button {
          width: 100%;
          padding: 16px;
          background: #e53935;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .purchase-button:hover:not(:disabled) {
          background: #c62828;
        }

        .purchase-button.sold-out {
          background: #999;
          cursor: not-allowed;
        }

        .cart-button {
          width: 100%;
          padding: 16px;
          background: #fff;
          border: 2px solid #e53935;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #e53935;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cart-button:hover:not(:disabled) {
          background: #e53935;
          color: #fff;
        }

        .cart-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .no-image {
          color: #999;
          font-size: 14px;
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
          color: #e53935;
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
