/**
 * カテゴリ関連の型定義
 */

/**
 * カテゴリ情報
 * Backend: CategoryResponse.kt
 */
export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
  level: number;
  iconUrl: string | null;
  sortOrder: number;
  children: CategoryResponse[];
}

