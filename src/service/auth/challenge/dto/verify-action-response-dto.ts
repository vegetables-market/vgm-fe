import type { UserInfo } from "@/lib/auth/shared/types/user-info";

export type VerifyActionResponseDto = {
  success: boolean;
  action_token: string;
  user: UserInfo | null;
  action: string;
};
