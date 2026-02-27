import { useState, useCallback, useRef } from "react";
import { createDraft } from "@/service/market/stocks/create-draft";

export function useItemDraft() {
  const [itemId, setItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 重複呼び出し防止用の Ref
  const isCreatingRef = useRef(false);
  const createdIdRef = useRef<string | null>(null);
  // 実行中の Promise resolver を保持
  const waitingResolversRef = useRef<Array<(id: string) => void>>([]);

  /**
   * Draft Item を作成、または既存 ID を返却
   * 既に itemId がある場合は API コールせずその ID を返す
   */
  const initDraft = useCallback(async (): Promise<string> => {
    // 既に作成済みの場合は即座に返す
    if (createdIdRef.current) return createdIdRef.current;

    // 作成中の場合は完了を待機（重複防止）
    if (isCreatingRef.current) {
      return new Promise<string>((resolve) => {
        waitingResolversRef.current.push(resolve);
      });
    }

    isCreatingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await createDraft();
      console.log("Draft created:", response.itemId);
      createdIdRef.current = response.itemId;
      setItemId(response.itemId);

      // 待機中の呼び出しに結果を通知
      waitingResolversRef.current.forEach((resolve) =>
        resolve(response.itemId),
      );
      waitingResolversRef.current = [];

      return response.itemId;
    } catch (err) {
      console.error("Failed to create draft:", err);
      const errorObj =
        err instanceof Error ? err : new Error("Failed to create draft");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
      // エラー時のみリセット。成功時は createdIdRef があるので再試行されない。
      if (!createdIdRef.current) {
        isCreatingRef.current = false;
      }
    }
  }, []); // Ref で状態管理しているため依存配列は空

  const getItemId = useCallback((): string | null => {
    return createdIdRef.current ?? itemId;
  }, [itemId]);

  return {
    itemId,
    initDraft,
    getItemId,
    loading,
    error,
  };
}
