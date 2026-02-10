"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin, AuthMethod } from "@/services/auth/verify-login";
import { verifyAction } from "@/services/auth/verify-action";
import { resendCode } from "@/services/auth/resend-code";
import { verifyAuthCode } from "@/services/auth/verify-auth-code";
import { getErrorMessage, handleGlobalError } from "@/lib/api/error-handler";
import { useAuth } from "@/context/AuthContext";
import EmailVerificationForm from "./EmailVerificationForm";

interface EmailVerificationProps {
  flowId: string;
  expiresAt?: string;
  nextResendAt?: string;
  action?: string;
  redirectTo?: string;
  maskedEmail?: string;
}

export default function EmailVerification({
  flowId,
  expiresAt,
  nextResendAt,
  action,
  redirectTo,
  maskedEmail: propMaskedEmail,
}: EmailVerificationProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(
    propMaskedEmail || null,
  );

  // 有効期限の残り時間（秒）
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  // 再送信クールダウン（秒）
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();
  const { login: authLogin } = useAuth();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  useEffect(() => {
    // localStorageからmasked_emailを取得
    const storedEmail = localStorage.getItem("vgm_masked_email");
    if (storedEmail) {
      setMaskedEmail(storedEmail);
    }
  }, []);

  // 有効期限タイマー
  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const end = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // 再送信クールダウンタイマー (サーバー指定時刻ベース)
  useEffect(() => {
    if (!nextResendAt) {
      setResendCooldown(0);
      return;
    }

    const calculateCooldown = () => {
      const end = new Date(nextResendAt).getTime();
      const now = new Date().getTime();
      return Math.max(0, Math.floor((end - now) / 1000));
    };

    const initial = calculateCooldown();
    setResendCooldown(initial);

    // カウントダウン開始
    if (initial > 0) {
      const timer = setInterval(() => {
        const remaining = calculateCooldown();
        setResendCooldown(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [nextResendAt]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError("認証コードは6桁です。");
      return;
    }

    setIsLoading(true);
    setError("");
    addLog(`Submitting challenge for flow_id: ${flowId}`);

    try {
      // フロー1: セキュリティ確認フロー（action パラメータあり）
      if (action) {
        const data = await verifyAction({
          method: AuthMethod.EMAIL,
          identifier: flowId,
          code,
          action,
        });
        addLog(`Action verification successful: ${JSON.stringify(data)}`);

        // Action Token Flow
        if (data.action_token && redirectTo) {
          const separator = redirectTo.includes("?") ? "&" : "?";
          router.push(
            `${redirectTo}${separator}action_token=${data.action_token}`,
          );
        } else {
          // redirectTo がない場合もエラーにせず、成功として扱う
          addLog("Action verification completed without redirect");
        }
        return; // セキュリティ確認フロー完了
      }
      // フロー2 & 3: 新規登録フローまたはログインフロー
      else {
        // まず /verify-code を試す（新規登録フロー）
        try {
          const codeResult = await verifyAuthCode(flowId, code);
          addLog(`Code verification successful: ${JSON.stringify(codeResult)}`);

          if (codeResult.verified) {
            // 新規登録フロー: 登録画面へ
            const targetEmail = codeResult.email || "";
            router.push(
              `/signup?email=${encodeURIComponent(targetEmail)}&flow_id=${flowId}&verified=true`,
            );
            return;
          }
        } catch (codeErr: any) {
          // /verify-code が失敗した場合は、ログインフローとして /verify-login を試す
          addLog(
            `Code verification failed, trying login flow: ${getErrorMessage(codeErr)}`,
          );

          const data = await verifyLogin({
            method: AuthMethod.EMAIL,
            identifier: flowId,
            code,
          });
          addLog(`Login verification successful: ${JSON.stringify(data)}`);

          if (data.user) {
            // ログインフロー: ログイン完了
            authLogin(data.user);
            localStorage.removeItem("vgm_masked_email");
            router.push("/");
          } else {
            setError("ログインに失敗しました。");
          }
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

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await resendCode({ flow_id: flowId });
      addLog(`Resend successful. New flow_id: ${data.flow_id}`);
      setSuccessMsg("認証コードを再送信しました。");

      // レスポンスに含まれる next_resend_at をURLに反映させることで
      // 上記のuseEffectが発火し、クールダウンがセットされる
      const newUrl = `/challenge?type=email&flow_id=${data.flow_id}&expires_at=${data.expires_at}&next_resend_at=${data.next_resend_at}`;
      router.replace(newUrl);
    } catch (err: any) {
      // 再送信制限エラーの場合
      if (
        err.info?.error === "RESEND_LIMIT_EXCEEDED" ||
        err.message?.includes("再送信回数の上限")
      ) {
        setError("再送信回数の上限に達しました。ログイン画面に戻ります。");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }

      const message = getErrorMessage(err);
      setError(message);
      // レート制限の場合もメッセージ表示のみ
    } finally {
      setIsResending(false);
    }
  };

  return (
    <EmailVerificationForm
      code={code}
      setCode={setCode}
      maskedEmail={maskedEmail}
      error={error}
      successMsg={successMsg}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onResend={handleResend}
      isResending={isResending}
      timeLeft={timeLeft}
      resendCooldown={resendCooldown}
    />
  );
}
