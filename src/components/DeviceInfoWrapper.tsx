"use client";

import React from "react";
import { useIsPWA } from "@/hooks/useIsPWA";
import { useDevice } from "@/hooks/useDevice";
import { usePWAUpdate } from "@/hooks/usePWAUpdate";
import { IoReload } from "react-icons/io5";

interface DeviceInfoWrapperProps {
  children?: React.ReactNode;
}

export default function DeviceInfoWrapper({
  children,
}: DeviceInfoWrapperProps) {
  const isPWA = useIsPWA();
  const { deviceType } = useDevice();
  const { updatePWA, isSWRegistered } = usePWAUpdate();
  const [isSecure, setIsSecure] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSecure(window.isSecureContext);
    }
  }, []);

  return (
    <>
      <div className="fixed bottom-20 right-0 m-4 p-3 bg-black/80 text-white text-xs rounded-lg shadow-lg z-[9999] pointer-events-none backdrop-blur-sm">
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
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">Secure:</span>
            <span
              className={
                isSecure ? "text-green-400 font-bold" : "text-red-400 font-bold"
              }
            >
              {isSecure ? "Yes" : "No (SW disabled)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">SW Status:</span>
            <span
              className={
                isSWRegistered ? "text-blue-400 font-bold" : "text-gray-400"
              }
            >
              {isSWRegistered ? "Registered" : "None"}
            </span>
          </div>

          {isPWA && (
            <button
              onClick={updatePWA}
              className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-700 pointer-events-auto text-amber-400 hover:text-amber-300 transition-colors group w-full text-left"
            >
              <IoReload className="text-sm group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-bold">Check Update</span>
            </button>
          )}
        </div>
      </div>
      {children}
    </>
  );
}
