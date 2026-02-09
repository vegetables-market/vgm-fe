import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';

export const deleteItem = async (itemId: number): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    method: 'DELETE',
  });
};
