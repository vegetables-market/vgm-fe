"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { recoveryApi } from "@/lib/api/auth/recovery";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import VerificationInput from "@/components/ui/auth/verification/VerificationInput";
import { FaEnvelope, FaMobileScreen } from "react-icons/fa6";

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
      const res = await recoveryApi.verifyChallenge(state, selectedMethod, code);
      
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
                  <a href="/login" className="text-primary hover:underline">ログイン画面へ戻る</a>
              </div>
          </div>
      );
  }

  return (
    <div className="flex w-75 flex-col items-center">
      <AuthTitle>
        {step === "COMPLETED" ? "送信完了" : "本人確認"}
      </AuthTitle>

      {error && <AuthStatusMessage message={error} variant="error" className="mb-4" />}

      {step === "LOADING" && !error && <p>読み込み中...</p>}

      {step === "OPTIONS" && (
        <div className="w-full space-y-4">
          <p className="text-sm text-gray-400 text-center mb-4">
            本人確認の方法を選択してください。
          </p>

          {options.includes("email") && (
            <button
              onClick={() => handleSendChallenge("email")}
              disabled={isLoading}
              className="w-full flex items-center p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left group"
            >
              <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <div className="font-bold">メールで認証</div>
                <div className="text-xs text-gray-400">登録済みのメールアドレスにコードを送信します</div>
              </div>
            </button>
          )}

          {options.includes("totp") && (
            <button
              onClick={() => handleSendChallenge("totp")}
              disabled={isLoading}
              className="w-full flex items-center p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left group"
            >
              <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20">
                <FaMobileScreen className="text-xl" />
              </div>
              <div>
                <div className="font-bold">認証アプリ (TOTP)</div>
                <div className="text-xs text-gray-400">Google Authenticatorなどのコードを使用します</div>
              </div>
            </button>
          )}
        </div>
      )}

      {step === "VERIFY" && (
        <div className="w-full">
            <p className="text-sm text-gray-400 text-center mb-6">
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

            <AuthSubmitButton onClick={handleVerify} isLoading={isLoading} disabled={code.length !== 6}>
                認証する
            </AuthSubmitButton>

            <button 
                onClick={() => { setStep("OPTIONS"); setCode(""); setError(""); }}
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-300"
            >
                他の方法を試す
            </button>
        </div>
      )}

      {step === "COMPLETED" && (
        <div className="text-center w-full">
            <p className="mb-6 text-gray-300 text-sm leading-relaxed">
                アカウントが存在し、条件を満たしていればメールを送信しました。<br />
                数分待っても届かない場合は、入力内容をご確認ください。<br />
                <br />
                メール内のリンクからパスワードの再設定を行ってください。
            </p>
            <AuthSubmitButton onClick={() => router.push("/login")}>
                ログイン画面へ戻る
            </AuthSubmitButton>
        </div>
      )}
    </div>
  );
}
