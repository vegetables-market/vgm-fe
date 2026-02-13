import type { SignupFormData } from "@/components/features/auth/types";

export type ProfileValidationResult = {
  isNameValid: boolean;
  isBirthDateValid: boolean;
  isGenderValid: boolean;
  isBirthDatePartiallyFilled: boolean;
  isBirthYearValid: boolean;
  isBirthMonthValid: boolean;
  isBirthDayValid: boolean;
  isValid: boolean;
};

export function validateProfile(formData: SignupFormData): ProfileValidationResult {
  const { name, birthYear, birthMonth, birthDay, gender } = formData;
  const isNameValid = name.trim() !== "";

  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(birthYear, 10);
  const monthNum = parseInt(birthMonth, 10);
  const dayNum = parseInt(birthDay, 10);

  const isBirthYearValid =
    !Number.isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear;
  const isBirthMonthValid =
    !Number.isNaN(monthNum) && monthNum >= 1 && monthNum <= 12;
  const isBirthDayValid = !Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 31;

  const isBirthDateValid =
    isBirthYearValid && isBirthMonthValid && isBirthDayValid;
  const isBirthDatePartiallyFilled =
    (birthYear !== "" || birthMonth !== "" || birthDay !== "") &&
    !isBirthDateValid;

  const isGenderValid = gender !== "";
  const isValid = isNameValid && isBirthDateValid && isGenderValid;

  return {
    isNameValid,
    isBirthDateValid,
    isGenderValid,
    isBirthDatePartiallyFilled,
    isBirthYearValid,
    isBirthMonthValid,
    isBirthDayValid,
    isValid,
  };
}

