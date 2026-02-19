'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { getMediaUrl } from "@/lib/api/urls";
import { getAdminUploadToken } from "@/services/admin/media/get-upload-token";

export default function AdminImageUploadPage() {
  const [targetFilename, setTargetFilename] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const fetchAdminToken = async () => {
    if (!targetFilename.trim()) {
        throw new Error('ファイル名を入力してください');
    }
    // トークン取得 (ファイル名は入力されたものを使用)
    return await getAdminUploadToken(targetFilename.trim());
  };

  const handleComplete = (filename: string) => {
    const url = `${getMediaUrl()}/${filename}`;
    setUploadedUrl(url);
    console.log('Admin Upload complete:', url);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理者用画像アップロード</h1>
      <p className="mb-6 text-gray-600">
        指定したファイル名で画像をアップロードできます。<br/>
        拡張子は元のファイル形式に応じて自動的に付与されます。
      </p>
      
      <div className="mb-6 max-w-md">
        <label htmlFor="filename" className="block text-sm font-bold text-gray-700 mb-1">
          希望するファイル名 (拡張子なし)
        </label>
        <input
          id="filename"
          type="text"
          value={targetFilename}
          onChange={(e) => setTargetFilename(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="例: banner-spring-2024"
        />
        <p className="text-xs text-gray-500 mt-1">
           ※英数字とハイフンのみを推奨します。重複すると上書きされる可能性があります。
        </p>
      </div>

      <div className="max-w-md bg-white p-6 rounded shadow mb-8">
        <ImageUploader 
            onUploadCompleteAction={handleComplete} 
            fetchToken={fetchAdminToken}
        />
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
        </div>
      )}
    </div>
  );
}
