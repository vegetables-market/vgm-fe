import type { UserInfo } from "@/lib/auth/shared/types/user-info";

export type LoginResponseDto = {
  status: string;
  user: UserInfo | null;
  require_verification?: boolean;
  flow_id?: string;
  masked_email?: string;
  requireTotp?: boolean;
  mfa_token?: string;
  mfa_type?: string;
  expires_at?: string;
  next_resend_at?: string;
  oauth_provider?: string;
  oauth_token?: string;
};
