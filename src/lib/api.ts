/**
 * API 設定と関数の一元管理
 */

/**
 * バックエンド API の URL を取得
 * GitHub Actions が環境変数を設定するため、
 * ここでデフォルト値を指定
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
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
