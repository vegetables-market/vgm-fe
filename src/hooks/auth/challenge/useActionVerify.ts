import { useRouter } from "next/navigation";
import { verifyAction } from "@/services/auth/verify-action";
import { AuthMethod } from "@/services/auth/verify-login";
import { useOtpInput } from "@/hooks/auth/shared/useOtpInput";
import { getErrorMessage } from "@/lib/api/error-handler";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";
import { VerificationMode } from "@/types/auth/core";

type UseActionVerifyParams = {
  mode: VerificationMode;
  identifier: string | null; // flowId or mfaToken
  action: string;
  redirectTo?: string | null;
};

export function useActionVerify({ mode, identifier, action, redirectTo }: UseActionVerifyParams) {
  const { 
    code, setCode, 
    error, setError, 
    isLoading, setIsLoading,
    successMsg 
  } = useOtpInput();
  
  const router = useRouter();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError("隱崎ｨｼ繧ｳ繝ｼ繝峨・6譯√〒縺吶・);
      return;
    }

    if (!identifier) {
       setError("隴伜挨蟄舌′隕九▽縺九ｊ縺ｾ縺帙ｓ縲・);
       return;
    }

    setIsLoading(true);
    setError("");
    addLog(`Submitting action verification: ${action}`);

    try {
      const method = mode === "totp" ? AuthMethod.TOTP : AuthMethod.EMAIL;
      
      const data = await verifyAction({
        method,
        identifier,
        code,
        action,
      });
      addLog(`Action verification successful: ${JSON.stringify(data)}`);

      const safe = safeRedirectTo(redirectTo);
      if (data.action_token && safe) {
        const separator = safe.includes("?") ? "&" : "?";
        router.push(`${safe}${separator}action_token=${data.action_token}`);
      } else {
        // No redirect specified, maybe just success message or callback?
        // Default behavior if not redirected
        // router.push("/"); // ??
      }
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
