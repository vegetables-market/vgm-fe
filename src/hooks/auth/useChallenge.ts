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

  useEffect(() => {
    if (!type) {
      setError("不正なリクエストです。");
    }
  }, [type]);

  const handleReturnToLogin = () => {
    router.push("/login");
  };

  return {
    state: {
      error,
      type,
      flowId,
      mfaToken,
    },
    actions: {
      handleReturnToLogin,
    },
  };
}
