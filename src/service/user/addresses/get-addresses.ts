import { fetchApi } from "@/lib/api/fetch";
import type { UserAddressesResponseDto } from "@/service/user/addresses/types";

export async function getAddresses(
  addressType: "DELIVERY" | "SENDER" = "DELIVERY",
): Promise<UserAddressesResponseDto> {
  return fetchApi<UserAddressesResponseDto>(
    `/v1/user/addresses?addressType=${addressType}`,
    {
    method: "GET",
    },
  );
}
