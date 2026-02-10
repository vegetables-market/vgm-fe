import React from "react";
import { FaCircleExclamation, FaCircleChevronLeft } from "react-icons/fa6";
import AuthTitle from "@/components/features/auth/ui/AuthTitle";
import EmailEntry from "@/components/features/auth/signup/steps/EmailEntry";
import CodeVerification from "@/components/features/auth/signup/steps/CodeVerification";
import UsernameEntry from "@/components/features/auth/signup/steps/UsernameEntry";
import PasswordEntry from "@/components/features/auth/signup/steps/PasswordEntry";
import TermsAgreement from "@/components/features/auth/signup/steps/TermsAgreement";

import ProgressBar from "@/components/features/auth/signup/ProgressBar";
import { SignupFormData } from "@/types/auth/user";

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
        <AuthTitle>新規登録</AuthTitle>

        {error && (
          <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 p-2 text-center text-[11px] text-white">
            <FaCircleExclamation className="mr-1 flex-shrink-0" />
            {error}
          </p>
        )}

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
             <CodeVerification
               formData={formData}
               setFormData={setFormData}
               onNext={handleNext}
               flowId={formData.flow_id || null}
               expiresAt={formData.expiresAt}
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
