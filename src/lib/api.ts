/**
 * API 設定と関数の一元管理
 */

/**
 * バックエンド API の URL を取得
 * GitHub Actions が環境変数を設定するため、
 * ここでデフォルト値を指定
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';
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
