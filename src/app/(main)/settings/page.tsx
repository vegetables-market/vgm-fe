"use client";

import React from "react";
import Link from "next/link";
import ProtectedContent from "@/components/features/auth/ProtectedContent";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">設定</h1>

      <ProtectedContent>
        <div>
          <Link href="/settings/security/" className="text-blue-500 hover:underline">
            セキュリティ
          </Link>
          <div className="mt-4 ml-4">
            <ul className="list-disc">
              <li>ID変更</li>
              <li>メールアドレス</li>
              <li>パスワード</li>
              <li>認証（totp）</li>
              <li>デバイス</li>
              <li>外部のログイン</li>
            </ul>
          </div>
        </div>
      </ProtectedContent>
    </div>
  );
}
