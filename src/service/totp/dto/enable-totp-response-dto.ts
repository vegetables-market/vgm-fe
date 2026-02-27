export type EnableTotpResponseDto = {
  success: boolean;
  message: string;
  secret?: string;
  qrCodeUri?: string;
  qrCodeImage?: string;
};
