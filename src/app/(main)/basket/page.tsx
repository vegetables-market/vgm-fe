"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cartApi } from "@/lib/api/services";
import type { CartResponse } from "@/lib/api/types";

export default function BasketPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await cartApi.updateCartItemQuantity(cartItemId, { quantity: newQuantity });
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert("数量の変更に失敗しました");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (!confirm("商品をカートから削除しますか？")) return;
    setIsUpdating(true);
    try {
      await cartApi.removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert("削除に失敗しました");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getMediaUrl = (url: string | null) => {
    if (!url) return "/images/no-image.png";
    if (url.startsWith("http")) return url;
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${url}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold mb-8">カート</h1>
        <p className="text-gray-500 mb-8">カートに商品が入っていません</p>
        <Link
          href="/products"
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
        >
          商品一覧へ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4">カート</h1>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg shadow-sm"
          >
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
               <Image
                 src={getMediaUrl(item.thumbnailUrl)}
                 alt={item.name}
                 fill
                 className="object-cover"
                 sizes="96px"
                 unoptimized
               />
            </div>

            {/* Info */}
            <div className="flex-1">
              <Link href={`/products/${item.itemId}`} className="font-bold text-lg text-gray-800 hover:text-red-500">
                {item.name}
              </Link>
              <p className="text-red-500 font-bold mt-1">¥{item.price.toLocaleString()}</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-end gap-2 text-gray-800">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <div className="px-3 py-1 min-w-[40px] text-center font-bold">{item.quantity}</div>
                <button
                  onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                  disabled={isUpdating}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item.cartItemId)}
                disabled={isUpdating}
                className="text-sm text-gray-500 hover:text-red-500 underline"
              >
                削除
              </button>
            </div>
            
             <div className="text-right sm:min-w-[100px] text-gray-800">
                  <p className="text-xs text-gray-500">小計</p>
                  <p className="font-bold">¥{item.subtotal.toLocaleString()}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center text-xl font-bold mb-6 text-gray-900">
          <span>合計金額</span>
          <span className="text-red-500">¥{cart.totalAmount.toLocaleString()}</span>
        </div>

        <div className="flex flex-col gap-4">
          <Link
             href="/purchase"
             className="block w-full text-center bg-red-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors shadow-md"
          >
            購入手続きへ進む
          </Link>
          <Link
            href="/products"
            className="block w-full text-center border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            買い物を続ける
          </Link>
        </div>
      </div>
    </div>
  );
}
