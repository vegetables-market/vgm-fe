/**
 * Auth関連の型定義 (DTO)
 */

export interface UserInfo {
    user_id: number;
    display_name: string;
    email: string | null;
    avatar_url: string | null;
    is_email_verified?: boolean;
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
}

export interface VerifyEmailRequest {
    identifier: string;
    code: string;
}

export interface VerifyChallengeRequest {
    flow_id: string;
    code: string;
}

export interface ResendCodeRequest {
    flow_id: string;
}

export interface LoginRequest {
    username: string;
    password?: string;
    device_id?: string;
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
}

export interface LoginResponse {
    status: string;
    user: UserInfo | null;
    require_verification?: boolean;
    flow_id?: string;
    masked_email?: string;
    requireTotp?: boolean;
    mfa_token?: string;
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
