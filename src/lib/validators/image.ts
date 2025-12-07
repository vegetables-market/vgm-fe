/**
 * 画像バリデーション
 */

const MAX_FILE_SIZE = 300 * 1024; // 300KB

/**
 * ファイルサイズをチェック
 */
export function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `ファイルサイズが大きすぎます (最大 ${MAX_FILE_SIZE / 1024}KB)`,
    };
  }
  return { valid: true };
}

/**
 * 画像形式をチェック
 */
export function validateImageType(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: '画像ファイルのみアップロード可能です',
    };
  }
  return { valid: true };
}

/**
 * 画像ファイル全体のバリデーション
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;

  const typeCheck = validateImageType(file);
  if (!typeCheck.valid) return typeCheck;

  return { valid: true };
}
