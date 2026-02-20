"use client";

import SettingsTitle from "@/components/features3/settings/ui/SettingsTitle";
import Btn from "@/components/ui/settings/Btn";
import BtnWrappers from "@/components/features3/settings/ui/BtnWrappers";

import LoggedInDevices from "@/components/features3/settings/security/LoggedInDevices";

export default function SecurityPage() {
  return (
    <>
      <SettingsTitle>セキュリティ</SettingsTitle>

      {/* ログイン履歴 */}
      <h2 className="mt-6 mb-2 px-1 text-lg font-bold text-gray-900">
        ログイン履歴
      </h2>
      <BtnWrappers>
        <Btn href="/settings/security/history">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              <span className="font-semibold">新しいログインがありました</span>
              <span className="text-sm text-gray-500">
                iPhoneでのログイン • 多要素認証
              </span>
            </div>
            <span className="text-sm text-blue-600">履歴を確認</span>
          </div>
        </Btn>
      </BtnWrappers>

      {/* ログイン方法 */}
      <h2 className="mt-6 mb-2 px-1 text-lg font-bold text-gray-900">
        ログイン方法
      </h2>
      <BtnWrappers>
        <Btn href="/settings/security/password">
          <span className="font-medium">パスワード</span>
          <span className="text-sm text-gray-500">最終変更: 3ヶ月前</span>
        </Btn>
        <Btn href="/settings/security/signinoptions">
          <span className="font-medium">多要素認証</span>
          <span className="text-sm text-gray-500">オン</span>
        </Btn>
        <Btn href="#">
          <span className="font-medium">アプリからのメッセージ</span>
        </Btn>
        <Btn href="/settings/security/email">
          <span className="font-medium">再設定用メールアドレス</span>
          <span className="text-sm text-gray-500">exam***@example.com</span>
        </Btn>
      </BtnWrappers>

      {/* ログインしているデバイス */}
      <h2 className="mt-6 mb-2 px-1 text-lg font-bold text-gray-900">
        ログインしているデバイス
      </h2>
      <LoggedInDevices />
    </>
  );
}
