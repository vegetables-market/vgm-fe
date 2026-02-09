import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useChallenge() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // デフォルトはemailとする（既存互換性のため）
  const type =
    searchParams.get("type") || (searchParams.get("flow_id") ? "email" : null);
  const flowId = searchParams.get("flow_id");
  const mfaToken = searchParams.get("token") || searchParams.get("mfa_token");
  const action = searchParams.get("action"); // delete_account など
  const maskedEmail = searchParams.get("masked_email");
  const expiresAt = searchParams.get("expires_at");
  const nextResendAt = searchParams.get("next_resend_at");
  const redirectTo = searchParams.get("redirect_to");

  useEffect(() => {
    if (!type) {
      setError("不正なリクエストです。");
    }
  }, [type]);

  const handleReturnToLogin = () => {
    if (redirectTo) {
      router.push(`/login?redirect_to=${encodeURIComponent(redirectTo)}`);
      return;
    }
    router.push("/login");
  };

  return {
    state: {
      error,
      type,
      flowId,
      mfaToken,
      action,
      maskedEmail,
      expiresAt,
      nextResendAt,
      redirectTo,
    },
    actions: {
      handleReturnToLogin,
    },
  };
}
