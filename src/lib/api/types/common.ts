/**
 * 共通型定義
 */

/**
 * ページネーション情報
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  message: string;
  errorCode?: string;
  details?: string[];
}

/**
 * 成功レスポンス (汎用)
 */
export interface SuccessResponse {
  success: boolean;
  message?: string;
}
