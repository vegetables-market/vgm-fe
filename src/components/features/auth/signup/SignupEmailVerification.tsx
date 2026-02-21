import type { VerifyAuthCodeResponseDto } from "@/service/auth/dto/verify-auth-code-response-dto";
import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import ChallengeForm from "@/components/features/auth/challenge/ChallengeForm";

type SignupEmailVerificationProps = {
  flowId: string | null;
  displayEmail?: string | null;
  expiresAt?: string | null;
  onVerifiedAction?: (data?: VerifyAuthCodeResponseDto) => void;
  redirectTo?: string | null;
};

export default function SignupEmailVerification({
  flowId,
  displayEmail,
  expiresAt,
  onVerifiedAction,
  redirectTo,
}: SignupEmailVerificationProps) {
  const logic = useChallengeLogic({
    mode: "email",
    flowId,
    displayEmail,
    expiresAt,
    redirectTo,
    onVerifiedAction,
  });

  return (
    <ChallengeForm
      mode="email"
      action={null}
      identifier={displayEmail}
      logic={logic}
      onBack={() => (window.location.href = "/login")}
    />
  );
}



