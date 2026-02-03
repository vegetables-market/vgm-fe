"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { getUploadToken, getMediaUrl } from "@/lib/api";

export default function AdminImageUploadPage() {
  const [targetFilename, setTargetFilename] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const fetchAdminToken = async () => {
    if (!targetFilename.trim()) {
      throw new Error("ファイル名を入力してください");
    }
    // トークン取得 (ファイル名は入力されたものを使用)
    return await getUploadToken(targetFilename.trim());
  };

  const handleComplete = (filename: string) => {
    const url = `${getMediaUrl()}/${filename}`;
    setUploadedUrl(url);
    console.log("Admin Upload complete:", url);
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">管理者用画像アップロード</h1>
      <p className="mb-6 text-gray-600">
        指定したファイル名で画像をアップロードできます。
        <br />
        拡張子は元のファイル形式に応じて自動的に付与されます。
      </p>

      <div className="mb-6 max-w-md">
        <label
          htmlFor="filename"
          className="mb-1 block text-sm font-bold text-gray-700"
        >
          希望するファイル名 (拡張子なし)
        </label>
        <input
          id="filename"
          type="text"
          value={targetFilename}
          onChange={(e) => setTargetFilename(e.target.value)}
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="例: banner-spring-2024"
        />
        <p className="mt-1 text-xs text-gray-500">
          ※英数字とハイフンのみを推奨します。重複すると上書きされる可能性があります。
        </p>
      </div>

      <div className="mb-8 max-w-md rounded bg-white p-6 shadow">
        <ImageUploader
          onUploadCompleteAction={handleComplete}
          fetchToken={fetchAdminToken}
        />
      </div>

      {uploadedUrl && (
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-bold">アップロード結果</h2>
          <div className="rounded bg-gray-100 p-4 break-all">
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {uploadedUrl}
            </a>
          </div>
          <div className="mt-4">
            <p className="mb-2 font-bold">表示テスト (Original):</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="Uploaded"
              className="h-auto max-w-full rounded border"
            />
          </div>
        </div>
      )}
    </div>
  );
}
