/**
 * API 設定と関数の一元管理
 */

export type ImageFormat = 'jpg' | 'png' | 'webp';

/**
 * バックエンド API の URL を取得
 * GitHub Actions が環境変数を設定するため、
 * ここでデフォルト値を指定
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

/**
 * メディアサーバー (vgm-media) の URL を取得
 */
export const getMediaUrl = (): string => {
  return process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8787';
};

/**
 * API エンドポイント定数
 */
export const API_ENDPOINTS = {
  TEST: '/api/test',
} as const;

/**
 * API レスポンスの型定義
 */
export interface TestItem {
  id: number;
  name: string;
}

/**
 * API エラー型
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 汎用 API フェッチ関数
 */
export async function fetchApi<T>(endpoint: string): Promise<T> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Failed to fetch: ${error}`);
  }
}

/**
 * テストデータ取得
 */
export async function fetchTestItems(): Promise<TestItem[]> {
  return fetchApi<TestItem[]>(API_ENDPOINTS.TEST);
}

/**
 * UUID でファイル名を生成
 */
function generateFileName(): string {
  return crypto.randomUUID();
}

/**
 * 画像を vgm-media (R2) にアップロード
 * @param file - アップロードする画像ファイル
 * @param format - 画像フォーマット (デフォルト: 'jpg')
 * @returns アップロード成功時のファイル名
 */
export async function uploadImage(
  file: File,
  format: ImageFormat = 'jpg',
): Promise<string> {
  // ファイルサイズチェック (300KB制限)
  const maxSize = 300 * 1024; // 300KB
  if (file.size > maxSize) {
    throw new Error(`ファイルサイズが大きすぎます (最大 ${maxSize / 1024}KB)`);
  }

  // 画像形式チェック
  if (!file.type.startsWith('image/')) {
    throw new Error('画像ファイルのみアップロード可能です');
  }

  const fileName = generateFileName();
  const arrayBuffer = await file.arrayBuffer();
  const mediaUrl = getMediaUrl();
  const contentType = `image/${format}`;

  try {
    const response = await fetch(`${mediaUrl}/${fileName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `アップロード失敗: ${errorText}`);
    }

    return fileName;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`画像のアップロードに失敗しました: ${error}`);
  }
}
