export type InitAuthFlowResultDto = {
  flow: "LOGIN" | "REGISTER" | "CHALLENGE";
  flow_id?: string;
  masked_email?: string;
  expires_at?: string;
  next_resend_at?: string;
};
