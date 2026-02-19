// app/(auth)/layout.tsx
import AuthBaseLayout from "@/components/layouts/AuthGroup/AuthBaseLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBaseLayout>{children} </AuthBaseLayout>;
}
