/**
 * Auth関連の型定義 (検証/チャレンジ)
 */

import type { UserInfo } from "./user";

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

