import React from "react";
import Link from "next/link"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center text-white font-bold">
                        <img src="/icons/vgm-icon.svg" alt="GrandMarket Logo" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">GrandMarket</h1>
                </Link>
            </div>

            <div className="flex-1 max-w-md mx-6">
                <input
                    type="text"
                    placeholder="商品を検索..."
                    className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
            </div>

            <div className="flex items-center gap-6 text-gray-600">
                {/* 出品ボタン */}
                <Link
                    href="/listing"
                    className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-md hover:bg-red-600 transition-colors shadow-sm"
                >
                    出品
                </Link>
                <button className="flex items-center gap-1 hover:text-amber-600 transition-colors">
                    <span className="material-icons-outlined">shopping_cart</span>
                    <span className="text-sm font-medium">カート</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-300">
                    {/* アイコン画像のプレースホルダー */}
                    <img src="https://placehold.co/100" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>

    )
};

export default Header;

