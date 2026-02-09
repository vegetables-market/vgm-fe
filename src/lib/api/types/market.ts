/**
 * マーケット関連の型定義
 * バックエンドのDTO構造に対応
 */

import { PaginatedResponse } from './common';

// ==================== Cart ====================

/**
 * カート内商品
 * Backend: CartItemResponse.kt
 */
export interface CartItemResponse {
  cartItemId: number;
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  thumbnailUrl: string | null;
}

/**
 * カート情報
 * Backend: CartResponse.kt
 */
export interface CartResponse {
  items: CartItemResponse[];
  totalAmount: number;
}

/**
 * カート追加リクエスト
 * Backend: AddCartRequest.kt
 */
export interface AddCartRequest {
  itemId: number;
  quantity: number;
}

/**
 * カート数量更新リクエスト
 * Backend: UpdateCartRequest.kt
 */
export interface UpdateCartRequest {
  quantity: number;
}

// ==================== Item ====================

/**
 * 出品者情報
 * Backend: SellerInfo.kt
 */
export interface SellerInfo {
  userId: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

/**
 * 商品情報 (汎用)
 * Backend: ItemResponse.kt
 */
export interface ItemResponse {
  itemId: number;
  title: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  condition: number;
  status: number;
  likesCount: number;
  thumbnailUrl: string | null;
  seller: SellerInfo;
  createdAt: string;
}

/**
 * 商品詳細情報
 * Backend: ItemDetailResponse.kt
 */
export interface ItemDetailResponse {
  itemId: number;
  title: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  condition: number;
  status: number;
  likesCount: number;
  images: ItemImageResponse[];
  seller: SellerInfo;
  relatedItems: ItemResponse[];
  createdAt: string;
}

/**
 * 商品画像
 * Backend: ItemImageResponse.kt
 */
export interface ItemImageResponse {
  imageId: number;
  imageUrl: string;
  displayOrder: number;
}

/**
 * シンプル商品情報
 * Backend: SimpleItemResponse.kt
 */
export interface SimpleItemResponse {
  itemId: number;
  name: string;
  price: number;
  thumbnailUrl: string | null;
  status: number;
  createdAt: string;
}

/**
 * ドラフト作成レスポンス
 * Backend: CreateDraftResponse.kt
 */
export interface CreateDraftResponse {
  itemId: number;
  message: string;
}

/**
 * 画像リンクリクエスト
 * Backend: LinkImagesRequest.kt
 */
export interface LinkImagesRequest {
  imageIds: number[];
}

/**
 * 商品作成リクエスト
 * Backend: CreateItemRequest.kt
 */
export interface CreateItemRequest {
  name: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  condition: number;
  stock: number;
}

// ==================== Category ====================

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

// ==================== Favorite ====================

/**
 * お気に入り一覧レスポンス
 * Backend: PaginatedResponse<ItemResponse>
 */
export type FavoritesResponse = PaginatedResponse<ItemResponse>;
