/**
 * 画像圧縮ユーティリティ
 */

import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 0.3; // 300KB

/**
 * 画像フォーマット型
 */
export type ImageFormat = "jpeg" | "png" | "webp";

/**
 * 圧縮オプションを生成
 */
function getCompressionOptions(format: ImageFormat = "jpeg") {
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
  format: ImageFormat = "jpeg",
): Promise<CompressionResult> {
  const originalSize = file.size;

  // 目標サイズ以下で、かつフォーマットが一致する場合はそのまま返す
  const targetMimeType = `image/${format}`;
  if (
    originalSize <= MAX_SIZE_MB * 1024 * 1024 &&
    file.type === targetMimeType
  ) {
    return {
      compressedFile: file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
    };
  }

  try {
    // 圧縮実行
    let options = getCompressionOptions(format);
    let compressedFile = await imageCompression(file, options);

    // 300KBを超える場合、サイズに収まるまで解像度を落として再試行 (最大5回)
    let iteration = 0;
    const MAX_ITERATIONS = 5;

    while (
      compressedFile.size > MAX_SIZE_MB * 1024 * 1024 &&
      iteration < MAX_ITERATIONS
    ) {
      // 解像度を徐々に下げる (0.8倍ずつ)
      options.maxWidthOrHeight = Math.floor(options.maxWidthOrHeight * 0.8);
      // 画質設定も少し下げる（browser-image-compressionの自動調整を補助）
      options.initialQuality = Math.max(0.5, options.initialQuality * 0.9);

      console.log(
        `Retry compression: ${iteration + 1}, MaxWidth: ${options.maxWidthOrHeight}, Quality: ${options.initialQuality}`,
      );

      compressedFile = await imageCompression(file, options);
      iteration++;
    }

    const compressedSize = compressedFile.size;

    // 圧縮率を計算（小数点第1位まで）
    const compressionRatio =
      Math.round(((originalSize - compressedSize) / originalSize) * 1000) / 10;

    return {
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error("画像圧縮エラー:", error);
    throw new Error("画像の圧縮に失敗しました");
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
