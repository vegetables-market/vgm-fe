import { useState, useCallback, useEffect, useRef } from 'react';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

import { compressImage } from '@/lib/utils/imageCompression';
import { getUploadToken } from '@/lib/api/services/upload/get-upload-token';
import { uploadImage } from '@/lib/api/client';
import { linkImages } from '@/lib/api/services/item/link-images';

export type UploadFileStatus = 'pending' | 'compressing' | 'uploading' | 'completed' | 'error';

export interface UploadFile {
  id: string; // ローカル識別用ID
  file: File | null; // 圧縮後のファイル
  originalFile: File;
  previewUrl: string;
  status: UploadFileStatus;
  progress: number;
  serverFilename?: string;
  error?: string;
}

const MAX_CONCURRENCY = 3;

interface UseMultiImageUploadOptions {
  initDraft?: () => Promise<number>;
}

export function useMultiImageUpload(itemId: number | null, options?: UseMultiImageUploadOptions) {
  const initDraft = options?.initDraft;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const uploadQueueRef = useRef<Map<string, UploadFile>>(new Map());
  const activeUploadsRef = useRef<number>(0);
  const itemIdRef = useRef<number | null>(null);

  // itemIdをRefで追跡
  useEffect(() => {
    itemIdRef.current = itemId;
  }, [itemId]);

  /**
   * 処理キューを回す
   */
  const processQueue = useCallback(async () => {
    const currentItemId = itemIdRef.current;
    if (!currentItemId) return;
    if (activeUploadsRef.current >= MAX_CONCURRENCY) return;
    if (uploadQueueRef.current.size === 0) return;

    // 次のタスクを取り出す
    const iterator = uploadQueueRef.current.entries().next();
    if (iterator.done) return;

    const [nextId, targetFile] = iterator.value;
    uploadQueueRef.current.delete(nextId);

    if (!targetFile || !targetFile.file) {
      console.error('File not found in queue:', nextId);
      processQueue();
      return;
    }

    activeUploadsRef.current++;

    // ステータスをUploadingに変更
    setFiles(prev => prev.map(f =>
      f.id === nextId ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      // 1. Token取得
      const { token, filename } = await getUploadToken();

      // 2. Direct Upload (Workers)
      await uploadImage(targetFile.file, 'jpg', token, filename);

      // 3. Link (Backend)
      await linkImages(currentItemId, [filename]);

      // 完了
      setFiles(prev => prev.map(f =>
        f.id === nextId ? { ...f, status: 'completed', serverFilename: filename, progress: 100 } : f
      ));

    } catch (err) {
      console.error(`Upload failed for ${nextId}:`, err);
      setFiles(prev => prev.map(f =>
        f.id === nextId ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' } : f
      ));
    } finally {
      activeUploadsRef.current--;
      processQueue();
    }
  }, []);

  /**
   * itemIdが設定されたらキュー処理を開始
   */
  useEffect(() => {
    if (itemId && uploadQueueRef.current.size > 0) {
      processQueue();
    }
  }, [itemId, processQueue]);

  /**
   * ファイル追加（ドラフトがなければ作成）
   */
  const addFiles = useCallback(async (newFiles: File[]) => {
    // ドラフトがなければ先に作成（initDraftが提供されている場合のみ）
    if (!itemIdRef.current) {
      if (initDraft) {
        try {
          const newItemId = await initDraft();
          itemIdRef.current = newItemId;
        } catch (err) {
          console.error('Failed to create draft:', err);
          return; // ドラフト作成失敗時は画像追加を中止
        }
      } else {
        console.error('No itemId and no initDraft provided');
        return;
      }
    }

    const newEntries: UploadFile[] = await Promise.all(newFiles.map(async (f) => {
      const id = generateId();

      let compressed = f;
      const previewUrl = URL.createObjectURL(f);

      try {
        const result = await compressImage(f, 'jpeg');
        compressed = result.compressedFile;
      } catch (e) {
        console.warn('Compression failed, using original', e);
      }

      return {
        id,
        originalFile: f,
        file: compressed,
        previewUrl,
        status: 'pending' as const,
        progress: 0
      };
    }));

    // State更新
    setFiles(prev => [...prev, ...newEntries]);

    // キューに追加（ファイル情報も一緒に保存）
    newEntries.forEach(entry => {
      uploadQueueRef.current.set(entry.id, entry);
    });

    // 即座に処理開始を試みる
    processQueue();
  }, [processQueue, initDraft]);

  /**
   * ファイル削除
   */
  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    // キューからも削除
    uploadQueueRef.current.delete(id);
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    isAllCompleted: files.length > 0 && files.every(f => f.status === 'completed'),
    hasError: files.some(f => f.status === 'error'),
    pendingCount: files.filter(f => f.status !== 'completed' && f.status !== 'error').length
  };
}
