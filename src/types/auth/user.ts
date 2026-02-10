/**
 * Auth関連の型定義 (ユーザー/フォーム)
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

