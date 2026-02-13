"use client";

import { useSignupStep } from "@/context/auth/SignupStepContext";

export default function SignupStepHeader() {
  const context = useSignupStep();

  if (!context) return null;

  const { step, totalSteps, showStepNumber } = context;

  if (!showStepNumber) {
    return null;
  }

  return (
    <p className="mb-2 text-base text-[#b3b3b3]">
      ステップ {step + 1} / {totalSteps}
    </p>
  );
}
