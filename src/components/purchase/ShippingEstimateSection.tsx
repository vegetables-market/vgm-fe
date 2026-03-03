"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ShippingAddress } from "@/lib/types";
import {
  estimateShipping,
  type ShippingEstimateResult,
} from "@/service/market/shipping/estimate-shipping";

type ShippingEstimateSectionProps = {
  itemId: string | number;
  selectedAddress: ShippingAddress | null;
};

type GoogleLatLng = { lat: number; lng: number };
type GoogleMapInstance = {
  fitBounds: (bounds: GoogleLatLngBounds, padding?: number) => void;
  setCenter: (latLng: GoogleLatLng) => void;
  setZoom: (zoom: number) => void;
};
type GoogleLatLngBounds = {
  extend: (latLng: GoogleLatLng) => void;
};
type GoogleMapsApi = {
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => GoogleMapInstance;
  Marker: new (options: Record<string, unknown>) => unknown;
  Polyline: new (options: Record<string, unknown>) => unknown;
  LatLngBounds: new () => GoogleLatLngBounds;
};
type WindowWithGoogleMaps = Window & {
  google?: {
    maps?: GoogleMapsApi;
  };
};

type ComputeRoutesResponse = {
  routes?: Array<{
    polyline?: {
      encodedPolyline?: string;
      geoJsonLinestring?: {
        coordinates?: number[][];
      };
    };
  }>;
};

let googleMapsScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if ((window as WindowWithGoogleMaps).google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      "google-maps-js-script",
    ) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google Maps script load failed")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-js-script";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps script load failed"));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

function decodePolyline(encoded: string): GoogleLatLng[] {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const path: GoogleLatLng[] = [];

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;

    path.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return path;
}

