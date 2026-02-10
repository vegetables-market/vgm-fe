/**
 * カート関連の型定義
 */

/**
 * カート内商品
 * Backend: CartItemResponse.kt
 */
export interface CartItemResponse {
  cartItemId: number;
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  thumbnailUrl: string | null;
}

/**
 * カート情報
 * Backend: CartResponse.kt
 */
export interface CartResponse {
  items: CartItemResponse[];
  totalAmount: number;
}

/**
 * カート追加リクエスト
 * Backend: AddCartRequest.kt
 */
export interface AddCartRequest {
  itemId: number;
  quantity: number;
}

/**
 * カート数量更新リクエスト
 * Backend: UpdateCartRequest.kt
 */
export interface UpdateCartRequest {
  quantity: number;
}

