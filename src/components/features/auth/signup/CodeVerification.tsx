"use client";

import VerificationInputForm from "@/components/features/auth/shared/VerificationInputForm";
import { useSignupCodeVerification } from "@/hooks/auth/verification/useSignupCodeVerification";
import { SignupFormData } from "@/components/features/auth/types";

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
    <VerificationInputForm
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

