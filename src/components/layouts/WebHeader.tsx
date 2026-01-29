"use client";

import { useState, useEffect } from "react";
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
    <header className="border-border sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center gap-3 pr-3 transition-transform duration-300 hover:scale-102"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl font-bold">
            <img src="/icons/vgm-icon.svg" alt="GrandMarket Logo" />
          </div>
          <h1 className="hidden text-xl font-bold tracking-tight sm:block">
            GrandMarket
          </h1>
        </Link>
      </div>

      <div className="mx-6 block h-10 max-w-md flex-1 items-center">
        <div className="relative flex h-10 items-center">
          {/*<FaMagnifyingGlass className=" text-xl text-gray-400 transition-colors group-focus-within:text-emerald-600 group-hover:text-gray-500 group-focus-within:group-hover:text-emerald-600" />*/}

          {/*<div className="  flex items-center pointer-events-none ">*/}
          {/*  <FaMagnifyingGlass className="text-gray-400 text-xl group-hover:text-gray-500 group-focus-within:text-emerald-600 group-focus-within:group-hover:text-emerald-600 transition-colors " />*/}
          {/*</div>*/}
          {/*<input*/}
          {/*  type="text"*/}
          {/*  placeholder="商品を検索..."*/}
          {/*  className=" w-full py-2 pr-4 pl-10 outline-1 outline-gray-300 transition-all  hover:outline-gray-400 focus:bg-green-50 focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:text-white dark:outline-gray-700 dark:hover:bg-gray-800 dark:focus:bg-gray-800"*/}
          {/*/>*/}
          <input
            type="search"
            placeholder="商品を検索..."
            className="peer absolute z-30 h-full w-full rounded-full py-2 pr-4 pl-10 outline-none placeholder:text-neutral-400"
          />
          <FaMagnifyingGlass className="peer-focus:text-primary pointer-events-none absolute left-3 z-20 transition-all duration-200 dark:text-neutral-400 peer-hover:dark:text-white" />
          <div className="peer-hover:bg-muted-foreground bg-muted peer-focus:border-primary peer-focus:bg-muted-foreground z-10 h-full w-full rounded-full border transition-all duration-200 peer-hover:border-neutral-600 peer-focus:border-2 dark:border-neutral-800"></div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-600 sm:gap-6 dark:text-gray-300">
        <div className="flex items-center gap-2">
          {/* お気に入り */}
          <Link
            href="/favorites"
            className="flex flex-col items-center justify-center gap-0.5 transition-colors hover:text-amber-600"
          >
            <FaRegHeart className="text-xl sm:text-2xl" />
            <span className="text-[8px] font-bold">お気に入り</span>
          </Link>

          {/* カート */}
          <Link
            href="/basket"
            className="flex flex-col items-center justify-center gap-0.5 transition-colors hover:text-amber-600"
          >
            <div className="relative">
              <IoCartOutline className="text-xl sm:text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[8px] font-bold text-white">
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
              className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 transition-all hover:ring-2 hover:ring-amber-500 dark:border-gray-700 dark:bg-gray-800"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="h-full w-full object-cover"
                />
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
                    className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                        {user.display_name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      設定
                    </Link>

                    <div className="mx-2 my-1 h-px bg-gray-100 dark:bg-zinc-800"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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
              className="rounded-full bg-gray-800 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 sm:text-sm dark:bg-white dark:text-black"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 sm:block sm:text-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
              新規登録
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
