export type RegisterRequestDto = {
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
};
