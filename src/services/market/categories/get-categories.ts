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

interface CategoryApiNode {
  categoryId?: number;
  categoryName?: string;
  parentId?: number | null;
  category_id?: number;
  category_name?: string;
  parent_id?: number | null;
  children?: CategoryApiNode[];
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetchApi<CategoryApiNode[]>(
    `${API_ENDPOINTS.CATEGORIES}`,
    {
      method: "GET",
    },
  );

  const flat: Category[] = [];
  const seen = new Set<number>();
  const visit = (node: CategoryApiNode) => {
    const categoryId = node.categoryId ?? node.category_id;
    const name = node.categoryName ?? node.category_name;
    const parentCategoryId = node.parentId ?? node.parent_id ?? null;

    if (categoryId == null || !name) {
      node.children?.forEach(visit);
      return;
    }

    if (seen.has(categoryId)) {
      node.children?.forEach(visit);
      return;
    }
    seen.add(categoryId);

    flat.push({
      categoryId,
      name,
      parentCategoryId,
    });
    node.children?.forEach(visit);
  };

  response.forEach(visit);
  return flat;
};
