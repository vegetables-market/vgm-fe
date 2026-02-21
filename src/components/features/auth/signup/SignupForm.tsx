import React from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import AuthStatusMessage from "@/components/ui/auth/AuthStatusMessage";
import EmailEntry from "@/components/features/auth/signup/entry/EmailEntry";
import SignupEmailVerification from "@/components/features/auth/signup/SignupEmailVerification";
import UsernameEntry from "@/components/features/auth/signup/entry/UsernameEntry";
import PasswordEntry from "@/components/features/auth/signup/entry/PasswordEntry";
import TermsAgreement from "@/components/features/auth/signup/entry/TermsAgreement";

import ProgressBar from "@/components/ui/auth/ProgressBar";
import { SignupFormData } from "@/lib/auth/signup/types/signup-form-data";
import { SignupStepProvider } from "@/context/auth/SignupStepContext";

const SIGNUP_STEPS = [
  { key: "email", title: "メールアドレスを入力", component: EmailEntry },
  {
    key: "verification",
    title: "認証コードを入力",
    component: SignupEmailVerification,
  },
  { key: "username", title: "ユーザーIDを設定", component: UsernameEntry },
  { key: "password", title: "パスワードを設定", component: PasswordEntry },
  { key: "terms", title: "利用規約の確認", component: TermsAgreement },
];

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

  // ステップ表示のロジック: Email(0)とVerification(1)はカウントせず、Username(2)から 1/3 とする
  const STEP_COUNT_START_INDEX = 2; // Usernameから
  const totalDisplaySteps = SIGNUP_STEPS.length - STEP_COUNT_START_INDEX;
  const showStepNumber = step >= STEP_COUNT_START_INDEX;
  const displayStep = showStepNumber ? step - STEP_COUNT_START_INDEX : 0;

  return (
    <>
      {step > 0 && (
        <div className="w-full">
          {step > 2 && (
            <FaCircleChevronLeft
              className="absolute top-8 left-8 cursor-pointer text-3xl transition-colors hover:text-gray-300"
              onClick={handlePrev}
            />
          )}

          {showStepNumber && (
            <ProgressBar
              currentStep={displayStep + 1}
              totalSteps={totalDisplaySteps}
            />
          )}
        </div>
      )}
      <div className="flex w-75 flex-col items-center">
        {error && (
          <AuthStatusMessage message={error} variant="error" className="mb-4" />
        )}

        <SignupStepProvider
          step={displayStep}
          totalSteps={totalDisplaySteps}
          showStepNumber={showStepNumber}
        >
          {step === 0 && (
            <EmailEntry
              formData={formData}
              setFormData={setFormData}
              addLog={addLog}
              redirectTo={redirectTo}
            />
          )}
          {step === 1 && (
            <SignupEmailVerification
              flowId={formData.flow_id || null}
              displayEmail={formData.email}
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
        </SignupStepProvider>
      </div>
    </>
  );
}

