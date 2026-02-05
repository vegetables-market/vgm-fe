"use client";

import Link from "next/link";
import {
  FiMail,
  FiKey,
  FiEdit3,
  FiShield,
  FiLink2,
  FiMonitor,
  FiChevronRight,
} from "react-icons/fi";
import { RiFingerprintLine } from "react-icons/ri";
import SettingsTitle from "@/components/features/settings/ui/SettingsTitle";
import Btn from "@/components/features/settings/ui/Btn";
import BtnWrappers from "@/components/features/settings/ui/BtnWrappers";

const securityItems = [
  {
    href: "/settings/security/email",
    label: "メールアドレス",
    description: "登録メールアドレスの確認・変更",
    icon: FiMail,
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/settings/security/password",
    label: "パスワード",
    description: "パスワードの変更",
    icon: FiKey,
    color: "bg-green-50 text-green-600",
  },
  {
    href: "/settings/security/user-name",
    label: "ユーザー名",
    description: "ログイン用のユーザー名を変更",
    icon: FiEdit3,
    color: "bg-purple-50 text-purple-600",
  },
  {
    href: "/settings/security/signinoptions",
    label: "二段階認証",
    description: "認証アプリ、メール認証の設定",
    icon: FiShield,
    color: "bg-red-50 text-red-600",
  },
  {
    href: "/settings/security/oauth",
    label: "外部サービス連携",
    description: "Google、Appleなどとのアカウント連携",
    icon: FiLink2,
    color: "bg-orange-50 text-orange-600",
  },
  {
    href: "/settings/security/devices",
    label: "ログイン中のデバイス",
    description: "接続中のデバイスを管理",
    icon: FiMonitor,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    href: "/settings/security/passkeys",
    label: "パスキー設定",
    description: "指紋や顔認証でログイン",
    icon: RiFingerprintLine,
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function SecurityPage() {
  return (
    <>
      <SettingsTitle>セキュリティ</SettingsTitle>
      <BtnWrappers>
        <Btn href="">
          <p>ログイン済みセッション</p>
        </Btn>
        <Btn>
          <p>Windows</p>
          <p>〇月〇日　○○件</p>
        </Btn>
        <Btn>
          <p>ログイン済みセッション</p>
        </Btn>
      </BtnWrappers>
      <div>
        <p>ログイン履歴（title）</p>
        <p>○○でログイン</p>
        <p>多用途認証</p>
        <p>iPhoneでログイン</p>
        <p>履歴を確認。</p>
      </div>
      <div>
        <p>ログイン方法（title）</p>
        <p>パスワード</p>
        <p>多用途認証</p>
        <p>アプリからのメッセージ</p>
        <p>再設定用メールアドレス</p>
      </div>

      <div>
        <p>ログインしているデバイス（title）</p>
        <p>Windows</p>
        <p>iPhone</p>
      </div>

      {/* カードグリッド */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {securityItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* アイコン */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.color}`}
              >
                <IconComponent className="h-6 w-6" />
              </div>

              {/* コンテンツ */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {item.label}
                  </h3>
                  <FiChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
