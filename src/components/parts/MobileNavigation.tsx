import React from "react";

const MobileNavigation = () => {
    return (
        <nav className="w-full fixed bottom-0 block lg:hidden">
            <nav className="flex items-center justify-around h-16 max-w-md mx-auto ">
                <button className="flex flex-col items-center justify-center w-full h-full transition-all text-emerald-600">
                    <div className="relative"><i className="fa-solid fa-house text-xl mb-0.5"></i></div>
                    <span className="text-[10px] font-medium">ホーム</span></button>
                <button className="flex flex-col items-center justify-center w-full h-full transition-all text-slate-400">
                    <div className="relative"><i className="fa-solid fa-magnifying-glass text-xl mb-0.5"></i></div>
                    <span className="text-[10px] font-medium">探す</span></button>
                <button className="flex flex-col items-center justify-center w-full h-full transition-all relative -top-4">
                    <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 ring-4 ring-white">
                        <i className="fa-solid fa-camera text-lg"></i></div>
                    <span className="text-[10px] font-bold text-emerald-600 mt-5">出品</span></button>
                <button className="flex flex-col items-center justify-center w-full h-full transition-all text-slate-400">
                    <div className="relative"><i className="fa-solid fa-basket-shopping text-xl mb-0.5"></i></div>
                    <span className="text-[10px] font-medium">カゴ</span></button>
                <button className="flex flex-col items-center justify-center w-full h-full transition-all text-slate-400">
                    <div className="relative"><i className="fa-solid fa-user text-xl mb-0.5"></i></div>
                    <span className="text-[10px] font-medium">マイページ</span></button>
            </nav>

        </nav>
    )
        ;
};


export default MobileNavigation;

