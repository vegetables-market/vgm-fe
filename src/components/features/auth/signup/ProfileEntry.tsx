"use client";

import { FaCircleExclamation } from "react-icons/fa6";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton";
import { useProfileEntry } from "@/hooks/auth/signup/useProfileEntry";
import type { ProfileEntryProps } from "@/types/auth/signup-components";

const GENDER_OPTIONS = [
  { value: "male", label: "逕ｷ諤ｧ" },
  { value: "female", label: "螂ｳ諤ｧ" },
  { value: "other", label: "縺昴・莉・ },
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
        <p className="mb-1 text-base text-[#b3b3b3]">繧ｹ繝・ャ繝・2 / 4</p>
        <p className="text-base font-bold text-white">繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｮ蜈･蜉・/p>
      </div>

      <section className="space-y-4">
        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">陦ｨ遉ｺ蜷・/span>
            <span className="ml-2 text-[11px] text-[#b3b3b3]">繝励Ο繝輔ぅ繝ｼ繝ｫ縺ｫ陦ｨ遉ｺ縺輔ｌ縺ｾ縺・/span>
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
              <p>陦ｨ遉ｺ蜷阪ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・/p>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">逕溷ｹｴ譛域律</span>
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
              <option value="">譛・/option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}譛・                </option>
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
              <p>逕溷ｹｴ譛域律繧呈ｭ｣縺励￥蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・/p>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">諤ｧ蛻･</span>
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
              <p>諤ｧ蛻･繧帝∈謚槭＠縺ｦ縺上□縺輔＞縲・/p>
            </div>
          )}
        </div>
      </section>

      <AuthSubmitButton>谺｡縺ｸ</AuthSubmitButton>
    </form>
  );
}
