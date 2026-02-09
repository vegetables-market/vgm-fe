/**
 * Auth関連の型定義 (DTO)
 */

export interface UserInfo {
    username: string; // user_id -> username
    displayName: string;
    email: string | null;
    avatarUrl: string | null;
    isEmailVerified?: boolean;
}

// フロントエンド用フォームデータ型
export interface SignupFormData {
    email: string;
    username: string;
    password: string;
    name: string;
    gender: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    flow_id?: string;
    expiresAt?: string;
}

// Requests
export interface RegisterRequest {
    username: string;
    email: string;
    display_name: string;
    password: string;
    birth_year?: number;
    birth_month?: number;
    birth_day?: number;
    gender?: string;
    flow_id?: string;
}

export interface VerifyEmailRequest {
    identifier: string;
    code: string;
}

export interface VerifyChallengeRequest {
    flow_id: string;
    code: string;
    action?: string;
}

export interface ResendCodeRequest {
    flow_id: string;
}

export interface LoginRequest {
    username: string;
    password?: string;
    device_id?: string;
}

export interface EnableTotpRequest {
    // No fields required for start
}

export interface VerifyTotpRequest {
    code: string;
}

export interface DisableTotpRequest {
    code: string;
    password?: string;
}

export interface TotpLoginRequest {
    mfa_token: string;
    code: string;
    action?: string;
}

// Responses
export interface RegisterResponse {
    status: string;
    user: UserInfo;
    require_verification?: boolean;
    flow_id?: string;
    masked_email?: string;
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
    user?: UserInfo;
}

export interface ResendCodeResponse {
    success: boolean;
    message: string;
    flow_id: string;
    expires_at: string;
    next_resend_at?: string;
}

export interface LoginResponse {
    status: string;
    user: UserInfo | null;
    require_verification?: boolean;
    flow_id?: string;
    masked_email?: string;
    requireTotp?: boolean;
    mfa_token?: string;
    mfa_type?: string;
}

export interface EnableTotpResponse {
    success: boolean;
    message: string;
    secret?: string;
    qrCodeUri?: string;
    qrCodeImage?: string;
}

export interface VerifyTotpResponse {
    success: boolean;
    message: string;
}

export interface DisableTotpResponse {
    success: boolean;
    message: string;
}
