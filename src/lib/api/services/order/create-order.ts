import { fetchApi } from '../../client';
import type { CreateOrderRequest, CreateOrderResponse } from '../../types';

export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  return fetchApi<CreateOrderResponse>('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
};
