"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [items, setItems] = useState([]);

  useEffect(() => {
  if (!query) return;

  const fetchResults = async () => {
    // 前に作ったエンドポイント api/v1/market/items/search を叩く
    const response = await fetch(`http://localhost:8080/api/v1/market/items/search?name=${encodeURIComponent(query)}`);
    const data = await response.json();
    setItems(data);
    console.log("API Response:", data);
  };

  fetchResults();
}, [query]);

  // グローバルに inputRef を公開してMobileNavigationからアクセス可能にする
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).searchInputRef = inputRef;
    }
    // アンマウント時にクリーンアップ
    return () => {
      if (typeof window !== "undefined") {
        (window as any).searchInputRef = null;
      }
    };
  }, []);

  const handleInputFocus = () => {
    // iOSでのキーボード表示を確実にするための処理
    if (inputRef.current) {
      inputRef.current.click();
      inputRef.current.setSelectionRange(0, 0);
    }
  };

  return (
  <div>
    <h1>「{query}」の検索結果: {items.length}件</h1>
    <div className="grid grid-cols-2 gap-4">
      {items.map((item: any) => (
        <div key={item.f_id} className="border p-4 rounded">
          <p>{item.f_name}</p>
          <p>{item.f_price}円</p>
        </div>
      ))}
    </div>
  </div>
);
}

