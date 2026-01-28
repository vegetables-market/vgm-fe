import React from "react";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">MyPage</h1>
      </div>
    </ProtectedRoute>
  );
}
