"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

import { HiOutlineHome } from "react-icons/hi";
import { FaMagnifyingGlass, FaRegHeart } from "react-icons/fa6";
import { IoGridOutline, IoCartOutline } from "react-icons/io5";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { totalItems } = useCart();

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("harvest_is_logged_in"));
  }, []);

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      sessionStorage.removeItem("harvest_is_logged_in");
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* 1. ロゴ & ナビゲーション */}
        <div className="flex items-center gap-8">
          <Link
            href="/vgm-fe/public"
            className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-green-800"
          >
            Harvest
          </Link>
          <nav className="hidden gap-6 text-sm font-bold text-stone-500 md:flex">
            <Link
              href="/vgm-fe/public"
              className="flex items-center gap-1 transition hover:text-green-700"
            >
              <HiOutlineHome className="text-lg" />
              ホーム
            </Link>
            <Link
              href="/menu"
              className="flex items-center gap-1 transition hover:text-green-700"
            >
              <IoGridOutline className="text-lg" />
              メニュー
            </Link>
          </nav>
        </div>

        {/* 2. 右側のエリア */}
        <div className="flex items-center gap-4">
          {/* お気に入り */}
          <Link
            href="/favorites"
            className="relative p-2 text-stone-400 transition hover:text-green-700"
          >
            <FaRegHeart className="h-6 w-6" />
          </Link>

          {/* アイコン「ショッピングカート」 */}
          <Link
            href="/basket"
            className="relative p-2 text-stone-400 transition hover:text-green-700"
          >
            <IoCartOutline className="h-6 w-6" />
            {/* カートに商品が入っていたらバッジを表示 */}
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* 検索バー */}
          <div className="hidden w-48 items-center rounded-full bg-stone-100 px-4 py-2 transition focus-within:ring-2 focus-within:ring-green-200 md:flex lg:w-64">
            <FaMagnifyingGlass className="mr-2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="検索..."
              className="w-full border-none bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none"
            />
          </div>

          {/* ユーザーメニュー */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 transition hover:opacity-80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-200 bg-green-100 text-sm font-bold text-green-700">
                  G
                </div>
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-stone-100 bg-white py-1 shadow-xl"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        マイページ
                      </Link>
                      <Link
                        href="/basket"
                        className="block px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        カートを見る
                      </Link>
                      <div className="mx-4 my-1 h-px bg-stone-100"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50"
                      >
                        ログアウト
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              W
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-stone-800 px-5 py-2 text-sm font-bold text-white transition hover:bg-stone-700"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
