import type { Dispatch, SetStateAction } from "react";
import type { SignupFormData } from "@/components/features/auth/types";

export interface EmailEntryProps {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  addLog: (msg: string) => void;
  redirectTo?: string | null;
}

export interface PasswordEntryProps {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export interface UsernameEntryProps {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export interface ProfileEntryProps {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export interface TermsAgreementProps {
  onSubmit: () => void;
  loading: boolean;
}
