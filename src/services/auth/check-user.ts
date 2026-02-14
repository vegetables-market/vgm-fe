import { fetchApi } from "@/lib/api/fetch";

export type CheckUserResponse = {
  next_step: "password" | "email_otp";
  identifier: string;
  flow_id?: string;
};

export const checkUser = async (identifier: string) => {
  return await fetchApi<CheckUserResponse>("/v1/auth/check-user", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
};
