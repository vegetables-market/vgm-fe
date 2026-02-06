import { API_ENDPOINTS, fetchApi } from '@/lib/api/api-client';
import {
    RegisterRequest,
    RegisterResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
    VerifyChallengeRequest,
    ResendCodeRequest,
    ResendCodeResponse,
    LoginRequest,
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
 * セキュリティチャレンジ（flow_id）認証
 */
/**
 * @deprecated Use verifyAuth instead
 */
export async function verifyChallenge(data: VerifyChallengeRequest): Promise<VerifyEmailResponse | LoginResponse> {
    // Forward to new endpoint
    const response = await verifyAuth({
        method: AuthMethod.EMAIL,
        identifier: data.flow_id,
        code: data.code,
        action: data.action
    });
    
    // Adapt response if necessary, but verifyAuth returns LoginResponse-like structure which is superset of VerifyEmailResponse
    return response as any;
}

/**
 * 認証コード再送信
 */
export async function resendCode(
    request: ResendCodeRequest,
): Promise<ResendCodeResponse> {
    return fetchApi<ResendCodeResponse>('/v1/auth/resend-code', {
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
 * ログアウト
 */
export async function logout(): Promise<void> {
    return fetchApi<void>('/v1/auth/logout', {
        method: 'POST',
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
 * MFA検証（ログイン時）
 */
export enum AuthMethod {
    EMAIL = 'EMAIL',
    TOTP = 'TOTP'
}

export interface VerifyAuthRequest {
    method: AuthMethod;
    identifier: String;
    code: String;
    action?: String;
}

export async function verifyAuth(
    request: VerifyAuthRequest
): Promise<LoginResponse> {
    return fetchApi<LoginResponse>('/v1/auth/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
    });
}

/**
 * @deprecated Use verifyAuth instead
 */
export async function verifyMfa(
    mfaToken: string,
    code: string,
    action?: string
): Promise<LoginResponse> {
    // Forward to new endpoint for compatibility or keep old until fully migrated
    return verifyAuth({
        method: AuthMethod.TOTP,
        identifier: mfaToken,
        code,
        action
    });
}
