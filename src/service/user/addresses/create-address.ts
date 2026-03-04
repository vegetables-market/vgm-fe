import { fetchApi } from "@/lib/api/fetch";
import type {
  UpsertUserAddressRequestDto,
  UserAddressMutationResponseDto,
} from "@/service/user/addresses/types";

export async function createAddress(
  input: UpsertUserAddressRequestDto,
  addressType: "DELIVERY" | "SENDER" = "DELIVERY",
): Promise<UserAddressMutationResponseDto> {
  return fetchApi<UserAddressMutationResponseDto>(
    `/v1/user/addresses?addressType=${addressType}`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
