"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCircleExclamation } from "react-icons/fa6";
import SocialLoginButtons from "@/components/features/auth/SocialLoginButtons";
import { login } from "@/services/authService";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ステップ1: ユーザーID入力後
    if (step === "email") {
      if (!emailOrUsername) {
        setError("メールアドレスまたはユーザーIDを入力してください。");
        return;
      }

      // 以前はここでAPIを叩いてユーザー存在確認を行っていたが、
      // セキュリティ向上（User Enumeration対策）のため、常にパスワード入力へ進むように変更
      addLog(`Proceeding to password step for: ${emailOrUsername}`);
      setStep("password");
      return;
    }

    // ステップ2: パスワード入力後
    if (step === "password") {
      if (!password) {
        setError("パスワードを入力してください。");
        return;
      }

      setIsLoading(true);
      addLog(`Attempting login with password for: ${emailOrUsername}`);
      try {
        const data = await login({ username: emailOrUsername, password });

        if (data.status === "MFA_REQUIRED" && data.mfa_token) {
          addLog("MFA Required. Redirecting to challenge page.");
          
          if (data.masked_email) {
            localStorage.setItem("vgm_masked_email", data.masked_email);
          }

          // MFAトークンをクエリパラメータにセットして遷移
          // 注意: トークンが非常に長い場合、URL長制限に引っかかる可能性があるが、
          // 通常のJWT/HMAC程度なら問題ない。セキュリティ的にはURLに残るのは望ましくないが、
          // 一時トークンであり短寿命のため許容範囲とする。より安全にするならState管理が必要。
          const mfaType = data.mfa_type?.toLowerCase() || "totp";
          router.push(
            `/challenge?type=${mfaType}&token=${encodeURIComponent(data.mfa_token)}`,
          );
        } else if (data.require_verification) {
          if (data.flow_id) {
            // 認証が必要で、flow_idがある場合（パスワード正解、または未知の端末）
            addLog("Verification required after password check.");
            if (data.masked_email) {
              localStorage.setItem("vgm_masked_email", data.masked_email);
            }
            router.push(`/challenge?type=email&flow_id=${data.flow_id}`);
          } else {
            // 認証が必要だが、flow_idがない場合（パスワード間違いなど）
            addLog("Login failed: Invalid credentials.");
            setError(
              "メールアドレス、ユーザーIDまたはパスワードが間違っています。",
            );
          }
        } else if (data.user) {
          addLog("Login successful!");
          authLogin(data.user);
          router.push("/");
        }
      } catch (err: any) {
        const message = getErrorMessage(err);
        setError(message);
        handleGlobalError(err, router);
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  return (
    <div className="flex w-75 flex-col items-center">
      <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold">
        ログイン
      </h2>

      <SocialLoginButtons
        mode="login"
        onProviderClick={(id) => addLog(`Social login clicked: ${id}`)}
      />

      <div className="mb-4 flex w-full items-center">
        <div className="w-full border-t border-gray-400 dark:border-gray-600"></div>
        <span className="shrink-0 cursor-default px-2 text-gray-400">
          または
        </span>
        <div className="w-full border-t border-gray-400 dark:border-gray-600"></div>
      </div>

      {error && (
        <p className="mb-2 flex h-8 w-full items-center justify-center rounded-xs bg-red-600 text-center text-[11px]">
          <FaCircleExclamation className="mr-1" />
          {error}
        </p>
      )}

      <div className="mb-3 w-75">
        <form onSubmit={handleSubmit}>
          <div className="mb-2 w-full">
            <span className="cursor-default text-[12px] font-bold">
              メールアドレスまたはユーザーID
            </span>
          </div>
          <input
            type="email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="mb-3 h-9 w-full rounded-lg border-2 border-white/70 pl-3 text-sm transition-colors duration-300 outline-none focus:border-white"
          />

          {step === "password" && (
            <div className="mb-3">
              <div className="mb-2 w-full">
                <span className="cursor-default text-[12px] font-bold">
                  パスワード
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="mb-3 h-9 w-full rounded-lg border-2 border-white/70 pl-3 text-sm transition-colors duration-300 outline-none focus:border-white"
                autoFocus
                disabled={isLoading}
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-dis bg-foreground text-muted h-10 w-full cursor-pointer rounded-full border text-base font-bold"
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : step === "email" ? "次へ" : "ログイン"}
          </button>
        </form>
      </div>

      <div className="flex w-full items-center justify-center">
        <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">
          アカウントを
        </span>
        <Link
          href="/signup"
          className="text-foreground text-xs font-bold underline"
        >
          新規登録する
        </Link>
      </div>
    </div>
  );
}
