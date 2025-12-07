/**
 * 画像圧縮ユーティリティ
 */

import imageCompression from 'browser-image-compression';

const MAX_SIZE_MB = 0.3; // 300KB

/**
 * 画像フォーマット型
 */
export type ImageFormat = 'jpeg' | 'png' | 'webp';

/**
 * 圧縮オプションを生成
 */
function getCompressionOptions(format: ImageFormat = 'jpeg') {
  return {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: `image/${format}`,
    initialQuality: 0.8,
  };
}

/**
 * 圧縮結果の型定義
 */
export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // 圧縮率（%）
}

/**
 * 画像を圧縮する
 * @param file - 圧縮する画像ファイル
 * @param format - 出力フォーマット（デフォルト: jpeg）
 * @returns 圧縮結果
 */
export async function compressImage(
  file: File,
  format: ImageFormat = 'jpeg',
): Promise<CompressionResult> {
  const originalSize = file.size;

  try {
    // 圧縮実行
    const options = getCompressionOptions(format);
    const compressedFile = await imageCompression(file, options);
    const compressedSize = compressedFile.size;

    // 圧縮率を計算（小数点第1位まで）
    const compressionRatio = Math.round(
      ((originalSize - compressedSize) / originalSize) * 1000,
    ) / 10;

    return {
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('画像圧縮エラー:', error);
    throw new Error('画像の圧縮に失敗しました');
  }
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 * @param bytes - バイト数
 * @returns フォーマット済み文字列（例: "245.3 KB"）
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
