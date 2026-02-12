"use client";

import VerificationCodeForm from "@/components/features/auth/step/VerificationCodeForm";
import {
  useVerificationFlow,
  VerificationMode,
} from "@/hooks/auth/verification/useVerificationFlow";

type VerificationContainerProps = {
  mode: VerificationMode;
  flowId?: string | null;
  mfaToken?: string | null;
  action?: string | null;
  redirectTo?: string | null;
  maskedEmail?: string | null;
  expiresAt?: string | null;
  nextResendAt?: string | null;
};

export default function VerificationContainer(
  props: VerificationContainerProps,
) {
  const {
    code,
    setCode,
    error,
    successMsg,
    isLoading,
    isResending,
    maskedEmail,
    timeLeft,
    resendCooldown,
    onSubmit,
    onResend,
  } = useVerificationFlow(props);

  // Determine description based on mode
  let description: React.ReactNode = undefined;
  if (props.mode === "totp") {
    description = (
      <>
        認証アプリ(Authenticator)に表示されている
        <br />
        6桁のコードを入力してください。
      </>
    );
  }

  // Determine displayed email (priority: hook state > prop)
  const displayEmail = maskedEmail || props.maskedEmail || null;

  return (
    <VerificationCodeForm
      code={code}
      setCode={setCode}
      emailDisplay={displayEmail}
      error={error}
      successMsg={successMsg}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onResend={onResend}
      isResending={isResending}
      timeLeft={timeLeft}
      resendCooldown={resendCooldown}
      description={description}
    />
  );
}
