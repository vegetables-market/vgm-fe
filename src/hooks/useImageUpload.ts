/**
 * 画像アップロード用カスタムフック
 */

import { useState } from 'react';
import { uploadImage } from '@/lib/api';
import { validateImageFile } from '@/lib/validators/image';
import { compressImage } from '@/lib/utils/imageCompression';

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 圧縮関連の状態
  const [compressing, setCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);

  /**
   * ファイル選択処理（圧縮を含む）
   */
  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile) {
      reset();
      return;
    }

    // 画像タイプのバリデーション（サイズは圧縮後にチェック）
    const typeValidation = validateImageFile(selectedFile);
    if (!typeValidation.valid) {
      setError(typeValidation.error || '不正なファイルです');
      return;
    }

    setCompressing(true);
    setError(null);
    setUploadedFileName(null);

    try {
      // 画像を圧縮
      const result = await compressImage(selectedFile);

      // 圧縮後のファイルで再度バリデーション
      const validation = validateImageFile(result.compressedFile);
      if (!validation.valid) {
        setError(validation.error || '圧縮後のファイルが不正です');
        return;
      }

      setFile(result.compressedFile);
      setPreview(URL.createObjectURL(result.compressedFile));
      setOriginalSize(result.originalSize);
      setCompressedSize(result.compressedSize);
      setCompressionRatio(result.compressionRatio);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の圧縮に失敗しました');
    } finally {
      setCompressing(false);
    }
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
    setCompressing(false);
    setOriginalSize(null);
    setCompressedSize(null);
    setCompressionRatio(null);
  };

  return {
    file,
    preview,
    uploading,
    uploadedFileName,
    error,
    compressing,
    originalSize,
    compressedSize,
    compressionRatio,
    handleFileSelect,
    upload,
    reset,
  };
}
