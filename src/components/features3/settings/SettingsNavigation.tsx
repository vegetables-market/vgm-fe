"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUser,
  FaLock,
  FaBell,
  FaCreditCard,
  FaTruck,
  FaTrash,
} from "react-icons/fa";

type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  danger?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    href: "/settings",
    label: "ホーム",
    icon: FaHome,
    iconBgColor: "bg-blue-400",
  },
  {
    href: "/settings/profile",
    label: "プロフィール",
    icon: FaUser,
    iconBgColor: "bg-purple-400",
  },
  {
    href: "/settings/security",
    label: "セキュリティ",
    icon: FaLock,
    iconBgColor: "bg-green-400",
  },
  {
    href: "/settings/notifications",
    label: "通知設定",
    icon: FaBell,
    iconBgColor: "bg-yellow-400",
  },
  {
    href: "/settings/payment",
    label: "支払い方法",
    icon: FaCreditCard,
    iconBgColor: "bg-pink-400",
  },
  {
    href: "/settings/shipping",
    label: "配送設定",
    icon: FaTruck,
    iconBgColor: "bg-indigo-400",
  },
  {
    href: "/settings/delete-account",
    label: "アカウント削除",
    icon: FaTrash,
    iconBgColor: "bg-red-400",
    danger: true,
  },
];

export default function SettingsNavigation() {
  const pathname = usePathname();

  return (
    <div className="h-full p-6">
      <nav className="space-y-2">
        <h2 className="mb-4 text-2xl font-bold">設定</h2>
        <div className="w-full">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/settings" && pathname.startsWith(item.href));
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:bg-disabled flex h-14 w-fit items-center gap-3 rounded-full p-2 pr-4 transition-all ${
                  isActive ? "bg-surface" : ""
                } ${item.danger ? "hover:opacity-90" : ""}`}
              >
                <div
                  className={`flex aspect-square h-full items-center justify-center rounded-full ${item.iconBgColor}`}
                >
                  <IconComponent className="text-xl text-white" />
                </div>
                <span
                  className={`font-medium ${item.danger ? "text-red-600" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
