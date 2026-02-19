import ResetPasswordForm from "@/components/features/auth/account-recovery/password/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
    </Suspense>
  );
}
