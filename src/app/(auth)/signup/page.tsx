"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";
import { getErrorMessage } from "@/lib/api/error-handler";
import Step0Email from "@/components/features/auth/signup/steps/Step0Email";
import Step1Username from "@/components/features/auth/signup/steps/Step1Username";
import Step2Password from "@/components/features/auth/signup/steps/Step2Password";
import Step3Profile from "@/components/features/auth/signup/steps/Step3Profile";
import Step4Terms from "@/components/features/auth/signup/steps/Step4Terms";
import ProgressBar from "@/components/features/auth/signup/ProgressBar";
import { FaCircleExclamation, FaCircleChevronLeft } from "react-icons/fa6";
import { SignupFormData } from "@/types/auth";

export default function SignupPage() {
  const [step, setStep] = useState(0); // 0:Email, 1:Username, 2:Password, 3:Profile, 4:Terms
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    username: "",
    password: "",
    name: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });
  const router = useRouter();

  const addLog = (msg: string) => {
    if (typeof window !== "undefined" && (window as any).addAuthLog) {
      (window as any).addAuthLog(msg);
    }
  };

  const handleNext = () => {
    setError("");
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const requestData = {
      username: formData.username,
      email: formData.email,
      password: formData.password ? "***" : "empty",
      display_name: formData.name,
      birth_year: formData.birthYear,
      birth_month: formData.birthMonth,
      birth_day: formData.birthDay,
      gender: formData.gender,
    };
    addLog(`Submitting signup data: ${JSON.stringify(requestData)}`);

    try {
      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        display_name: formData.name,
        birth_year: formData.birthYear
          ? parseInt(formData.birthYear)
          : undefined,
        birth_month: formData.birthMonth
          ? parseInt(formData.birthMonth)
          : undefined,
        birth_day: formData.birthDay ? parseInt(formData.birthDay) : undefined,
        gender: formData.gender || undefined,
      });

      addLog(`Signup successful: ${JSON.stringify(data)}`);

      if (data.require_verification && data.flow_id) {
        if (data.masked_email) {
          localStorage.setItem("vgm_masked_email", data.masked_email);
        }
        router.push(`/challenge?flow_id=${data.flow_id}`);
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      addLog(`Signup error: ${message}`);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
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
