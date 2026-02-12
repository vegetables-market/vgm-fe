"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/debug/ThemeToggle";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useState } from "react";

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">VGM Top Page</h1>
      <p className="mb-4">Welcome to VGM application.</p>

      <div className="mb-4 flex flex-wrap gap-4">
        <Link
          href="/stock/new"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          出品する
        </Link>
        <Link
          href="/test"
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Test Pages
        </Link>
        <Link
          href="/stocks"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          購入する
        </Link>

        {/* UI確認用ボタン */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          メニュー (UI確認)
        </button>

        <ThemeToggle />
      </div>

      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="メニュー"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            ここにメニューコンテンツが表示されます。
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-gray-800"
              >
                Menu {i}
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Link
              href="/menu"
              className="block w-full rounded-lg bg-gray-900 py-3 text-center text-white dark:bg-gray-700"
            >
              Menuページへ移動
            </Link>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
