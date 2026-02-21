import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { validatePassword } from "@/service/auth/password-validation";

type UsePasswordEntryParams = {
  password: string;
  onNext: () => void;
};

export function usePasswordEntry({ password, onNext }: UsePasswordEntryParams) {
  const [showError, setShowError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validations = useMemo(() => validatePassword(password), [password]);

  const clearError = () => setShowError(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

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
    isPasswordVisible,
    validations,
    clearError,
    togglePasswordVisibility,
    handleSubmit,
  };
}

