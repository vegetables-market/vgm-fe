import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

export type AuthStatusVariant = "error" | "success";

interface AuthStatusMessageProps {
  message: string;
  variant?: AuthStatusVariant;
  className?: string;
}

export default function AuthStatusMessage({
  message,
  variant = "error",
  className = "",
}: AuthStatusMessageProps) {
  const isError = variant === "error";
  const toneClass = isError
    ? "bg-red-600/90 text-white"
    : "bg-green-600/90 text-white";

  return (
    <p
      className={`mb-2 flex h-auto min-h-8 w-full items-center justify-center rounded-xs p-2 text-center text-[11px] ${toneClass} ${className}`}
    >
      {isError ? (
        <FaCircleExclamation className="mr-1 flex-shrink-0" />
      ) : (
        <FaCircleCheck className="mr-1 flex-shrink-0" />
      )}
      {message}
    </p>
  );
}
