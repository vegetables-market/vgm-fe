import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { StockListSort } from "@/lib/market/stocks/types/stock-list-sort";
import { buildStockListPageSearchParams } from "@/service/market/stocks/build-page-search-params";
import { getStockListQueryFromSearchParams } from "@/service/market/stocks/get-query-from-search-params";
import { normalizeStockListSort } from "@/service/market/stocks/normalize-sort";
import { useStocks } from "./use-stocks";

export function useStocksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { result, isLoading, error, searchStocks } = useStocks();

  const searchParamsText = searchParams.toString();
  const currentSearchParams = useMemo(
    () => new URLSearchParams(searchParamsText),
    [searchParamsText],
  );

  const categoryId = currentSearchParams.get("categoryId") || "";
  const [keyword, setKeyword] = useState(currentSearchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(currentSearchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(currentSearchParams.get("maxPrice") || "");
  const [sort, setSort] = useState<StockListSort>(
    normalizeStockListSort(currentSearchParams.get("sort")),
  );

  useEffect(() => {
    setKeyword(currentSearchParams.get("q") || "");
    setMinPrice(currentSearchParams.get("minPrice") || "");
    setMaxPrice(currentSearchParams.get("maxPrice") || "");
    setSort(normalizeStockListSort(currentSearchParams.get("sort")));
  }, [currentSearchParams]);

  useEffect(() => {
    const query = getStockListQueryFromSearchParams(currentSearchParams);
    void searchStocks(query).catch(() => undefined);
  }, [currentSearchParams, searchStocks]);

  const handleSearch = useCallback(() => {
    const nextSearchParams = buildStockListPageSearchParams({
      keyword: keyword || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      page: 1,
    });

    router.push(`/stocks?${nextSearchParams.toString()}`);
  }, [router, keyword, categoryId, minPrice, maxPrice, sort]);

  const handlePageChange = useCallback(
    (page: number) => {
      const nextSearchParams = new URLSearchParams(searchParamsText);
      nextSearchParams.set("page", String(page));
      router.push(`/stocks?${nextSearchParams.toString()}`);
    },
    [router, searchParamsText],
  );

  const handleSortChange = useCallback((value: string) => {
    setSort(normalizeStockListSort(value));
  }, []);

  const handleStockClick = useCallback(
    (itemId: string) => {
      router.push(`/stocks/${itemId}`);
    },
    [router],
  );

  return {
    keyword,
    setKeyword,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sort,
    handleSortChange,
    result,
    isLoading,
    error,
    handleSearch,
    handlePageChange,
    handleStockClick,
  };
}

