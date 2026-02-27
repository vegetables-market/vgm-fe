import type { AuthMethodDto } from "@/service/auth/challenge/dto/auth-method-dto";

export type VerifyLoginRequestDto = {
  method: AuthMethodDto;
  identifier: string;
  code: string;
  action?: string;
};
