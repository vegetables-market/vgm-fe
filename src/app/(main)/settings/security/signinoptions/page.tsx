import Link from "next/link";

export default function SigninOptionsPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">2段階認証設定</h1>
      <p>パスキー</p>
      <p>アプリにメッセージ</p>
      <Link href="/settings/security/signinoptions/mfa">認証システム</Link>
      <p>バックアップコード</p>
    </div>
  );
}
