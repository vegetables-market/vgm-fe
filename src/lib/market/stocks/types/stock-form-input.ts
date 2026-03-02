export type StockFormInput = {
  name: string;
  description: string;
  categoryId: number | "";
  price: string;
  quantity: string;
  shippingPayerType: number;
  prefectureId: number;
  shippingOriginAddressId?: number | null;
  shippingDaysId: number;
  shippingMethodId: number;
  itemCondition: number;
};

