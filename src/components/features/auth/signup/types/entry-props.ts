import type { Dispatch, SetStateAction } from "react";
import type { SignupFormData } from "@/lib/auth/signup/types/signup-form-data";

export type EmailEntryProps = {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  addLog: (msg: string) => void;
  redirectTo?: string | null;
};

export type PasswordEntryProps = {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  onNext: () => void;
};

export type UsernameEntryProps = {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  onNext: () => void;
};

export type TermsAgreementProps = {
  onSubmit: () => void;
  loading: boolean;
};
