export type UserInfo = {
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  isEmailVerified?: boolean;
  bio?: string;
};
