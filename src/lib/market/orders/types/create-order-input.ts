export type CreateOrderInput = {
  itemId: string;
  quantity: number;
  shippingName: string;
  shippingZipCode: string;
  shippingPrefecture: string;
  shippingCity: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  paymentMethod: string;
};
