import Link from "next/link";

export default function SignupLink() {
  return (
    <div className="flex w-full items-center justify-center">
      <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">
        アカウントを
      </span>
      <Link
        href="/signup"
        className="text-foreground text-xs font-bold underline"
      >
        新規登録する
      </Link>
    </div>
  );
}
