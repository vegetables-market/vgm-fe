"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/api-client";

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

export default function FavoritesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async (page: number = 1) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi<PaginatedResponse>(
        `/v1/user/favorites?page=${page}&limit=20`,
        { credentials: "include" }
      );

      setProducts(data.items);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "お気に入りの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!confirm("お気に入りから削除しますか？")) {
      return;
    }

export default function favoritesPage() {
  return (
    <div className="p-8">
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-2xl font-bold mb-4">favorites</h1>
    </div>
  );
}
