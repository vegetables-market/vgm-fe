"use client";

import { useRef, useState, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));

  // 外部からのvalue変更を反映
  useEffect(() => {
    const newOtp = value.split("").slice(0, length);
    // 足りない分は空文字で埋める
    while (newOtp.length < length) {
      newOtp.push("");
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return; // 数字のみ許可

    const newOtp = [...otp];
    // 最後の1文字だけを取る（上書き対応）
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // 次の入力欄へフォーカス移動
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // 現在の欄が空でバックスペースが押されたら、前の欄へ移動して削除
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        // 現在の欄を削除
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length).split("");
    if (pastedData.some((char) => isNaN(Number(char)))) return; // 数字以外が含まれていたら無視

    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(""));
    
    // 最後の入力欄へフォーカス
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-10 h-12 text-center text-xl font-bold bg-zinc-900 border border-zinc-700 rounded-md text-white focus:border-amber-300 focus:outline-none transition-colors disabled:opacity-50"
        />
      ))}
    </div>
  );
}
