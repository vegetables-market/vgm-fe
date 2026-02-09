import { fetchApi } from '../../client';

export const confirmPayment = async (
  orderId: number,
  paymentIntentId: string
): Promise<any> => {
  return fetchApi(`/api/payment/confirm/${orderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentIntentId }),
  });
};