async function fetchDrivingRoutePath(
  apiKey: string,
  origin: GoogleLatLng,
  destination: GoogleLatLng,
  signal: AbortSignal,
): Promise<GoogleLatLng[] | null> {
  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "routes.polyline.encodedPolyline,routes.polyline.geoJsonLinestring",
    },
    body: JSON.stringify({
      origin: {
        location: {
          latLng: {
            latitude: origin.lat,
            longitude: origin.lng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
      polylineQuality: "HIGH_QUALITY",
      polylineEncoding: "ENCODED_POLYLINE",
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Routes API request failed: ${response.status}`);
  }

  const data = (await response.json()) as ComputeRoutesResponse;
  const polyline = data.routes?.[0]?.polyline;
  if (!polyline) return null;

  if (polyline.encodedPolyline) {
    const decoded = decodePolyline(polyline.encodedPolyline);
    if (decoded.length > 0) {
      return decoded;
    }
  }

  const geoJsonCoordinates = polyline.geoJsonLinestring?.coordinates;
  if (!geoJsonCoordinates || geoJsonCoordinates.length === 0) {
    return null;
  }

  const path = geoJsonCoordinates
    .map(([lng, lat]) => ({ lat, lng }))
    .filter(
      (point) =>
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lng) &&
        Math.abs(point.lat) <= 90 &&
        Math.abs(point.lng) <= 180,
    );

  return path.length > 0 ? path : null;
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return "-";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours <= 0) return `約${minutes}分`;
  if (minutes <= 0) return `約${hours}時間`;
  return `約${hours}時間${minutes}分`;
}

export function ShippingEstimateSection({
  itemId,
  selectedAddress,
}: ShippingEstimateSectionProps) {
  const [estimate, setEstimate] = useState<ShippingEstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const hasCoordinates = useMemo(
    () =>
      estimate?.originLat != null &&
      estimate.originLng != null &&
      estimate.destinationLat != null &&
      estimate.destinationLng != null,
    [estimate],
  );

  useEffect(() => {
    if (!selectedAddress) {
      setEstimate(null);
      setError("");
      return;
    }

    const addressId = Number(selectedAddress.id);
    if (!Number.isFinite(addressId)) {
      setEstimate(null);
      setError("配送先住所IDが不正です");
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError("");

    void estimateShipping(itemId, addressId)
      .then((data) => {
        if (!isActive) return;
        setEstimate(data);
      })
      .catch((estimateError) => {
        if (!isActive) return;
        console.error(estimateError);
        setEstimate(null);
        setError("配送日数の見積取得に失敗しました");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [itemId, selectedAddress]);

  useEffect(() => {
    if (!hasCoordinates || !mapsApiKey) {
      setIsMapReady(false);
      return;
    }

    let isActive = true;
    void loadGoogleMapsScript(mapsApiKey)
      .then(() => {
        if (!isActive) return;
        setIsMapReady(true);
      })
      .catch((scriptError) => {
        if (!isActive) return;
        console.error(scriptError);
        setIsMapReady(false);
      });

    return () => {
      isActive = false;
    };
  }, [hasCoordinates, mapsApiKey]);

  useEffect(() => {
    if (!isMapReady || !hasCoordinates || !mapRef.current || !estimate) {
      return;
    }

    const abortController = new AbortController();
    let isActive = true;
    const googleMaps = (window as WindowWithGoogleMaps).google?.maps;
    if (!googleMaps) {
      return;
    }

    const origin = {
      lat: Number(estimate.originLat),
      lng: Number(estimate.originLng),
    };
    const destination = {
      lat: Number(estimate.destinationLat),
      lng: Number(estimate.destinationLng),
    };

    const map = new googleMaps.Map(mapRef.current, {
      center: origin,
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const bounds = new googleMaps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);

    new googleMaps.Marker({
      map,
      position: origin,
      title: "発送元",
      label: "発",
    });

    new googleMaps.Marker({
      map,
      position: destination,
      title: "配送先",
      label: "着",
    });

    if (origin.lat === destination.lat && origin.lng === destination.lng) {
      map.setCenter(origin);
      map.setZoom(11);
      return () => {
        isActive = false;
        abortController.abort();
      };
    }

    const drawRouteLine = (path: GoogleLatLng[]) => {
      new googleMaps.Polyline({
        map,
        path,
        geodesic: true,
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });
    };

    const drawFallbackLine = () => {
      drawRouteLine([origin, destination]);
      map.fitBounds(bounds, 60);
    };

    void fetchDrivingRoutePath(mapsApiKey, origin, destination, abortController.signal)
      .then((path) => {
        if (!isActive) {
          return;
        }

        if (!path || path.length < 2) {
          drawFallbackLine();
          return;
        }

        drawRouteLine(path);

        const routeBounds = new googleMaps.LatLngBounds();
        path.forEach((point) => {
          routeBounds.extend(point);
        });
        map.fitBounds(routeBounds, 60);
      })
      .catch((routesError) => {
        if (!isActive) return;
        console.error(routesError);
        drawFallbackLine();
      });

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [estimate, hasCoordinates, isMapReady, mapsApiKey]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
        配送見積（Routes API）
      </h3>

      {!selectedAddress && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          配送先を選択すると見積を表示します
        </p>
      )}

      {selectedAddress && isLoading && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          配送見積を計算中...
        </p>
      )}

      {selectedAddress && !isLoading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {selectedAddress && !isLoading && !error && estimate && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-200 md:grid-cols-2">
            <p>
              距離: <span className="font-semibold">{estimate.distanceKm} km</span>
            </p>
            <p>
              移動時間(車):{" "}
              <span className="font-semibold">
                {formatDuration(estimate.routeDurationSeconds)}
              </span>
            </p>
            <p>
              お届け目安:{" "}
              <span className="font-semibold">{estimate.estimatedLabel}</span>
            </p>
            <p>
              推定方式:{" "}
              <span className="font-semibold">
                {estimate.estimateSource === "GOOGLE_ROUTES_API"
                  ? "Google Routes API"
                  : "都道府県中心座標フォールバック"}
              </span>
            </p>
          </div>

          {hasCoordinates && mapsApiKey && (
            <div className="space-y-2">
              <div
                ref={mapRef}
                className="h-64 w-full rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {hasCoordinates && !mapsApiKey && (
            <p className="text-xs text-amber-600">
              地図表示には `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` の設定が必要です
            </p>
          )}

          <p className="text-xs text-gray-500">{estimate.note}</p>
        </div>
      )}
    </div>
  );
}
