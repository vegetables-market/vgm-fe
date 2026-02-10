import { useRouter } from "next/navigation";

export type ChallengeInitialParams = {
  type?: string;
  flowId?: string;
  mfaToken?: string;
  action?: string;
  maskedEmail?: string;
  expiresAt?: string;
  nextResendAt?: string;
  redirectTo?: string;
};

export function useChallenge(initial?: ChallengeInitialParams) {
  const router = useRouter();

  const type = initial?.type || (initial?.flowId ? "email" : null);
  const error = type ? "" : "不正なリクエストです。";

  const handleReturnToLogin = () => {
    router.push("/login");
  };

  return {
    state: {
      error,
      type,
      flowId: initial?.flowId || null,
      mfaToken: initial?.mfaToken || null,
      action: initial?.action || null,
      maskedEmail: initial?.maskedEmail || null,
      expiresAt: initial?.expiresAt || null,
      nextResendAt: initial?.nextResendAt || null,
      redirectTo: initial?.redirectTo || null,
    },
    actions: {
      handleReturnToLogin,
    },
  };
}

