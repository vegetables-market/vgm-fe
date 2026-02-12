interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  // ステップ1はプログレスバーを表示しない仕様のため、step-1を基準にする
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="absolute top-0 w-full bg-zinc-700 h-1">
      <div
        className="h-full bg-amber-300 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
