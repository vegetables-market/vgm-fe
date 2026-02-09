import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';

export const linkImages = async (
  itemId: number,
  filenames: string[]
): Promise<void> => {
  return fetchApi(`${API_ENDPOINTS.ITEMS}/${itemId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filenames }),
  });
};
