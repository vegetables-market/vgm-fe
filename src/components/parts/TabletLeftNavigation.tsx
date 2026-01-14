import React from "react";
import Link from "next/link";
import { FaHouse } from "react-icons/fa6";

const TabletLeftNavigation = () => {
  return (
    <nav className="bg-white h-dvh overline-y-hidden w-1/4 border-r border-slate-100 p-6 sticky top-0">
      <div className="flex flex-col flex-1 h-full">
        <button className="bg-amber-300">
          <Link href="/" className="flex">
            <FaHouse />
            <span>タブレットnavigation</span>
          </Link>
        </button>
        <button className="bg-amber-300">
          <Link href="/" className="flex">
            <FaHouse />
            <span>その他</span>
          </Link>
        </button>
      </div>
      <div className="w-full h-fit">
        <button className="bg-blue-300">見つける</button>
      </div>
    </nav>
  );
};

export default TabletLeftNavigation;
