"use client";

import React from "react";
import Link from "next/link";
import { useIsPWA } from "@/hooks/useIsPWA";
import { usePWAUpdate } from "@/hooks/usePWAUpdate";

export default function MainPage() {
  const isPWA = useIsPWA();
  const { updatePWA } = usePWAUpdate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">VGM Top Page</h1>
      <p className="mb-4">Welcome to VGM application.</p>

      <div className="flex gap-4 mb-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Login
        </Link>
        <Link
          href="/test"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Pages
        </Link>
      </div>

      <div>ここ</div>

      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>

      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>

      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>

      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>

      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>

      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
    </div>
  );
}
