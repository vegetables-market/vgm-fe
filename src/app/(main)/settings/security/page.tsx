import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

export default function SecurityPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">セキュリティ</h1>
        <Link href="/settings/security/email">email</Link><br />
        <Link href="/settings/security/password">パスワード</Link><br />
        <Link href="/settings/security/user-name">ユーザー名</Link><br />
        <Link href="/settings/security/mfa">二段階認証</Link><br />
      </div>
    </ProtectedRoute>
  );
}
