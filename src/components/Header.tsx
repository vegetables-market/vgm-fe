"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { totalItems } = useCart();

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem('harvest_is_logged_in'));
  }, []);

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      sessionStorage.removeItem('harvest_is_logged_in');
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* 1. ロゴ & ナビゲーション */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-2xl font-bold text-green-800 tracking-tight flex items-center gap-2">
            Harvest
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-stone-500">
            <Link href="/" className="hover:text-green-700 transition">ホーム</Link>
            <Link href="#" className="hover:text-green-700 transition">市場を見る</Link>
            <Link href="#" className="hover:text-green-700 transition">生産者一覧</Link>
          </nav>
        </div>

        {/* 2. 右側のエリア */}
        <div className="flex items-center gap-4">

          {/* アイコン「ショッピングカート */}
          <Link href="/cart" className="relative p-2 text-stone-400 hover:text-green-700 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* カートに商品が入っていたらバッジを表示 */}
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* 検索バー */}
          <div className="hidden md:flex items-center bg-stone-100 rounded-full px-4 py-2 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-green-200 transition">
            <svg className="w-4 h-4 text-stone-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="検索..." className="bg-transparent border-none outline-none text-sm w-full placeholder-stone-400 text-stone-700" />
          </div>

          {/* 出品ボタン */}
          <Link
            href="/listing"
            className="text-sm font-bold bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-sm"
          >
            出品
          </Link>

          {/* ユーザーメニュー */}
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm border border-green-200">G</div>
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-20 overflow-hidden">
                      <Link href="/profile" className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 font-bold" onClick={() => setIsMenuOpen(false)}>マイページ</Link>
                      <Link href="/cart" className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 font-bold" onClick={() => setIsMenuOpen(false)}>カートを見る</Link>
                      <div className="h-px bg-stone-100 my-1 mx-4"></div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-bold">ログアウト</button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-bold bg-stone-800 text-white px-5 py-2 rounded-full hover:bg-stone-700 transition">ログイン</Link>
          )}
        </div>
      </div>
    </header>
  );
}