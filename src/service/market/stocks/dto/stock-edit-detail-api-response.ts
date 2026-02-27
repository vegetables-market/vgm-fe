export type StockEditDetailApiResponse = {
  item?: {
    itemId?: string | number;
    item_id?: string | number;
    name?: string;
    title?: string;
    description?: string | null;
    categoryId?: number | string;
    category_id?: number | string;
    price?: number | string;
    quantity?: number | string;
    shippingPayerType?: number | string;
    shipping_payer_type?: number | string;
    shippingOriginArea?: number | string;
    shipping_origin_area?: number | string;
    shippingDaysId?: number | string;
    shipping_days_id?: number | string;
    shippingMethodId?: number | string;
    shipping_method_id?: number | string;
    itemCondition?: number | string;
    item_condition?: number | string;
    images?: Array<{
      imageUrl?: string;
      image_url?: string;
    }>;
  };
};

