"use client";

import { useMemo, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { SignupFormData } from "@/components/features/auth/types";

const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
];

interface ProfileEntryProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export default function ProfileEntry({ formData, setFormData, onNext }: ProfileEntryProps) {
  const [showError, setShowError] = useState(false);

  const { isNameValid, isBirthDateValid, isGenderValid, isBirthDatePartiallyFilled, isBirthYearValid, isBirthMonthValid, isBirthDayValid } = useMemo(() => {
    const { name, birthYear, birthMonth, birthDay, gender } = formData;
    const nameValid = name.trim() !== "";
    
    const yearNum = parseInt(birthYear, 10);
    const birthYearValid = !isNaN(yearNum) && yearNum >= 1900 && yearNum <= new Date().getFullYear();
    
    const monthNum = parseInt(birthMonth, 10);
    const birthMonthValid = !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12;
    
    const dayNum = parseInt(birthDay, 10);
    const birthDayValid = !isNaN(dayNum) && dayNum >= 1 && dayNum <= 31;
    
    const birthDateValid = birthYearValid && birthMonthValid && birthDayValid;
    const isPartiallyFilled = (birthYear !== "" || birthMonth !== "" || birthDay !== "") && !birthDateValid;
    
    const genderValid = gender !== "";
    
    return {
      isNameValid: nameValid,
      isBirthDateValid: birthDateValid,
      isGenderValid: genderValid,
      isBirthDatePartiallyFilled: isPartiallyFilled,
      isBirthYearValid: birthYearValid,
      isBirthMonthValid: birthMonthValid,
      isBirthDayValid: birthDayValid,
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid || !isBirthDateValid || !isGenderValid) {
      setShowError(true);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 3 / 4</p>
        <p className="text-base font-bold text-white">プロフィールの入力</p>
      </div>

      <section className="space-y-4">
        {/* 名前 */}
        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">表示名</span>
            <span className="ml-2 text-[11px] text-[#b3b3b3]">プロフィールに表示されます</span>
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className={`h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              showError && !isNameValid
                ? "!border-red-400"
                : "!border-white/70 focus:!border-white"
            }`}
            autoFocus
          />
          {showError && !isNameValid && (
            <div className="mt-1 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>名前を入力してください。</p>
            </div>
          )}
        </div>

        {/* 生年月日 */}
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
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setFormData((prev) => ({ ...prev, birthYear: val }));
              }}
              className={`h-9 w-20 rounded-lg border-2 bg-black pl-2 text-[13px] text-white outline-none ${
                showError && !isBirthDateValid && (!isBirthDatePartiallyFilled || !isBirthYearValid)
                  ? "!border-red-400"
                  : "!border-white/70 focus:!border-white"
              }`}
            />
            <select
              value={formData.birthMonth}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthMonth: e.target.value }))}
              className={`h-9 flex-1 rounded-lg border-2 bg-black px-1 text-[13px] text-white outline-none ${
                showError && !isBirthDateValid && (!isBirthDatePartiallyFilled || !isBirthMonthValid)
                  ? "!border-red-400"
                  : "!border-white/70 focus:!border-white"
              }`}
            >
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="dd"
              value={formData.birthDay}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                setFormData((prev) => ({ ...prev, birthDay: val }));
              }}
              className={`h-9 w-16 rounded-lg border-2 bg-black pl-2 text-[13px] text-white outline-none ${
                showError && !isBirthDateValid && (!isBirthDatePartiallyFilled || !isBirthDayValid)
                  ? "!border-red-400"
                  : "!border-white/70 focus:!border-white"
              }`}
            />
          </div>
          {showError && !isBirthDateValid && (
            <div className="mt-1 text-xs text-red-400">
              <div className="flex items-center">
                <FaCircleExclamation className="mr-1" />
                <p>生年月日を正しく入力してください。</p>
              </div>
            </div>
          )}
        </div>

        {/* 性別 */}
        <div>
          <div className="mb-2 w-full">
            <span className="text-[13px] font-bold text-white">性別</span>
          </div>
          <div className="flex gap-4">
            {GENDER_OPTIONS.map((o) => (
              <label key={o.value} className="flex items-center gap-1 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  value={o.value}
                  checked={formData.gender === o.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-white/70 peer-checked:border-4 peer-checked:border-amber-300 transition-all"></div>
                <span className="text-[13px] text-white group-hover:text-gray-300 transition-colors">{o.label}</span>
              </label>
            ))}
          </div>
          {showError && !isGenderValid && (
            <div className="mt-1 flex items-center text-xs text-red-400">
              <FaCircleExclamation className="mr-1" />
              <p>性別を選択してください。</p>
            </div>
          )}
        </div>
      </section>

      <button
        type="submit"
        className="mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black hover:bg-gray-200 transition-colors"
      >
        次へ
      </button>
    </form>
  );
}
