/**
 * 画像アップロードコンポーネント（UI専用）
 */

"use client";

import ImagePreview from "./ImagePreview";
import { useImageUpload } from "@/hooks/upload/useImageUpload";
import UploadResult from "./UploadResult";
import { formatFileSize } from "@/lib/utils/imageCompression";

interface ImageUploaderProps {
  onUploadCompleteAction?: (filename: string) => void;
  fetchToken?: () => Promise<{ token: string; filename: string }>;
}

export default function ImageUploader({
  onUploadCompleteAction,
  fetchToken,
}: ImageUploaderProps) {
  const {
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
  } = useImageUpload({ fetchToken });

  // ファイル選択時
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  };

  // アップロード実行
  const handleUpload = async () => {
    const success = await upload();
    if (success && uploadedFileName && onUploadCompleteAction) {
      onUploadCompleteAction(uploadedFileName);
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      {/* アップロード成功時は結果を表示 */}
      {uploadedFileName ? (
        <UploadResult fileName={uploadedFileName} onReset={reset} />
      ) : (
        <>
          {/* プレビュー */}
          <ImagePreview preview={preview} />

          {/* 圧縮中の表示 */}
          {compressing && (
            <div className="mb-4 rounded-lg bg-blue-100 p-4 text-blue-700">
              🔄 画像を圧縮中...
            </div>
          )}

          {/* 圧縮結果の表示 */}
          {!compressing &&
            originalSize &&
            compressedSize &&
            compressionRatio !== null && (
              <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
                <div className="mb-2 font-semibold">✅ 圧縮完了</div>
                <div className="space-y-1 text-sm">
                  <div>元のサイズ: {formatFileSize(originalSize)}</div>
                  <div>圧縮後: {formatFileSize(compressedSize)}</div>
                  <div>圧縮率: {compressionRatio}%</div>
                </div>
              </div>
            )}

          {/* フォーマット選択 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">
              保存形式:
            </label>
            <div className="flex justify-center gap-4">
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  value="jpg"
                  checked={format === "jpg"}
                  onChange={(e) => setFormat(e.target.value as "jpg")}
                  disabled={uploading || compressing}
                  className="mr-2"
                />
                <span>JPEG</span>
              </label>
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  value="png"
                  checked={format === "png"}
                  onChange={(e) => setFormat(e.target.value as "png")}
                  disabled={uploading || compressing}
                  className="mr-2"
                />
                <span>PNG</span>
              </label>
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  value="webp"
                  checked={format === "webp"}
                  onChange={(e) => setFormat(e.target.value as "webp")}
                  disabled={uploading || compressing}
                  className="mr-2"
                />
                <span>WebP</span>
              </label>
            </div>
          </div>

          {/* ファイル選択 */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || compressing}
            className="mx-auto mb-4 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
          />

          {/* エラー表示 */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
              ❌ {error}
            </div>
          )}

          {/* アップロードボタン */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading || compressing || !!error}
            className={`rounded-full px-6 py-2 font-bold text-white transition-colors ${
              !file || uploading || compressing || !!error
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {uploading ? "送信中..." : "決定する"}
          </button>
        </>
      )}
    </div>
  );
}
