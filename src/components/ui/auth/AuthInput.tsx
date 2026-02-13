import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError?: boolean;
  onTogglePasswordVisibility?: () => void;
  isPasswordVisible?: boolean;
  isSuccess?: boolean;
}

export default function AuthInput({
  label,
  hasError = false,
  className = "",
  onTogglePasswordVisibility,
  isPasswordVisible = false,
  isSuccess = false,
  ...props
}: AuthInputProps) {
  const borderClass = hasError
    ? "border-red-400 focus:border-red-400"
    : isSuccess
      ? "border-green-500 focus:border-green-500"
      : "border-border focus:border-muted-foreground";

  return (
    <div className={`mb-3 w-full ${className}`}>
      <div className="mb-2 w-full">
        <p className="cursor-default text-[13px] font-bold">{label}</p>
      </div>
      <div className="relative">
        <input
          className={`border-border h-9 w-full rounded-lg border-2 pl-3 text-sm transition-colors duration-300 outline-none ${borderClass} ${
            onTogglePasswordVisibility ? "pr-10" : ""
          }`}
          {...props}
        />
        {onTogglePasswordVisibility && (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="text-muted-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-lg"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}
