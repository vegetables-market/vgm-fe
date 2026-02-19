import { ApiError } from "./fetch";
import { getMediaUrl } from "./urls";

/**
 * 画像フォーマット型
 */
export type ImageFormat = "jpg" | "png" | "webp";

/**
 * ImageFormatをMIMEタイプ用に変換
 */
function formatToMimeFormat(format: ImageFormat): "jpeg" | "png" | "webp" {
  return format === "jpg" ? "jpeg" : format;
}

/**
 * 画像を vgm-media (R2) にアップロード
 * JWTトークンによる認証付き
 */
export async function uploadImage(
  file: File,
  format: ImageFormat = "jpg",
  token: string,
  filename: string, // バックエンドから指定されたファイル名を使用
): Promise<string> {
  const maxSize = 300 * 1024;
  if (file.size > maxSize) {
    throw new Error(`ファイルサイズが大きすぎます (最大 ${maxSize / 1024}KB)`);
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルのみアップロード可能です");
  }

  // filenameはBE発行のものを使用するためgenerateFileNameは不要
  const arrayBuffer = await file.arrayBuffer();
  const mediaUrl = getMediaUrl();
  const mimeFormat = formatToMimeFormat(format);
  const contentType = `image/${mimeFormat}`;

  try {
    const response = await fetch(`${mediaUrl}/${filename}`, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`, // JWTトークン付与
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        response.status,
        `アップロード失敗: ${errorText}`,
        "UPLOAD_ERROR",
      );
    }

    const result = await response.json();
    return result.id || filename;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`画像のアップロードに失敗しました: ${String(error)}`);
  }
}

