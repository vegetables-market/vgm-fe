
import { FaCircleExclamation } from "react-icons/fa6";
import EmailVerification from "@/components/features/auth/verification/EmailVerification";
import TotpVerification from "@/components/features/auth/verification/TotpVerification";
import EmailMfaVerification from "@/components/features/auth/verification/EmailMfaVerification";

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
  const { error, type, flowId, mfaToken, action, maskedEmail, expiresAt, nextResendAt, redirectTo } = state;
  const { handleReturnToLogin } = actions;

  const renderContent = () => {
    // 1. Email Verification (Signup / Login Unknown Device) -> flow_id
    if (type === "email" && flowId) {
      return <EmailVerification flowId={flowId} expiresAt={expiresAt || undefined} nextResendAt={nextResendAt || undefined} action={action || undefined} redirectTo={redirectTo || undefined} maskedEmail={maskedEmail || undefined} />;
    }
    // 2. Email MFA (Login Known Device) -> mfa_token
    if (type === "email" && mfaToken) {
      return <EmailMfaVerification mfaToken={mfaToken} redirectTo={redirectTo || undefined} />;
    }
    // 3. TOTP MFA -> mfa_token
    // Note: flowId might actually be an mfaToken if initiateAction returned TOTP type but used flow_id field in response.
    // Ideally frontend should map response.flow_id to mfaToken prop if type is TOTP.
    // However, backend initiateAction now returns token in flow_id field but frontend page might pass it as flow_id param??
    // Let's assume standard mfaToken param for TOTP.
    if (type === "totp" && mfaToken) {
      return <TotpVerification mfaToken={mfaToken} action={action || undefined} redirectTo={redirectTo || undefined} />;
    }

    // パラメータ不足等の場合
    if (!error) {
      return null;
    }
    return null;
  };

  const getTitle = () => {
    return "セキュリティ確認";
  };

  return (
    <div className="flex w-75 flex-col items-center">
      <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold text-white">
        {getTitle()}
      </h2>

      {error && (
        <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 p-2 text-center text-[11px] text-white">
          <FaCircleExclamation className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {renderContent()}

      <div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
        <button
          onClick={handleReturnToLogin}
          className="cursor-pointer border-none bg-transparent text-xs text-zinc-500 underline transition-colors hover:text-zinc-300"
        >
          {action === "delete_account" ? "設定に戻る" : "ログイン画面に戻る"}
        </button>
      </div>
    </div>
  );
}
