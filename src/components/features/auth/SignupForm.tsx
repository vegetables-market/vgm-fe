import React from "react";
import { FaCircleExclamation, FaCircleChevronLeft } from "react-icons/fa6";
import Step0Email from "@/components/features/auth/signup/steps/Step0Email";
import Step1Username from "@/components/features/auth/signup/steps/Step1Username";
import Step2Password from "@/components/features/auth/signup/steps/Step2Password";
import Step3Profile from "@/components/features/auth/signup/steps/Step3Profile";
import Step4Terms from "@/components/features/auth/signup/steps/Step4Terms";
import ProgressBar from "@/components/features/auth/signup/ProgressBar";
import { SignupFormData } from "@/types/auth";

interface SignupState {
  step: number;
  error: string;
  loading: boolean;
  formData: SignupFormData;
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
  const { step, error, loading, formData } = state;
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
        <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold">
          {step === 0 ? "新規登録" : `ステップ ${step} / 5`}
        </h2>

        {error && (
          <p className="mb-4 flex h-auto min-h-8 w-full items-center justify-center rounded-xs bg-red-600/90 p-2 text-center text-[11px] text-white">
            <FaCircleExclamation className="mr-1 flex-shrink-0" />
            {error}
          </p>
        )}

        <div className="mb-5 w-full">
          {step === 0 && (
            <Step0Email
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              addLog={addLog}
            />
          )}
          {step === 1 && (
            <Step1Username
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2Password
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 3 && (
            <Step3Profile
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 4 && (
            <Step4Terms onSubmit={handleSubmit} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
}
