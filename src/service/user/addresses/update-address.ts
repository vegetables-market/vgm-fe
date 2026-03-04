import { fetchApi } from "@/lib/api/fetch";
import type {
  UpsertUserAddressRequestDto,
  UserAddressMutationResponseDto,
} from "@/service/user/addresses/types";

export async function updateAddress(
  addressId: number,
  input: UpsertUserAddressRequestDto,
  addressType: "DELIVERY" | "SENDER" = "DELIVERY",
): Promise<UserAddressMutationResponseDto> {
  return fetchApi<UserAddressMutationResponseDto>(
    `/v1/user/addresses/${addressId}?addressType=${addressType}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}
