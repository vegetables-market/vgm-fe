"use client";

import VerificationInputForm from "@/components/features/auth/shared/VerificationInputForm";
import { useEmailChallenge } from "@/hooks/auth/challenge/useEmailChallenge";

type EmailVerificationProps = {
  flowId: string | null;
  maskedEmail?: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export default function EmailVerification({
  flowId,
  maskedEmail,
  redirectTo,
  expiresAt,
  nextResendAt,
}: EmailVerificationProps) {
  const {
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
  } = useEmailChallenge({
    flowId,
    redirectTo,
    expiresAt,
    nextResendAt,
  });

  return (
    <VerificationInputForm
      code={code}
      setCode={setCode}
      emailDisplay={maskedEmail || undefined}
      description={
        <div className="text-center text-sm text-gray-300">
          登録したメールアドレスに送信された
          <br />
          6桁の認証コードを入力してください。
        </div>
      }
      error={error}
      successMsg={successMsg}
      isLoading={isLoading}
      isResending={isResending}
      timeLeft={timeLeft}
      resendCooldown={resendCooldown}
      onResend={onResend}
      onSubmit={onSubmit}
    />
  );
}
