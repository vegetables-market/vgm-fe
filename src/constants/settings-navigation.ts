import {
    FaHome,
    FaUser,
    FaLock,
    FaBell,
    FaCreditCard,
    FaTruck,
    FaTrash,
} from "react-icons/fa";

export type SettingsNavigationItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBgColor: string;
    danger?: boolean;
};

export const SETTINGS_NAVIGATION_ITEMS: SettingsNavigationItem[] = [
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
