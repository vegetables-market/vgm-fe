"use client";

import Link from "next/link";

const securityItems = [
  {
    href: "/settings/security/email",
    label: "メールアドレス",
    description: "登録メールアドレスの確認・変更",
    icon: "📧",
  },
  {
    href: "/settings/security/password",
    label: "パスワード",
    description: "パスワードの変更",
    icon: "🔑",
  },
  {
    href: "/settings/security/user-name",
    label: "ユーザー名",
    description: "ログイン用のユーザー名を変更",
    icon: "✏️",
  },
  {
    href: "/settings/security/signinoptions",
    label: "二段階認証",
    description: "認証アプリ、メール認証の設定",
    icon: "🔐",
  },
  {
    href: "/settings/security/oauth",
    label: "外部サービス連携",
    description: "Google、Appleなどとのアカウント連携",
    icon: "🔗",
  },
  {
    href: "/settings/security/devices",
    label: "ログイン中のデバイス",
    description: "接続中のデバイスを管理",
    icon: "💻",
  },
  {
    href: "/settings/security/passkeys",
    label: "パスキー設定",
    description: "指紋や顔認証でログイン",
    icon: "👆",
  },
];

export default function SecurityPage() {
  return (
    <div className="security-page">
      <h1 className="page-title">セキュリティ</h1>
      <p className="page-subtitle">アカウントのセキュリティ設定を管理します</p>

      <div className="security-list">
        {securityItems.map((item) => (
          <Link key={item.href} href={item.href} className="security-item">
            <span className="item-icon">{item.icon}</span>
            <div className="item-content">
              <h3 className="item-title">{item.label}</h3>
              <p className="item-description">{item.description}</p>
            </div>
            <span className="item-arrow">›</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .security-page {
          max-width: 600px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0 0 24px 0;
        }

        .security-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #eee;
          border-radius: 12px;
          overflow: hidden;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: #fff;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .security-item:hover {
          background: #fafafa;
        }

        .item-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 10px;
        }

        .item-content {
          flex: 1;
        }

        .item-title {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .item-description {
          font-size: 13px;
          color: #888;
          margin: 0;
        }

        .item-arrow {
          font-size: 24px;
          color: #ccc;
          font-weight: 300;
        }

        .security-item:hover .item-arrow {
          color: #999;
        }

        @media (max-width: 768px) {
          .security-item {
            padding: 14px 16px;
            gap: 12px;
          }

          .item-icon {
            width: 36px;
            height: 36px;
            font-size: 20px;
          }

          .item-title {
            font-size: 14px;
          }

          .item-description {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
