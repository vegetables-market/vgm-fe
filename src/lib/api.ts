export * from './api/client'; // 共通部分を再エクスポート
export * from './api/types'; // 型定義を再エクスポート

/**
 * サービス関数は直接インポートしてください
 * 
 * 例:
 * import { getMyItems } from '@/lib/api/services/item/get-my-items';
 * import { login } from '@/lib/api/services/auth/login';
 * import { getUploadToken } from '@/lib/api/services/upload/get-upload-token';
 */
