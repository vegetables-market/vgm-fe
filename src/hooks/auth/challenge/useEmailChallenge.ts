
import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";

import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import {
  useVerificationCountdown,
} from "@/hooks/auth/verification/useVerificationCountdown";
import { useChallengeResend } from "@/hooks/auth/challenge/useChallengeResend";

type UseEmailChallengeParams = {
  flowId: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
  onVerifiedAction?: (data?: any) => void;
};

export function useEmailChallenge({
  flowId,
  redirectTo,
  expiresAt,
  nextResendAt,
  onVerifiedAction,
}: UseEmailChallengeParams) {
  const { 
    code, setCode, 
    error, setError, 
    isLoading, setIsLoading,
    successMsg, setSuccessMsg 
  } = useOtpInput();
  
  /* New Hook Usage */
  const { isResending, resendCooldown, onResend } = useChallengeResend({
    flowId,
    nextResendAt,
    redirectTo,
    setError,
    setSuccessMsg: setSuccessMsg as (msg: string) => void,
    verificationType: "email",
  });

  const { timeLeft } = useVerificationCountdown(expiresAt || undefined);
  
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
          if (onVerifiedAction) {
            onVerifiedAction(codeResult);
          } else {
            const targetEmail = codeResult.email || "";
            router.push(
              withRedirectTo(
                `/signup?email=${encodeURIComponent(
                  targetEmail,
                )}&flow_id=${flowId}&verified=true`,
                redirectTo,
              ),
            );
          }
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
