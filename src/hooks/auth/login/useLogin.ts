import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkUser } from "@/services/auth/check-user";
import { getErrorMessage } from "@/lib/api/error-handler";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";

type LoginInitialParams = {
  redirectTo?: string | null;
};

export function useLogin(initial?: LoginInitialParams) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const redirectTo = initial?.redirectTo || null;
  const safeRedirect = safeRedirectTo(redirectTo);

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername) {
      setError("メールアドレスまたはユーザーIDを入力してください。");
      return;
    }

    setIsLoading(true);
    try {
      // バックエンドに問い合わせて次のステップを決定
      const checkResult = await checkUser(emailOrUsername);

      if (checkResult.next_step === "password") {
          addLog(`Proceeding to password challenge for: ${checkResult.identifier}`);
          // パスワード入力画面へ遷移
          // ユーザーが存在しない場合でもここに来る（セキュリティ対策）
          const params = new URLSearchParams();
          params.set("type", "password");
          params.set("username", checkResult.identifier);
          if (safeRedirect) params.set("redirect_to", safeRedirect);
          
          router.push(`/challenge?${params.toString()}`);

      } else if (checkResult.next_step === "email_otp" && checkResult.flow_id) {
          addLog("Proceeding to email verification");
          // メール認証画面へ遷移
          const params = new URLSearchParams();
          params.set("type", "email");
          params.set("flow_id", checkResult.flow_id);
          params.set("email", checkResult.identifier); // 表示用
          if (safeRedirect) params.set("redirect_to", safeRedirect);
          
          router.push(`/challenge?${params.toString()}`);
      } else {
          // 想定外のレスポンス
          throw new Error("Invalid auth step");
      }

    } catch (err: any) {
      console.error(err);
      const message = getErrorMessage(err);
      setError(message || "認証の開始に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: {
      emailOrUsername,
      error,
      isLoading,
      redirectTo,
    },
    actions: {
      setEmailOrUsername,
      onSubmit: handleSubmit,
      addLog,
    },
  };
}
