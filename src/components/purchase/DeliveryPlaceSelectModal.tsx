"use client";

import { DeliveryPlaceOption, DELIVERY_PLACE_LABELS } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface DeliveryPlaceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlace: DeliveryPlaceOption;
  onSelect: (place: DeliveryPlaceOption) => void;
}

const DELIVERY_PLACE_OPTIONS: DeliveryPlaceOption[] = [
  "door",
  "delivery_box",
  "gas_meter",
  "bicycle",
  "garage",
  "building_door",
  "hand_delivery",
];

export function DeliveryPlaceSelectModal({
  isOpen,
  onClose,
  selectedPlace,
  onSelect,
}: DeliveryPlaceSelectModalProps) {
  const handleSelect = (place: DeliveryPlaceOption) => {
    onSelect(place);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* モーダル本体 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-gray-900 rounded-t-2xl md:rounded-2xl z-50 max-h-[90vh] overflow-y-auto md:max-w-lg md:w-full"
          >
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-white">
                置き配の場所を選択
              </h2>
              <div className="w-10" /> {/* スペーサー */}
            </div>

            <div className="p-4 space-y-2">
              {/* 説明 */}
              <p className="text-gray-400 text-sm mb-4">
                ご不在時に荷物を届ける場所を指定できます。在宅時は玄関でお受け取りいただけます。
              </p>

              {/* オプションリスト */}
              {DELIVERY_PLACE_OPTIONS.map((place) => (
                <label
                  key={place}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedPlace === place
                      ? "bg-blue-900/20 border border-blue-500"
                      : "hover:bg-gray-800 border border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_place"
                    checked={selectedPlace === place}
                    onChange={() => handleSelect(place)}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="text-white">
                    {DELIVERY_PLACE_LABELS[place]}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
