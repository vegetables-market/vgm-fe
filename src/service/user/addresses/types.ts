export type UserAddressDto = {
  addressId: number;
  name: string | null;
  nameKana: string | null;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string | null;
  phoneNumber: string | null;
  countryCode: string;
  isDefault: boolean;
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
