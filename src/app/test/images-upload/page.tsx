
'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/api';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // ファイル選択時
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setUploadedFileName(null);
    }
  };

  // アップロード実行
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileName = await uploadImage(file);
      setUploadedFileName(fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロード失敗');
    } finally {
      setUploading(false);
    }
  };

  // リセット
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUploadedFileName(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold">画像アップロードテスト</h1>

      {/* ファイル選択 */}
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-blue-500"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-gray-600">
            {file ? file.name : 'クリックして画像を選択'}
          </div>
          <div className="mt-2 text-sm text-gray-400">最大 300KB</div>
        </label>
      </div>

      {/* プレビュー */}
      {preview && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">プレビュー:</h2>
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 rounded-lg border"
          />
        </div>
      )}

      {/* アップロードボタン */}
      {file && !uploadedFileName && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
          ❌ {error}
        </div>
      )}

      {/* 成功表示 */}
      {uploadedFileName && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-green-100 p-4 text-green-700">
            ✅ アップロード成功！
          </div>
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">アップロードされたファイル:</h3>
            <code className="break-all text-sm">{uploadedFileName}</code>
          </div>
          <button
            onClick={handleReset}
            className="w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100"
          >
            別の画像をアップロード
          </button>
        </div>
      )}
    </div>
  );
}
