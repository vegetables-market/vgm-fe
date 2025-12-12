/**
 * 画像プレビュー表示コンポーネント
 */

type Props = {
  preview: string | null;
};

export default function ImagePreview({ preview }: Props) {
  if (!preview) {
    return (
      <div className="mb-4 text-gray-400 text-center">
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
        className="max-h-48 object-contain rounded shadow-sm"
      />
    </div>
  );
}
