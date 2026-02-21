import { useCallback, useState } from "react";
import type { StockListQuery } from "@/lib/market/stocks/types/stock-list-query";
import type { StockListResult } from "@/lib/market/stocks/types/stock-list-result";
import { getStocks } from "@/service/market/stocks/get-stocks";

const INITIAL_RESULT: StockListResult = {
  items: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export function useStocks() {
  const [result, setResult] = useState<StockListResult>(INITIAL_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchStocks = useCallback(async (query: StockListQuery) => {
    setIsLoading(true);
    setError("");

    try {
      const next = await getStocks(query);
      setResult(next);
      return next;
    } catch (error_: unknown) {
      const message = error_ instanceof Error ? error_.message : "啁E��の取得に失敗しました";
      setError(message);
      throw error_;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    result,
    isLoading,
    error,
    searchStocks,
  };
}

