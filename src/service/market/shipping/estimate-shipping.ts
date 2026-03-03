import { fetchApi } from "@/lib/api/fetch";

type ShippingEstimateApiResponse = {
  itemId?: string | number;
  item_id?: string | number;
  addressId?: number | string;
  address_id?: number | string;
  distanceKm?: number | string;
  distance_km?: number | string;
  routeDurationSeconds?: number | string | null;
  route_duration_seconds?: number | string | null;
  estimatedDays?: number | string;
  estimated_days?: number | string;
  distanceBand?: string;
  distance_band?: string;
  estimatedLabel?: string;
  estimated_label?: string;
  estimateSource?: string;
  estimate_source?: string;
  originLat?: number | string | null;
  origin_lat?: number | string | null;
  originLng?: number | string | null;
  origin_lng?: number | string | null;
  destinationLat?: number | string | null;
  destination_lat?: number | string | null;
  destinationLng?: number | string | null;
  destination_lng?: number | string | null;
  note?: string;
};

export type ShippingEstimateResult = {
  itemId: string;
  addressId: number;
  distanceKm: number;
  routeDurationSeconds: number | null;
  estimatedDays: number;
  distanceBand: string;
  estimatedLabel: string;
  estimateSource: string;
  originLat: number | null;
  originLng: number | null;
  destinationLat: number | null;
  destinationLng: number | null;
  note: string;
};

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toNullableNumber(value: unknown): number | null {
  if (value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function estimateShipping(
  itemId: string | number,
  addressId: number,
): Promise<ShippingEstimateResult> {
  const raw = await fetchApi<ShippingEstimateApiResponse>(
    "/v1/market/shipping/estimate",
    {
      method: "POST",
      body: JSON.stringify({
        item_id: String(itemId),
        address_id: addressId,
      }),
    },
  );

  return {
    itemId: String(raw.itemId ?? raw.item_id ?? itemId),
    addressId: toNumber(raw.addressId ?? raw.address_id ?? addressId),
    distanceKm: toNumber(raw.distanceKm ?? raw.distance_km),
    routeDurationSeconds: toNullableNumber(
      raw.routeDurationSeconds ?? raw.route_duration_seconds,
    ),
    estimatedDays: toNumber(raw.estimatedDays ?? raw.estimated_days),
    distanceBand: raw.distanceBand ?? raw.distance_band ?? "",
    estimatedLabel: raw.estimatedLabel ?? raw.estimated_label ?? "",
    estimateSource: raw.estimateSource ?? raw.estimate_source ?? "CENTROID_FALLBACK",
    originLat: toNullableNumber(raw.originLat ?? raw.origin_lat),
    originLng: toNullableNumber(raw.originLng ?? raw.origin_lng),
    destinationLat: toNullableNumber(raw.destinationLat ?? raw.destination_lat),
    destinationLng: toNullableNumber(raw.destinationLng ?? raw.destination_lng),
    note: raw.note ?? "配送業者・天候・交通状況により前後します",
  };
}
