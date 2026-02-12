import React from "react";

type AuthSubmitButtonVariant = "primary" | "danger" | "neutral";

interface AuthSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: AuthSubmitButtonVariant;
}

const VARIANT_CLASS: Record<AuthSubmitButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
  neutral: "bg-muted text-foreground hover:bg-border",
};

export default function AuthSubmitButton({
  children,
  isLoading = false,
  loadingText = "処理中...",
  variant = "primary",
  className = "",
  disabled,
  type = "submit",
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`mt-6 h-10 w-full cursor-pointer rounded-full text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

