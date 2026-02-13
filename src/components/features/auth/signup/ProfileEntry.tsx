"use client";

import { FaCircleExclamation } from "react-icons/fa6";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import { useProfileEntry } from "@/hooks/auth/signup/useProfileEntry";
import type { ProfileEntryProps } from "./types";

const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
];

export default function ProfileEntry({
  formData,
  setFormData,
  onNext,
}: ProfileEntryProps) {
  const { showError, validations, clearError, handleSubmit } = useProfileEntry({
    formData,
    onNext,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 2 / 4</p>
        <p className="text-base font-bold text-white">プロフィールの入力</p>
      </div>

      <section className="space-y-4">
        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">表示名</span>
            <span className="ml-2 text-[11px] text-[#b3b3b3]">プロフィールに表示されます</span>
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              clearError();
            }}
            className={`h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              showError && !validations.isNameValid
                ? "!border-red-400"
                : "!border-white/70 focus:!border-white"
            }`}
            autoFocus
          />
          {showError && !validations.isNameValid && (
            <div className="mt-1 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>表示名を入力してください。</p>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">生年月日</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="yyyy"
              value={formData.birthYear}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setFormData((prev) => ({ ...prev, birthYear: value }));
                clearError();
              }}
              className={`h-9 w-20 rounded-lg border-2 bg-black pl-2 text-[13px] text-white outline-none ${
                showError &&
                !validations.isBirthDateValid &&
                (!validations.isBirthDatePartiallyFilled || !validations.isBirthYearValid)
                  ? "!border-red-400"
                  : "!border-white/70 focus:!border-white"
              }`}
            />
            <select
              value={formData.birthMonth}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, birthMonth: e.target.value }));
                clearError();
              }}
              className={`h-9 flex-1 rounded-lg border-2 bg-black px-1 text-[13px] text-white outline-none ${
                showError &&
                !validations.isBirthDateValid &&
                (!validations.isBirthDatePartiallyFilled || !validations.isBirthMonthValid)
                  ? "!border-red-400"
                  : "!border-white/70 focus:!border-white"
              }`}
            >
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}月
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="dd"
              value={formData.birthDay}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                setFormData((prev) => ({ ...prev, birthDay: value }));
                clearError();
              }}
              className={`h-9 w-16 rounded-lg border-2 bg-black pl-2 text-[13px] text-white outline-none ${
                showError &&
                !validations.isBirthDateValid &&
                (!validations.isBirthDatePartiallyFilled || !validations.isBirthDayValid)
                  ? "!border-red-400"
                  : "!border-white/70 focus:!border-white"
              }`}
            />
          </div>
          {showError && !validations.isBirthDateValid && (
            <div className="mt-1 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>生年月日を正しく入力してください。</p>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">性別</span>
          </div>
          <div className="flex gap-4">
            {GENDER_OPTIONS.map((option) => (
              <label key={option.value} className="group flex cursor-pointer items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={formData.gender === option.value}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, gender: e.target.value }));
                    clearError();
                  }}
                  className="peer sr-only"
                />
                <div className="h-4 w-4 rounded-full border border-white/70 transition-all peer-checked:border-4 peer-checked:border-amber-300"></div>
                <span className="text-[13px] text-white transition-colors group-hover:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
          {showError && !validations.isGenderValid && (
            <div className="mt-1 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>性別を選択してください。</p>
            </div>
          )}
        </div>
      </section>

      <AuthSubmitButton>次へ</AuthSubmitButton>
    </form>
  );
}
