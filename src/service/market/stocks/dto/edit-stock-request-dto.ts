export type EditStockRequestDto = {
  name: string;
  description: string;
  category_id: number;
  price: number;
  quantity: number;
  shippingPayerType: number;
  shippingOriginArea: number;
  shippingDaysId: number;
  shippingMethodId: number;
  itemCondition: number;
  imageUrls?: string[];
};

