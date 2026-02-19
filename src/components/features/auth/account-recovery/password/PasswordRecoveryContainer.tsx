"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { recoveryApi } from "@/lib/api/auth/recovery";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import VerificationInput from "@/components/ui/auth/verification/VerificationInput";
import { FaEnvelope } from "react-icons/fa6";

type RecoveryStep = "LOADING" | "OPTIONS" | "VERIFY" | "COMPLETED";

export default function PasswordRecoveryContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const state = searchParams.get("state");

  const [step, setStep] = useState<RecoveryStep>("LOADING");
  const [options, setOptions] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      setError("セッションが無効です。もう一度最初からやり直してください。");
      setStep("LOADING"); // Stop
      return;
    }

    const fetchOptions = async () => {
      try {
        const res = await recoveryApi.getOptions(state);
        setOptions(res.options);
        // If only one option, auto select? Maybe better to let user choose or auto-proceed if email is the only way
        if (res.options.length === 1 && res.options[0] === "email") {
          // Auto select email but wait for user to confirm "Send"?
          // Better to show "Send verification code to email" button.
          setStep("OPTIONS");
        } else {
          setStep("OPTIONS");
        }
      } catch (err) {
        // Generic error message
        setError("オプションの取得に失敗しました。");
      }
    };
    fetchOptions();
  }, [state]);

  const handleSendChallenge = async (method: string) => {
    if (!state) return;
    setIsLoading(true);
    setError("");
    try {
      if (method === "email") {
        await recoveryApi.sendChallenge(state, method);
      }
      // TOTP doesn't need send
      setSelectedMethod(method);
      setStep("VERIFY");
    } catch (err) {
      setError("コードの送信に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!state || !selectedMethod) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await recoveryApi.verifyChallenge(
        state,
        selectedMethod,
        code,
      );

      if (res.verified) {
        // If verify success, complete recovery
        await recoveryApi.completeRecovery(state);
        setStep("COMPLETED");
      } else {
        setError("認証に失敗しました。コードを確認してください。");
      }
    } catch (err) {
      setError("認証に失敗しました。コードを確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  if (!state) {
    return (
      <div className="flex w-75 flex-col items-center">
        <AuthStatusMessage message="無効なアクセスです。" variant="error" />
        <div className="mt-4">
          <a href="/login" className="text-primary hover:underline">
            ログイン画面へ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>{step === "COMPLETED" ? "送信完了" : "本人確認"}</AuthTitle>

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
              onClick={() => handleSendChallenge("email")}
              disabled={isLoading}
              className="bg-background flex cursor-pointer items-center rounded-sm p-4"
            >
              <div className="bg-surface mr-4 rounded-full p-3">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <div className="font-bold">メールで認証</div>
                <div className="text-muted-foreground text-xs">
                  登録済みのメールアドレスにコードを送信します
                </div>
              </div>
            </button>
          )}

          {options.includes("totp") && (
            <button
              onClick={() => handleSendChallenge("totp")}
              disabled={isLoading}
              className="bg-background flex cursor-pointer items-center rounded-sm p-4"
            >
              <div className="bg-surface mr-4 rounded-full p-3">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <div className="font-bold">認証アプリ</div>
                <div className="text-muted-foreground text-xs">
                  Google Authenticatorなどのコードを使用します
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
              ? "メールに送信された6桁のコードを入力してください。"
              : "認証アプリに表示されているコードを入力してください。"}
          </p>

          <VerificationInput
            value={code}
            onChange={setCode}
            onEnter={handleVerify}
            isLoading={isLoading}
          />

          <AuthSubmitButton
            onClick={handleVerify}
            isLoading={isLoading}
            disabled={code.length !== 6}
          >
            認証する
          </AuthSubmitButton>

          <button
            onClick={() => {
              setStep("OPTIONS");
              setCode("");
              setError("");
            }}
            className="text-muted-foreground mt-4 w-full cursor-pointer text-sm hover:text-gray-300 hover:underline"
          >
            他の方法を試す
          </button>
        </div>
      )}

      {step === "COMPLETED" && (
        <div className="w-full">
          <p className="mb-6 text-sm leading-relaxed text-gray-300">
            ご登録のメールアドレスにパスワード再設定メールを送信しました。
            <br />
          </p>
          <AuthSubmitButton onClick={() => router.push("/login")}>
            ログイン画面へ戻る
          </AuthSubmitButton>
        </div>
      )}
    </div>
  );
}
