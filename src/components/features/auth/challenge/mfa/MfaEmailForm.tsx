"use client";

import VerificationInputForm from "@/components/features/auth/shared/VerificationInputForm";
import { useMfaEmail } from "@/hooks/auth/challenge/useMfaEmail";

type MfaEmailFormProps = {
  mfaToken: string | null;
  flowId?: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export default function MfaEmailForm({
  mfaToken,
  flowId,
  redirectTo,
  expiresAt,
  nextResendAt,
}: MfaEmailFormProps) {
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
  } = useMfaEmail({
    mfaToken,
    flowId,
    redirectTo,
    expiresAt,
    nextResendAt,
  });

  return (
    <VerificationInputForm
      code={code}
      setCode={setCode}
      description={
        <div className="text-center text-sm text-gray-300">
          メールアドレスに送信された
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
