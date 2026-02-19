"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart as fetchCartApi } from "@/services/market/cart/get-cart";
import { updateCartItem } from "@/services/market/cart/update-cart-item";
import { removeFromCart as removeCartItem } from "@/services/market/cart/remove-from-cart";
import type { CartResponse } from "@/types/market/cart";

export default function BasketPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await fetchCartApi();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateCartItem(cartItemId, newQuantity);
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
      await removeCartItem(cartItemId);
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
    const mediaUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${url}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-4 text-center md:p-8">
        <h1 className="mb-8 text-2xl font-bold">カート</h1>
        <p className="mb-8 text-gray-500">カートに商品が入っていません</p>
        <Link
          href="/stocks"
          className="inline-block rounded-lg bg-red-500 px-6 py-3 font-bold text-white transition-colors hover:bg-red-600"
        >
          商品一覧へ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white p-4 md:p-8">
      <h1 className="mb-8 border-b pb-4 text-2xl font-bold text-gray-900">
        カート
      </h1>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex flex-col items-start gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center"
          >
            {/* Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
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
              <Link
                href={`/stocks/${item.itemId}`}
                className="text-lg font-bold text-gray-800 hover:text-red-500"
              >
                {item.name}
              </Link>
              <p className="mt-1 font-bold text-red-500">
                ¥{item.price.toLocaleString()}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-end gap-2 text-gray-800">
              <div className="flex items-center rounded border">
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.cartItemId, item.quantity - 1)
                  }
                  disabled={isUpdating || item.quantity <= 1}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <div className="min-w-[40px] px-3 py-1 text-center font-bold">
                  {item.quantity}
                </div>
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.cartItemId, item.quantity + 1)
                  }
                  disabled={isUpdating}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item.cartItemId)}
                disabled={isUpdating}
                className="text-sm text-gray-500 underline hover:text-red-500"
              >
                削除
              </button>
            </div>

            <div className="text-right text-gray-800 sm:min-w-[100px]">
              <p className="text-xs text-gray-500">小計</p>
              <p className="font-bold">¥{item.subtotal.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="mb-6 flex items-center justify-between text-xl font-bold text-gray-900">
          <span>合計金額</span>
          <span className="text-red-500">
            ¥{cart.totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/purchase"
            className="block w-full rounded-lg bg-red-500 py-4 text-center text-lg font-bold text-white shadow-md transition-colors hover:bg-red-600"
          >
            購入手続きへ進む
          </Link>
          <Link
            href="/stocks"
            className="block w-full rounded-lg border border-gray-300 py-3 text-center text-gray-600 transition-colors hover:bg-gray-50"
          >
            買い物を続ける
          </Link>
        </div>
      </div>
    </div>
  );
}
