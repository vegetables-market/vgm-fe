import { useEffect, useState } from "react";
import { getCategories } from "@/service/market/stocks/get-categories";
import type { Category } from "@/service/market/stocks/get-categories";

export function useStockCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

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
