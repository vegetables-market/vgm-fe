/**
 * 画像アップロードテストページ
 */

'use client';

import ImageUploader from '@/components/ImageUploader';

export default function UploadTestPage() {
  // アップロード完了時のコールバック
  const handleComplete = (filename: string) => {
    console.log('保存されたファイル名:', filename);
    
    // ★ここが重要:
    // 本来はこの後、この filename を使ってバックエンドの商品登録APIを叩く
    // await fetch('/api/products', { body: JSON.stringify({ image: filename, ... }) })
  };

  return (
    <div className="min-h-screen p-8 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-6">画像アップロードテスト</h1>
      
      <div className="max-w-md mx-auto">
        <ImageUploader onUploadCompleteAction={handleComplete} />
      </div>
    </div>
  );
}
