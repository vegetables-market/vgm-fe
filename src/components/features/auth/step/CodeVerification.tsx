"use client";

import VerificationCodeForm from "@/components/features/auth/step/VerificationCodeForm";
import { useSignupCodeVerification } from "@/hooks/auth/verification/useSignupCodeVerification";
import { SignupFormData } from "@/types/auth/user";

interface CodeVerificationProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
  flowId: string | null;
  expiresAt?: string;
}

export default function CodeVerification({
  formData,
  setFormData: _setFormData,
  onNext,
  flowId,
  expiresAt,
}: CodeVerificationProps) {
  const { code, setCode, error, isLoading, timeLeft, onSubmit } =
    useSignupCodeVerification({
      flowId,
      expiresAt,
      onVerified: onNext,
    });

  return (
    <VerificationCodeForm
      code={code}
      setCode={setCode}
      emailDisplay={formData.email}
      error={error}
      isLoading={isLoading}
      onSubmit={onSubmit}
      timeLeft={timeLeft}
    />
  );
}

