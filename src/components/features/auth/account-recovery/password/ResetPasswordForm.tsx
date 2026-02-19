"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { recoveryApi } from "@/lib/api/auth/recovery";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import { getErrorMessage } from "@/lib/api/error-handler";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("無効なトークンです。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }
    if (password.length < 8) {
        setError("パスワードは8文字以上で入力してください。");
        return;
    }

    setIsLoading(true);
    setError("");
    try {
      await recoveryApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err) || "パスワードのリセットに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
      return (
          <div className="flex w-75 flex-col items-center">
              <AuthTitle>変更完了</AuthTitle>
              <AuthStatusMessage message="パスワードを変更しました。" variant="success" className="mb-6 w-full" />
              <AuthSubmitButton onClick={() => router.push("/login")}>
                  ログイン画面へ進む
              </AuthSubmitButton>
          </div>
      );
  }

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>パスワードの再設定</AuthTitle>
      
      {!token && (
           <AuthStatusMessage message="トークンが見つかりません。" variant="error" className="mb-4" />
      )}

      {error && <AuthStatusMessage message={error} variant="error" className="mb-4" />}

      <form onSubmit={handleSubmit} className="w-full">
        <AuthInput
          label="新しいパスワード"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onTogglePasswordVisibility={togglePasswordVisibility}
          isPasswordVisible={isPasswordVisible}
          required
          autoFocus
          placeholder="8文字以上"
        />

        <AuthInput
          label="パスワード（確認）"
          type={isPasswordVisible ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="もう一度入力してください"
        />

        <AuthSubmitButton isLoading={isLoading} disabled={!token || !password || !confirmPassword}>
          変更する
        </AuthSubmitButton>
      </form>
    </div>
  );
}
