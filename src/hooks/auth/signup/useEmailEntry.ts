import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { initAuthFlow } from "@/services/auth/init-auth-flow";

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
      return;
    }

    setShowError(false);
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
        console.error("Error: Missing flow_id for authentication flow");
      }
    } catch (error) {
      addLog("Error checking email status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    hasEmailError,
    clearEmailError,
    onSubmit,
  };
}
