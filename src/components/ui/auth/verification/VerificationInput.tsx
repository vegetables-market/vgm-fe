import React from "react";

type VerificationInputProps = {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  isLoading?: boolean;
};

export default function VerificationInput({
  value,
  onChange,
  onEnter,
  isLoading,
}: VerificationInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length === 6 && !isLoading) {
      onEnter();
    }
  };

  return (
    <div className="relative mb-6 w-full max-w-[280px]">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        maxLength={6}
        placeholder="000000"
        className="h-12 w-full rounded-lg border-2 border-white/20 bg-black text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition-colors duration-300 focus:border-white"
        autoFocus
        disabled={isLoading}
      />
    </div>
  );
}
