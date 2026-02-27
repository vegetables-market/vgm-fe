"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileMenuList } from "@/components/profile/ProfileMenuList";
import { ItemCard } from "@/components/market/ItemCard";
import { getMyItems } from "@/service/market/stocks/get-my-items";
import { getImageUrl } from "@/utils/image";
import type { MyStockItem } from "@/lib/market/stocks/types/my-stock-item";
import { useAuth } from "@/context/AuthContext";

// APIレスポンスをItemCard用に変換
const STATUS_MAP: Record<number, string> = { 2: "active", 3: "trading", 4: "sold", 5: "stopped" };

function toCardItem(item: MyStockItem) {
    const imgUrl = item.imageUrl;
    return {
        id: item.itemId.toString(),
        name: item.name || "",
        price: item.price || 0,
        status: STATUS_MAP[item.status] || "unknown",
        images: imgUrl ? [getImageUrl(imgUrl)] : [],
    };
}

export default function ProfilePage() {
    const [myListings, setMyListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user: authUser } = useAuth();

    const user = {
        displayName: authUser?.displayName || "ゲスト",
        avatarUrl: authUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
        ratingAverage: 4.8,
        location: "未設定",
        bio: "よろしくお願いします！"
    };

    useEffect(() => {
        // APIから自分の出品商品を取得
        getMyItems()
            .then((items: MyStockItem[]) => {
                setMyListings(items.map(toCardItem));
            })
            .catch((err: unknown) => {
                console.error("Failed to load my items:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // status: 2=出品中, 3=取引中, 4=売却済, 5=停止中
    const activeItems = myListings.filter((item) => item.status === "active");
    const soldItems = myListings.filter((item) => item.status === "sold");

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-6 pb-16">
                <h1 className="text-xl font-bold text-white text-center">マイページ</h1>
            </div>

            <div className="mx-auto max-w-2xl px-4 -mt-12">
                <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-md">
                    <ProfileHeader user={user} />
                    <ProfileStats stats={{
                        itemsCount: myListings.length,
                        salesCount: soldItems.length,
                        reviewsCount: 0
                    }} />
                </div>

                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-stone-800">
                            出品中の商品
                            <span className="ml-2 text-sm font-normal text-stone-500">({activeItems.length}件)</span>
                        </h2>
                        <Link href="/my/stocks/new" className="text-sm font-medium text-emerald-600 hover:underline">+ 新規出品</Link>
                    </div>

                    {isLoading ? (
                        <div className="rounded-lg bg-white p-8 text-center text-stone-500">読み込み中...</div>
                    ) : activeItems.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {activeItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-white p-8 text-center">
                            <p className="mb-4 text-stone-500">出品中の商品はありません</p>
                            <Link href="/my/stocks/new" className="inline-block rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition hover:bg-emerald-600">
                                出品する
                            </Link>
                        </div>
                    )}
                </section>

                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <ProfileMenuList />
                </div>
            </div>
        </div>
    );
}