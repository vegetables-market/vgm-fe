import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import ChallengeForm from "@/components/features/auth/challenge/ChallengeForm";

type SignupEmailVerificationProps = {
  flowId: string | null;
  maskedEmail?: string | null;
  expiresAt?: string | null;
  onVerifiedAction?: (data?: any) => void;
  redirectTo?: string | null;
};

export default function SignupEmailVerification({
  flowId,
  maskedEmail,
  expiresAt,
  onVerifiedAction,
  redirectTo,
}: SignupEmailVerificationProps) {
  const logic = useChallengeLogic({
    mode: "email",
    flowId,
    expiresAt,
    redirectTo,
    onVerifiedAction,
  });

  return (
    <ChallengeForm
      mode="email"
      action={null}
      maskedEmail={maskedEmail || null}
      logic={logic}
      onReturnToLogin={() => (window.location.href = "/login")}
    />
  );
}
