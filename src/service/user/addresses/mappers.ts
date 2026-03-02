import type { ShippingAddress } from "@/lib/types";
import type {
  UpsertUserAddressRequestDto,
  UserAddressDto,
} from "@/service/user/addresses/types";

export function mapUserAddressDtoToShippingAddress(
  dto: UserAddressDto,
): ShippingAddress {
  return {
    id: String(dto.addressId),
    name: dto.name ?? "未設定",
    nameKana: dto.nameKana ?? "",
    postalCode: dto.postalCode,
    prefecture: dto.prefecture,
    city: dto.city,
    address1: dto.addressLine1,
    address2: dto.addressLine2 ?? undefined,
    phone: dto.phoneNumber ?? "",
    isDefault: dto.isDefault,
  };
}

export function mapShippingAddressToUpsertRequestDto(
  address: ShippingAddress,
): UpsertUserAddressRequestDto {
  return {
    name: address.name,
    nameKana: address.nameKana || null,
    postalCode: address.postalCode,
    prefecture: address.prefecture,
    city: address.city,
    addressLine1: address.address1,
    addressLine2: address.address2 || null,
    phoneNumber: address.phone || null,
    countryCode: "JP",
    isDefault: address.isDefault,
  };
}
