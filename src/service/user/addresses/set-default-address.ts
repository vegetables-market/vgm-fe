import { fetchApi } from "@/lib/api/fetch";
import type { UserAddressMutationResponseDto } from "@/service/user/addresses/types";

export async function setDefaultAddress(
  addressId: number,
): Promise<UserAddressMutationResponseDto> {
  return fetchApi<UserAddressMutationResponseDto>(
    `/v1/user/addresses/${addressId}/default`,
    {
      method: "PUT",
    },
  );
}
