/**
 * アップロード関連の型定義
 */

export interface UploadTokenResponse {
  token: string;
  filename: string;
  expiresAt: number;
}
