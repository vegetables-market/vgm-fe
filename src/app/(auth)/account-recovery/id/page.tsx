"use client";

import { useState } from "react";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import { FaCircleChevronLeft, FaEnvelope } from "react-icons/fa6";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import Link from "next/link";
import { recoveryApi } from "@/lib/api/auth/recovery";

export default function ForgotIdPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await recoveryApi.forgotId(email);
    } catch (error) {
      // Error is explicitly ignored for security (prevention of enumeration)
      console.error("Forgot ID error:", error);
    } finally {
      setIsLoading(false);
      setIsSent(true);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Back Button */}
      <Link href="/login" className="absolute top-8 left-8">
        <FaCircleChevronLeft className="text-3xl transition-colors" />
      </Link>

      <div className="flex w-75 max-w-md flex-col items-center">
        <AuthTitle>メールアドレスを探す</AuthTitle>

        {isSent ? (
          <div className="animate-in fade-in zoom-in bg-background w-full rounded-lg border p-6 text-center duration-300">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary/20 rounded-full p-4">
                <FaEnvelope className="text-primary text-3xl" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              メールを送信しました
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              入力されたメールアドレスが登録済み（予備メール等）の場合、ログインIDを記載したメールを送信しました。
            </p>
            <p className="mb-6 text-xs text-gray-400">
              届かない場合は、迷惑メールフォルダを確認するか、別のメールアドレスをお試しください。
            </p>
            <Link
              href="/login"
              className="bg-primary hover:bg-primary-hover block w-full rounded-md px-6 py-3 text-center font-bold text-white transition-colors"
            >
              ログイン画面へ戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6 text-center">
              <p className="text-sm leading-relaxed text-gray-300">
                再設定用のメールアドレスを入力してください
              </p>
            </div>

            <AuthInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              label="予備メールアドレス"
              required
              disabled={isLoading}
            />

            <AuthSubmitButton disabled={isLoading || !email}>
              {isLoading ? "送信中..." : "IDを確認する"}
            </AuthSubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
