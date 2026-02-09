import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { EnableTotpRequest, EnableTotpResponse } from '@/types/auth';

/**
 * TOTP有効化開始
 */
export const enableTotp = async (
  request: EnableTotpRequest
): Promise<EnableTotpResponse> => {
  return fetchApi<EnableTotpResponse>(API_ENDPOINTS.TOTP_ENABLE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
};
