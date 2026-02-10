"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// TODO: Implement category API
import { categoryApi } from "@/lib/api/stubs";
import type { CategoryResponse } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi
      .getAllCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">カテゴリー一覧</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((parentCat) => (
          <div
            key={parentCat.categoryId}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-4">
              <Link
                href={`/categories/${parentCat.categoryId}`}
                className="flex items-center gap-2 text-xl font-bold text-gray-800 transition-colors hover:text-red-600"
              >
                {parentCat.iconUrl && (
                  <span className="text-2xl">{parentCat.iconUrl}</span>
                )}
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
                      className="text-sm text-gray-600 transition-colors hover:text-red-600 hover:underline"
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
        <div className="py-12 text-center text-gray-500">
          カテゴリーが見つかりませんでした
        </div>
      )}
    </div>
  );
}
