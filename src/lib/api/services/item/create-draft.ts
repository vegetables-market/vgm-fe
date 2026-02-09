import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { CreateDraftResponse } from '../../types';

export const createDraft = async (): Promise<CreateDraftResponse> => {
  return fetchApi<CreateDraftResponse>(`${API_ENDPOINTS.ITEMS}/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
