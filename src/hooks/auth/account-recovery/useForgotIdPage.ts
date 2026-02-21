import { useState } from "react";
import type { FormEvent } from "react";
import { requestIdRecovery } from "@/service/auth/recovery/request-id-recovery";

export function useForgotIdPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await requestIdRecovery(email);
    } catch (error) {
      // セキュリティ上、失敗有無は画面で区別しない
      console.error("Forgot ID error:", error);
    } finally {
      setIsLoading(false);
      setIsSent(true);
    }
  };

  return {
    email,
    isSent,
    isLoading,
    setEmail,
    onSubmit,
  };
}
