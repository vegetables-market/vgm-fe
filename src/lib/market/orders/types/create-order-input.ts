export type CreateOrderInput = {
  itemId: number;
  quantity: number;
  shippingName: string;
  shippingZipCode: string;
  shippingPrefecture: string;
  shippingCity: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  paymentMethod: string;
};
