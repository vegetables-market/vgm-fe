/**
 * 画像バリデーション
 * 
 * Note: ファイルサイズのチェックは圧縮後のファイルに対して行われることを想定しています。
 * 圧縮前の元画像は大きくても問題ありません。
 */

const MAX_FILE_SIZE = 300 * 1024; // 300KB (圧縮後のサイズ制限)

/**
 * ファイルサイズをチェック
 * 圧縮後のファイルに対して使用されることを想定
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
 * 圧縮後のファイルに対して使用されることを想定
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;

  const typeCheck = validateImageType(file);
  if (!typeCheck.valid) return typeCheck;

  return { valid: true };
}
