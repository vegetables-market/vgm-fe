"use client";

import ImageUploader from "@/components/ImageUploader";
import { getMediaUrl } from "@/lib/api/urls";
import { useState } from "react";

export default function TestImageUploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleComplete = (filename: string) => {
    const url = `${getMediaUrl()}/${filename}`;
    setUploadedUrl(url);
    console.log("Upload complete:", url);
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">画像アップロードテスト (一般)</h1>
      <p className="mb-4 text-gray-600">
        ファイル名はサーバー側で自動生成されます (UUID)。
        <br />
        認証付きトークンを使用してアップロードします。
      </p>

      <div className="mb-8 max-w-md rounded bg-white p-6 shadow">
        <ImageUploader onUploadCompleteAction={handleComplete} />
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
          <div className="mt-4">
            <p className="mb-2 font-bold">表示テスト (Small - WASM):</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${uploadedUrl}?size=small`}
              alt="Small"
              className="h-auto max-w-full rounded border"
            />
          </div>
        </div>
      )}
    </div>
  );
}
