import { FaCircleCheck, FaCircleExclamation, FaSpinner } from "react-icons/fa6";

export type AuthStatusVariant = "error" | "success" | "info";

interface AuthStatusMessageProps {
  message: string;
  variant?: AuthStatusVariant;
  className?: string;
  isLoading?: boolean;
}

export default function AuthStatusMessage({
  message,
  variant = "error",
  className = "",
  isLoading = false,
}: AuthStatusMessageProps) {
  const isError = variant === "error";
  const isSuccess = variant === "success";

  const toneClass = isError
    ? "bg-red-600/90 text-white"
    : isSuccess
      ? "bg-green-600/90 text-white"
      : "bg-zinc-700/90 text-white"; // info variant

  return (
    <p
      className={`mb-2 flex h-auto min-h-8 w-full items-center justify-center rounded-xs text-center text-[11px] ${toneClass} ${className}`}
    >
      {isLoading ? (
        <FaSpinner className="mr-1 animate-spin" />
      ) : isError ? (
        <FaCircleExclamation className="mr-1" />
      ) : isSuccess ? (
        <FaCircleCheck className="mr-1" />
      ) : null}
      {message}
    </p>
  );
}
