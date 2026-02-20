import { useState, useCallback, useRef } from "react";
import { createDraft } from "@/services/market/items/create-draft";

export function useItemDraft() {
  const [itemId, setItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 重複呼び出し防止用のRef
  const isCreatingRef = useRef(false);
  const createdIdRef = useRef<string | null>(null);
  // 待機中のPromise resolver を保持
  const waitingResolversRef = useRef<Array<(id: string) => void>>([]);

  /**
   * Draft Itemを作成または既存のIDを返却
   * 既にitemIdがある場合はAPIコールせずそのIDを返す
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
      // エラー時のみリセット（成功時は createdIdRef が設定されているので再試行されない）
      if (!createdIdRef.current) {
        isCreatingRef.current = false;
      }
    }
  }, []); // 依存配列を空に - Refで状態管理しているので不要

  return {
    itemId,
    initDraft,
    loading,
    error,
    getItemId: () => createdIdRef.current,
  };
}
