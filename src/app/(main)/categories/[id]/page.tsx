'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

interface Category {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
  level: number;
  iconUrl: string | null;
  sortOrder: number;
  children?: Category[];
}

interface Item {
  itemId: number;
  name: string;
  price: number;
  status: number;
  imageUrl: string | null;
  categoryId: number;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Number(params.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // カテゴリー情報取得
    fetchApi<{ categories: Category[] }>('/v1/market/categories', {
      credentials: 'include'
    })
      .then(data => {
        const findCategory = (cats: Category[]): Category | null => {
          for (const cat of cats) {
            if (cat.categoryId === categoryId) return cat;
            if (cat.children) {
              const found = findCategory(cat.children);
              if (found) return found;
            }
          }
          return null;
        };
        const found = findCategory(data.categories || []);
        setCategory(found);
      })
      .catch(err => console.error(err));

    // 在庫検索（カテゴリーフィルター）
    const params = new URLSearchParams({
      category_id: categoryId.toString(),
      page: page.toString(),
      size: '20'
    });

    fetchApi<{ items: Item[]; totalPages: number }>(`/v1/market/items/search?${params}`, {
      credentials: 'include'
    })
      .then(data => {
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryId, page]);

  const getImageUrl = (filename: string | null) => {
    if (!filename) return '/images/no-image.png';
    if (filename.startsWith('http')) return filename;
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8787';
    const baseUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl;
    return `${baseUrl}/${filename}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!category) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">カテゴリーが見つかりませんでした</p>
        <Link href="/categories" className="text-blue-600 hover:underline">
          カテゴリー一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* パンくずリスト */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link href="/categories" className="hover:text-red-600">カテゴリー</Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-gray-800">{category.categoryName}</li>
        </ol>
      </nav>

      {/* カテゴリーヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          {category.iconUrl && <span className="text-4xl">{category.iconUrl}</span>}
          {category.categoryName}
        </h1>
      </div>

      {/* 子カテゴリー */}
      {category.children && category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">サブカテゴリー</h2>
          <div className="flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.categoryId}
                href={`/categories/${child.categoryId}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-red-50 hover:border-red-500 transition-colors text-sm"
              >
                {child.categoryName}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 在庫一覧 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          在庫一覧 ({items.length}件)
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow text-gray-500">
            このカテゴリーの在庫はまだありません
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <Link
                  key={item.itemId}
                  href={`/stocks/${item.itemId}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-red-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  前へ
                </button>
                <span className="px-4 py-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
