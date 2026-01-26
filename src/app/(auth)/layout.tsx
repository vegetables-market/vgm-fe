// app/(auth)/layout.tsx
import DebugConsole from "@/components/features/auth/DebugConsole";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen bg-black">
      <div className="pb-12">
        {children}
      </div>
      <DebugConsole />
    </section>
  );
}
