/**
 * 画像アップロード用カスタムフック
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { uploadImage } from "@/lib/api/client";
import { getUploadToken } from "@/services/upload/get-upload-token";
import type { ImageFormat } from "@/lib/api/client";
import { compressImage } from "@/lib/utils/imageCompression";

type UseImageUploadProps = {
  fetchToken?: () => Promise<{ token: string; filename: string }>;
};

export function useImageUpload({ fetchToken }: UseImageUploadProps = {}) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 圧縮関連の状態
  const [compressing, setCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);

  // フォーマット選択
  const [format, setFormat] = useState<ImageFormat>("jpg");

  useEffect(() => {
    previewUrlRef.current = preview;
  }, [preview]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  /**
   * 画像処理（圧縮）を実行
   */
  const processFile = useCallback(
    async (targetFile: File, targetFormat: ImageFormat) => {
      setCompressing(true);
      setError(null);
      setUploadedFileName(null);

      try {
        // 画像を圧縮（選択されたフォーマットで）
        const mimeFormat = targetFormat === "jpg" ? "jpeg" : targetFormat;
        const result = await compressImage(targetFile, mimeFormat);

        // 300KB制限チェック
        if (result.compressedSize > 300 * 1024) {
          setError(
            "300KB以下に圧縮できませんでした。別のフォーマットを試すか、より小さな画像を使用してください。",
          );
        }

        setFile(result.compressedFile);
        const nextPreviewUrl = URL.createObjectURL(result.compressedFile);
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextPreviewUrl;
        });
        setOriginalSize(result.originalSize);
        setCompressedSize(result.compressedSize);
        setCompressionRatio(result.compressionRatio);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "画像の圧縮に失敗しました",
        );
      } finally {
        setCompressing(false);
      }
    },
    [],
  );

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
      setError("ファイルが選択されていません");
      return false;
    }

    if (file.size > 300 * 1024) {
      setError("ファイルサイズが300KBを超えています");
      return false;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. アップロード用トークンと許可済みファイル名を取得
      // カスタム関数があればそれを使い、なければデフォルト(一般用)を使う
      const { token, filename } = fetchToken
        ? await fetchToken()
        : await getUploadToken();

      // 2. トークンを使ってアップロード
      // uploadImage内部で Authorization: Bearer {token} が付与される
      // filenameはBEが発行したUUIDを使用
      const uploadedName = await uploadImage(file, format, token, filename);

      setUploadedFileName(uploadedName);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロード失敗");
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
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
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
