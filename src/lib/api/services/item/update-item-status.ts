import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';

export const updateItemStatus = async (
  itemId: number,
  status: number
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
};
