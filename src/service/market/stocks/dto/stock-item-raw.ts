import type { StockSellerRaw } from "./stock-seller-raw";

export type StockItemRaw = {
  id?: string | number;
  item_id?: string | number;
  itemId?: string | number;
  title?: string;
  name?: string;
  description?: string | null;
  price?: number | string;
  category_id?: number | null;
  categoryId?: number | null;
  category_name?: string | null;
  categoryName?: string | null;
  condition?: number | string;
  status?: number | string;
  likes_count?: number | string;
  likesCount?: number | string;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  seller?: StockSellerRaw;
  created_at?: string;
  createdAt?: string;
};

