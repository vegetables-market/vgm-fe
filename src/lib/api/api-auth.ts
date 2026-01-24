import { API_ENDPOINTS, fetchApi } from './api-client';

export * from './api-client'; // ApiErrorなどを再エクスポート

export interface RegisterRequest {
    username: string;
    display_name: string;
    password: string;
}

export interface RegisterResponse {
    status: string;
    user: {
        user_id: number;
        display_name: string;
        avatar_url: string | null;
    };
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    user: {
        user_id: number;
        display_name: string;
        avatar_url: string | null;
    };
    requireTotp?: boolean;
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
 * メールアドレス認証
 */
export async function verifyEmail(
    request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
    return fetchApi<VerifyEmailResponse>(API_ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
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
