import { fetchApi, API_ENDPOINTS } from '@/lib/api/client';
import {
    EnableTotpRequest,
    EnableTotpResponse,
    VerifyTotpRequest,
    VerifyTotpResponse,
    DisableTotpRequest,
    DisableTotpResponse,
    TotpLoginRequest,
    LoginResponse
} from '@/types/auth';

/**
 * 2段階認証(TOTP)関連のサービス (TotpService)
 */

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
