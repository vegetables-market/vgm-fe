'use client';

import ImageUploader from '@/components/ImageUploader';
import { getMediaUrl } from '@/lib/api/client';
import { useState } from 'react';

export default function TestImageUploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleComplete = (filename: string) => {
    const url = `${getMediaUrl()}/${filename}`;
    setUploadedUrl(url);
    console.log('Upload complete:', url);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">画像アップロードテスト (一般)</h1>
      <p className="mb-4 text-gray-600">
        ファイル名はサーバー側で自動生成されます (UUID)。<br/>
        認証付きトークンを使用してアップロードします。
      </p>
      
      <div className="max-w-md bg-white p-6 rounded shadow mb-8">
        <ImageUploader onUploadCompleteAction={handleComplete} />
      </div>

      {uploadedUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">アップロード結果</h2>
          <div className="p-4 bg-gray-100 rounded break-all">
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {uploadedUrl}
            </a>
          </div>
          <div className="mt-4">
            <p className="mb-2 font-bold">表示テスト (Original):</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={uploadedUrl} alt="Uploaded" className="max-w-full h-auto border rounded" />
          </div>
          <div className="mt-4">
            <p className="mb-2 font-bold">表示テスト (Small - WASM):</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${uploadedUrl}?size=small`} alt="Small" className="max-w-full h-auto border rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
