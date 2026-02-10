"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCircleExclamation } from "react-icons/fa6";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { verifyAction } from "@/services/auth/verify-action";
import { getErrorMessage } from "@/lib/api/error-handler";
import OtpInput from "@/components/features/auth/OtpInput";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { safeRedirectTo } from "@/lib/next/safeRedirectTo";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

interface TotpVerificationProps {
  mfaToken: string;
  action?: string;
  redirectTo?: string;
}

export default function TotpVerification({
  mfaToken,
  action,
  redirectTo,
}: TotpVerificationProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    setIsLoading(true);
    setError("");
    addLog("Verifying MFA code...");

    try {
      const request = {
        method: AuthMethod.TOTP,
        identifier: mfaToken,
        code,
      };

      // アクションがある場合は verifyAction、ない場合は verifyLogin
      if (action) {
        const data = await verifyAction({ ...request, action });
        addLog(`Action verification successful: ${JSON.stringify(data)}`);

        // Action Token Flow
        const safe = safeRedirectTo(redirectTo);
        if (data.action_token && safe) {
          const separator = safe.includes("?") ? "&" : "?";
          router.push(
            `${safe}${separator}action_token=${data.action_token}`,
          );
          return;
        }
      } else {
        const data = await verifyLogin(request);
        addLog(`MFA Verify response: ${data.status}`);

        if (data.user) {
          addLog("MFA login successful!");
          authLogin(data.user);
          pushRedirect(redirectTo, "/");
        } else if (data.require_verification && data.flow_id) {
          // MFA後にさらにメール認証が必要な場合（まれなケース）
          router.push(
            withRedirectTo(
              `/challenge?type=email&flow_id=${data.flow_id}`,
              redirectTo,
            ),
          );
        } else {
          setError("ログインに失敗しました。");
        }
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message); // "Invalid verification code" など
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 p-2 text-center text-[11px] text-white">
          <FaCircleExclamation className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      <div className="mb-5 w-full">
        <p className="mb-4 text-center text-[13px] text-gray-300">
          認証アプリ（Authenticator）に表示されている
          <br />
          6桁のコードを入力してください。
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <OtpInput value={code} onChange={setCode} disabled={isLoading} />
          </div>

          <button
            type="submit"
            className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black transition-colors hover:bg-gray-200 disabled:opacity-50"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "認証中..." : "認証する"}
          </button>
        </form>
      </div>
    </div>
  );
}
