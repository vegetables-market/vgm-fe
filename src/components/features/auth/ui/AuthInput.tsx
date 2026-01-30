import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({ label, className = "", ...props }: AuthInputProps) {
  return (
    <div className="mb-3 w-full">
      <div className="mb-2 w-full">
        <span className="cursor-default text-[12px] font-bold">
          {label}
        </span>
      </div>
      <input
        className={`h-9 w-full rounded-lg border-2 border-white/70 pl-3 text-sm transition-colors duration-300 outline-none focus:border-white ${className}`}
        {...props}
      />
    </div>
  );
}
