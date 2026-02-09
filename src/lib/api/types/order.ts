/**
 * 注文関連の型定義
 */

export interface CreateOrderRequest {
  buyerId: number;
  productId: number;
  shippingAddress?: string;
  shippingPostalCode?: string;
  shippingRecipientName?: string;
  shippingPhoneNumber?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  orderId?: number;
  totalAmount?: number;
  platformFee?: number;
  sellerAmount?: number;
}
