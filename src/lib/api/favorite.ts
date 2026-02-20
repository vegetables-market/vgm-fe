import { fetchApi } from "./fetch";
import type { ItemResponse } from "@/types/market/item";


export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export const favoriteApi = {
  // お気に入り一覧取得
  getFavorites: async (page: number, limit: number) => {
    // fetchApiが自動で "/api" を補完してくれるので "/v1/..." でOK
    return await fetchApi<PaginatedResponse<ItemResponse>>(
      `/v1/user/favorites?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  },

  // お気に入り削除
  removeFavorite: async (item_id: string) => {
    return await fetchApi<{ success: boolean }>(
      `/v1/user/favorites/${item_id}`,
      { method: "DELETE" }
    );
  }
};