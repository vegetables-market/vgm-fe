import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

export function ProfileMenuList() {
  const menuItems: MenuItem[] = [
    { label: "注文履歴", href: "/orders" },
    { label: "プロフィール編集", href: "/profile/edit" },
    { label: "売上管理", href: "/sales" },
    { label: "お気に入り一覧", href: "/favorites" },
    { label: "設定", href: "/settings" },
  ];

  return (
    <nav className="mt-4">
      <ul className="divide-y divide-gray-100 border-t border-b border-gray-100 dark:divide-gray-700 dark:border-gray-700">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
              {/* 右矢印アイコン（SVG）*/}
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}