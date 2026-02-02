import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function AuthButton({ isLoading, children, className = "", disabled, ...props }: AuthButtonProps) {
  return (
    <button
      className={`bg-dis bg-foreground text-muted h-10 w-full cursor-pointer rounded-full border text-base font-bold ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "処理中..." : children}
    </button>
  );
}
