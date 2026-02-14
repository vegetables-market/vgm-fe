export type VerificationMode = "email" | "email_mfa" | "totp" | "password";

export interface UserInfo {
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  isEmailVerified?: boolean;
}

export interface SignupFormData {
  email: string;
  username: string;
  password: string;
  name: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  flow_id?: string;
  expiresAt?: string;
}

export interface LoginResult {
  status: "AUTHENTICATED" | "MFA_REQUIRED" | "VERIFICATION_REQUIRED" | "FAILED";
  user?: UserInfo;
  mfa_required?: boolean;
  mfa_type?: string;
  mfa_token?: string;
  require_verification?: boolean;
  flow_id?: string;
  masked_email?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

