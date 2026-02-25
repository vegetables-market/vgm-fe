"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/fetch";
import { getStockDetail } from "@/service/market/stocks/get-stock-detail";
import type { StockDetail } from "@/lib/market/stocks/types/stock-detail";

export default function StocksDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return fallback;
  };

  const fetchStockDetail = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getStockDetail(id);
      setStock(data);
      setIsLiked(data.item.isLiked);
    } catch (err) {
      setError(getErrorMessage(err, "���i�̎擾�Ɏ��s���܂���"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStockDetail();
  }, [fetchStockDetail]);

  const handleToggleFavorite = async () => {
    if (!stock) return;

    try {
      if (isLiked) {
        await fetchApi(`/v1/user/favorites/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setIsLiked(false);
        setStock({
          ...stock,
          item: {
            ...stock.item,
            likesCount: stock.item.likesCount - 1,
          },
        });
      } else {
        await fetchApi(`/v1/user/favorites/${id}`, {
          method: "POST",
          credentials: "include",
        });
        setIsLiked(true);
        setStock({
          ...stock,
          item: {
            ...stock.item,
            likesCount: stock.item.likesCount + 1,
          },
        });
      }
    } catch (err) {
      alert(getErrorMessage(err, "���C�ɓ��葀��Ɏ��s���܂���"));
    }
  };

  const handleAddToCart = async () => {
    if (!stock) return;

    setIsProcessing(true);
    try {
      await fetchApi("/v1/market/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: stock.item.itemId, quantity: 1 }),
        credentials: "include",
      });
      if (confirm("�J�[�g�ɒǉ����܂����B�J�[�g�ֈړ����܂����H")) {
        router.push("/basket");
      }
    } catch (err) {
      alert(getErrorMessage(err, "�J�[�g�ւ̒ǉ��Ɏ��s���܂���"));
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
      "�V�i",
      "���g�p�ɋ߂�",
      "�ڗ��������≘��Ȃ�",
      "��⏝�≘�ꂠ��",
      "���≘�ꂠ��",
      "�S�̓I�ɏ�Ԃ�����",
    ];
    return conditions[condition] || "�s��";
  };

  const getShippingText = (type: number) => {
    return type === 0 ? "�������݁i�o�i�ҕ��S�j" : "�������i�w���ҕ��S�j";
  };

  const getImageUrl = (raw: string | null | undefined) => {
    const imagePath = raw?.trim();
    if (!imagePath) return "/images/no-image.png";
    if (imagePath.startsWith("http")) return imagePath;
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    const cleanedPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanedPath}`;
  };

  if (isLoading) {
    return <div className="loading">�ǂݍ��ݒ�...</div>;
  }

  if (error || !stock) {
    return (
      <div className="error-page">
        <p>{error || "���i��������܂���ł���"}</p>
        <button onClick={() => router.push("/stocks")} className="back-button">
          ���i�ꗗ�ɖ߂�
        </button>
      </div>
    );
  }

  const { item } = stock;
  const relatedItems = stock.relatedItems;

  return (
    <div className="stock-detail-page">
      <div className="stock-container">
        <div className="image-gallery">
          <div className="main-image">
            {item.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageUrl(item.images[selectedImage].imageUrl)} alt={item.title} />
            ) : (
              <div className="no-image">�摜�Ȃ�</div>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getImageUrl(image.imageUrl)} alt={`${item.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stock-info">
          <h1 className="stock-title">{item.title}</h1>
          <p className="stock-price">{formatPrice(item.price)}</p>

          <div className="stock-meta">
            <span className="likes-count">? {item.likesCount}</span>
            {item.categoryName && <span className="category">{item.categoryName}</span>}
          </div>

          <div className="actions">
            <button
              onClick={handlePurchase}
              className={`purchase-button ${item.quantity <= 0 ? "sold-out" : ""}`}
              disabled={item.quantity <= 0}
            >
              {item.quantity <= 0 ? "����؂�" : "�w������"}
            </button>

            <button
              onClick={handleAddToCart}
              className="cart-button"
              disabled={item.quantity <= 0 || isProcessing}
            >
              {isProcessing ? "������..." : "�J�[�g�ɒǉ�"}
            </button>
          </div>

          <button onClick={handleToggleFavorite} className={`favorite-button ${isLiked ? "liked" : ""}`}>
            {isLiked ? "? ���C�ɓ������" : "? ���C�ɓ���"}
          </button>

          <div className="stock-description">
            <h2>���i����</h2>
            <p>{item.description || "�����͂���܂���"}</p>
          </div>

          <div className="stock-details">
            <h2>���i�ڍ�</h2>
            <dl>
              <dt>�J�e�S���[</dt>
              <dd>{item.categoryName || "���ݒ�"}</dd>
              <dt>���</dt>
              <dd>{getConditionText(item.condition)}</dd>
              <dt>�u�����h</dt>
              <dd>{item.brand || "���ݒ�"}</dd>
              <dt>�d��</dt>
              <dd>{item.weight ? `${item.weight}g` : "���ݒ�"}</dd>
              <dt>����</dt>
              <dd>{getShippingText(item.shippingPayerType)}</dd>
              <dt>�݌�</dt>
              <dd>{item.quantity}</dd>
            </dl>
          </div>

          {relatedItems.length > 0 && (
            <div className="related-section">
              <h2>�֘A���i</h2>
              <div className="related-grid">
                {relatedItems.map((related) => (
                  <div
                    key={related.itemId}
                    className="related-card"
                    onClick={() => router.push(`/stocks/${related.itemId}`)}
                  >
                    <div className="related-image">
                      {related.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImageUrl(related.thumbnailUrl)} alt={related.title} />
                      ) : (
                        <div className="no-image">�摜�Ȃ�</div>
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
