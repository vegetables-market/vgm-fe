import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { VerifyTotpRequest, VerifyTotpResponse } from '@/types/auth';

/**
 * TOTP検証＆有効化
 */
export const verifyAndEnableTotp = async (
  request: VerifyTotpRequest
): Promise<VerifyTotpResponse> => {
  return fetchApi<VerifyTotpResponse>(API_ENDPOINTS.TOTP_VERIFY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
};
