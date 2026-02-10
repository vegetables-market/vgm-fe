import { fetchApi, API_ENDPOINTS } from '@/lib/api/client';
import {
    RegisterRequest,
    RegisterResponse,
    LoginResponse
} from '@/types/auth';

/**
 * 基本的な認証関連のサービス (AuthService)
 */

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
    loginRequest: { email: string; password: string },
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
 * ログアウト
 */
export async function logout(): Promise<void> {
    return fetchApi<void>('/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });
}

/**
 * 認証コード再送信
 */
export async function resendCode(
    request: { flow_id: string },
): Promise<{ flow_id: string; expires_at: string; message: string; next_resend_at: string }> {
    return fetchApi<{ flow_id: string; expires_at: string; message: string; next_resend_at: string }>('/v1/auth/resend-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
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
 * 認証方式
 */
export enum AuthMethod {
    EMAIL = 'EMAIL',
    TOTP = 'TOTP'
}

export interface VerifyAuthRequest {
    method: AuthMethod;
    identifier: string;
    code: string;
    action?: string;
}

/**
 * ログイン完了
 * EMAIL/TOTP認証後にセッションを作成してログインを完了する
 */
export async function verifyLogin(
    request: VerifyAuthRequest
): Promise<LoginResponse> {
    return fetchApi<LoginResponse>('/v1/auth/verify-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}

/**
 * セキュリティ確認
 * 重要アクション実行前の再認証でアクショントークンを発行する
 */
export async function verifyAction(
    request: VerifyAuthRequest
): Promise<{ success: boolean; action_token: string; user: any; action: string }> {
    return fetchApi<{ success: boolean; action_token: string; user: any; action: string }>('/v1/auth/verify-action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}
