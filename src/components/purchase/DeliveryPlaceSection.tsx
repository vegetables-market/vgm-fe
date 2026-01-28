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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white">
            置き配の指定
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-0.5 rounded">
            任意
          </span>
        </div>
        <button
          onClick={onChangeClick}
          className="text-blue-500 text-sm hover:underline flex items-center gap-1"
        >
          変更する
          <svg
            className="w-4 h-4"
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
