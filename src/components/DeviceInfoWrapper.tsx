"use client";

import React from "react";
import { useIsPWA } from "@/hooks/useIsPWA";
import { useDevice } from "@/hooks/useDevice";

interface DeviceInfoWrapperProps {
  children?: React.ReactNode;
}

export default function DeviceInfoWrapper({
  children,
}: DeviceInfoWrapperProps) {
  const isPWA = useIsPWA();
  const { deviceType } = useDevice();

  return (
    <>
      <div className="fixed bottom-0 right-0 m-4 p-3 bg-black/80 text-white text-xs rounded-lg shadow-lg z-[9999] pointer-events-none backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">PWA Mode:</span>
            <span
              className={isPWA ? "text-green-400 font-bold" : "text-gray-200"}
            >
              {isPWA ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">Device:</span>
            <span className="text-blue-300 font-medium capitalize">
              {deviceType}
            </span>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
