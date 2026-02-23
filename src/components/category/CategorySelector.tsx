"use client";

import { useState, useEffect } from "react";

interface Category {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
  level: number;
  iconUrl: string | null;
  sortOrder: number;
  children?: Category[];
}

interface CategorySelectorProps {
  value: number | "";
  onChange: (categoryId: number) => void;
  required?: boolean;
  className?: string;
}

export default function CategorySelector({
  value,
  onChange,
  required,
  className,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<number | "">("");

  useEffect(() => {
    fetch("/v1/market/categories", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setLoading(false);
      });
  }, []);

  // 選択されたカテゴリーから親を特定
  useEffect(() => {
    if (value && categories.length > 0) {
      const findParent = (cats: Category[]): number | "" => {
        for (const cat of cats) {
          if (cat.categoryId === value) {
            return cat.parentId || "";
          }
          if (cat.children) {
            const found = findParent(cat.children);
            if (found !== "") return cat.categoryId;
          }
        }
        return "";
      };
      const parent = findParent(categories);
      setSelectedParent(parent);
    }
  }, [value, categories]);

  const handleParentChange = (parentId: string) => {
    setSelectedParent(parentId === "" ? "" : Number(parentId));
    // 親カテゴリー変更時は子カテゴリーをクリア
    if (onChange) onChange(0);
  };

  const handleChildChange = (childId: string) => {
    if (childId && onChange) {
      onChange(Number(childId));
    }
  };

  // 親カテゴリー一覧
  const parentCategories = categories;

  // 選択された親の子カテゴリー一覧
  const childCategories = selectedParent
    ? categories.find((c) => c.categoryId === selectedParent)?.children || []
    : [];

  if (loading) {
    return <div className="text-sm text-gray-500">カテゴリー読み込み中...</div>;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 親カテゴリー選択 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            大カテゴリー {required && <span className="text-red-500">*</span>}
          </label>
          <select
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={selectedParent}
            onChange={(e) => handleParentChange(e.target.value)}
            required={required}
          >
            <option value="">選択してください</option>
            {parentCategories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.iconUrl && `${cat.iconUrl} `}
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* 子カテゴリー選択 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            小カテゴリー {required && <span className="text-red-500">*</span>}
          </label>
          <select
            className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            value={value}
            onChange={(e) => handleChildChange(e.target.value)}
            disabled={!selectedParent || childCategories.length === 0}
            required={required}
          >
            <option value="">
              {!selectedParent
                ? "大カテゴリーを選択してください"
                : "選択してください"}
            </option>
            {childCategories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {selectedParent && childCategories.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">
              このカテゴリーには小カテゴリーがありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
