import { useState, useCallback, useRef } from 'react';
import { createDraft } from '@/lib/api';

export function useItemDraft() {
  const [itemId, setItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 重複呼び出し防止用のRef
  const isCreatingRef = useRef(false);
  const createdIdRef = useRef<number | null>(null);

  /**
   * Draft Itemを作成または既存のIDを返却
   * 既にitemIdがある場合はAPIコールせずそのIDを返す
   */
  const initDraft = useCallback(async () => {
    // 既に作成済みの場合は即座に返す
    if (createdIdRef.current) return createdIdRef.current;
    if (itemId) return itemId;

    // 作成中の場合は待機（重複防止）
    if (isCreatingRef.current) {
      // 作成完了を待つ
      return new Promise<number>((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (createdIdRef.current) {
            clearInterval(checkInterval);
            resolve(createdIdRef.current);
          }
        }, 100);
        // タイムアウト
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Draft creation timeout'));
        }, 10000);
      });
    }

    isCreatingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await createDraft();
      console.log('Draft created:', response.item_id);
      createdIdRef.current = response.item_id;
      setItemId(response.item_id);
      return response.item_id;
    } catch (err) {
      console.error('Failed to create draft:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to create draft');
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
      isCreatingRef.current = false;
    }
  }, [itemId]);

  return {
    itemId,
    initDraft,
    loading,
    error
  };
}
