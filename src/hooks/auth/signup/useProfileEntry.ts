import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { SignupFormData } from "@/components/features/auth/types";
import { validateProfile } from "@/services/auth/profile-validation";

type UseProfileEntryParams = {
  formData: SignupFormData;
  onNext: () => void;
};

export function useProfileEntry({ formData, onNext }: UseProfileEntryParams) {
  const [showError, setShowError] = useState(false);

  const validations = useMemo(() => validateProfile(formData), [formData]);

  const clearError = () => setShowError(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validations.isValid) {
      setShowError(true);
      return;
    }
    onNext();
  };

  return {
    showError,
    validations,
    clearError,
    handleSubmit,
  };
}

