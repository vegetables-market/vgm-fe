/**
 * 画像プレビュー表示コンポーネント
 */

type Props = {
  preview: string | null;
};

export default function ImagePreview({ preview }: Props) {
  if (!preview) {
    return (
      <div className="mb-4 text-center text-gray-400">
        画像を選択してください
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview}
        alt="Preview"
        className="max-h-48 rounded object-contain shadow-sm"
      />
    </div>
  );
}
