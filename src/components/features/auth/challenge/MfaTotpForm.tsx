"use client";

import VerificationInputForm from "@/components/features/auth/shared/VerificationInputForm";
import { useMfaTotp } from "@/hooks/auth/challenge/useMfaTotp";

type MfaTotpFormProps = {
  mfaToken: string | null;
  redirectTo?: string | null;
};

export default function MfaTotpForm({
  mfaToken,
  redirectTo,
}: MfaTotpFormProps) {
  const {
    code,
    setCode,
    error,
    successMsg,
    isLoading,
    onSubmit,
  } = useMfaTotp({
    mfaToken,
    redirectTo,
  });

  return (
    <VerificationInputForm
      code={code}
      setCode={setCode}
      description={
        <div className="text-center text-sm text-gray-300">
          認証アプリに表示されている
          <br />
          6桁のコードを入力してください。
        </div>
      }
      error={error}
      successMsg={successMsg}
      isLoading={isLoading}
      onSubmit={onSubmit}
      // TOTP mode has no resend functionality
      onResend={undefined}
      timeLeft={null}
      resendCooldown={null}
    />
  );
}
