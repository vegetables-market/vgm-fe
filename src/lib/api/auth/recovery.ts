import { API_ENDPOINTS } from "../api-endpoint";
import { fetchApi } from "../fetch";
import type { RecoveryMethod } from "@/lib/auth/recovery/types/recovery-method";
import type { GetRecoveryOptionsResponseDto } from "@/service/auth/recovery/dto/get-recovery-options-response-dto";
import type { StartPasswordRecoveryResponseDto } from "@/service/auth/recovery/dto/start-password-recovery-response-dto";
import type { VerifyRecoveryChallengeResponseDto } from "@/service/auth/recovery/dto/verify-recovery-challenge-response-dto";

export const recoveryApi = {
  start: async (username: string): Promise<StartPasswordRecoveryResponseDto> => {
    return fetchApi<StartPasswordRecoveryResponseDto>(API_ENDPOINTS.RECOVERY_START, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  getOptions: async (state: string): Promise<GetRecoveryOptionsResponseDto> => {
    return fetchApi<GetRecoveryOptionsResponseDto>(`${API_ENDPOINTS.RECOVERY_OPTIONS}?state=${state}`);
  },

  sendChallenge: async (state: string, method: RecoveryMethod): Promise<void> => {
    return fetchApi(API_ENDPOINTS.RECOVERY_SEND, {
      method: "POST",
      body: JSON.stringify({ state, method }),
    });
  },

  verifyChallenge: async (state: string, method: RecoveryMethod, code: string): Promise<VerifyRecoveryChallengeResponseDto> => {
    return fetchApi<VerifyRecoveryChallengeResponseDto>(API_ENDPOINTS.RECOVERY_VERIFY, {
      method: "POST",
      body: JSON.stringify({ state, method, code }),
    });
  },

  completeRecovery: async (state: string): Promise<void> => {
    return fetchApi(API_ENDPOINTS.RECOVERY_COMPLETE, {
      method: "POST",
      body: JSON.stringify({ state }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return fetchApi(API_ENDPOINTS.PASSWORD_RESET, {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  },

  forgotId: async (email: string): Promise<void> => {
    return fetchApi(API_ENDPOINTS.RECOVERY_ID_REMINDER, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
