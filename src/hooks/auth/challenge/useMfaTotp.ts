import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

type UseMfaTotpParams = {
  mfaToken: string | null;
  redirectTo?: string | null;
};

export function useMfaTotp({
  mfaToken,
  redirectTo,
}: UseMfaTotpParams) {
  const {
    code, setCode,
    error, setError,
    isLoading, setIsLoading,
    successMsg // Not typically used in TOTP but kept for consistency if needed
  } = useOtpInput();

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
    addLog(`Submitting MFA verification: totp`);

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
    onSubmit,
  };
}
