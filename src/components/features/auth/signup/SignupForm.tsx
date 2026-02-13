import React from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import EmailEntry from "./EmailEntry";
import EmailVerification from "@/components/features/auth/challenge/EmailVerification";
import UsernameEntry from "./UsernameEntry";
import PasswordEntry from "./PasswordEntry";
import TermsAgreement from "./TermsAgreement";

import ProgressBar from "@/components/features/auth/ProgressBar";
import { SignupFormData } from "@/types/auth/core";

interface SignupState {
  step: number;
  error: string;
  loading: boolean;
  formData: SignupFormData;
  redirectTo: string | null;
}

interface SignupActions {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: () => void;
  addLog: (msg: string) => void;
}

interface SignupFormProps {
  state: SignupState;
  actions: SignupActions;
}

export default function SignupForm({ state, actions }: SignupFormProps) {
  const { step, error, loading, formData, redirectTo } = state;
  const { setFormData, handleNext, handlePrev, handleSubmit, addLog } = actions;

  return (
    <>
      {step > 0 && (
        <div className="w-full">
          <FaCircleChevronLeft
            className="absolute top-8 left-8 cursor-pointer text-3xl transition-colors hover:text-gray-300"
            onClick={handlePrev}
          />
          <ProgressBar currentStep={step + 1} totalSteps={5} />
        </div>
      )}
      <div className="flex w-75 flex-col items-center">
        <AuthTitle>{"\u65b0\u898f\u767b\u9332"}</AuthTitle>

        {error && <AuthStatusMessage message={error} variant="error" className="mb-4" />}

        <div className="mb-5 w-full">
          {step === 0 && (
            <EmailEntry
              formData={formData}
              setFormData={setFormData}
              addLog={addLog}
              redirectTo={redirectTo}
            />
          )}
          {step === 1 && (
            <EmailVerification
              flowId={formData.flow_id || null}
              maskedEmail={formData.email}
              expiresAt={formData.expiresAt}
              onVerifiedAction={handleNext}
              redirectTo={redirectTo}
            />
          )}
          {step === 2 && (
            <UsernameEntry
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 3 && (
            <PasswordEntry
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 4 && (
            <TermsAgreement onSubmit={handleSubmit} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
}
