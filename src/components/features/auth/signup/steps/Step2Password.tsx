"use client";

import { useMemo, useState } from "react";
import { FaRegCircle, FaCircleCheck, FaEye, FaEyeSlash } from "react-icons/fa6";
import { SignupFormData } from "@/types/auth";

interface Step2Props {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
}

export default function Step2Password({ formData, setFormData, onNext }: Step2Props) {
  const [showError, setShowError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validations = useMemo(() => {
    const { password } = formData;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumberOrSpecialChar = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 10;
    return {
      hasLetter,
      hasNumberOrSpecialChar,
      isLengthValid,
      isValid: hasLetter && hasNumberOrSpecialChar && isLengthValid,
    };
  }, [formData.password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validations.isValid) {
      setShowError(true);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7">
        <p className="mb-1 text-base text-[#b3b3b3]">ステップ 3 / 4</p>
        <p className="text-base font-bold text-white">パスワードを作成</p>
      </div>

      <section>
        {/* ブラウザのパスワードマネージャー用にusernameを隠しフィールドとして配置 */}
        <input
          type="text"
          name="username"
          value={formData.username}
          readOnly
          autoComplete="username"
          className="hidden"
        />

        <div className="mb-2 w-full">
          <span className="text-[13px] font-bold text-white">パスワード</span>
        </div>
        <div className="relative mb-4">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="new-password"
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            className={`h-9 w-full rounded-lg border-2 bg-black pr-10 pl-3 text-[13px] text-white transition-colors duration-300 outline-none ${
              showError && !validations.isValid
                ? "!border-red-400"
                : "!border-white/70 focus:!border-white"
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-lg text-white/70 hover:text-white"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <h3 className="mb-3 text-[13px] font-bold text-white">以下の条件を満たす必要があります。</h3>
        <div className="mb-2 flex flex-col space-y-2">
          <div className="flex items-center text-[13px]">
            {validations.hasLetter ? (
              <FaCircleCheck className="mr-1 text-green-500" />
            ) : (
              <FaRegCircle className="mr-1 text-white" />
            )}
            <p className={showError && !validations.hasLetter ? "text-red-400" : "text-white"}>
              英字を一字以上含む
            </p>
          </div>
          <div className="flex items-center text-[13px]">
            {validations.hasNumberOrSpecialChar ? (
              <FaCircleCheck className="mr-1 text-green-500" />
            ) : (
              <FaRegCircle className="mr-1 text-white" />
            )}
            <p className={showError && !validations.hasNumberOrSpecialChar ? "text-red-400" : "text-white"}>
              数字または特殊文字を一つ以上含む
            </p>
          </div>
          <div className="flex items-center text-[13px]">
            {validations.isLengthValid ? (
              <FaCircleCheck className="mr-1 text-green-500" />
            ) : (
              <FaRegCircle className="mr-1 text-white" />
            )}
            <p className={showError && !validations.isLengthValid ? "text-red-400" : "text-white"}>
              合計で10文字以上
            </p>
          </div>
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
