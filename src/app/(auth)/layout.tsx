// app/(auth)/layout.tsx
import AuthBaseLayout from "@/components/features/auth/AuthBaseLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBaseLayout>{children} </AuthBaseLayout>;
}
