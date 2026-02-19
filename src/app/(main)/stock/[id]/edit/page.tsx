import "server-only";

import StockEditClient from "./StockEditClient";

export const dynamicParams = false;

type SearchResponse = {
  items?: Array<{ itemId: number }>;
};

export async function generateStaticParams() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const url = `${apiBaseUrl}/api/v1/market/items/search?sort=newest&page=1&limit=100`;

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return [{ id: "0" }];
    const data = (await res.json()) as SearchResponse;
    const items = data.items ?? [];
    if (items.length === 0) return [{ id: "0" }];
    return items.map((it) => ({ id: String(it.itemId) }));
  } catch {
    return [{ id: "0" }];
  }
}

export default function StockEditPage({ params }: { params: { id: string } }) {
  return <StockEditClient id={params.id} />;
}
