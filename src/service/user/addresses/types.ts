export type UserAddressDto = {
  addressId?: number;
  address_id?: number;
  name?: string | null;
  nameKana?: string | null;
  name_kana?: string | null;
  postalCode?: string;
  postal_code?: string;
  prefecture?: string;
  city?: string;
  addressLine1?: string;
  address_line1?: string;
  addressLine2?: string | null;
  address_line2?: string | null;
  phoneNumber?: string | null;
  phone_number?: string | null;
  countryCode?: string;
  country_code?: string;
  isDefault?: boolean;
  is_default?: boolean;
};

export type UserAddressesResponseDto = {
  addresses: UserAddressDto[];
};

export type UpsertUserAddressRequestDto = {
  name: string;
  nameKana?: string | null;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string | null;
  phoneNumber?: string | null;
  countryCode?: string;
  isDefault?: boolean;
};

export type UserAddressMutationResponseDto = {
  success: boolean;
  address: UserAddressDto;
};

export type UserAddressDeleteResponseDto = {
  success: boolean;
};
