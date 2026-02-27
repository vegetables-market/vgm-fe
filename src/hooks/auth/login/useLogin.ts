import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAuthLog } from "@/lib/auth/debug/add-auth-log";
import { getErrorMessage } from "@/lib/api/error-handler";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";
import { checkUser } from "@/service/auth/challenge/check-user";

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

  const addLog = (msg: string) => addAuthLog(msg);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername) {
      setError("メールアドレスまたはユーザーIDを入力してください。");
      return;
    }

    setIsLoading(true);
    try {
      const checkResult = await checkUser(emailOrUsername);

      if (checkResult.next_step === "password") {
        addLog(`Proceeding to password challenge for: ${checkResult.identifier}`);
        const params = new URLSearchParams();
        params.set("type", "password");
        params.set("username", checkResult.identifier);
        if (safeRedirect) params.set("redirect_to", safeRedirect);
        router.push(`/challenge?${params.toString()}`);
        return;
      }

      if (checkResult.next_step === "email_otp" && checkResult.flow_id) {
        addLog("Proceeding to email verification");
        const params = new URLSearchParams();
        params.set("type", "email");
        params.set("flow_id", checkResult.flow_id);
        params.set("email", checkResult.identifier);
        if (safeRedirect) params.set("redirect_to", safeRedirect);
        router.push(`/challenge?${params.toString()}`);
        return;
      }

      throw new Error("Invalid auth step");
    } catch (err: unknown) {
      console.error(err);
      const message = getErrorMessage(err);
      setError(message || "認証フローの開始に失敗しました。");
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
