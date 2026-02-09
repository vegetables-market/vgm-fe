import { fetchApi } from '../../client';

export const getPaymentIntent = async (orderId: number): Promise<any> => {
  return fetchApi(`/api/payment/intent/${orderId}`, { method: 'GET' });
};
