/**
 * Auth関連の型定義 (登録)
 */

import type { UserInfo } from "./user";

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
  oauth_token?: string;
  oauth_provider?: string;
}

export interface RegisterResponse {
  status: string;
  user: UserInfo;
  require_verification?: boolean;
  flow_id?: string;
  masked_email?: string;
}

