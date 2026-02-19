import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";

interface ValidationItemProps {
  isValid: boolean;
  label: string;
  showError: boolean;
}

export default function AuthValidationItem({
  isValid,
  label,
  showError,
}: ValidationItemProps) {
  return (
    <div className="flex items-center text-[13px]">
      {isValid ? (
        <FaCircleCheck className="mr-1 text-green-500" />
      ) : (
        <FaRegCircle className="mr-1" />
      )}
      <p
        className={
          showError && !isValid ? "text-red-400" : "text-muted-foreground"
        }
      >
        {label}
      </p>
    </div>
  );
}
