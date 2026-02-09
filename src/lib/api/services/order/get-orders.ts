import { fetchApi } from '../../client';

export const getOrders = async (buyerId: number): Promise<any[]> => {
  return fetchApi(`/api/orders?buyerId=${buyerId}`, { method: 'GET' });
};
