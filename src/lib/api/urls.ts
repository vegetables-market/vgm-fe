/**
 * API/Media URL utilities
 */

/**
 * バックエンド API の URL を取得
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

/**
 * メディアサーバー (vgm-media) の URL を取得
 */
export const getMediaUrl = (): string => {
  return process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8787";
};
