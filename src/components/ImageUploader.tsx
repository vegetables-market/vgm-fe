/**
 * 画像アップロードコンポーネント（UI専用）
 */

'use client';

import ImagePreview from './ImagePreview';
import { useImageUpload } from '@/hooks/useImageUpload';
import UploadResult from './UploadResult';

type Props = {
  onUploadCompleteAction?: (filename: string) => void;
};

export default function ImageUploader({ onUploadCompleteAction }: Props) {
  const {
    file,
    preview,
    uploading,
    uploadedFileName,
    error,
    handleFileSelect,
    upload,
    reset,
  } = useImageUpload();

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
    <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center bg-gray-50">
      {/* アップロード成功時は結果を表示 */}
      {uploadedFileName ? (
        <UploadResult fileName={uploadedFileName} onReset={reset} />
      ) : (
        <>
          {/* プレビュー */}
          <ImagePreview preview={preview} />

          {/* ファイル選択 */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100
              mb-4 mx-auto"
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
            disabled={!file || uploading}
            className={`px-6 py-2 rounded-full font-bold text-white transition-colors
              ${
                !file || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {uploading ? '送信中...' : '決定する'}
          </button>
        </>
      )}
    </div>
  );
}
