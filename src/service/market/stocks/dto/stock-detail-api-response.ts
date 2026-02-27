export type StockDetailApiResponse = {
  item?: {
    itemId?: number | string;
    item_id?: number | string;
    title?: string;
    description?: string | null;
    price?: number | string;
    quantity?: number | string;
    categoryId?: number | null;
    category_id?: number | null;
    categoryName?: string | null;
    category_name?: string | null;
    condition?: number | string;
    status?: number | string;
    likesCount?: number | string;
    likes_count?: number | string;
    isLiked?: boolean;
    is_liked?: boolean;
    brand?: string | null;
    weight?: number | null;
    shippingPayerType?: number | string;
    shipping_payer_type?: number | string;
    images?: Array<{
      imageId?: number | string;
      image_id?: number | string;
      imageUrl?: string;
      image_url?: string;
      displayOrder?: number | string;
      display_order?: number | string;
    }>;
    seller?: {
      userId?: number | string;
      user_id?: number | string;
      username?: string;
      displayName?: string;
      display_name?: string;
      avatarUrl?: string | null;
      avatar_url?: string | null;
      ratingAverage?: number | null;
      rating_average?: number | null;
      ratingCount?: number | string;
      rating_count?: number | string;
    };
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
  };
  relatedItems?: Array<{
    itemId?: number | string;
    item_id?: number | string;
    title?: string;
    price?: number | string;
    thumbnailUrl?: string | null;
    thumbnail_url?: string | null;
  }>;
  related_items?: Array<{
    itemId?: number | string;
    item_id?: number | string;
    title?: string;
    price?: number | string;
    thumbnailUrl?: string | null;
    thumbnail_url?: string | null;
  }>;
};
