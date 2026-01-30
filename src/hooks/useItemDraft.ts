import { useState, useCallback } from 'react';
import { createDraft } from '@/lib/api';

export function useItemDraft() {
  const [itemId, setItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Draft Itemを作成または既存のIDを返却
   * 既にitemIdがある場合はAPIコールせずそのIDを返す
   */
  const initDraft = useCallback(async () => {
    if (itemId) return itemId;
    
    setLoading(true);
    setError(null);
    try {
      const response = await createDraft();
      console.log('Draft created:', response.item_id);
      setItemId(response.item_id);
      return response.item_id;
    } catch (err) {
      console.error('Failed to create draft:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to create draft');
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  return { 
    itemId, 
    initDraft, 
    loading, 
    error 
  };
}
