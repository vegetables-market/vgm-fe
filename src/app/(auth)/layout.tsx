// app/(auth)/layout.tsx
import AuthBaseLayout from "@/components/features3/auth/AuthBaseLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBaseLayout>{children} </AuthBaseLayout>;
}
