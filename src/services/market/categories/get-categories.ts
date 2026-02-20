import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";

/**
 * カテゴリ一覧取得
 */
export interface Category {
  category_id: number;
  category_name: string;
  parent_category_id: number | null;
  categoryId?: number;
  categoryName?: string;
  name?: string;
  parentId?: number | null;
  parentCategoryId?: number | null;
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
    const categoryName = node.categoryName ?? node.category_name;
    const parentCategoryId = node.parentId ?? node.parent_id ?? null;

    if (categoryId == null || !categoryName) {
      node.children?.forEach(visit);
      return;
    }

    if (seen.has(categoryId)) {
      node.children?.forEach(visit);
      return;
    }
    seen.add(categoryId);

    flat.push({
      category_id: categoryId,
      category_name: categoryName,
      parent_category_id: parentCategoryId,
      categoryId,
      categoryName,
      name: categoryName,
      parentId: parentCategoryId,
      parentCategoryId,
    });
    node.children?.forEach(visit);
  };

  response.forEach(visit);
  return flat;
};
