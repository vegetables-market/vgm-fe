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

const MAX_ITEM_NAME_LENGTH = 50;
const MAX_ITEM_DESCRIPTION_LENGTH = 300;

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

  if (!input.name.trim() || !input.description.trim() || !input.price || !input.categoryId) {
    return "必須項目を入力してください。";
  }

  const nameLength = Array.from(input.name.trim()).length;
  if (nameLength > MAX_ITEM_NAME_LENGTH) {
    return `商品名は${MAX_ITEM_NAME_LENGTH}文字以内で入力してください。`;
  }

  const descriptionLength = Array.from(input.description.trim()).length;
  if (descriptionLength > MAX_ITEM_DESCRIPTION_LENGTH) {
    return `商品の説明は${MAX_ITEM_DESCRIPTION_LENGTH}文字以内で入力してください。`;
  }

  return null;
}
