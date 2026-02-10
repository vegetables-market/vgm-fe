"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { getErrorMessage } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import { useSafeRedirect } from "@/hooks/navigation/useSafeRedirect";
import { withRedirectTo } from "@/lib/next/withRedirectTo";
import EmailVerificationForm from "./EmailVerificationForm";

interface EmailMfaVerificationProps {
  mfaToken: string;
  redirectTo?: string;
}

export default function EmailMfaVerification({
  mfaToken,
  redirectTo,
}: EmailMfaVerificationProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { pushRedirect } = useSafeRedirect();

  useEffect(() => {
    // localStorageからmasked_emailを取得（ログインレスポンスで保存されているはず）
    const storedEmail = localStorage.getItem("vgm_masked_email");
    if (storedEmail) {
      setMaskedEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // MFA認証 (verifyLogin) を使用
      const data = await verifyLogin({
        method: AuthMethod.TOTP,
        identifier: mfaToken,
        code,
      });

      if (data.user) {
        authLogin(data.user);
        localStorage.removeItem("vgm_masked_email");
        pushRedirect(redirectTo, "/");
      } else if (data.require_verification && data.flow_id) {
        // 万が一、MFA後にさらにEmail Verificationが必要な場合
        router.push(
          withRedirectTo(`/challenge?type=email&flow_id=${data.flow_id}`, redirectTo),
        );
      } else {
        setError("ログインに失敗しました。");
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmailVerificationForm
      code={code}
      setCode={setCode}
      maskedEmail={maskedEmail}
      error={error}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}
