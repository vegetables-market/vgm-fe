"use client";

// import { useState } from "react"; // Unused
import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { useVerificationCountdown } from "@/hooks/auth/verification/useVerificationCountdown";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";

type UseSignupCodeVerificationParams = {
  flowId: string | null;
  expiresAt?: string;
  onVerified: () => void;
};

export function useSignupCodeVerification({
  flowId,
  expiresAt,
  onVerified,
}: UseSignupCodeVerificationParams) {
  const { code, setCode, error, setError, isLoading, setIsLoading } =
    useOtpInput();
  const { timeLeft } = useVerificationCountdown(expiresAt);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!flowId) {
      setError(
        "システムエラー: 認証IDが見つかりません。最初からやり直してください。",
      );
      return;
    }
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyAuthCode(flowId, code);
      if (result.verified) {
        onVerified();
      } else {
        setError("認証コードが正しくありません。");
      }
    } catch (err) {
      setError("認証に失敗しました。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    error,
    isLoading,
    timeLeft,
    onSubmit,
  };
}

