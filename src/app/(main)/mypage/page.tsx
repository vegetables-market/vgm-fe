import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">MyPage</h1>
      </div>
    </ProtectedRoute>
  );
}
