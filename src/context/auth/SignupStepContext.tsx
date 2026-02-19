"use client";

import { createContext, useContext, ReactNode } from "react";

type SignupStepContextType = {
  step: number;
  totalSteps: number;
  showStepNumber?: boolean;
};

const SignupStepContext = createContext<SignupStepContextType | null>(null);

export function useSignupStep() {
  return useContext(SignupStepContext);
}

type SignupStepProviderProps = {
  step: number;
  totalSteps: number;
  showStepNumber?: boolean;
  children: ReactNode;
};

export function SignupStepProvider({
  step,
  totalSteps,
  showStepNumber = true,
  children,
}: SignupStepProviderProps) {
  return (
    <SignupStepContext.Provider
      value={{ step, totalSteps, showStepNumber }}
    >
      {children}
    </SignupStepContext.Provider>
  );
}
