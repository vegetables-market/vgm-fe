/**
 * 画像アップロード用カスタムフック
 */

import { useState, useEffect, useCallback } from 'react';
import { uploadImage, type ImageFormat } from '@/lib/api';
import { compressImage } from '@/lib/utils/imageCompression';

export function useImageUpload() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
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
  
  // フォーマット選択
  const [format, setFormat] = useState<ImageFormat>('jpg');

  /**
   * 画像処理（圧縮）を実行
   */
  const processFile = useCallback(async (targetFile: File, targetFormat: ImageFormat) => {
    setCompressing(true);
    setError(null);
    setUploadedFileName(null);

    try {
      // 画像を圧縮（選択されたフォーマットで）
      const mimeFormat = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
      const result = await compressImage(targetFile, mimeFormat);

      // 300KB制限チェック
      if (result.compressedSize > 300 * 1024) {
        setError('300KB以下に圧縮できませんでした。別のフォーマットを試すか、より小さな画像を使用してください。');
      }

      setFile(result.compressedFile);
      setPreview(URL.createObjectURL(result.compressedFile));
      setOriginalSize(result.originalSize);
      setCompressedSize(result.compressedSize);
      setCompressionRatio(result.compressionRatio);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の圧縮に失敗しました');
    } finally {
      setCompressing(false);
    }
  }, []);

  /**
   * ファイルまたはフォーマットが変更されたら再圧縮
   */
  useEffect(() => {
    if (originalFile) {
      processFile(originalFile, format);
    }
  }, [originalFile, format, processFile]);

  /**
   * ファイル選択処理
   */
  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      reset();
      return;
    }
    setOriginalFile(selectedFile);
  };

  /**
   * アップロード実行
   */
  const upload = async (): Promise<boolean> => {
    if (!file) {
      setError('ファイルが選択されていません');
      return false;
    }

    if (file.size > 300 * 1024) {
      setError('ファイルサイズが300KBを超えています');
      return false;
    }

    setUploading(true);
    setError(null);

    try {
      const fileName = await uploadImage(file, format);
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
    setOriginalFile(null);
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
    format,
    setFormat,
    handleFileSelect,
    upload,
    reset,
  };
}
