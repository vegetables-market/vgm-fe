import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { DisableTotpRequest, DisableTotpResponse } from '@/types/auth';

/**
 * TOTP無効化
 */
export const disableTotp = async (
  request: DisableTotpRequest
): Promise<DisableTotpResponse> => {
  return fetchApi<DisableTotpResponse>(API_ENDPOINTS.TOTP_DISABLE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
};
