import type { ReactNode } from "react";
import { FaCheck } from "react-icons/fa6";

interface AuthAgreementItemProps {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  className?: string;
}

export default function AuthAgreementItem({
  checked,
  onChange,
  children,
  className = "",
}: AuthAgreementItemProps) {
  return (
    <div
      className={`bg-background flex items-center rounded-sm p-4 text-white ${className}`}
    >
      <button
        type="button"
        onClick={onChange}
        className="mr-2 cursor-pointer p-1"
      >
        <div
          className={`flex aspect-square h-5 w-5 items-center justify-center rounded-sm p-0.5 transition-colors ${
            checked
              ? "bg-primary text-white"
              : "border-2 border-zinc-600 bg-transparent text-transparent"
          }`}
        >
          <FaCheck className="text-[10px]" />
        </div>
      </button>
      <div
        className="cursor-pointer text-[12px] select-none"
        onClick={onChange}
      >
        {children}
      </div>
    </div>
  );
}
