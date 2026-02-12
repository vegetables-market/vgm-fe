/**
 * Auth関連の型定義 (TOTP)
 */

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

