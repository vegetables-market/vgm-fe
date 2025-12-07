/**
 * 画像アップロード用カスタムフック
 */

import { useState } from 'react';
import { uploadImage } from '@/lib/api';
import { validateImageFile } from '@/lib/validators/image';

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * ファイル選択処理
   */
  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      reset();
      return;
    }

    // バリデーション
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || '不正なファイルです');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setUploadedFileName(null);
  };

  /**
   * アップロード実行
   */
  const upload = async (): Promise<boolean> => {
    if (!file) {
      setError('ファイルが選択されていません');
      return false;
    }

    setUploading(true);
    setError(null);

    try {
      const fileName = await uploadImage(file);
      setUploadedFileName(fileName);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロード失敗');
      return false;
    } finally {
      setUploading(false);
    }
  };

  /**
   * 状態をリセット
   */
  const reset = () => {
    setFile(null);
    setPreview(null);
    setUploadedFileName(null);
    setError(null);
    setUploading(false);
  };

  return {
    file,
    preview,
    uploading,
    uploadedFileName,
    error,
    handleFileSelect,
    upload,
    reset,
  };
}
