"use client";

import { FaRegCircle, FaCircleCheck, FaEye, FaEyeSlash } from "react-icons/fa6";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import { usePasswordEntry } from "@/hooks/auth/signup/usePasswordEntry";
import type { PasswordEntryProps } from "@/types/auth/signup-components";

export default function PasswordEntry({
  formData,
  setFormData,
  onNext,
}: PasswordEntryProps) {
  const {
    showError,
    isPasswordVisible,
    validations,
    clearError,
    togglePasswordVisibility,
    handleSubmit,
  } = usePasswordEntry({
    password: formData.password,
    onNext,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">繧ｹ繝・ャ繝・3 / 4</p>
        <p className="text-base font-bold text-white">繝代せ繝ｯ繝ｼ繝峨ｒ險ｭ螳・/p>
      </div>

      <section>
        <input
          type="text"
          name="username"
          value={formData.username}
          readOnly
          autoComplete="username"
          className="hidden"
        />

        <div className="mb-2 w-full">
          <span className="text-[13px] font-bold text-white">繝代せ繝ｯ繝ｼ繝・/span>
        </div>
        <div className="relative mb-4">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="new-password"
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
              clearError();
            }}
            className={`h-9 w-full rounded-lg border-2 bg-black pr-10 pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              showError && !validations.isValid
                ? "!border-red-400"
                : "!border-white/70 focus:!border-white"
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-lg text-white/70 hover:text-white"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <h3 className="mb-3 text-[13px] font-bold text-white">
          莉･荳九・譚｡莉ｶ繧呈ｺ縺溘☆蠢・ｦ√′縺ゅｊ縺ｾ縺・        </h3>
        <div className="mb-2 flex flex-col space-y-2">
          <div className="flex items-center text-[13px]">
            {validations.hasLetter ? (
              <FaCircleCheck className="mr-1 text-green-500" />
            ) : (
              <FaRegCircle className="mr-1 text-white" />
            )}
            <p className={showError && !validations.hasLetter ? "text-red-400" : "text-white"}>
              闍ｱ蟄励ｒ1譁・ｭ嶺ｻ･荳雁性繧
            </p>
          </div>
          <div className="flex items-center text-[13px]">
            {validations.hasNumberOrSpecialChar ? (
              <FaCircleCheck className="mr-1 text-green-500" />
            ) : (
              <FaRegCircle className="mr-1 text-white" />
            )}
            <p className={showError && !validations.hasNumberOrSpecialChar ? "text-red-400" : "text-white"}>
              謨ｰ蟄励∪縺溘・險伜捷繧・縺､莉･荳雁性繧
            </p>
          </div>
          <div className="flex items-center text-[13px]">
            {validations.isLengthValid ? (
              <FaCircleCheck className="mr-1 text-green-500" />
            ) : (
              <FaRegCircle className="mr-1 text-white" />
            )}
            <p className={showError && !validations.isLengthValid ? "text-red-400" : "text-white"}>
              10譁・ｭ嶺ｻ･荳・            </p>
          </div>
        </div>
      </section>

      <AuthSubmitButton>谺｡縺ｸ</AuthSubmitButton>
    </form>
  );
}
