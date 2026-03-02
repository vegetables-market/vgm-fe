import { fetchApi } from "@/lib/api/fetch";
import type { UserAddressDeleteResponseDto } from "@/service/user/addresses/types";

export async function deleteAddress(
  addressId: number,
): Promise<UserAddressDeleteResponseDto> {
  return fetchApi<UserAddressDeleteResponseDto>(`/v1/user/addresses/${addressId}`, {
    method: "DELETE",
  });
}
