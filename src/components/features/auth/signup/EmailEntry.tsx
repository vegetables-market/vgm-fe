import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaCircleExclamation } from "react-icons/fa6";
import SocialLoginButtons from "@/components/features3/auth/SocialLoginButtons";
import { initAuthFlow } from "@/services/auth/init-auth-flow";
import { SignupFormData } from "@/components/features/auth/types";
import OrDivider from "@/components/ui/auth/OrDivider";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

interface EmailEntryProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  addLog: (msg: string) => void;
  redirectTo?: string | null;
}

export default function EmailEntry({
  formData,
  setFormData,
  addLog,
  redirectTo,
}: EmailEntryProps) {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      addLog(`Checking email status: ${formData.email}`);

      // 認証フロー初期化 (Backendで統一的に処理)
      const result = await initAuthFlow(formData.email);
      addLog(`Auth flow initiated: ${result.flow} / ${result.flow_id}`);

      if (result.flow_id) {
        // 統一フロー: チャレンジページへ遷移
        const params = new URLSearchParams();
        params.set("type", "email");
        params.set("flow_id", result.flow_id);
        if (result.expires_at) params.set("expires_at", result.expires_at);
        if (result.next_resend_at)
          params.set("next_resend_at", result.next_resend_at);
        if (redirectTo) params.set("redirect_to", redirectTo);

        router.push(`/challenge?${params.toString()}`);
      } else {
        // 万が一 flow_id がない場合のエラーハンドリング
        addLog("Error: Missing flow_id for authentication flow");
        console.error("Error: Missing flow_id for authentication flow");
      }
    } catch (error) {
      addLog("Error checking email status");
      console.error(error);
      // エラー表示など
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold">メールアドレス</span>
          </div>

          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="mail@example.com"
            className={`mb-1 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              showError && !isEmailValid
                ? "border-red-400"
                : "border-white/70 focus:border-white"
            }`}
            autoFocus
          />
          {showError && !isEmailValid && (
            <div className="mb-2 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>有効なメールアドレスを入力してください。</p>
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black transition-colors hover:bg-gray-200 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading ? "確認中..." : "次へ"}
        </button>
      </form>

      <div className="w-full">
        <OrDivider />

        <SocialLoginButtons
          mode="signup"
          onProviderClick={(id) => addLog(`Social signup: ${id}`)}
        />

        <div className="mt-8 flex w-full items-center justify-center border-t border-gray-800 pt-6">
          <span className="mr-1 text-xs text-[#b3b3b3]">
            アカウントをお持ちの方は
          </span>
          <Link
            href={withRedirectTo("/login", redirectTo)}
            className="text-xs text-white underline hover:text-gray-300"
          >
            ここからログイン
          </Link>
        </div>
      </div>
    </>
  );
}
