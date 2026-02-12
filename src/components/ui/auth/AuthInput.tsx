import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError?: boolean;
}

export default function AuthInput({
  label,
  hasError = false,
  className = "",
  ...props
}: AuthInputProps) {
  const borderClass = hasError
    ? "border-red-400 focus:border-red-400"
    : "border-white/70 focus:border-white";

  return (
    <div className="mb-3 w-full">
      <div className="mb-2 w-full">
        <span className="cursor-default text-[12px] font-bold">
          {label}
        </span>
      </div>
      <input
        className={`h-9 w-full rounded-lg border-2 pl-3 text-sm transition-colors duration-300 outline-none ${borderClass} ${className}`}
        {...props}
      />
    </div>
  );
}
