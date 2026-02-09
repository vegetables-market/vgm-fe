import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';

export const updateItem = async (
  itemId: number,
  data: any
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
