import type { UserInfo } from "@/lib/auth/shared/types/user-info";

export type RegisterResponseDto = {
  status: string;
  user: UserInfo;
  require_verification?: boolean;
  flow_id?: string;
  masked_email?: string;
};
