"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { HiHome, HiOutlineHome } from "react-icons/hi";
import { FaMagnifyingGlass, FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoCart, IoGridOutline, IoCartOutline, IoGrid } from "react-icons/io5";

const TabletLeftNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [animatingItem, setAnimatingItem] = useState<string | null>(null);

  const navItems = [
    {
      href: "/",
      iconOff: HiOutlineHome,
      iconOn: HiHome,
      label: "ホーム",
    },
    {
      href: "/search",
      iconOff: FaMagnifyingGlass,
      iconOn: FaMagnifyingGlass,
      label: "探す",
      isSearchButton: true,
    },
    {
      href: "/basket",
      iconOff: IoCartOutline,
      iconOn: IoCart,
      label: "カゴ",
    },
    {
      href: "/favorites",
      iconOff: FaRegHeart,
      iconOn: FaHeart,
      label: "お気に入り",
    },
    {
      href: "/menu",
      iconOff: IoGridOutline,
      iconOn: IoGrid,
      label: "メニュー",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleNavClick = (item: (typeof navItems)[0]) => {
    const active = isActive(item.href);

    // アニメーションをトリガー
    setAnimatingItem(item.href);
    setTimeout(() => {
      setAnimatingItem(null);
    }, 400);

    // 検索ボタンの特殊処理
    if (item.isSearchButton) {
      if (active) {
        // 2回目：検索ページにいる場合、inputにフォーカス
        const searchInputRef = (window as any).searchInputRef;
        if (searchInputRef?.current) {
          const input = searchInputRef.current;
          input.focus();
          input.click();
        }
      } else {
        // 1回目：検索ページにいないので、遷移する
        router.push(item.href);
      }
    } else {
      router.push(item.href);
    }
  };

  return (
    <nav className="sticky top-0 block h-dvh w-1/4 shrink-0 overflow-y-auto border-r border-slate-100 bg-white p-6">
      <style>{`
        @keyframes bounce-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-bounce-icon {
          animation: bounce-icon 0.4s ease-in-out;
        }
      `}</style>

      <div className="flex h-full flex-col">
        {/* ロゴエリア */}
        <div className="mt-2 mb-10 px-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-800">
            GrandMarket
          </h1>
        </div>

        {/* ナビゲーションリスト */}
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.iconOn : item.iconOff;
            const isAnimating = animatingItem === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all ${
                  active
                    ? "bg-green-50 font-bold text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div
                  className={`relative ${isAnimating ? "animate-bounce-icon" : ""}`}
                >
                  <Icon
                    className={`text-2xl transition-transform group-hover:scale-105 ${active ? "" : "opacity-80"}`}
                  />
                </div>
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabletLeftNavigation;
