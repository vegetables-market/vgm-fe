import { useEffect, useState } from "react";
import { getCategories } from "@/service/market/stocks/get-categories";
import type { StockCategory } from "@/lib/market/stocks/types/stock-category";

export function useStockCategories() {
  const [categories, setCategories] = useState<StockCategory[]>([]);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories", err));

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
