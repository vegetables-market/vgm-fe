/**
 * お気に入りAPI
 * Backend Use Cases: favorite/GetFavorites, favorite/AddFavorite, favorite/RemoveFavorite
 */

import { fetchApi } from '../client';
import type { FavoritesResponse, SuccessResponse } from '../types';

/**
 * お気に入り一覧取得
 * Backend: GetFavorites Use Case
 */
export const getFavorites = (
  page: number = 1,
  limit: number = 20
): Promise<FavoritesResponse> => {
  return fetchApi<FavoritesResponse>(
    `/v1/user/favorites?page=${page}&limit=${limit}`
  );
};

/**
 * お気に入りに追加
 * Backend: AddFavorite Use Case
 */
export const addFavorite = (itemId: number): Promise<SuccessResponse> => {
  return fetchApi<SuccessResponse>(`/v1/user/favorites/${itemId}`, {
    method: 'POST',
  });
};

/**
 * お気に入りから削除
 * Backend: RemoveFavorite Use Case
 */
export const removeFavorite = (itemId: number): Promise<SuccessResponse> => {
  return fetchApi<SuccessResponse>(`/v1/user/favorites/${itemId}`, {
    method: 'DELETE',
  });
};

/**
 * お気に入りAPI (オブジェクト形式)
 */
export const favoriteApi = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
