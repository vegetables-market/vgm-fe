"use client";

import VerificationInputForm from "@/components/features/auth/shared/VerificationInputForm";
import { useMfaChallenge } from "@/hooks/auth/challenge/useMfaChallenge";
import { VerificationMode } from "@/types/auth/core";

type MfaChallengeProps = {
  mode: VerificationMode;
  mfaToken: string | null;
  flowId?: string | null;
  redirectTo?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export default function MfaChallenge({
  mode,
  mfaToken,
  flowId,
  redirectTo,
  expiresAt,
  nextResendAt,
}: MfaChallengeProps) {
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
  } = useMfaChallenge({
    mode,
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
          {mode === "totp" ? (
            <>
              認証アプリに表示されている
              <br />
              6桁のコードを入力してください。
            </>
          ) : (
            <>
              メールアドレスに送信された
              <br />
              6桁の認証コードを入力してください。
            </>
          )}
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
