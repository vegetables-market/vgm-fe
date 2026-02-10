import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";

/**
 * カテゴリ一覧取得
 */
export interface Category {
  categoryId: number;
  name: string;
  parentCategoryId: number | null;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetchApi<{ categories: Category[] }>(
    `${API_ENDPOINTS.CATEGORIES}`,
    {
      method: "GET",
    },
  );
  return response.categories;
};
