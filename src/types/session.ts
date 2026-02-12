export interface SessionResponse {
  sessionId: number;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: string;
  lastActiveAt?: string;
  expiresAt: string;
  isCurrent: boolean;
  provider?: string;
}

export interface RevokeSessionResponse {
  success: boolean;
  message: string;
}
