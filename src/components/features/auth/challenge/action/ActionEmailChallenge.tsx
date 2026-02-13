"use client";

import VerificationInputForm from "@/components/features/auth/shared/VerificationInputForm";
import { useActionVerify } from "@/hooks/auth/challenge/useActionVerify";
import { VerificationMode } from "@/types/auth/core";

type ActionChallengeProps = {
  mode: VerificationMode;
  identifier: string | null;
  action: string;
  redirectTo?: string | null;
};

export default function ActionEmailChallenge({
  mode,
  identifier,
  action,
  redirectTo,
}: ActionChallengeProps) {
  const { code, setCode, error, successMsg, isLoading, onSubmit } =
    useActionVerify({
      mode,
      identifier,
      action,
      redirectTo,
    });

  return (
    <VerificationInputForm
      code={code}
      setCode={setCode}
      description={
        <div className="text-center text-sm text-gray-300">
          アクション「{action}」を完了するために
          <br />
          認証コードを入力してください。
        </div>
      }
      error={error}
      successMsg={successMsg}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  );
}
