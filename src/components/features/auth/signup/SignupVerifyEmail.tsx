import { useChallengeLogic } from "@/hooks/auth/challenge/useChallengeLogic";
import ChallengeForm from "@/components/features/auth/challenge/ChallengeForm";

type SignupVerifyEmailProps = {
  flowId: string | null;
  displayEmail?: string | null;
  expiresAt?: string | null;
  onVerifiedAction?: (data?: any) => void;
  redirectTo?: string | null;
};

export default function SignupVerifyEmail({
  flowId,
  displayEmail,
  expiresAt,
  onVerifiedAction,
  redirectTo,
}: SignupVerifyEmailProps) {
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
