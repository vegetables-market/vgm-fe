import React from "react";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

export default function BasketPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 className="text-2xl font-bold mb-4">Basket</h1>
      </div>
    </ProtectedRoute>
  );
}
