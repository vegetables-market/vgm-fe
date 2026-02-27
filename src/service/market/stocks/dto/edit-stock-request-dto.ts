export type EditStockRequestDto = {
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
  image_urls?: string[];
};

