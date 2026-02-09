import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { Item } from '../../types';

export const getMyItems = async (): Promise<Item[]> => {
  return fetchApi<Item[]>(`${API_ENDPOINTS.ITEMS}/me`, {
    method: 'GET',
  });
};
