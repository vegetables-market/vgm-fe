"use client";

import { useRef, useEffect } from "react";

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="p-8">
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 className="mb-4 text-2xl font-bold">Search</h1>
      <input
        ref={inputRef}
        type="text"
        className="h-10 w-[90%] rounded border border-gray-300 bg-blue-300 px-3"
        placeholder="検索..."
        onFocus={handleInputFocus}
        autoComplete="off"
      />
    </div>
  );
}
