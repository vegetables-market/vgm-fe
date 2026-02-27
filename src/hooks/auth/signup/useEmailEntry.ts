import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { initAuthFlow } from "@/service/auth/challenge/init-auth-flow";
import { getErrorMessage } from "@/lib/api/error-handler";

type UseEmailEntryParams = {
  email: string;
  redirectTo?: string | null;
  addLog: (msg: string) => void;
};

export function useEmailEntry({
  email,
  redirectTo,
  addLog,
}: UseEmailEntryParams) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const hasEmailError = showError && !isEmailValid;

  const clearEmailError = () => setShowError(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setShowError(true);
      setErrorMessage("");
      return;
    }

    setShowError(false);
    setErrorMessage("");
    setIsLoading(true);
    try {
      addLog(`Checking email status: ${email}`);
      const result = await initAuthFlow(email);
      addLog(`Auth flow initiated: ${result.flow} / ${result.flow_id}`);

      if (result.flow_id) {
        const params = new URLSearchParams();
        params.set("type", "email");
        params.set("flow_id", result.flow_id);
        params.set("email", email);
        if (result.expires_at) params.set("expires_at", result.expires_at);
        if (result.next_resend_at) {
          params.set("next_resend_at", result.next_resend_at);
        }
        params.set("signup", "true");
        if (redirectTo) params.set("redirect_to", redirectTo);

        router.push(`/challenge?${params.toString()}`);
      } else {
        addLog("Error: Missing flow_id for authentication flow");
        setErrorMessage("認証フローの開始に失敗しました。");
      }
    } catch (error: unknown) {
      addLog("Error checking email status");
      setErrorMessage(
        getErrorMessage(error) || "認証フローの開始に失敗しました。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    hasEmailError,
    errorMessage,
    clearEmailError,
    onSubmit,
  };
}
