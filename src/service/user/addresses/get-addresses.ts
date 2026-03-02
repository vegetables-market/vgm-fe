import { fetchApi } from "@/lib/api/fetch";
import type { UserAddressesResponseDto } from "@/service/user/addresses/types";

export async function getAddresses(): Promise<UserAddressesResponseDto> {
  return fetchApi<UserAddressesResponseDto>("/v1/user/addresses", {
    method: "GET",
  });
}
