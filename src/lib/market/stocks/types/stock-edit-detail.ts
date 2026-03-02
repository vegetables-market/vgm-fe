export type StockEditDetail = {
  itemId: string;
  name: string;
  description: string;
  imageUrls: string[];
  categoryId: number;
  price: number;
  quantity: number;
  shippingPayerType: number;
  shippingOriginArea: number;
  shippingOriginAddressId: number | null;
  shippingDaysId: number;
  shippingMethodId: number;
  itemCondition: number;
};

