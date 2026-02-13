interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  // ステップ1はプログレスバーを表示しない仕様のため、step-1を基準にする
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="absolute top-0 h-1 w-full bg-zinc-700">
      <div
        className="bg-primary h-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
