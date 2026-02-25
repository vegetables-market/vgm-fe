import { fetchApi } from "@/lib/api/fetch";
import { API_ENDPOINTS } from "@/lib/api/api-endpoint";
import type { StockCategory } from "@/lib/market/stocks/types/stock-category";

type CategoryApiNode = {
  categoryId?: number;
  categoryName?: string;
  parentId?: number | null;
  category_id?: number;
  category_name?: string;
  parent_id?: number | null;
  children?: CategoryApiNode[];
};

export const getCategories = async (): Promise<StockCategory[]> => {
  const response = await fetchApi<CategoryApiNode[]>(`${API_ENDPOINTS.CATEGORIES}`, {
    method: "GET",
  });

  const flat: StockCategory[] = [];
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
      categoryId,
      name: categoryName,
      parentCategoryId,
    });
    node.children?.forEach(visit);
  };

  response.forEach(visit);
  return flat;
};
