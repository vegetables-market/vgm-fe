import Link from "next/link";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

type Props = {
  promptText: string;
  linkText: string;
  href: string;
  redirectTo?: string | null;
};

export default function AuthSwitchLink({
  promptText,
  linkText,
  href,
  redirectTo,
}: Props) {
  return (
    <div className="flex w-full items-center justify-center">
      <span className="mr-1 cursor-default text-xs text-[#b3b3b3]">
        {promptText}
      </span>
      <Link
        href={withRedirectTo(href, redirectTo)}
        className="text-foreground text-xs font-bold underline"
      >
        {linkText}
      </Link>
    </div>
  );
}
