import Link from "next/link";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

type Props = {
  redirectTo?: string | null;
};

export default function SignupLink({ redirectTo }: Props) {
  return (
    <div className="flex w-full items-center justify-center">
      <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">
        アカウントを
      </span>
      <Link
        href={withRedirectTo("/signup", redirectTo)}
        className="text-foreground text-xs font-bold underline"
      >
        新規登録する
      </Link>
    </div>
  );
}
