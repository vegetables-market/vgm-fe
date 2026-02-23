import { fetchApi } from "@/lib/api/fetch";
import type { LoginResponseDto } from "@/service/auth/dto/login-response-dto";
import type { VerifyLoginRequestDto } from "@/service/auth/challenge/dto/verify-login-request-dto";

export async function verifyLogin(
  request: VerifyLoginRequestDto,
): Promise<LoginResponseDto> {
  return fetchApi<LoginResponseDto>("/v1/auth/verify-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });
}
