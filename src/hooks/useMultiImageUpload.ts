import { useState, useCallback, useEffect, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid'; // Removed: uuid is not installed

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

import { compressImage } from '@/lib/utils/imageCompression';
import { getUploadToken, uploadImage, linkImages } from '@/lib/api';

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

export function useMultiImageUpload(itemId: number | null) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const uploadQueueRef = useRef<string[]>([]); // アップロード待ちID
  const activeUploadsRef = useRef<number>(0); // 現在実行中の数

  /**
   * 処理キューを回す
   */
  const processQueue = useCallback(async () => {
    if (!itemId) return; // Draft IDがないとアップロードできない
    if (activeUploadsRef.current >= MAX_CONCURRENCY) return;
    if (uploadQueueRef.current.length === 0) return;

    // 次のタスクを取り出す
    const nextId = uploadQueueRef.current.shift();
    if (!nextId) return;

    activeUploadsRef.current++;

    // ステータスをUploadingに変更
    setFiles(prev => prev.map(f => 
      f.id === nextId ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      // 対象ファイル特定
      const target = files.find(f => f.id === nextId);
      if (!target || !target.file) {
          // 何らかの理由でファイルがない
          throw new Error('File not found');
      }

      // 1. Token取得
      const { token, filename } = await getUploadToken();

      // 2. Direct Upload (Workers)
      await uploadImage(target.file, 'jpg', token, filename); // フォーマットは一旦jpg固定

      // 3. Link (Backend)
      await linkImages(itemId, [filename]);

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
      // 次を処理（再帰的ではなくuseEffect依存でトリガーさせたいが、
      // ここで直接呼ぶのが確実）
      processQueue(); 
    }
  }, [files, itemId]);

  /**
   * itemIdやキューの状態が変わったら処理を試行
   */
  useEffect(() => {
    processQueue();
  }, [itemId, files.length, processQueue]); 
  // ↑ files.lengthを入れることで、新規追加されたときもトリガーされる
  // ただし processQueue 内で files を参照していると無限ループのリスクがあるが、
  // shiftingロジックは Ref で管理しているので大丈夫なはず

  /**
   * ファイル追加
   */
  const addFiles = useCallback(async (newFiles: File[]) => {
    const newEntries: UploadFile[] = await Promise.all(newFiles.map(async (f) => {
      const id = generateId();
      
      // 圧縮処理（これは並列でやってしまう）
      let compressed = f;
      // プレビュー生成
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
        status: 'pending' as const, // 最初はpending
        progress: 0
      };
    }));

    // State更新
    setFiles(prev => [...prev, ...newEntries]);

    // キューに追加
    newEntries.forEach(e => {
      uploadQueueRef.current.push(e.id);
    });
    
    // トリガーはuseEffectが行う
  }, []);

  /**
   * ファイル削除
   */
  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    // キューからも削除
    uploadQueueRef.current = uploadQueueRef.current.filter(qid => qid !== id);
    // TODO: サーバーにアップロード済みなら削除APIを呼ぶべきだが、
    // 今回はDraftなので放置でも良い（Orphan対策は別途バッチでやる方針）
    // 即時削除したい場合は deleteImage APIが必要
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
