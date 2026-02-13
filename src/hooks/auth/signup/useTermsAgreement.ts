import { useState } from "react";
import type { FormEvent } from "react";

type UseTermsAgreementParams = {
  onSubmit: () => void;
};

export function useTermsAgreement({ onSubmit }: UseTermsAgreementParams) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    onSubmit();
  };

  return {
    agreed,
    setAgreed,
    handleSubmit,
  };
}

