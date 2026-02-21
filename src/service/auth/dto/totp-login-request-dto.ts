export type TotpLoginRequestDto = {
  mfa_token: string;
  code: string;
  action?: string;
};
