import "server-only";

import CategoryDetailClient from "./CategoryDetailClient";

export const dynamicParams = false;

type CategoriesResponse =
  | Array<{ categoryId: number | string; children?: any[] }>
  | { categories: Array<{ categoryId: number | string; children?: any[] }> };

export async function generateStaticParams() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const url = `${apiBaseUrl}/api/v1/market/categories`;

  const collectIds = (cats: Array<any>, acc: string[]) => {
    for (const c of cats) {
      if (c?.categoryId !== undefined) acc.push(String(c.categoryId));
      if (Array.isArray(c?.children)) collectIds(c.children, acc);
    }
  };

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return [{ id: "0" }];
    const data = (await res.json()) as CategoriesResponse;
    const categories = Array.isArray(data)
      ? data
      : (data.categories ?? []);

    const ids: string[] = [];
    collectIds(categories, ids);
    if (ids.length === 0) return [{ id: "0" }];
    return ids.map((id) => ({ id }));
  } catch {
    return [{ id: "0" }];
  }
}

export default function CategoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CategoryDetailClient id={params.id} />;
}
