import ChallengeLayout from "./ChallengeLayout";
import ChallengeFlow from "@/components/features/auth/challenge/ChallengeFlow";
import { VerificationMode } from "@/types/auth/core";

interface ChallengeState {
  error: string;
  type: string | null;
  flowId: string | null;
  mfaToken: string | null;
  action: string | null;
  maskedEmail: string | null;
  expiresAt: string | null;
  nextResendAt: string | null;
  redirectTo: string | null;
}

interface ChallengeActions {
  handleReturnToLogin: () => void;
}

interface ChallengeFormProps {
  state: ChallengeState;
  actions: ChallengeActions;
}

export default function ChallengeForm({ state, actions }: ChallengeFormProps) {
  const {
    error,
    type,
    flowId,
    mfaToken,
    action,
    maskedEmail,
    expiresAt,
    nextResendAt,
    redirectTo,
  } = state;
  const { handleReturnToLogin } = actions;

  const renderContent = () => {
    let mode: VerificationMode | null = null;
    let effectiveFlowId = flowId;
    let effectiveMfaToken = mfaToken;

    // 1. Email Verification (Signup / Login Unknown Device) -> flow_id
    if (type === "email" && flowId) {
      mode = "email";
    }
    // 2. Email MFA (Login Known Device) -> mfa_token
    else if (type === "email" && mfaToken) {
      mode = "email_mfa";
    }
    // 3. TOTP MFA -> mfa_token
    else if (type === "totp" && mfaToken) {
      mode = "totp";
    }

    if (!mode) {
      // 繝代Λ繝｡繝ｼ繧ｿ荳崎ｶｳ遲峨・蝣ｴ蜷・
      return null;
    }

    return (
      <ChallengeFlow
        mode={mode}
        flowId={effectiveFlowId}
        mfaToken={effectiveMfaToken}
        action={action || null}
        redirectTo={redirectTo || null}
        maskedEmail={maskedEmail || null}
        expiresAt={expiresAt || null}
        nextResendAt={nextResendAt || null}
      />
    );
  };

  const getTitle = () => {
    return "セキュリティ確認";
  };

  return (
    <ChallengeLayout
      title={getTitle()}
      error={error}
      footer={
        <button
          onClick={handleReturnToLogin}
          className="cursor-pointer border-none bg-transparent text-xs text-zinc-500 underline transition-colors hover:text-zinc-300"
        >
          {action === "delete_account" ? "設定に戻る" : "ログイン画面に戻る"}
        </button>
      }
    >
      {renderContent()}
    </ChallengeLayout>
  );
}
