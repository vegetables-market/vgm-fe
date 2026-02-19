import { FaArrowRotateRight } from "react-icons/fa6";

type VerificationResendProps = {
  onResend: () => void;
  isResending: boolean;
  resendCooldown: number | null;
};

export default function VerificationResend({
  onResend,
  isResending,
  resendCooldown,
}: VerificationResendProps) {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-2 text-xs">
      <div className="flex items-center gap-2">
        {resendCooldown && resendCooldown > 0 ? (
          <span>再送可能まで: {resendCooldown}秒</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="flex cursor-pointer items-center gap-1 hover:underline disabled:opacity-50"
          >
            <FaArrowRotateRight className={isResending ? "animate-spin" : ""} />
            コードを再送する
          </button>
        )}
      </div>
    </div>
  );
}
