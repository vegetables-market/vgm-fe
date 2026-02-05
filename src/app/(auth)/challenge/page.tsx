"use client";

import { Suspense } from "react";
import { useChallenge } from "@/hooks/auth/useChallenge";
import ChallengeForm from "@/components/features/auth/form/ChallengeForm";

function ChallengeContent() {
  const { state, actions } = useChallenge();
  return <ChallengeForm state={state} actions={actions} />;
}

export default function ChallengePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <ChallengeContent />
    </Suspense>
  );
}
