import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";

/**
 * カテゴリ一覧取得
 */
export interface Category {
  category_id: number;
  category_name: string;
  parent_category_id: number | null;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetchApi<Category[]>(
    `${API_ENDPOINTS.CATEGORIES}`,
    {
      method: "GET",
    },
  );
  return response;
};
