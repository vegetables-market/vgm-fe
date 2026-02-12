import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { resendCode } from "@/services/auth/resend-code";
import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import {
  useVerificationCountdown,
  useResendCooldown,
} from "@/hooks/auth/verification/useVerificationCountdown";

type UseEmailChallengeParams = {
  flowId: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export function useEmailChallenge({
  flowId,
  redirectTo,
  expiresAt,
  nextResendAt,
}: UseEmailChallengeParams) {
  const { 
    code, setCode, 
    error, setError, 
    isLoading, setIsLoading,
    successMsg, setSuccessMsg 
  } = useOtpInput();
  
  const [isResending, setIsResending] = useState(false);
  
  const { timeLeft } = useVerificationCountdown(expiresAt || undefined);
  const { resendCooldown } = useResendCooldown(nextResendAt || undefined);

  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleLoginSuccess = (data: any) => {
    addLog(`Login verification successful: ${JSON.stringify(data)}`);
    if (data.user) {
      authLogin(data.user);
      localStorage.removeItem("vgm_masked_email");
      pushRedirect(redirectTo, "/");
    } else if (data.require_verification && data.flow_id) {
       router.push(
          withRedirectTo(
            `/challenge?type=email&flow_id=${data.flow_id}`,
            redirectTo,
          ),
        );
    } else {
      setError("ログインに失敗しました。");
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

      // Reload page with new params (flow_id changed)
      const base = `/challenge?type=email&flow_id=${data.flow_id}&expires_at=${data.expires_at}&next_resend_at=${data.next_resend_at}`;
      const newUrl = withRedirectTo(base, redirectTo);
      router.replace(newUrl);
    } catch (err: any) {
       if (
        err.info?.error === "RESEND_LIMIT_EXCEEDED" ||
        err.message?.includes("再送回数の上限")
      ) {
        setError(
          "再送回数の上限に達しました。ログイン画面に戻ります。",
        );
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

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    if (!flowId) {
       setError("フローIDが見つかりません。");
       return;
    }

    setIsLoading(true);
    setError("");
    addLog(`Submitting email verification`);

    try {
      // 1. Try verifyAuthCode (Signup flow)
      try {
        const codeResult = await verifyAuthCode(flowId, code);
        addLog(`Code verification successful: ${JSON.stringify(codeResult)}`);

        if (codeResult.verified) {
          const targetEmail = codeResult.email || "";
          router.push(
            withRedirectTo(
              `/signup?email=${encodeURIComponent(
                targetEmail,
              )}&flow_id=${flowId}&verified=true`,
              redirectTo,
            ),
          );
          return;
        }
      } catch (codeErr: any) {
         addLog(`Code verification failed, trying login flow: ${getErrorMessage(codeErr)}`);
         // 2. Fallback to Login Unknown Device flow
         const data = await verifyLogin({
            method: AuthMethod.EMAIL,
            identifier: flowId,
            code,
          });
          handleLoginSuccess(data);
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      handleGlobalError(err, router);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    error,
    successMsg,
    isLoading,
    isResending,
    timeLeft,
    resendCooldown,
    onResend,
    onSubmit,
  };
}
