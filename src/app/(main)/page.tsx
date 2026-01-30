"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function MainPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">VGM Top Page</h1>
      <p className="mb-4">Welcome to VGM application.</p>

      <div className="mb-4 flex gap-4">
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
          href="/products"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          購入する
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
}
