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
<<<<<<< HEAD
  const response = await fetchApi<Category[]>(
=======
  const response = await fetchApi<CategoryApiNode[]>(
>>>>>>> 6886c9c602790a287d5c2e66191cb7809bf2397a
    `${API_ENDPOINTS.CATEGORIES}`,
    {
      method: "GET",
    },
  );
<<<<<<< HEAD
  return response;
=======

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
>>>>>>> 6886c9c602790a287d5c2e66191cb7809bf2397a
};
