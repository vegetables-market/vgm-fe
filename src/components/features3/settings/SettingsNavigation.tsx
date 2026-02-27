"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsNavigationItem } from "@/constants/settings-navigation";

type SettingsNavigationProps = {
  items: SettingsNavigationItem[];
};

export default function SettingsNavigation({ items }: SettingsNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="h-full p-6">
      <nav className="space-y-2">
        <h2 className="mb-4 text-2xl font-bold">設定</h2>
        <div className="w-full">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/settings" && pathname.startsWith(item.href));
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:bg-disabled flex h-14 w-fit items-center gap-3 rounded-full p-2 pr-4 transition-all ${isActive ? "bg-surface" : ""
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
