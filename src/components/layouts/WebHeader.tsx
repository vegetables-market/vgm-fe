"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { logout } from "@/services/authService";
import { UserInfo } from "@/types/auth";

import { FaMagnifyingGlass, FaRegHeart, FaUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";

export default function WebHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    // localStorageからユーザー情報を取得
    const storedUser = localStorage.getItem("vgm_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }
    
    // ログイン状態の変更を検知するためのイベントリスナー（簡易的）
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("vgm_user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    // カスタムイベント（DebugConsoleなどからの更新用）
    // ※本来はContextで管理すべきだが、今回は簡易実装
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      localStorage.removeItem("vgm_user");
      setUser(null);
      setIsMenuOpen(false);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center ">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity pr-3"
        >
          <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center text-white font-bold">
            <img src="/icons/vgm-icon.svg" alt="GrandMarket Logo" />
          </div>
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-100 tracking-tight hidden sm:block">
            GrandMarket
          </h1>
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
            <FaMagnifyingGlass className="text-gray-400 text-xl group-hover:text-gray-500 group-focus-within:text-emerald-600 group-focus-within:group-hover:text-emerald-600 transition-colors " />
          </div>
          <input
            type="text"
            placeholder="商品を検索..."
            className="w-full pl-10 pr-4 py-2 rounded-full outline-1 outline-gray-300 dark:outline-gray-700 bg-transparent dark:text-white hover:bg-green-50 dark:hover:bg-gray-800 hover:outline-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-green-50 dark:focus:bg-gray-800 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-gray-600 dark:text-gray-300">
        <div className="flex gap-2 items-center">
          {/* お気に入り */}
          <Link
            href="/favorites"
            className="flex flex-col items-center justify-center gap-0.5 hover:text-amber-600 transition-colors"
          >
            <FaRegHeart className="text-xl sm:text-2xl" />
            <span className="text-[8px] font-bold">お気に入り</span>
          </Link>

          {/* カート */}
          <Link
            href="/basket"
            className="flex flex-col items-center justify-center gap-0.5 hover:text-amber-600 transition-colors"
          >
            <div className="relative">
              <IoCartOutline className="text-xl sm:text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[8px] font-bold">カート</span>
          </Link>
        </div>

        {/* ユーザーメニュー */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer border border-gray-300 dark:border-gray-700 hover:ring-2 hover:ring-amber-500 transition-all flex items-center justify-center"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-500 dark:text-gray-400" />
              )}
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
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.display_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      設定
                    </Link>
                    
                    <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1 mx-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold"
                    >
                      ログアウト
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold bg-gray-800 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="hidden sm:block text-xs sm:text-sm font-bold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            >
              新規登録
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
