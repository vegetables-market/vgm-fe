import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { UploadTokenResponse } from '../../types';

export const getUploadToken = async (): Promise<UploadTokenResponse> => {
  return fetchApi<UploadTokenResponse>(`${API_ENDPOINTS.ITEMS}/upload-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
