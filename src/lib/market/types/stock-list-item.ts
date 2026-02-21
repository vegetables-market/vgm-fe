import type { StockSeller } from "./stock-seller";

export type StockListItem = {
  itemId: string;
  title: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  condition: number;
  status: number;
  likesCount: number;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  seller: StockSeller;
  createdAt: string;
};

