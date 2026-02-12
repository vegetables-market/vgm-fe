/**
 * Auth関連の型定義 (ログイン)
 */

import type { UserInfo } from "./user";

export interface LoginRequest {
  username: string;
  password?: string;
  device_id?: string;
}

export interface TotpLoginRequest {
  mfa_token: string;
  code: string;
  action?: string;
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

