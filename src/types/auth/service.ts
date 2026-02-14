/**
 * Auth Service Response Types
 */

export interface InitAuthFlowResult {
  flow: "LOGIN" | "REGISTER" | "CHALLENGE";
  flow_id?: string;
  masked_email?: string;
  expires_at?: string;
  next_resend_at?: string;
}


export interface CheckUsernameResult {
  available: boolean;
  message?: string;
  suggestions?: string[];
}
