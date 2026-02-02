'use client';

import { useState, useEffect } from 'react';
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ categories: Category[] }>('/v1/market/categories', {
      credentials: 'include'
    })
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">カテゴリー一覧</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((parentCat) => (
          <div key={parentCat.categoryId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <Link 
                href={`/categories/${parentCat.categoryId}`}
                className="text-xl font-bold text-gray-800 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                {parentCat.iconUrl && <span className="text-2xl">{parentCat.iconUrl}</span>}
                {parentCat.categoryName}
              </Link>
            </div>

            {/* 子カテゴリー */}
            {parentCat.children && parentCat.children.length > 0 && (
              <ul className="space-y-2">
                {parentCat.children.map((childCat) => (
                  <li key={childCat.categoryId}>
                    <Link
                      href={`/categories/${childCat.categoryId}`}
                      className="text-sm text-gray-600 hover:text-red-600 hover:underline transition-colors"
                    >
                      {childCat.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          カテゴリーが見つかりませんでした
        </div>
      )}
    </div>
  );
}
