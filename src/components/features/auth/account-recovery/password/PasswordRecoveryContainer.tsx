"use client";

import { useSearchParams } from "next/navigation";
import { FaEnvelope } from "react-icons/fa6";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import VerificationInput from "@/components/ui/auth/verification/VerificationInput";
import { usePasswordRecovery } from "@/hooks/auth/account-recovery/usePasswordRecovery";

export default function PasswordRecoveryContainer() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");

  const {
    step,
    options,
    selectedMethod,
    code,
    error,
    isLoading,
    setCode,
    onSelectMethod,
    onVerify,
    onBackToOptions,
    onMoveToLogin,
  } = usePasswordRecovery({ state });

  if (!state) {
    return (
      <div className="flex w-75 flex-col items-center">
        <AuthStatusMessage message="無効なアクセスです。" variant="error" />
        <div className="mt-4">
          <a href="/login" className="text-primary hover:underline">
            ログイン画面に戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>{step === "COMPLETED" ? "再設定完了" : "本人確認"}</AuthTitle>

      {error && (
        <AuthStatusMessage message={error} variant="error" className="mb-4" />
      )}

      {step === "LOADING" && !error && <p>読み込み中...</p>}

      {step === "OPTIONS" && (
        <div className="w-full space-y-4">
          <p className="text-muted-foreground mb-4 text-center text-sm">
            本人確認の方法を選択してください。
          </p>

          {options.includes("email") && (
            <button
              onClick={() => onSelectMethod("email")}
              disabled={isLoading}
              className="bg-background flex cursor-pointer items-center rounded-sm p-4"
            >
              <div className="bg-surface mr-4 rounded-full p-3">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <div className="font-bold">メールで確認</div>
                <div className="text-muted-foreground text-xs">
                  登録メールアドレスにコードを送信します。
                </div>
              </div>
            </button>
          )}

          {options.includes("totp") && (
            <button
              onClick={() => onSelectMethod("totp")}
              disabled={isLoading}
              className="bg-background flex cursor-pointer items-center rounded-sm p-4"
            >
              <div className="bg-surface mr-4 rounded-full p-3">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <div className="font-bold">認証アプリ</div>
                <div className="text-muted-foreground text-xs">
                  認証アプリに表示されたコードを使います。
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {step === "VERIFY" && (
        <div className="w-full">
          <p className="text-muted-foreground mb-6 text-center text-sm">
            {selectedMethod === "email"
              ? "メールに送信された確認コードを入力してください。"
              : "認証アプリに表示されたコードを入力してください。"}
          </p>

          <VerificationInput
            value={code}
            onChange={setCode}
            onEnter={onVerify}
            isLoading={isLoading}
          />

          <AuthSubmitButton
            onClick={onVerify}
            isLoading={isLoading}
            disabled={code.length !== 6}
          >
            確認する
          </AuthSubmitButton>

          <button
            onClick={onBackToOptions}
            className="text-muted-foreground mt-4 w-full cursor-pointer text-sm hover:text-gray-300 hover:underline"
          >
            別の方法を試す
          </button>
        </div>
      )}

      {step === "COMPLETED" && (
        <div className="w-full">
          <p className="mb-6 text-sm leading-relaxed text-gray-300">
            パスワード再設定メールを送信しました。
          </p>
          <AuthSubmitButton onClick={onMoveToLogin}>
            ログイン画面へ戻る
          </AuthSubmitButton>
        </div>
      )}
    </div>
  );
}
