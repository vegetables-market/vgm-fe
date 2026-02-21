export type CheckUsernameResultDto = {
  available: boolean;
  message?: string;
  suggestions?: string[];
};
