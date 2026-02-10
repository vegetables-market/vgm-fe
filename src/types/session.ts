export interface SessionResponse {
  sessionId: number;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: string;
  lastActiveAt?: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface RevokeSessionResponse {
  success: boolean;
  message: string;
}
