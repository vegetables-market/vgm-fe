export type PasswordValidationResult = {
  hasLetter: boolean;
  hasNumberOrSpecialChar: boolean;
  isLengthValid: boolean;
  isValid: boolean;
};

export function validatePassword(
  password: string,
  minLength = 10,
): PasswordValidationResult {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecialChar = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLengthValid = password.length >= minLength;

  return {
    hasLetter,
    hasNumberOrSpecialChar,
    isLengthValid,
    isValid: hasLetter && hasNumberOrSpecialChar && isLengthValid,
  };
}
