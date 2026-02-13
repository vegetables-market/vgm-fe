import { useState } from "react";
import { useRouter } from "next/navigation";
import { resendCode } from "@/services/auth/resend-code";
import { getErrorMessage } from "@/lib/api/error-handler";
import { useResendCooldown } from "@/hooks/auth/verification/useVerificationCountdown";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

type UseChallengeResendParams = {
  flowId?: string | null;
  nextResendAt?: string | null;
  redirectTo?: string | null;
  setError: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
  verificationType?: "email" | "email_mfa"; // For URL parameter construction
  token?: string | null; // For email_mfa URL parameter
};

export function useChallengeResend({
  flowId,
  nextResendAt,
  redirectTo,
  setError,
  setSuccessMsg,
  verificationType = "email",
  token,
}: UseChallengeResendParams) {
  const [isResending, setIsResending] = useState(false);
  const { resendCooldown } = useResendCooldown(nextResendAt || undefined);
  const router = useRouter();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const onResend = async () => {
    if (isResending || (resendCooldown && resendCooldown > 0)) return;
    if (!flowId) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg("認証コードを再送しました。");

      // Reload page with new params
      // Default to email params, but support email_mfa if needed
      let base = `/challenge?type=${verificationType}&flow_id=${data.flow_id}&expires_at=${data.expires_at}&next_resend_at=${data.next_resend_at}`;
      
      if (verificationType === "email_mfa" && token) {
         base += `&token=${encodeURIComponent(token)}`;
      }

      const newUrl = withRedirectTo(base, redirectTo);
      router.replace(newUrl);
    } catch (err: any) {
      if (
        err.info?.error === "RESEND_LIMIT_EXCEEDED" ||
        err.message?.includes("再送回数の上限")
      ) {
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
