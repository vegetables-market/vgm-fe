import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { resendCode } from "@/services/auth/resend-code";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import {
  useVerificationCountdown,
  useResendCooldown,
} from "@/hooks/auth/verification/useVerificationCountdown";
import { VerificationMode } from "@/components/features/auth/types";

type UseMfaChallengeParams = {
  mode: VerificationMode; // email_mfa or totp
  mfaToken: string | null;
  flowId?: string | null; // Needed for resend if email_mfa
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export function useMfaChallenge({ 
  mode, 
  mfaToken, 
  flowId,
  redirectTo,
  expiresAt,
  nextResendAt
}: UseMfaChallengeParams) {
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
    addLog(`MFA verification successful: ${JSON.stringify(data)}`);
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
    if (mode === "totp") return;
    if (isResending || (resendCooldown && resendCooldown > 0)) return;
    if (!flowId) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful (MFA). New flow_id: ${data.flow_id}`);
      setSuccessMsg("認証コードを再送しました。");

      // Reload page (MFA usually keeps same mfa_token? Or maybe flow_id changes and needs to be updated in URL?)
      // If result has flow_id, update URL parameter
      const base = `/challenge?type=email_mfa&token=${encodeURIComponent(mfaToken || "")}&flow_id=${data.flow_id}&expires_at=${data.expires_at}&next_resend_at=${data.next_resend_at}`;
      const newUrl = withRedirectTo(base, redirectTo);
      router.replace(newUrl);
    } catch (err: any) {
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

    if (!mfaToken) {
       setError("MFAトークンが見つかりません。");
       return;
    }

    setIsLoading(true);
    setError("");
    addLog(`Submitting MFA verification: ${mode}`);

    try {
      const data = await verifyLogin({
        method: AuthMethod.TOTP,
        identifier: mfaToken,
        code,
      });
      handleLoginSuccess(data);
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
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
    onResend: mode === "totp" ? undefined : onResend,
    onSubmit,
  };
}
