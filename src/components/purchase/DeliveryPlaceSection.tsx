"use client";

import { DeliveryPlaceOption, DELIVERY_PLACE_LABELS } from "@/lib/types";

interface DeliveryPlaceSectionProps {
  selectedPlace: DeliveryPlaceOption;
  onChangeClick: () => void;
}

export function DeliveryPlaceSection({
  selectedPlace,
  onChangeClick,
}: DeliveryPlaceSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white">
            置き配の指定
          </h3>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            任意
          </span>
        </div>
        <button
          onClick={onChangeClick}
          className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
        >
          変更する
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300">
        {DELIVERY_PLACE_LABELS[selectedPlace]}
      </p>
    </div>
  );
}
