"use client";

import React from "react";
import { useIsPWA } from "@/hooks/pwa/useIsPWA";
import { useDevice } from "@/hooks/app/useDevice";
import { usePWAUpdate } from "@/hooks/pwa/usePWAUpdate";
import { IoReload } from "react-icons/io5";

import { DeviceType } from "@/hooks/app/useDevice";

interface DeviceInfoWrapperProps {
  children?: React.ReactNode;
  initialIsPWA?: boolean;
  initialDeviceType?: DeviceType;
}

export default function DeviceInfoWrapper({
  children,
  initialIsPWA,
  initialDeviceType,
}: DeviceInfoWrapperProps) {
  const isPWA = useIsPWA(initialIsPWA);
  const { deviceType } = useDevice(initialDeviceType);
  const { updatePWA, isSWRegistered } = usePWAUpdate();
  const [isSecure, setIsSecure] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSecure(window.isSecureContext);
    }
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed right-0 bottom-20 z-[9999] m-4 rounded-lg bg-black/80 p-3 text-xs text-white shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">Display Mode:</span>
            <span
              className={isPWA ? "font-bold text-green-400" : "text-yellow-400"}
            >
              {isPWA ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">Device:</span>
            <span className="font-medium text-blue-300 capitalize">
              {deviceType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">Secure:</span>
            <span
              className={
                isSecure ? "font-bold text-green-400" : "font-bold text-red-400"
              }
            >
              {isSecure ? "Yes" : "No (SW disabled)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">SW Status:</span>
            <span
              className={
                isSWRegistered ? "font-bold text-blue-400" : "text-gray-400"
              }
            >
              {isSWRegistered ? "Registered" : "None"}
            </span>
          </div>

          {isPWA && (
            <button
              onClick={updatePWA}
              className="group pointer-events-auto mt-1 flex w-full items-center gap-2 border-t border-gray-700 pt-2 text-left text-amber-400 transition-colors hover:text-amber-300"
            >
              <IoReload className="text-sm transition-transform duration-500 group-hover:rotate-180" />
              <span className="font-bold">Check Update</span>
            </button>
          )}
        </div>
      </div>
      {children}
    </>
  );
}
