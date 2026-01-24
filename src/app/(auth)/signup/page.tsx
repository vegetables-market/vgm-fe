'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaRegCircle,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleChevronLeft,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa6';
// import { useAuth } from '@/context/AuthContext';

const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
];

export default function SignupPage() {
  // const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showStep3Errors, setShowStep3Errors] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
  });

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

  const passwordValidations = useMemo(() => {
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

  const {
    isNameValid,
    isBirthYearValid,
    isBirthMonthValid,
    isBirthDayValid,
    isBirthDatePartiallyFilled,
    isBirthDateValid,
    isGenderValid,
    isStep3Valid,
  } = useMemo(() => {
    const { name, birthYear, birthMonth, birthDay, gender } = formData;

    const nameValid = name.trim() !== '';

    // Year validation
    const yearNum = parseInt(birthYear, 10);
    const currentYear = new Date().getFullYear();
    const birthYearValid =
      !isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear;

    // Day validation
    const dayNum = parseInt(birthDay, 10);
    const birthDayValid = !isNaN(dayNum) && dayNum >= 1 && dayNum <= 31;

    // Month validation
    const birthMonthValid = birthMonth.trim() !== '';

    const birthDateValid = birthYearValid && birthMonthValid && birthDayValid;
    const isPartiallyFilled =
      (birthYear.trim() !== '' ||
        birthMonth.trim() !== '' ||
        birthDay.trim() !== '') &&
      !birthDateValid;
    const genderValid = gender !== '';
    return {
      isNameValid: nameValid,
      isBirthYearValid: birthYearValid,
      isBirthMonthValid: birthMonthValid,
      isBirthDayValid: birthDayValid,
      isBirthDatePartiallyFilled: isPartiallyFilled,
      isBirthDateValid: birthDateValid,
      isGenderValid: genderValid,
      isStep3Valid: nameValid && birthDateValid && genderValid,
    };
  }, [
    formData.name,
    formData.birthYear,
    formData.birthMonth,
    formData.birthDay,
    formData.gender,
  ]);

  const isPasswordInputInvalid =
    showPasswordErrors && !passwordValidations.isValid;

  const handleNextStep = () => {
    setError('');

    if (step === 1) {
      if (!isEmailValid) {
        setShowEmailError(true);
        return;
      }
    }

    if (step === 2) {
      if (!passwordValidations.isValid) {
        setShowPasswordErrors(true);
        return;
      }
    }

    if (step === 3) {
      if (!isStep3Valid) {
        setShowStep3Errors(true);
        return;
      }
    }

    // エラー表示をリセットして次のステップへ
    setShowEmailError(false);
    setShowPasswordErrors(false);
    setShowStep3Errors(false);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信をキャンセル

    if (!isStep3Valid) {
      setShowStep3Errors(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // AuthContextのregister関数を使用してバックエンドAPIに登録
      // 新しいregister関数は自動的にログインも実行する
      // await register(
      //   formData.email,
      //   formData.password,
      //   formData.name,
      //   formData.birthYear ? parseInt(formData.birthYear) : undefined,
      //   formData.birthMonth ? parseInt(formData.birthMonth) : undefined,
      //   formData.birthDay ? parseInt(formData.birthDay) : undefined,
      //   formData.gender || undefined
      // );

      console.log('登録・ログイン完了:', formData);

      // 成功メッセージを短時間表示してからリダイレクト
      setError(''); // エラーをクリア

      // 少し待ってからトップページにリダイレクト（ユーザーが成功を認識できるように）
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error: any) {
      console.error('登録エラー:', error);
      setError(error.message || '登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
      <div className="relative flex w-125 flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#121212] pt-8 pb-12">
        {step > 1 && (
          <div className="w-full">
            <FaCircleChevronLeft
              className="absolute top-8 left-8 cursor-pointer text-3xl"
              onClick={handlePrevStep}
            />
            <div className="absolute top-0 w-full bg-zinc-700">
              <div
                className="h-1 bg-amber-300 transition-all duration-300 ease-in-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex w-75 flex-col items-center">
          {step === 1 && (
            <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold text-white">
              新規登録
            </h2>
          )}

          {error && (
            <p className="mb-2 flex h-8 w-full items-center justify-center rounded-xs bg-red-600 text-center text-[11px]">
              <FaCircleExclamation className="mr-1" />
              {error}
            </p>
          )}

          <div className="mb-5 w-full">
            {step > 1 && (
              <div className="mb-7">
                <p className="mb-1 text-base text-[#b3b3b3]">
                  ステップ {step - 1} / 3 {''}
                </p>
                <p className="text-base font-bold text-white">
                  {step === 2 && 'パスワードを作成'}
                  {step === 3 && '情報の入力'}
                  {step === 4 && '利用規約'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <section>
                  <div className="mb-2 w-full">
                    <span className="cursor-default text-[13px] font-bold text-white">
                      メールアドレス
                    </span>
                  </div>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="mail@example.com"
                    className={`mb-1 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] transition-colors duration-300 outline-none ${
                      showEmailError && !isEmailValid
                        ? '!border-red-400'
                        : '!border-white/70 focus:!border-white'
                    }`}
                    autoFocus
                  />
                  {showEmailError && !isEmailValid && (
                    <div className="mb-2 flex items-center text-xs text-red-400">
                      <FaCircleExclamation className="mr-1" />
                      <p className="">
                        有効なメールアドレスを入力してください。
                      </p>
                    </div>
                  )}
                </section>
              )}

              {step === 2 && (
                <section>
                  <div className="mb-2 w-full">
                    <span className="cursor-default text-[13px] font-bold text-white">
                      パスワード
                    </span>
                  </div>
                  <div className="relative mb-4">
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`h-9 w-full rounded-lg border-2 bg-black pr-10 pl-3 text-[13px] transition-colors duration-300 outline-none ${
                        isPasswordInputInvalid
                          ? '!border-red-400' // エラー時はfocusスタイルを適用せず、常に赤
                          : '!border-white/70 focus:!border-white' // エラーがない場合は通常とfocusのスタイルを適用
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-lg text-white/70 hover:text-white"
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <h3 className="mb-3 text-[13px] font-bold">
                    以下の条件を満たす必要があります。
                  </h3>
                  <div className="mb-2 flex flex-col">
                    <div className="mb-2 flex items-center text-[13px]">
                      {passwordValidations.hasLetter ? (
                        <FaCircleCheck className="mr-1 text-green-500" />
                      ) : (
                        <FaRegCircle className="mr-1" />
                      )}
                      <p
                        className={
                          showPasswordErrors && !passwordValidations.hasLetter
                            ? 'text-red-400'
                            : 'text-white'
                        }
                      >
                        英字を一字以上含む
                      </p>
                    </div>
                    <div className="mb-2 flex items-center text-[13px]">
                      {passwordValidations.hasNumberOrSpecialChar ? (
                        <FaCircleCheck className="mr-1 text-green-500" />
                      ) : (
                        <FaRegCircle className="mr-1" />
                      )}
                      <p
                        className={
                          showPasswordErrors &&
                          !passwordValidations.hasNumberOrSpecialChar
                            ? 'text-red-400'
                            : 'text-white'
                        }
                      >
                        数字または特殊文字を一つ以上含む
                      </p>
                    </div>
                    <div className="flex items-center text-[13px]">
                      {passwordValidations.isLengthValid ? (
                        <FaCircleCheck className="mr-1 text-green-500" />
                      ) : (
                        <FaRegCircle className="mr-1" />
                      )}
                      <p
                        className={
                          showPasswordErrors &&
                          !passwordValidations.isLengthValid
                            ? 'text-red-400'
                            : 'text-white'
                        }
                      >
                        合計で10文字以上
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section>
                  <div className="mb-2 w-full">
                    <span className="mb-2 flex cursor-default text-[13px] font-bold text-white">
                      名前
                    </span>
                    <span className="flex cursor-default text-[13px] font-bold text-[#b3b3b3]">
                      この名前がプロフィールに表示されます。
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`mb-2 h-9 w-full rounded-lg border-2 bg-black pl-3 text-[13px] transition-colors duration-300 outline-none ${
                      showStep3Errors && !isNameValid
                        ? '!border-red-400'
                        : '!border-white/70 focus:!border-white'
                    }`}
                    autoFocus
                  />
                  {showStep3Errors && !isNameValid && (
                    <div className="mb-4 flex items-center text-xs text-red-400">
                      <FaCircleExclamation className="mr-1" />
                      <p>名前を入力してください。</p>
                    </div>
                  )}
                  <div className="h-1"></div>
                  <div className="mb-2 w-full">
                    <span className="cursor-default text-[13px] font-bold text-white">
                      生年月日
                    </span>
                  </div>
                  <div className="mb-2 flex w-full gap-2">
                    {/* 年 */}
                    <div className="w-25">
                      <input
                        type="text"
                        value={formData.birthYear}
                        inputMode="numeric"
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ''
                          );
                          setFormData({
                            ...formData,
                            birthYear: numericValue.slice(0, 4),
                          });
                        }}
                        placeholder="yyyy"
                        className={`h-9 w-full [appearance:textfield] rounded-lg border-2 bg-black pl-3 text-[13px] transition-colors duration-300 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                          showStep3Errors &&
                          !isBirthDateValid &&
                          (!isBirthDatePartiallyFilled || !isBirthYearValid)
                            ? '!border-red-400'
                            : '!border-white/70 focus:!border-white'
                        }`}
                      />
                    </div>
                    {/* 月 */}
                    <div className="flex-1">
                      <select
                        value={formData.birthMonth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthMonth: e.target.value,
                          })
                        }
                        className={`h-9 w-full cursor-pointer rounded-lg border-2 bg-black px-2 text-[13px] text-white transition-colors duration-300 outline-none ${
                          showStep3Errors &&
                          !isBirthDateValid &&
                          (!isBirthDatePartiallyFilled || !isBirthMonthValid)
                            ? '!border-red-400'
                            : '!border-white/70 focus:!border-white'
                        }`}
                      >
                        <option value="" disabled>
                          月
                        </option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {month}月
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {/* 日 */}
                    <div className="w-15">
                      <input
                        type="text"
                        value={formData.birthDay}
                        inputMode="numeric"
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ''
                          );
                          setFormData({
                            ...formData,
                            birthDay: numericValue.slice(0, 2),
                          });
                        }}
                        placeholder="dd"
                        className={`h-9 w-full [appearance:textfield] rounded-lg border-2 bg-black pl-3 text-[13px] transition-colors duration-300 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                          showStep3Errors &&
                          !isBirthDateValid &&
                          (!isBirthDatePartiallyFilled || !isBirthDayValid)
                            ? '!border-red-400'
                            : '!border-white/70 focus:!border-white'
                        }`}
                      />
                    </div>
                  </div>
                  {showStep3Errors &&
                    !isBirthDateValid &&
                    (isBirthDatePartiallyFilled ? (
                      <div className="mb-4 space-y-1 text-xs text-red-400">
                        {!isBirthYearValid && (
                          <div className="flex items-center">
                            <FaCircleExclamation className="mr-1" />
                            <p>1900年以降の誕生年を入力してください。</p>
                          </div>
                        )}
                        {!isBirthMonthValid && (
                          <div className="flex items-center">
                            <FaCircleExclamation className="mr-1" />
                            <p>誕生月を選択してください。</p>
                          </div>
                        )}
                        {!isBirthDayValid && (
                          <div className="flex items-center">
                            <FaCircleExclamation className="mr-1" />
                            <p>日を1から31までの数字で入力してください。</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4 flex items-center text-xs text-red-400">
                        <FaCircleExclamation className="mr-1" />
                        <p>生年月日をすべて入力してください。</p>
                      </div>
                    ))}
                  <div className="h-1"></div>
                  <div className="mb-2 w-full">
                    <span className="cursor-default text-[13px] font-bold text-white">
                      性別
                    </span>
                  </div>
                  <div className="mb-2 flex w-full gap-2">
                    {GENDER_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        htmlFor={`gender-${option.value}`}
                        className="group flex cursor-pointer items-center"
                      >
                        <input
                          type="radio"
                          id={`gender-${option.value}`}
                          name="gender"
                          value={option.value}
                          checked={formData.gender === option.value}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="peer sr-only"
                        />
                        <div className="aspect-square h-auto w-4 rounded-full border border-white/70 transition-all duration-300 group-hover:border-amber-300 peer-checked:border-4 peer-checked:border-amber-300"></div>
                        <div className="rounded-lg px-2 text-[13px] text-white transition-colors duration-300">
                          {option.label}
                        </div>
                      </label>
                    ))}
                  </div>
                  {showStep3Errors && !isGenderValid && (
                    <div className="mb-2 flex items-center text-xs text-red-400">
                      <FaCircleExclamation className="mr-1" />
                      <p>性別を選択してください。</p>
                    </div>
                  )}
                </section>
              )}

              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-3 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black"
                >
                  次へ
                </button>
              )}

              {(step === 2 || step === 3) && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-6 h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black"
                >
                  次へ
                </button>
              )}

              {step === 4 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 w-full cursor-pointer rounded-full bg-white text-base font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? '登録中...' : '登録'}
                </button>
              )}
            </form>
          </div>

          {step === 1 && (
            <>
              {/*棒*/}
              <div className="relative mb-5 w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-[13px]">
                  <span className="cursor-default bg-[#121212] px-2 text-gray-400">
                    または
                  </span>
                </div>
              </div>

              <div className="mb-6 flex w-full flex-col gap-2">
                {/* Spotify */}
                <button className="relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-1 border-zinc-300 bg-black font-bold text-white">
                  <div className="absolute left-8">
                    <div className="relative mr-2 flex h-6 w-6 items-center justify-center">
                      <div className="absolute h-5 w-5 rounded-full bg-black"></div>
                      <Image
                        src="/serviceLogo/logo-spotify-music.svg"
                        alt=""
                        width={361}
                        height={361}
                        className="h-full w-full object-contain drop-shadow-xl/100"
                      />
                    </div>
                  </div>
                  <span className="text-sm text-white">Spotifyで登録</span>
                </button>

                {/* AppleMusic */}
                <button className="relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-1 border-zinc-300 bg-black font-bold text-white">
                  <div className="absolute left-8 mr-2 flex h-6 w-6 items-center justify-center">
                    <Image
                      src="/serviceLogo/logo-apple-music.svg"
                      alt=""
                      width={361}
                      height={361}
                      className="h-full w-full object-contain drop-shadow-xl/100"
                    />
                  </div>
                  <span className="text-sm text-white">AppleMusicで登録</span>
                </button>
              </div>

              {/*棒*/}
              <div className="relative mb-6 w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
              </div>

              <div className="flex w-full items-center justify-center">
                <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">
                  アカウントをお持ちの方は
                </span>
                <Link href="/login" className="text-xs text-white underline">
                  ここからログインする
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
