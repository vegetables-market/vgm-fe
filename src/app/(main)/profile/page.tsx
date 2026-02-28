"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api/fetch";
import { getApiUrl } from "@/lib/api/urls";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileMenuList } from "@/components/profile/ProfileMenuList";
import { ItemCard } from "@/components/market/ItemCard";
import { getMyItems } from "@/service/market/stocks/get-my-items";
import type { MyStockItem } from "@/lib/market/stocks/types/my-stock-item";

type ProfileApiResponse = {
    userId?: number;
    username?: string;
    displayName?: string;
    display_name?: string;
    email?: string | null;
    avatarUrl?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
};

type ProfileItemCard = {
    id: string;
    name: string;
    price: number;
    images: string[];
    status: "active" | "sold";
};

function toMediaUrl(imageUrl: string | null) {
    if (!imageUrl) return "/images/no-image.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    const cleanedPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return `${baseUrl}/${cleanedPath}`;
}

function toAvatarUrl(imageUrl: string | null) {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/uploads/")) return `${getApiUrl()}/api${imageUrl}`;

    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
    const baseUrl = mediaUrl.endsWith("/") ? mediaUrl.slice(0, -1) : mediaUrl;
    const cleanedPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return `${baseUrl}/${cleanedPath}`;
}

function mapToProfileItems(items: MyStockItem[]): ProfileItemCard[] {
    return items
        .filter((item) => item.status === 2 || item.status === 3 || item.status === 4)
        .map((item) => ({
            id: item.itemId,
            name: item.name,
            price: item.price,
            images: [toMediaUrl(item.imageUrl)],
            status: item.status === 4 ? "sold" : "active",
        }));
}

export default function ProfilePage() {
    const [myListings, setMyListings] = useState<ProfileItemCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [user, setUser] = useState({
        displayName: "",
        avatarUrl: null as string | null,
        ratingAverage: null as number | null,
        location: "",
        bio: ""
    });

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError("");
            try {
                const [profileResult, myItemsResult] = await Promise.allSettled([
                    fetchApi<ProfileApiResponse>("/v1/user/account/me", { method: "GET", credentials: "include" }),
                    getMyItems(),
                ]);

                if (profileResult.status === "fulfilled") {
                    const profile = profileResult.value;
                    setUser({
                        displayName: profile.displayName ?? profile.display_name ?? "ユーザー",
                        avatarUrl: toAvatarUrl(profile.avatarUrl ?? profile.avatar_url ?? null),
                        ratingAverage: null,
                        location: "",
                        bio: profile.bio ?? "",
                    });
                } else {
                    console.error(profileResult.reason);
                    setError("プロフィール情報の取得に失敗しました");
                }

                if (myItemsResult.status === "fulfilled") {
                    setMyListings(mapToProfileItems(myItemsResult.value));
                } else {
                    console.error(myItemsResult.reason);
                    setError((prev) =>
                        prev
                            ? `${prev} / 出品情報の取得に失敗しました`
                            : "出品情報の取得に失敗しました",
                    );
                }
            } catch (err) {
                console.error(err);
                setError("データ取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, []);

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
                        <Link href="/my/stocks/" className="text-sm font-medium text-emerald-600 hover:underline">商品を管理</Link>
                    </div>

                    {isLoading ? (
                        <div className="rounded-lg bg-white p-8 text-center text-stone-500">読み込み中...</div>
                    ) : error ? (
                        <div className="rounded-lg bg-white p-8 text-center text-red-600">{error}</div>
                    ) : activeItems.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {activeItems.map((item, index) => (
                                <ItemCard
                                    key={item.id ? `listing-${item.id}` : `listing-fallback-${index}`}
                                    item={item}
                                />
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
