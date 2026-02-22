import { useState } from "react";
import { useRouter } from "next/navigation";
import { resendCode } from "@/service/auth/resend-code";
import { getErrorMessage } from "@/lib/api/error-handler";
import { useResendCooldown } from "@/hooks/auth/verification/useVerificationCountdown";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { addAuthLog } from "@/lib/auth/debug/add-auth-log";

type UseChallengeResendParams = {
  flowId?: string | null;
  nextResendAt?: string | null;
  redirectTo?: string | null;
  maskedEmail?: string | null;
  setError: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
  verificationType?: "email" | "email_mfa";
  token?: string | null;
};

type ResendLimitError = {
  info?: {
    error?: string;
  };
};

function isResendLimitExceededError(err: unknown): boolean {
  if (err instanceof Error && err.message.includes("上限")) return true;
  if (typeof err !== "object" || err === null) return false;

  const maybeError = err as ResendLimitError;
  return maybeError.info?.error === "RESEND_LIMIT_EXCEEDED";
}

export function useChallengeResend({
  flowId,
  nextResendAt,
  redirectTo,
  maskedEmail,
  setError,
  setSuccessMsg,
  verificationType = "email",
  token,
}: UseChallengeResendParams) {
  const [isResending, setIsResending] = useState(false);
  const { resendCooldown } = useResendCooldown(nextResendAt || undefined);
  const router = useRouter();

  const onResend = async () => {
    if (isResending || (resendCooldown && resendCooldown > 0)) return;
    if (!flowId) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await resendCode({ flow_id: flowId });
      addAuthLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg("認証コードを再送しました。");

      const params = new URLSearchParams();
      params.set("type", verificationType);
      params.set("flow_id", data.flow_id);
      params.set("next_resend_at", data.next_resend_at);
      params.set("resent", "true");
      if (maskedEmail) params.set("masked_email", maskedEmail);
      if (verificationType === "email_mfa" && token) params.set("token", token);

      const newUrl = withRedirectTo(`/challenge?${params.toString()}`, redirectTo);
      router.replace(newUrl);
    } catch (err: unknown) {
      if (isResendLimitExceededError(err)) {
        setError("再送回数の上限に達しました。ログイン画面に戻ります。");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }

      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    resendCooldown,
    onResend,
  };
}
