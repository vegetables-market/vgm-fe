"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

import { FaMagnifyingGlass, FaRegHeart } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";

const Header = () => {
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
    <header className="fixed z-50 w-full h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center ">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity pr-3"
        >
          <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center text-white font-bold">
            <img src="/icons/vgm-icon.svg" alt="GrandMarket Logo" />
          </div>
          <h1 className="text-xl font-bold text-gray-700 tracking-tight hidden sm:block">
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
            className="w-full pl-10 pr-4 py-2 rounded-full outline-1 outline-gray-300  bg-transparent hover:bg-green-50 hover:outline-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-green-50   transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-gray-600">
        <div className="flex gap-2">
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
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-300 hover:ring-2 hover:ring-amber-500 transition-all flex items-center justify-center"
            >
              {/* プレースホルダーまたは実際のアイコン */}
              <span className="text-xs font-bold text-gray-500">USER</span>
              {/* <img src="https://placehold.co/100" alt="User" className="w-full h-full object-cover" /> */}
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
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-bold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/basket"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-bold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      カートを見る
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-bold"
                    >
                      ログアウト
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-bold bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
