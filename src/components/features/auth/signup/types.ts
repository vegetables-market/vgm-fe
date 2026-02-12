import type { Dispatch, SetStateAction } from "react";
import type { SignupFormData } from "@/components/features/auth/types";

export interface EmailEntryProps {
  formData: SignupFormData;
  setFormData: Dispatch<SetStateAction<SignupFormData>>;
  addLog: (msg: string) => void;
  redirectTo?: string | null;
}

