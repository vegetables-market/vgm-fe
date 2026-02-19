import PasswordRecoveryContainer from "@/components/features/auth/account-recovery/password/PasswordRecoveryContainer";
import { Suspense } from "react";

export default function PasswordRecoveryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
         <PasswordRecoveryContainer />
    </Suspense>
  );
}
