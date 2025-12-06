'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';

export default function UploadTestPage() {
  const [uploadedFilename, setUploadedFilename] = useState<string>('');

  // アップロード完了後に呼ばれる関数
  const handleComplete = (filename: string) => {
    console.log('保存されたファイル名:', filename);
    setUploadedFilename(filename);
    
    // ★ここが重要:
    // 本来はこの後、この filename を使ってバックエンドの商品登録APIを叩く
    // await fetch('/api/products', { body: JSON.stringify({ image: filename, ... }) })
  };

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

  return (
    <div className="min-h-screen p-8 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-6">画像アップロードテスト</h1>
      
      <div className="max-w-md mx-auto">
        <ImageUploader onUploadComplete={handleComplete} />
        
        {/* 結果表示 */}
        {uploadedFilename && mediaUrl && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
            <h2 className="font-bold text-green-800 mb-2">成功しました！</h2>
            <p className="text-sm text-gray-600 break-all">
              ファイル名: <strong>{uploadedFilename}</strong>
            </p>
            
            <p className="text-sm mt-4 mb-1">R2から取得した画像:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`${mediaUrl}/${uploadedFilename}`} 
              alt="Uploaded Result"
              className="w-32 h-32 object-cover border rounded bg-white" 
            />
            
            <p className="text-sm mt-4 mb-1">リサイズ確認 (width=100):</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`${mediaUrl}/${uploadedFilename}?width=100`} 
              alt="Resized Result"
              className="border rounded bg-white" 
            />
          </div>
        )}
      </div>
    </div>
  );
}