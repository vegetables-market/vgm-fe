"use client";

import Link from "next/link";

const settingsSections = [
  {
    title: "アカウント",
    items: [
      {
        href: "/settings/profile",
        label: "プロフィール編集",
        description: "表示名、自己紹介などを変更",
      },
      {
        href: "/settings/security",
        label: "セキュリティ",
        description: "パスワード、2段階認証の設定",
      },
    ],
  },
  {
    title: "取引設定",
    items: [
      {
        href: "/settings/payment",
        label: "支払い方法",
        description: "クレジットカード、電子マネーの管理",
      },
      {
        href: "/settings/shipping",
        label: "配送設定",
        description: "住所、配送方法の設定",
      },
    ],
  },
  {
    title: "通知・プライバシー",
    items: [
      {
        href: "/settings/notifications",
        label: "通知設定",
        description: "メール、プッシュ通知の設定",
      },
      {
        href: "/settings/privacy",
        label: "プライバシー",
        description: "公開情報、ブロックリストの管理",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="settings-home">
      <h1 className="settings-title">設定</h1>
      <p className="settings-subtitle">
        アカウントや取引に関する各種設定を行えます
      </p>

      {settingsSections.map((section) => (
        <div key={section.title} className="settings-section">
          <h2 className="section-title">{section.title}</h2>
          <div className="settings-grid">
            {section.items.map((item) => (
              <Link key={item.href} href={item.href} className="settings-card">
                <div className="card-content">
                  <h3 className="card-title">{item.label}</h3>
                  <p className="card-description">{item.description}</p>
                </div>
                <span className="card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        .settings-home {
          max-width: 800px;
        }

        .settings-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .settings-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0 0 32px 0;
        }

        .settings-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #eee;
        }

        .settings-grid {
          display: grid;
          gap: 12px;
        }

        .settings-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #fafafa;
          border: 1px solid #eee;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .settings-card:hover {
          background: #f0f0f0;
          border-color: #ddd;
          transform: translateX(4px);
        }

        .card-content {
          flex: 1;
        }

        .card-title {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .card-description {
          font-size: 13px;
          color: #888;
          margin: 0;
        }

        .card-arrow {
          font-size: 18px;
          color: #ccc;
          transition: transform 0.2s ease;
        }

        .settings-card:hover .card-arrow {
          color: #ef4444;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .settings-title {
            font-size: 20px;
          }

          .settings-card {
            padding: 14px 16px;
          }

          .card-title {
            font-size: 14px;
          }

          .card-description {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
