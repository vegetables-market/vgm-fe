export type StockFormPayloadInput = {
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
};

export type NewStockPayload = {
  name: string;
  description: string;
  category_id: number;
  price: number;
  quantity: number;
  shipping_payer_type: number;
  shipping_origin_area: number;
  shipping_days_id: number;
  shipping_method_id: number;
  item_condition: number;
};

export type EditStockPayload = {
  name: string;
  description: string;
  categoryId: number;
  price: number;
  quantity: number;
  shippingPayerType: number;
  shippingOriginArea: number;
  shippingDaysId: number;
  shippingMethodId: number;
  itemCondition: number;
};

export function buildNewStockPayload(input: StockFormPayloadInput): NewStockPayload {
  return {
    name: input.name,
    description: input.description,
    category_id: Number(input.categoryId),
    price: Number(input.price),
    quantity: Number(input.quantity),
    shipping_payer_type: input.shippingPayerType,
    shipping_origin_area: input.prefectureId,
    shipping_days_id: input.shippingDaysId,
    shipping_method_id: input.shippingMethodId,
    item_condition: input.itemCondition,
  };
}

export function buildEditStockPayload(input: StockFormPayloadInput): EditStockPayload {
  return {
    name: input.name,
    description: input.description,
    categoryId: Number(input.categoryId),
    price: Number(input.price),
    quantity: Number(input.quantity),
    shippingPayerType: input.shippingPayerType,
    shippingOriginArea: input.prefectureId,
    shippingDaysId: input.shippingDaysId,
    shippingMethodId: input.shippingMethodId,
    itemCondition: input.itemCondition,
  };
}
