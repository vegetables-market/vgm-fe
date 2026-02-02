"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedContent from "@/components/features/auth/ProtectedContent";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { href: "/settings", label: "設定トップ", icon: "⚙️" },
  { href: "/settings/profile", label: "プロフィール", icon: "👤" },
  { href: "/settings/security", label: "セキュリティ", icon: "🔒" },
  { href: "/settings/notifications", label: "通知設定", icon: "🔔" },
  { href: "/settings/payment", label: "支払い方法", icon: "💳" },
  { href: "/settings/shipping", label: "配送設定", icon: "📦" },
  { href: "/settings/delete-account", label: "アカウント削除", icon: "🗑️", danger: true },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <ProtectedContent>
      <div className="settings-container">
        {/* 左サイドバーナビゲーション */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            <h2 className="settings-nav-title">設定</h2>
            <ul className="settings-nav-list">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/settings" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`settings-nav-item ${isActive ? "active" : ""}`}
                    >
                      <span className="settings-nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* 中央コンテンツエリア */}
        <main className="settings-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .settings-container {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          min-height: calc(100vh - 120px);
          padding: 24px 16px;
          gap: 32px;
        }

        .settings-sidebar {
          position: sticky;
          top: 90px;
          width: 240px;
          flex-shrink: 0;
          height: fit-content;
        }

        .settings-nav {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 20px 0;
        }

        .settings-nav-title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          padding: 0 20px 16px;
          border-bottom: 1px solid #eee;
          margin-bottom: 8px;
        }

        .settings-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .settings-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          color: #555;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .settings-nav-item:hover {
          background: #f5f5f5;
          color: #333;
        }

        .settings-nav-item.active {
          background: linear-gradient(to right, #fff5f5, transparent);
          color: #ef4444;
          border-left-color: #ef4444;
          font-weight: 600;
        }

        .settings-nav-icon {
          font-size: 18px;
        }

        .settings-content {
          flex: 1;
          min-width: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 24px 32px;
        }

        @media (max-width: 768px) {
          .settings-container {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
          }

          .settings-sidebar {
            position: static;
            width: 100%;
          }

          .settings-nav {
            padding: 12px 0;
          }

          .settings-nav-title {
            padding: 0 16px 12px;
            font-size: 16px;
          }

          .settings-nav-list {
            display: flex;
            overflow-x: auto;
            gap: 4px;
            padding: 0 12px;
          }

          .settings-nav-item {
            padding: 10px 14px;
            white-space: nowrap;
            border-left: none;
            border-radius: 20px;
            font-size: 13px;
          }

          .settings-nav-item.active {
            background: #ef4444;
            color: #fff;
          }

          .settings-content {
            padding: 20px 16px;
          }
        }
      `}</style>
    </ProtectedContent>
  );
}
