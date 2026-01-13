// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="auth-container">
      {/* ヘッダーなどは置かず、そのまま表示 */}
      {children}
    </section>
  );
}