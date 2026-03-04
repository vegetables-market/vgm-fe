import type { ShippingAddress } from "@/lib/types";
import type {
  UpsertUserAddressRequestDto,
  UserAddressDto,
} from "@/service/user/addresses/types";

export function mapUserAddressDtoToShippingAddress(
  dto: UserAddressDto,
): ShippingAddress {
  const rawId = dto.addressId ?? dto.address_id;
  if (rawId == null) {
    throw new Error("Address id is missing in response");
  }

  return {
    id: String(rawId),
    name: dto.name ?? "未設定",
    nameKana: dto.nameKana ?? dto.name_kana ?? "",
    postalCode: dto.postalCode ?? dto.postal_code ?? "",
    prefecture: dto.prefecture ?? "",
    city: dto.city ?? "",
    address1: dto.addressLine1 ?? dto.address_line1 ?? "",
    address2: dto.addressLine2 ?? dto.address_line2 ?? undefined,
    phone: dto.phoneNumber ?? dto.phone_number ?? "",
    isDefault: dto.isDefault ?? dto.is_default ?? false,
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
