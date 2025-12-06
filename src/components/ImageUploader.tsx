'use client';

import { useState } from 'react';

// 親コンポーネントにファイル名を渡すための型定義
type Props = {
  onUploadComplete: (filename: string) => void;
};

export default function ImageUploader({ onUploadComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 環境変数の読み込み (GitHub Actionsで埋め込まれたURL)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // サイズチェック (300KB)
    if (selectedFile.size > 300 * 1024) {
      alert('ファイルサイズが大きすぎます (最大300KB)');
      e.target.value = ''; // 選択解除
      return;
    }

    setFile(selectedFile);
    // プレビュー表示用のURLを作る
    setPreview(URL.createObjectURL(selectedFile));
  };

  // アップロード実行処理
  const handleUpload = async () => {
    if (!file || !mediaUrl) return;

    setIsUploading(true);

    try {
      // 1. ランダムなファイル名を生成 (例: f7a2... .jpg)
      const extension = file.name.split('.').pop();
      const filename = `${crypto.randomUUID()}.${extension}`;

      // 2. WorkersへのURLを作成
      // 例: https://vgm-media-dev.../f7a2....jpg
      const uploadTargetUrl = `${mediaUrl}/${filename}`;

      // 3. PUT送信
      const res = await fetch(uploadTargetUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      // 4. 親にファイル名を通知
      alert('アップロード完了！');
      onUploadComplete(filename);

    } catch (error) {
      console.error(error);
      alert('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center bg-gray-50">

      {/* プレビューエリア */}
      {preview ? (
        <div className="mb-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 object-contain rounded shadow-sm"
          />
        </div>
      ) : (
        <div className="mb-4 text-gray-400">画像を選択してください</div>
      )}

      {/* ファイル選択ボタン */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100
          mb-4 mx-auto"
      />

      {/* アップロードボタン */}
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`px-6 py-2 rounded-full font-bold text-white transition-colors
          ${!file || isUploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {isUploading ? '送信中...' : '決定する'}
      </button>

      {/* URL確認用 (開発中のみ表示しても便利) */}
      <p className="text-xs text-gray-400 mt-4">
        Dest: {mediaUrl || 'URL未設定'}
      </p>
    </div>
  );
}