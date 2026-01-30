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
        <h1 className="mb-4 text-2xl font-bold">Basket</h1>
      </div>
    </ProtectedRoute>
  );
}
