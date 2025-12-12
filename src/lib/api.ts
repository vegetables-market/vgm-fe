/**
 * API 設定と関数の一元管理
 */

/**
 * 画像フォーマット型
 */
export type ImageFormat = 'jpg' | 'png' | 'webp';

/**
 * バックエンド API の URL を取得
 * GitHub Actions が環境変数を設定するため、
 * ここでデフォルト値を指定
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';
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
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  USER: '/api/auth/user',
  TOTP_ENABLE: '/api/auth/totp/enable',
  TOTP_VERIFY: '/api/auth/totp/verify-and-enable',
  TOTP_DISABLE: '/api/auth/totp/disable',
  LOGIN_TOTP: '/api/auth/login/totp',
  // 商品関連
  PRODUCTS: '/api/products',
  // 注文関連
  ORDERS: '/api/orders',
  // 決済関連
  PAYMENT_CREATE: '/api/payment/create',
  PAYMENT_CONFIRM: '/api/payment/confirm',
  PAYMENT_RELEASE_ESCROW: '/api/payment/release-escrow',
  PAYMENT_REFUND: '/api/payment/refund',
  PAYMENT_STATUS: '/api/payment',
} as const;

/**
 * API レスポンスの型定義
 */
export interface TestItem {
  id: number;
  name: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  requireTotp?: boolean;
  userId?: number;
  username?: string;
  email?: string;
}

// TOTP関連の型定義
export interface EnableTotpRequest {
  userId: number;
}

export interface EnableTotpResponse {
  success: boolean;
  message: string;
  secret?: string;
  qrCodeUri?: string;
  qrCodeImage?: string;
}

export interface VerifyTotpRequest {
  userId: number;
  code: string;
}

export interface VerifyTotpResponse {
  success: boolean;
  message: string;
}

export interface DisableTotpRequest {
  userId: number;
  password: string;
}

export interface DisableTotpResponse {
  success: boolean;
  message: string;
}

export interface TotpLoginRequest {
  username: string;
  password: string;
  totpCode: string;
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
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;

  console.log('[fetchApi] URL:', url);
  console.log('[fetchApi] Method:', options?.method || 'GET');
  console.log('[fetchApi] Options:', options);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // レスポンスボディを読み取り、エラーメッセージを取得
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        // バックエンドからのエラーメッセージがあれば使用
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        // JSONのパースに失敗した場合はデフォルトメッセージを使用
      }
      throw new ApiError(response.status, errorMessage);
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
 * 新規登録
 */
export async function register(
  registerRequest: RegisterRequest,
): Promise<RegisterResponse> {
  return fetchApi<RegisterResponse>(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerRequest),
    credentials: 'include',
  });
}

/**
 * ログイン
 */
export async function login(
  loginRequest: LoginRequest,
): Promise<LoginResponse> {
  return fetchApi<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginRequest),
    credentials: 'include',
  });
}

/**
 * ユーザー情報取得
 */
export async function getUserById(userId: number): Promise<LoginResponse> {
  return fetchApi<LoginResponse>(`${API_ENDPOINTS.USER}/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
}

/**
 * TOTP有効化開始
 */
export async function enableTotp(
  request: EnableTotpRequest,
): Promise<EnableTotpResponse> {
  return fetchApi<EnableTotpResponse>(API_ENDPOINTS.TOTP_ENABLE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * TOTP検証＆有効化
 */
export async function verifyAndEnableTotp(
  request: VerifyTotpRequest,
): Promise<VerifyTotpResponse> {
  return fetchApi<VerifyTotpResponse>(API_ENDPOINTS.TOTP_VERIFY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * TOTP無効化
 */
export async function disableTotp(
  request: DisableTotpRequest,
): Promise<DisableTotpResponse> {
  return fetchApi<DisableTotpResponse>(API_ENDPOINTS.TOTP_DISABLE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * TOTPログイン
 */
export async function loginWithTotp(
  request: TotpLoginRequest,
): Promise<LoginResponse> {
  return fetchApi<LoginResponse>(API_ENDPOINTS.LOGIN_TOTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

// ==================== 商品・注文・決済関連 ====================

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sellerId: number;
  sellerName: string;
  status: string;
  category?: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  sellerId: number;
  category?: string;
  stock?: number;
}

export interface CreateOrderRequest {
  buyerId: number;
  productId: number;
  shippingAddress?: string;
  shippingPostalCode?: string;
  shippingRecipientName?: string;
  shippingPhoneNumber?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  orderId?: number;
  totalAmount?: number;
  platformFee?: number;
  sellerAmount?: number;
}

export interface CreatePaymentRequest {
  orderId: number;
  userId: number;
  paymentMethod: 'CREDIT_CARD' | 'PAYPAY';
  amount: number;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  paymentId?: number;
  clientSecret?: string;
  paypayUrl?: string;
  paypayDeeplink?: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ReleaseEscrowRequest {
  orderId: number;
}

/**
 * 商品一覧取得
 */
export async function getProducts(): Promise<{ success: boolean; products: Product[] }> {
  return fetchApi(API_ENDPOINTS.PRODUCTS, {
    method: 'GET',
    credentials: 'include',
  });
}

/**
 * 商品作成
 */
export async function createProduct(request: CreateProductRequest): Promise<{ success: boolean; message: string; productId?: number }> {
  return fetchApi(API_ENDPOINTS.PRODUCTS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * 注文作成
 */
export async function createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
  return fetchApi(API_ENDPOINTS.ORDERS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * 決済開始
 */
export async function createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  console.log('[createPayment] Request:', request);
  console.log('[createPayment] Endpoint:', API_ENDPOINTS.PAYMENT_CREATE);
  console.log('[createPayment] Method: POST');

  return fetchApi(API_ENDPOINTS.PAYMENT_CREATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * 決済確認（エスクロー化）
 */
export async function confirmPayment(request: ConfirmPaymentRequest): Promise<{ success: boolean; message: string }> {
  return fetchApi(API_ENDPOINTS.PAYMENT_CONFIRM, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
}

/**
 * エスクロー解除（出品者への入金）
 */
export async function releaseEscrow(request: ReleaseEscrowRequest): Promise<{ success: boolean; message: string }> {
  return fetchApi(API_ENDPOINTS.PAYMENT_RELEASE_ESCROW, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    credentials: 'include',
  });
 * UUID でファイル名を生成
 */
function generateFileName(): string {
  return crypto.randomUUID();
}

/**
 * ImageFormatをMIMEタイプ用に変換
 */
function formatToMimeFormat(format: ImageFormat): 'jpeg' | 'png' | 'webp' {
  return format === 'jpg' ? 'jpeg' : format;
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
  const mimeFormat = formatToMimeFormat(format);
  const contentType = `image/${mimeFormat}`;

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

    // レスポンスからIDを取得（バックエンドが返すIDを使用）
    const result = await response.json();
    return result.id || fileName;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`画像のアップロードに失敗しました: ${error}`);
  }
}
