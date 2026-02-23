/**
 * 商品ステータス定義
 */

export const ITEM_STATUS = {
  WORK_IN_PROGRESS: 0, // 出品作業中
  DRAFT: 1, // 下書き
  ON_SALE: 2, // 出品中
  TRADING: 3, // 取引中
  SOLD_OUT: 4, // 売り切れ
  SUSPENDED: 5, // 停止
} as const;

export type ItemStatus = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];
