"use client";

import { useSearchParams } from "next/navigation";
import AuthInput from "@/components/ui/auth/AuthInput";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import { useResetPasswordForm } from "@/hooks/auth/account-recovery/useResetPasswordForm";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    password,
    confirmPassword,
    error,
    success,
    isLoading,
    isPasswordVisible,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    onSubmit,
    onMoveToLogin,
  } = useResetPasswordForm({ token });

  if (success) {
    return (
      <div className="flex w-75 flex-col items-center">
        <AuthTitle>再設定完了</AuthTitle>
        <AuthStatusMessage
          message="パスワードを再設定しました。"
          variant="success"
          className="mb-6 w-full"
        />
        <AuthSubmitButton onClick={onMoveToLogin}>
          ログイン画面へ移動
        </AuthSubmitButton>
      </div>
    );
  }

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>パスワードの再設定</AuthTitle>

      {!token && (
        <AuthStatusMessage
          message="トークンが見つかりません。"
          variant="error"
          className="mb-4"
        />
      )}

      {error && (
        <AuthStatusMessage message={error} variant="error" className="mb-4" />
      )}

      <form onSubmit={onSubmit} className="w-full">
        <AuthInput
          label="新しいパスワード"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          placeholder="もう一度入力してください"
        />

        <AuthSubmitButton
          isLoading={isLoading}
          disabled={!token || !password || !confirmPassword}
        >
          再設定する
        </AuthSubmitButton>
      </form>
    </div>
  );
}
