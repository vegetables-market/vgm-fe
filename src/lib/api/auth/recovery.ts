import { API_ENDPOINTS } from "../api-endpoint";
import { fetchApi } from "../fetch";

export interface StartRecoveryResponse {
  state: string;
}

export interface GetOptionsResponse {
  options: string[];
}

export interface VerifyChallengeResponse {
  verified: boolean;
}

export const recoveryApi = {
  start: async (username: string): Promise<StartRecoveryResponse> => {
    return fetchApi<StartRecoveryResponse>(API_ENDPOINTS.RECOVERY_START, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  getOptions: async (state: string): Promise<GetOptionsResponse> => {
    return fetchApi<GetOptionsResponse>(
      `${API_ENDPOINTS.RECOVERY_OPTIONS}?state=${state}`,
    );
  },

  sendChallenge: async (state: string, method: string): Promise<void> => {
    return fetchApi(API_ENDPOINTS.RECOVERY_SEND, {
      method: "POST",
      body: JSON.stringify({ state, method }),
    });
  },

  verifyChallenge: async (
    state: string,
    method: string,
    code: string,
  ): Promise<VerifyChallengeResponse> => {
    return fetchApi<VerifyChallengeResponse>(API_ENDPOINTS.RECOVERY_VERIFY, {
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
