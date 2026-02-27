"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, PlusCircle, Leaf, Truck, ShieldCheck, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/debug/ThemeToggle";
import { BottomSheet } from "@/components/ui/BottomSheet";

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-stone-800 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      {/* 1. ヒーローセクション: キャッチコピーとメイン動線 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white px-8 py-24 text-center dark:from-green-950/20 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-block rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Leaf size={48} />
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            農家直送の鮮度を、<br />もっと身近に。
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-stone-500 dark:text-zinc-400">
            GrandMarketは、こだわりの生産者から直接、<br className="hidden md:block" />
            一番美味しい瞬間の食材が届くマーケットプレイスです。
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/stocks" className="flex items-center gap-3 rounded-full bg-green-600 px-12 py-5 text-lg font-bold text-white shadow-xl transition hover:bg-green-700 hover:scale-105 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600">
              <ShoppingBag size={24} /> 商品を見る
            </Link>
            <Link href="/my/stocks/new" className="flex items-center gap-3 rounded-full bg-white px-12 py-5 text-lg font-bold text-green-600 border-2 border-green-600 transition hover:bg-green-50 active:scale-95 dark:bg-transparent dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400/10">
              <PlusCircle size={24} /> 出品する
            </Link>
          </div>
        </div>
      </section>

      {/* 2. カテゴリーセクション: 画像トラブル回避のアイコンスタイル */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold">カテゴリーから探す</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "野菜", icon: "🥬", color: "bg-emerald-50 dark:bg-emerald-900/10" },
              { label: "果物", icon: "🍎", color: "bg-rose-50 dark:bg-rose-900/10" },
              { label: "加工品", icon: "🍯", color: "bg-amber-50 dark:bg-amber-900/10" },
              { label: "その他", icon: "📦", color: "bg-slate-50 dark:bg-slate-800/50" },
            ].map((cat) => (
              <Link key={cat.label} href="/stocks" className={`${cat.color} group rounded-3xl p-10 text-center transition hover:scale-105 hover:shadow-md`}>
                <span className="mb-4 block text-5xl transition group-hover:scale-110">{cat.icon}</span>
                <span className="font-bold text-stone-700 dark:text-zinc-300">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 特徴紹介セクション */}
      <section className="bg-stone-50 px-8 py-20 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: Truck, title: "最短当日発送", desc: "農家から直送されるため、どこよりも新鮮です。" },
              { icon: ShieldCheck, title: "安心の決済システム", desc: "Stripe連携により、支払いは安全に保護されます。" },
              { icon: Menu, title: "使いやすいUI", desc: "直感的な操作で、迷わずお買い物を楽しめます。" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <feature.icon className="mx-auto mb-4 text-green-600 dark:text-green-400" size={40} />
                <h3 className="mb-2 font-bold">{feature.title}</h3>
                <p className="text-sm text-stone-500 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 開発用フッター（元々のボタン類を配置） */}
      <footer className="border-t border-stone-100 bg-white px-8 py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-stone-400">© 2026 GrandMarket Project</p>
            
            <div className="flex flex-wrap items-center gap-4 opacity-40 transition-opacity hover:opacity-100">
              <Link href="/test" className="text-xs font-bold underline">Test Pages</Link>
              <button onClick={() => setIsMenuOpen(true)} className="text-xs font-bold underline">
                UI確認メニュー
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>

      {/* 既存のBottomSheetを保持 */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="デバッグメニュー"
      >
        <div className="space-y-4 pb-8">
          <p className="text-sm text-gray-500 dark:text-zinc-400">開発中の画面一覧です。</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/stocks" className="rounded-xl bg-gray-50 p-4 text-center dark:bg-zinc-800">購入画面</Link>
            <Link href="/my/stocks/new" className="rounded-xl bg-gray-50 p-4 text-center dark:bg-zinc-800">出品画面</Link>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
