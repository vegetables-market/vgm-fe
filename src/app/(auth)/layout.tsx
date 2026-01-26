// app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen bg-black">
      <div className="pb-12">
        {children}
      </div>
    </section>
  );
}
