"use client";

import { useIsPWA } from "@/hooks/useIsPWA";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import { HiHome, HiOutlineHome } from "react-icons/hi";
import { FaMagnifyingGlass, FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoCart, IoGridOutline, IoCartOutline, IoGrid } from "react-icons/io5";

const MobileNavigation = () => {
  const isPWA = useIsPWA();
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
        // 2回目：検索ページにいる場合、inputにフォーカスしてキーボードを出す
        // setTimeoutを使わず同期的に呼び出すことで、モバイルブラウザのセキュリティ制約(ユーザー操作必須)をクリアしやすくする
        const searchInputRef = (window as any).searchInputRef;
        if (searchInputRef?.current) {
          const input = searchInputRef.current;
          input.focus();

          // 一部の端末向けの念のための処理（ただしfocusが最優先）
          // focus後にclickすることでイベント発火を促す
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
    <nav
      className={` fixed w-full bottom-0 block lg:hidden bg-white/80 border-t border-slate-100 ${isPWA ? "pb-5" : "pb-0"}`}
    >
      <style>{`
        @keyframes bounce-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-bounce-icon {
          animation: bounce-icon 0.4s ease-in-out;
        }
      `}</style>
      <div className="flex items-center justify-between h-16 max-w-md mx-auto ">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = active ? item.iconOn : item.iconOff;
          const isAnimating = animatingItem === item.href;

          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                active ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              <div
                className={`relative ${isAnimating ? "animate-bounce-icon" : ""}`}
              >
                <Icon className=" text-2xl mb-0.5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
