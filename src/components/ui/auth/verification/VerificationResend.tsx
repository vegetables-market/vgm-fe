import { FaArrowRotateRight } from "react-icons/fa6";

type VerificationResendProps = {
  onResend: () => void;
  isResending: boolean;
  timeLeft: number | null;
  resendCooldown: number | null;
};

export default function VerificationResend({
  onResend,
  isResending,
  timeLeft,
  resendCooldown,
}: VerificationResendProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 text-xs text-gray-400">
      <div className="flex items-center gap-2">
        {resendCooldown && resendCooldown > 0 ? (
          <span>再送可能まで: {resendCooldown}秒</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="flex items-center gap-1 hover:text-white hover:underline disabled:opacity-50"
          >
            <FaArrowRotateRight className={isResending ? "animate-spin" : ""} />
            コードを再送する
          </button>
        )}
      </div>

      {timeLeft != null && timeLeft > 0 && (
        <div className="text-gray-500">
          有効期限: {Math.floor(timeLeft / 60)}分{timeLeft % 60}秒
        </div>
      )}
    </div>
  );
}
