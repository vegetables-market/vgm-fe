import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { useVerificationCountdown } from "@/hooks/auth/verification/useVerificationCountdown";
import { useChallengeResend } from "@/hooks/auth/challenge/useChallengeResend";

type UseMfaEmailParams = {
  mfaToken: string | null;
  flowId?: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export function useMfaEmail({
  mfaToken,
  flowId,
  redirectTo,
  expiresAt,
  nextResendAt,
}: UseMfaEmailParams) {
  const {
    code,
    setCode,
    error,
    setError,
    isLoading,
    setIsLoading,
    successMsg,
    setSuccessMsg,
  } = useOtpInput();

  const { isResending, resendCooldown, onResend } = useChallengeResend({
    flowId,
    nextResendAt,
    redirectTo,
    setError,
    setSuccessMsg: setSuccessMsg as (msg: string) => void,
    verificationType: "email_mfa",
    token: mfaToken,
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
    addLog(`Submitting MFA verification: email_mfa`);

    try {
      const data = await verifyLogin({
        method: AuthMethod.TOTP, // Backend uses TOTP method even for Email MFA currently
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
    onResend,
    onSubmit,
  };
}
