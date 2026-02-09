/**
 * カテゴリAPI
 * Backend Use Cases: category/GetAllCategories
 */

import { fetchApi } from '../client';
import type { CategoryResponse } from '../types';

/**
 * カテゴリ一覧取得 (階層構造)
 * Backend: GetAllCategories Use Case
 */
export const getAllCategories = (): Promise<CategoryResponse[]> => {
  return fetchApi<CategoryResponse[]>('/v1/categories');
};

/**
 * カテゴリAPI (オブジェクト形式)
 */
export const categoryApi = {
  getAllCategories,
};
