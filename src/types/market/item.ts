import type { PaginatedResponse } from "../common";
import type { ItemStatus } from "./item-status";

/**
 * 商品情報 (簡易版)
 */
export interface Item {
  id: number;
  name: string | null;
  price: number | null;
  status: ItemStatus;
  imageUrl?: string | null;
  createdAt: string;
}

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
 * 商品画像
 * Backend: ItemImageResponse.kt
 */
export interface ItemImageResponse {
  imageId: number;
  imageUrl: string;
  displayOrder: number;
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
 * お気に入り一覧レスポンス
 * Backend: PaginatedResponse<ItemResponse>
 */
export type FavoritesResponse = PaginatedResponse<ItemResponse>;

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

