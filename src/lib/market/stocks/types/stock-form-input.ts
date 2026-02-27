export type StockFormInput = {
  name: string;
  description: string;
  categoryId: number | "";
  price: string;
  quantity: string;
  shippingPayerType: number;
  prefectureId: number;
  shippingDaysId: number;
  shippingMethodId: number;
  itemCondition: number;
  imageUrls?: string[];
};

