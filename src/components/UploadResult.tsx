/**
 * アップロード結果表示コンポーネント
 */

import { getMediaUrl } from '@/lib/api/client';

type Props = {
  fileName: string;
  onReset: () => void;
};

export default function UploadResult({ fileName, onReset }: Props) {
  const mediaUrl = getMediaUrl();

  return (
    <div className="mt-4 space-y-4">
      {/* 成功メッセージ */}
      <div className="rounded-lg bg-green-100 p-4 text-green-700">
        ✅ アップロード成功！
      </div>

      {/* ファイル名表示 */}
      <div className="rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold">アップロードされたファイル:</h3>
        <code className="break-all text-sm">{fileName}</code>
      </div>

      {/* R2から取得した画像 */}
      <div>
        <p className="mb-2 text-sm font-semibold">R2から取得した画像:</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${mediaUrl}/${fileName}?format=jpg`}
          alt="Uploaded Result"
          className="max-w-full border rounded bg-white"
        />
      </div>

      {/* リセットボタン */}
      <button
        onClick={onReset}
        className="w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100"
      >
        別の画像をアップロード
      </button>
    </div>
  );
}
