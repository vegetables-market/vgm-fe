/**
 * 逕ｻ蜒上い繝・・ｽE繝ｭ繝ｼ繝臥畑繧ｫ繧ｹ繧ｿ繝繝輔ャ繧ｯ
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { uploadImage } from "@/lib/api/media";
import { getUploadToken } from "@/service/market/stocks/get-upload-token";
import type { ImageFormat } from "@/lib/api/media";
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

  // 蝨ｧ邵ｮ髢｢騾｣縺ｮ迥ｶ諷・
  const [compressing, setCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);

  // 繝輔か繝ｼ繝槭ャ繝磯∈謚・
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
   * 逕ｻ蜒擾ｿｽE逅・・ｽ・ｽ蝨ｧ邵ｮ・ｽE・ｽ繧貞ｮ溯｡・
   */
  const processFile = useCallback(
    async (targetFile: File, targetFormat: ImageFormat) => {
      setCompressing(true);
      setError(null);
      setUploadedFileName(null);

      try {
        // 逕ｻ蜒上ｒ蝨ｧ邵ｮ・ｽE・ｽ驕ｸ謚槭＆繧後◆繝輔か繝ｼ繝槭ャ繝医〒・ｽE・ｽE
        const mimeFormat = targetFormat === "jpg" ? "jpeg" : targetFormat;
        const result = await compressImage(targetFile, mimeFormat);

        // 300KB蛻ｶ髯舌メ繧ｧ繝・・ｽ・ｽ
        if (result.compressedSize > 300 * 1024) {
          setError(
            "300KB以下に圧縮できませんでした。別のフォーマットを試すか、より小さい画像を使用してください。",
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
          err instanceof Error ? err.message : "逕ｻ蜒擾ｿｽE蝨ｧ邵ｮ縺ｫ螟ｱ謨励＠縺ｾ縺励◆",
        );
      } finally {
        setCompressing(false);
      }
    },
    [],
  );

  /**
   * 繝輔ぃ繧､繝ｫ縺ｾ縺滂ｿｽE繝輔か繝ｼ繝槭ャ繝医′螟画峩縺輔ｌ縺溘ｉ蜀榊悸邵ｮ
   */
  useEffect(() => {
    if (originalFile) {
      processFile(originalFile, format);
    }
  }, [originalFile, format, processFile]);

  /**
   * 繝輔ぃ繧､繝ｫ驕ｸ謚橸ｿｽE逅・
   */
  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      reset();
      return;
    }
    setOriginalFile(selectedFile);
  };

  /**
   * 繧｢繝・・ｽE繝ｭ繝ｼ繝牙ｮ溯｡・
   */
  const upload = async (): Promise<boolean> => {
    if (!file) {
      setError("繝輔ぃ繧､繝ｫ縺碁∈謚槭＆繧後※縺・・ｽ・ｽ縺帙ｓ");
      return false;
    }

    if (file.size > 300 * 1024) {
      setError("ファイルサイズは300KBを超えています。");
      return false;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. 繧｢繝・・ｽE繝ｭ繝ｼ繝臥畑繝茨ｿｽE繧ｯ繝ｳ縺ｨ險ｱ蜿ｯ貂医∩繝輔ぃ繧､繝ｫ蜷阪ｒ蜿門ｾ・
      // 繧ｫ繧ｹ繧ｿ繝髢｢謨ｰ縺後≠繧鯉ｿｽE縺昴ｌ繧剃ｽｿ縺・・ｽ・ｽ縺ｪ縺代ｌ縺ｰ繝・・ｽ・ｽ繧ｩ繝ｫ繝・荳闊ｬ逕ｨ)繧剃ｽｿ縺・
      const { token, filename } = fetchToken
        ? await fetchToken()
        : await getUploadToken();

      // 2. 繝茨ｿｽE繧ｯ繝ｳ繧剃ｽｿ縺｣縺ｦ繧｢繝・・ｽE繝ｭ繝ｼ繝・
      // uploadImage蜀・・ｽ・ｽ縺ｧ Authorization: Bearer {token} 縺御ｻ倅ｸ弱＆繧後ｋ
      // filename縺ｯBE縺檎匱陦後＠縺欟UID繧剃ｽｿ逕ｨ
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
   * 迥ｶ諷九ｒ繝ｪ繧ｻ繝・・ｽ・ｽ
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
