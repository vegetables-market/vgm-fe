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

export function buildNewStockPayload(input: StockFormPayloadInput) {
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

export function buildEditStockPayload(input: StockFormPayloadInput) {
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
