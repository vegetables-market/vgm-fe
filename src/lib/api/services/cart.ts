/**
 * カートAPI
 * Backend Use Cases: cart/GetCart, cart/AddToCart, cart/UpdateCartItemQuantity, cart/RemoveFromCart
 */

import { fetchApi } from '../client';
import type {
  CartResponse,
  AddCartRequest,
  UpdateCartRequest,
  SuccessResponse,
} from '../types';

/**
 * カート取得
 * Backend: GetCart Use Case
 */
export const getCart = (): Promise<CartResponse> => {
  return fetchApi<CartResponse>('/v1/market/cart');
};

/**
 * カートに商品を追加
 * Backend: AddToCart Use Case
 */
export const addToCart = (data: AddCartRequest): Promise<SuccessResponse> => {
  return fetchApi<SuccessResponse>('/v1/market/cart', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * カート内商品の数量を更新
 * Backend: UpdateCartItemQuantity Use Case
 */
export const updateCartItemQuantity = (
  cartItemId: number,
  data: UpdateCartRequest
): Promise<SuccessResponse> => {
  return fetchApi<SuccessResponse>(`/v1/market/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * カートから商品を削除
 * Backend: RemoveFromCart Use Case
 */
export const removeFromCart = (cartItemId: number): Promise<SuccessResponse> => {
  return fetchApi<SuccessResponse>(`/v1/market/cart/${cartItemId}`, {
    method: 'DELETE',
  });
};

/**
 * カートAPI (オブジェクト形式)
 */
export const cartApi = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
};
