export type ValidateStockFormInput = {
  name: string;
  description: string;
  price: string;
  categoryId: number | "";
  pendingCount: number;
  hasError: boolean;
  fileCount?: number;
  isAllCompleted?: boolean;
  requireImage?: boolean;
};

export function validateStockFormInput(
  input: ValidateStockFormInput,
): string | null {
  if (input.requireImage && (input.fileCount ?? 0) === 0) {
    return "画像を1枚以上選択してください。";
  }

  if (input.pendingCount > 0) {
    return "画像のアップロード中です。完了まで待ってください。";
  }

  if (input.hasError) {
    return "画像のアップロードでエラーが発生しています。再アップロードしてください。";
  }

  if (input.requireImage && input.isAllCompleted === false) {
    return "画像アップロードの完了を待ってください。";
  }

  if (!input.name || !input.description || !input.price || !input.categoryId) {
    return "必須項目を入力してください。";
  }

  return null;
}
