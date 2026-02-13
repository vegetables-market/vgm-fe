import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import { useVerificationCountdown } from "@/hooks/auth/verification/useVerificationCountdown";
import { useChallengeResend } from "@/hooks/auth/challenge/useChallengeResend";
import { VerificationMode } from "@/types/auth/core";
import { verifyAction } from "@/services/auth/verify-action";

export type UseChallengeLogicParams = {
  mode: VerificationMode;
  flowId?: string | null;
  mfaToken?: string | null;
  action?: string | null;
  identifier?: string | null; // For Action verification
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
  onVerifiedAction?: (data?: any) => void;
};

export function useChallengeLogic({
  mode,
  flowId,
  mfaToken,
  action,
  identifier,
  redirectTo,
  expiresAt,
  nextResendAt,
  onVerifiedAction,
}: UseChallengeLogicParams) {
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

  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();

  // --- Resend Logic ---
  // Only applicable for "email" and "email_mfa" modes.
  // "totp" does not support resend.
  const isResendSupported = mode === "email" || mode === "email_mfa";
  
  const { isResending, resendCooldown, onResend } = useChallengeResend({
    flowId,
    nextResendAt,
    redirectTo,
    setError,
    setSuccessMsg: setSuccessMsg as (msg: string) => void,
    verificationType: mode === "email_mfa" ? "email_mfa" : "email",
    token: mfaToken,
  });

  const { timeLeft } = useVerificationCountdown(expiresAt || undefined);

  // --- Submit Logic ---
  const handleLoginSuccess = (data: any) => {
    if (data.user) {
      authLogin(data.user);
      localStorage.removeItem("vgm_masked_email");
      pushRedirect(redirectTo, "/");
    } else if (data.require_verification && data.flow_id) {
       // e.g. Email MFA -> TOTP fallback or next step
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

  const onSubmit = async () => {
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (mode === "email") {
        // 1. Email Verification (Signup or Login Unknown Device)
        try {
          // Attempt Signup Verification first
           if (flowId) {
             const codeResult = await verifyAuthCode(flowId, code);
             if (codeResult.verified) {
               if (onVerifiedAction) {
                 onVerifiedAction(codeResult);
                 return;
               }
               // Signup Verified -> Redirect to specific signup step or complete
               const targetEmail = codeResult.email || "";
                router.push(
                  withRedirectTo(
                    `/signup?email=${encodeURIComponent(targetEmail)}&flow_id=${flowId}&verified=true`,
                    redirectTo,
                  ),
                );
                return;
             }
           }
        } catch (ignored) {
          // If verifyAuthCode fails (e.g. flowId is for login), fall through to verifyLogin
        }

        // Fallback: Login Unknown Device
        if (flowId) {
          const data = await verifyLogin({
            method: AuthMethod.EMAIL,
            identifier: flowId,
            code,
          });
          handleLoginSuccess(data);
        } else {
          throw new Error("フローIDが見つかりません。");
        }

      } else if (mode === "totp") {
        // 2. TOTP Verification
        if (!mfaToken) throw new Error("MFAトークンが見つかりません。");
        const data = await verifyLogin({
            method: AuthMethod.TOTP,
            identifier: mfaToken,
            code,
        });
        handleLoginSuccess(data);

      } else if (mode === "email_mfa") {
        // 3. Email MFA (Login Known Device)
        // Not widely used yet but supported by hooks
        // Implementation would parallel TOTP but with Email method? 
        // Current backend likely treats this similar to generic Login
         if (!mfaToken) throw new Error("MFAトークンが見つかりません。");
         // Assuming backend handles email_mfa via verifyLogin or similar
         // For now, if implemented, it would likely use verifyLogin with AuthMethod.EMAIL_MFA if it existed,
         // or re-use logic. Given existing code, let's treat it as not fully implemented or same as Login
         setError("この認証モードは現在サポートされていません。");

      } else if (action) {
        // 4. Action Verification (Delete Account etc)
        const id = identifier || (mode === "totp" ? mfaToken : flowId);
        if (!id) throw new Error("識別子が見つかりません。");
        
        const method = mode === "totp" ? AuthMethod.TOTP : AuthMethod.EMAIL;
        await verifyAction({
          method,
          identifier: id,
          code,
          action,
        });

        setSuccessMsg("認証に成功しました。");
        // Action specific redirects could be handled here or by caller
        // For now, just show success
        if (action === "delete_account") {
             // Handle account deletion success flow
             // Maybe redirect to a goodbye page or logout
             // For now pending specific requirement
        }
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
    isResendSupported,
    onResend,
    onSubmit,
  };
}
